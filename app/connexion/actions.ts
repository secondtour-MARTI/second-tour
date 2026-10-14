"use server";

import { redirect } from "next/navigation";
import { supabaseSession } from "@/lib/supabase/server";

export type EtatConnexion = { erreur: string | null };

export async function seConnecter(_etat: EtatConnexion, form: FormData): Promise<EtatConnexion> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const motDePasse = String(form.get("mot_de_passe") ?? "").slice(0, 72);
  if (!email || !motDePasse) return { erreur: "Renseigne ton email et ton mot de passe." };

  const sb = await supabaseSession();
  const { error } = await sb.auth.signInWithPassword({ email, password: motDePasse });
  if (error) return { erreur: "Email ou mot de passe incorrect." };
  redirect("/espace");
}

export async function seDeconnecter() {
  const sb = await supabaseSession();
  await sb.auth.signOut();
  redirect("/connexion");
}
