import { supabaseAdmin, supabaseSession } from "@/lib/supabase/server";

export type Garage = {
  id: string;
  owner_id: string;
  email: string;
  nom: string | null;
  metier: string | null;
  delai_rappel_jours: number;
  offre_texte: string;
  slug: string;
};

// Renvoie l'utilisateur connecté, son garage et l'état de son abonnement.
// Toujours vérifié côté serveur, à chaque requête.
export async function accesCourant() {
  const sb = await supabaseSession();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { user: null, garage: null, actif: false } as const;

  const admin = supabaseAdmin();
  const { data: garage } = await admin.from("garages").select("*").eq("owner_id", user.id).maybeSingle();

  let actif = false;
  if (garage) {
    const parGarage = await admin
      .from("abonnements")
      .select("id")
      .eq("garage_id", garage.id)
      .eq("statut", "active")
      .limit(1);
    actif = !!parGarage.data && parGarage.data.length > 0;
    if (!actif) {
      const parEmail = await admin
        .from("abonnements")
        .select("id")
        .eq("email", String(garage.email).toLowerCase())
        .eq("statut", "active")
        .limit(1);
      actif = !!parEmail.data && parEmail.data.length > 0;
    }
  }

  return { user, garage: (garage as Garage | null) ?? null, actif } as const;
}
