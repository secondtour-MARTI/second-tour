"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin, supabaseSession } from "@/lib/supabase/server";
import { METIERS, type MetierId } from "@/lib/diagnostic";
import { codeAleatoire } from "@/lib/outils";

export type EtatAcces = { erreur: string | null };

// Crée l'accès du garage juste après le paiement.
// Le paiement est revérifié auprès de Stripe côté serveur : on ne fait pas confiance à l'URL.
export async function creerAcces(_etat: EtatAcces, form: FormData): Promise<EtatAcces> {
  const sessionId = String(form.get("session_id") ?? "");
  const motDePasse = String(form.get("mot_de_passe") ?? "");

  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return { erreur: "Lien de paiement invalide." };
  if (motDePasse.length < 8) return { erreur: "Ton mot de passe doit faire au moins 8 caractères." };
  if (motDePasse.length > 72) return { erreur: "Ton mot de passe est trop long (72 caractères maximum)." };

  let s;
  try {
    s = await stripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return { erreur: "Impossible de vérifier ton paiement. Réessaie dans un instant." };
  }
  if (s.status !== "complete") return { erreur: "Ce paiement n'est pas confirmé." };

  const email = s.customer_details?.email?.toLowerCase();
  if (!email) return { erreur: "Aucun email n'est associé à ce paiement." };

  const admin = supabaseAdmin();

  const { data: existant } = await admin.from("garages").select("id").eq("email", email).maybeSingle();
  if (existant) return { erreur: "Un accès existe déjà pour cet email. Connecte-toi avec ton mot de passe." };

  const cree = await admin.auth.admin.createUser({ email, password: motDePasse, email_confirm: true });
  if (cree.error || !cree.data.user) {
    return { erreur: "Un compte existe déjà pour cet email. Connecte-toi avec ton mot de passe." };
  }

  const metier = (s.metadata?.metier ?? "") as MetierId | "";
  const delai = metier && metier in METIERS ? METIERS[metier].delaiJours : 335;

  const { data: garage, error: errGarage } = await admin
    .from("garages")
    .insert({
      owner_id: cree.data.user.id,
      email,
      metier: metier || null,
      delai_rappel_jours: delai,
      slug: codeAleatoire(8).toLowerCase(),
    })
    .select("id")
    .single();
  if (errGarage || !garage) return { erreur: "La création de ton espace a échoué. Réessaie dans un instant." };

  // L'abonnement est normalement déjà enregistré par le webhook ; sinon on l'enregistre ici,
  // à partir des données vérifiées auprès de Stripe.
  const abonnementId = typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
  if (abonnementId) {
    await admin.from("abonnements").upsert(
      {
        email,
        garage_id: garage.id,
        stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
        stripe_subscription_id: abonnementId,
        plan: s.metadata?.plan ?? null,
        statut: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" }
    );
  }

  const sb = await supabaseSession();
  const connexion = await sb.auth.signInWithPassword({ email, password: motDePasse });
  if (connexion.error) return { erreur: "Ton accès est créé. Connecte-toi avec ton email et ton mot de passe." };

  redirect("/espace");
}
