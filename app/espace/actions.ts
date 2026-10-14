"use server";

import { revalidatePath } from "next/cache";
import { accesCourant } from "@/lib/acces";
import { supabaseAdmin } from "@/lib/supabase/server";
import { METIERS, type MetierId } from "@/lib/diagnostic";
import { codeAleatoire, dateRappel, lireContact, lireDatePassage, montant, texteCourt } from "@/lib/outils";

export type Etat = { ok: string | null; erreur: string | null };

async function garageActif() {
  const { garage, actif } = await accesCourant();
  if (!garage) throw new Error("non connecté");
  if (!actif) throw new Error("abonnement inactif");
  return garage;
}

// Réglages minimum : nom du garage, prestation principale, offre de retour.
export async function enregistrerGarage(_e: Etat, form: FormData): Promise<Etat> {
  let garage;
  try {
    garage = await garageActif();
  } catch {
    return { ok: null, erreur: "Ta session a expiré. Reconnecte-toi." };
  }
  const nom = texteCourt(form.get("nom"), 60);
  const metier = String(form.get("metier") ?? "") as MetierId;
  const offre = texteCourt(form.get("offre"), 40) || "-10 %";
  if (nom.length < 2) return { ok: null, erreur: "Indique le nom de ton garage." };
  if (!(metier in METIERS)) return { ok: null, erreur: "Choisis ta prestation principale." };

  const { error } = await supabaseAdmin()
    .from("garages")
    .update({ nom, metier, offre_texte: offre, delai_rappel_jours: METIERS[metier].delaiJours })
    .eq("id", garage.id);
  if (error) return { ok: null, erreur: "L'enregistrement a échoué. Réessaie." };
  revalidatePath("/espace");
  return { ok: "C'est enregistré.", erreur: null };
}

// Ajout d'un client au comptoir, par le garagiste.
export async function ajouterClient(_e: Etat, form: FormData): Promise<Etat> {
  let garage;
  try {
    garage = await garageActif();
  } catch {
    return { ok: null, erreur: "Ta session a expiré. Reconnecte-toi." };
  }
  const contact = lireContact(String(form.get("contact") ?? ""));
  if (!contact) return { ok: null, erreur: "Entre un numéro de portable (06 ou 07…) ou un email valide." };
  if (form.get("accord") !== "oui") {
    return { ok: null, erreur: "Coche la case : le client doit être d'accord pour recevoir un rappel." };
  }
  const prenom = texteCourt(form.get("prenom"), 40) || null;
  const prix = montant(form.get("montant"));
  const datePassage = lireDatePassage(form.get("date_passage"));
  if (datePassage === "invalide") {
    return { ok: null, erreur: "La date du passage doit être aujourd'hui ou dans les 3 dernières années." };
  }
  const passageLe = datePassage ?? new Date().toISOString().slice(0, 10);
  const rappelLe = dateRappel(passageLe, garage.delai_rappel_jours);

  const admin = supabaseAdmin();
  const { data: client, error } = await admin
    .from("clients")
    .insert({ garage_id: garage.id, prenom, ...contact, consentement_le: new Date().toISOString() })
    .select("id")
    .single();
  if (error || !client) return { ok: null, erreur: "L'ajout a échoué. Réessaie." };

  const metier = garage.metier as MetierId | null;
  const { error: errP } = await admin.from("passages").insert({
    garage_id: garage.id,
    client_id: client.id,
    prestation: metier && metier in METIERS ? METIERS[metier].prestation : null,
    montant: prix,
    date_passage: passageLe,
    date_rappel: rappelLe,
    code_offre: codeAleatoire(6),
  });
  if (errP) return { ok: null, erreur: "L'ajout a échoué. Réessaie." };

  revalidatePath("/espace");
  const quand = new Date(rappelLe + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return { ok: `${prenom ?? "Client"} ajouté. Rappel prévu le ${quand}.`, erreur: null };
}

// Le client revient avec son code : le garagiste le valide, le compteur avance.
export async function validerOffre(_e: Etat, form: FormData): Promise<Etat> {
  let garage;
  try {
    garage = await garageActif();
  } catch {
    return { ok: null, erreur: "Ta session a expiré. Reconnecte-toi." };
  }
  const code = String(form.get("code") ?? "").trim().toUpperCase().replace(/\s/g, "");
  const prix = montant(form.get("montant_retour"));
  if (!/^[A-Z0-9]{6}$/.test(code)) return { ok: null, erreur: "Le code fait 6 caractères, par exemple K7MP2Q." };
  if (prix === null) return { ok: null, erreur: "Indique le montant de ce passage, en euros." };

  const admin = supabaseAdmin();
  const { data: passage } = await admin
    .from("passages")
    .select("id, offre_utilisee_le")
    .eq("garage_id", garage.id)
    .eq("code_offre", code)
    .maybeSingle();
  if (!passage) return { ok: null, erreur: "Code inconnu. Vérifie les lettres et les chiffres." };
  if (passage.offre_utilisee_le) return { ok: null, erreur: "Cette offre a déjà été utilisée." };

  // Usage unique garanti : la mise à jour ne passe que si l'offre n'a pas encore été utilisée.
  const { data: maj } = await admin
    .from("passages")
    .update({ offre_utilisee_le: new Date().toISOString(), montant_retour: prix })
    .eq("id", passage.id)
    .is("offre_utilisee_le", null)
    .select("id");
  if (!maj || maj.length === 0) return { ok: null, erreur: "Cette offre a déjà été utilisée." };

  revalidatePath("/espace");
  return { ok: "Offre validée. Le client est compté comme revenu.", erreur: null };
}
