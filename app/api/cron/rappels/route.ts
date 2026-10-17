import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { envoisDus, envoyerEmail, marquerEnvoi } from "@/lib/rappels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Lancé chaque matin par Vercel (voir vercel.json). Envoie les rappels et relances email dus.
// Les clients joignables seulement par SMS apparaissent dans l'espace du garage, à envoyer en un toucher.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ erreur: "Non autorisé." }, { status: 401 });
  }

  const admin = supabaseAdmin();
  const [{ data: abos }, { data: garages }] = await Promise.all([
    admin.from("abonnements").select("garage_id, email").eq("statut", "active"),
    admin.from("garages").select("id, email"),
  ]);
  const emailsActifs = new Set((abos ?? []).map((a) => String(a.email).toLowerCase()));
  const actifs = new Set<string>((abos ?? []).map((a) => a.garage_id).filter(Boolean) as string[]);
  for (const g of garages ?? []) if (emailsActifs.has(String(g.email).toLowerCase())) actifs.add(g.id);

  const dus = await envoisDus();
  let envoyes = 0;
  let erreurs = 0;
  for (const e of dus) {
    if (e.canal !== "email") continue;
    const { data: p } = await admin.from("passages").select("garage_id").eq("id", e.passageId).single();
    if (!p || !actifs.has(p.garage_id)) continue;
    const erreur = await envoyerEmail(e);
    if (erreur) {
      erreurs++;
      await admin.from("passages").update({ erreur_envoi: erreur }).eq("id", e.passageId);
      if (erreur === "envoi d'email non configuré") break;
    } else {
      envoyes++;
      await marquerEnvoi(e.passageId, e.type, "email");
    }
  }

  return NextResponse.json({ envoyes, erreurs, total_dus: dus.length });
}
