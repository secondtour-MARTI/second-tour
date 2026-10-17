import { supabaseAdmin } from "@/lib/supabase/server";
import { htmlEmail, RELANCE_APRES_JOURS, sujetEmail, texteRappel, texteRelance, type Contexte } from "@/lib/messages";

export type EnvoiDu = {
  passageId: string;
  type: "rappel" | "relance";
  canal: "email" | "sms";
  destinataire: string;
  ctx: Contexte;
  texte: string;
};

type LignePassage = {
  id: string;
  garage_id: string;
  prestation: string | null;
  code_offre: string;
  date_passage: string;
  date_rappel: string;
  rappel_envoye_le: string | null;
  relance_envoyee_le: string | null;
  clients: { prenom: string | null; telephone: string | null; email: string | null; jeton: string; desinscrit_le: string | null } | null;
  garages: { nom: string | null; offre_texte: string } | null;
};

export function urlSite() {
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return process.env.NEXT_PUBLIC_SITE_URL ?? (prod ? `https://${prod}` : "http://localhost:3000");
}

const aujourdHui = () => new Date().toISOString().slice(0, 10);

// Tous les rappels et relances à envoyer aujourd'hui (option : un seul garage).
export async function envoisDus(garageId?: string): Promise<EnvoiDu[]> {
  const admin = supabaseAdmin();
  const seuilRelance = new Date(Date.now() - RELANCE_APRES_JOURS * 86400000).toISOString();
  const champs =
    "id, garage_id, prestation, code_offre, date_passage, date_rappel, rappel_envoye_le, relance_envoyee_le, clients(prenom, telephone, email, jeton, desinscrit_le), garages(nom, offre_texte)";

  let qRappels = admin
    .from("passages")
    .select(champs)
    .is("rappel_envoye_le", null)
    .is("offre_utilisee_le", null)
    .lte("date_rappel", aujourdHui())
    .limit(500);
  let qRelances = admin
    .from("passages")
    .select(champs)
    .not("rappel_envoye_le", "is", null)
    .lte("rappel_envoye_le", seuilRelance)
    .is("relance_envoyee_le", null)
    .is("offre_utilisee_le", null)
    .limit(500);
  if (garageId) {
    qRappels = qRappels.eq("garage_id", garageId);
    qRelances = qRelances.eq("garage_id", garageId);
  }
  const [r1, r2] = await Promise.all([qRappels, qRelances]);

  const lignes: { p: LignePassage; type: "rappel" | "relance" }[] = [
    ...((r1.data ?? []) as unknown as LignePassage[]).map((p) => ({ p, type: "rappel" as const })),
    ...((r2.data ?? []) as unknown as LignePassage[]).map((p) => ({ p, type: "relance" as const })),
  ];

  const base = urlSite();
  const resultat: EnvoiDu[] = [];
  for (const { p, type } of lignes) {
    const c = Array.isArray(p.clients) ? p.clients[0] : p.clients;
    const g = Array.isArray(p.garages) ? p.garages[0] : p.garages;
    if (!c || !g || c.desinscrit_le) continue;
    const ctx: Contexte = {
      garage: g.nom ?? "Votre garage",
      offre: g.offre_texte,
      prenom: c.prenom,
      prestation: p.prestation,
      code: p.code_offre,
      datePassage: p.date_passage,
      lienStop: `${base}/stop/${c.jeton}`,
    };
    const texte = type === "rappel" ? texteRappel(ctx) : texteRelance(ctx);
    if (c.email) resultat.push({ passageId: p.id, type, canal: "email", destinataire: c.email, ctx, texte });
    else if (c.telephone) resultat.push({ passageId: p.id, type, canal: "sms", destinataire: c.telephone, ctx, texte });
  }
  return resultat;
}

// Envoi d'un email via Resend. Renvoie null si OK, sinon le message d'erreur.
export async function envoyerEmail(e: EnvoiDu): Promise<string | null> {
  const cle = process.env.RESEND_API_KEY;
  const expediteur = process.env.EMAIL_EXPEDITEUR; // ex. rappels@secondtour.fr
  if (!cle || !expediteur) return "envoi d'email non configuré";
  const nom = e.ctx.garage.replace(/[<>"]/g, "").slice(0, 60);
  try {
    const rep = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${nom} <${expediteur}>`,
        to: [e.destinataire],
        subject: sujetEmail(e.type, e.ctx),
        html: htmlEmail(e.type, e.ctx),
        text: e.texte,
        headers: { "List-Unsubscribe": `<${e.ctx.lienStop}>` },
      }),
    });
    if (!rep.ok) return `Resend ${rep.status}: ${(await rep.text()).slice(0, 200)}`;
    return null;
  } catch (err) {
    return err instanceof Error ? err.message.slice(0, 200) : "erreur réseau";
  }
}

// Marque un rappel ou une relance comme envoyé.
export async function marquerEnvoi(passageId: string, type: "rappel" | "relance", canal: string, garageId?: string) {
  const admin = supabaseAdmin();
  const maintenant = new Date().toISOString();
  const maj =
    type === "rappel"
      ? { rappel_envoye_le: maintenant, rappel_canal: canal, erreur_envoi: null }
      : { relance_envoyee_le: maintenant, erreur_envoi: null };
  let q = admin.from("passages").update(maj).eq("id", passageId);
  if (garageId) q = q.eq("garage_id", garageId);
  q = type === "rappel" ? q.is("rappel_envoye_le", null) : q.is("relance_envoyee_le", null);
  await q;
}
