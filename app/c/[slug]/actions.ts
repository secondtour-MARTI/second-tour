"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { METIERS, type MetierId } from "@/lib/diagnostic";
import { codeAleatoire, dansNJours, lireContact, texteCourt } from "@/lib/outils";

export type EtatInscription = { ok: boolean; erreur: string | null };

// Inscription du client final depuis l'affiche QR du comptoir.
export async function inscrire(_e: EtatInscription, form: FormData): Promise<EtatInscription> {
  // Piège à robots : ce champ est invisible pour un humain.
  if (texteCourt(form.get("site"), 100)) return { ok: true, erreur: null };

  const slug = String(form.get("slug") ?? "").toLowerCase();
  if (!/^[a-z0-9]{8}$/.test(slug)) return { ok: false, erreur: "Lien invalide." };
  const contact = lireContact(String(form.get("contact") ?? ""));
  if (!contact) return { ok: false, erreur: "Entrez un numéro de portable (06 ou 07…) ou un email valide." };
  if (form.get("accord") !== "oui") return { ok: false, erreur: "Cochez la case pour recevoir votre rappel." };

  const admin = supabaseAdmin();
  const { data: garage } = await admin
    .from("garages")
    .select("id, metier, delai_rappel_jours")
    .eq("slug", slug)
    .maybeSingle();
  if (!garage) return { ok: false, erreur: "Ce garage est introuvable." };

  const { data: client, error } = await admin
    .from("clients")
    .insert({
      garage_id: garage.id,
      prenom: texteCourt(form.get("prenom"), 40) || null,
      ...contact,
      consentement_le: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error || !client) return { ok: false, erreur: "Une erreur est survenue. Réessayez." };

  const metier = garage.metier as MetierId | null;
  await admin.from("passages").insert({
    garage_id: garage.id,
    client_id: client.id,
    prestation: metier && metier in METIERS ? METIERS[metier].prestation : null,
    date_rappel: dansNJours(garage.delai_rappel_jours),
    code_offre: codeAleatoire(6),
  });

  return { ok: true, erreur: null };
}
