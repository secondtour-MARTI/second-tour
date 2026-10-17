// Textes des rappels et des relances, personnalisés selon le client et sa prestation.

export const RELANCE_APRES_JOURS = 42; // second et dernier message, 6 semaines après le rappel

export type Contexte = {
  garage: string;
  offre: string;
  prenom: string | null;
  prestation: string | null;
  code: string;
  datePassage: string; // AAAA-MM-JJ
  lienStop: string;
};

function depuis(datePassage: string) {
  const jours = Math.round((Date.now() - new Date(datePassage + "T12:00:00Z").getTime()) / 86400000);
  if (jours < 45) return `${Math.max(1, Math.round(jours / 7))} semaines`;
  const mois = Math.round(jours / 30.4);
  if (mois < 12) return `${mois} mois`;
  if (mois < 15) return "un an";
  return `${mois} mois`;
}

const bonjour = (prenom: string | null) => (prenom ? `Bonjour ${prenom}` : "Bonjour");
const pour = (prestation: string | null) => (prestation ? `votre ${prestation}` : "votre entretien");

export function texteRappel(c: Contexte) {
  return `${bonjour(c.prenom)}, c'est ${c.garage}. Votre dernier passage pour ${pour(c.prestation)} remonte à ${depuis(
    c.datePassage
  )} : c'est le bon moment pour revenir. Offre ${c.offre} avec le code ${c.code} (valable une fois). Répondez pour réserver. Ne plus recevoir : ${c.lienStop}`;
}

export function texteRelance(c: Contexte) {
  return `${bonjour(c.prenom)}, ${c.garage} ici. Votre ${c.prestation ?? "entretien"} date de ${depuis(
    c.datePassage
  )}, on ne voudrait pas que vous l'oubliiez. Votre offre ${c.offre} (code ${c.code}) vous attend toujours. Dernier message de notre part. Ne plus recevoir : ${c.lienStop}`;
}

export function sujetEmail(type: "rappel" | "relance", c: Contexte) {
  return type === "rappel"
    ? `${c.garage} : c'est le moment pour ${pour(c.prestation)}`
    : `${c.garage} : votre offre ${c.offre} vous attend`;
}

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function htmlEmail(type: "rappel" | "relance", c: Contexte) {
  const corps =
    type === "rappel"
      ? `Votre dernier passage pour ${pour(c.prestation)} remonte à ${depuis(c.datePassage)} : c'est le bon moment pour revenir.`
      : `Votre ${c.prestation ?? "entretien"} date de ${depuis(c.datePassage)}. On ne voudrait pas que vous l'oubliiez.`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f1e7;font-family:Arial,sans-serif;color:#22231f">
<div style="max-width:480px;margin:0 auto;padding:24px">
<div style="background:#fffcf5;border:3px solid #22231f;padding:24px">
<p style="margin:0;font-size:13px;letter-spacing:2px;color:#5f5e57">${echapper(c.garage.toUpperCase())}</p>
<p style="font-size:18px">${echapper(bonjour(c.prenom))},</p>
<p style="font-size:16px;line-height:1.5">${echapper(corps)}</p>
<div style="background:#f2c230;border:3px solid #22231f;padding:16px;text-align:center;margin:20px 0">
<p style="margin:0;font-size:15px;color:#1f3b2d">Votre offre <strong>${echapper(c.offre)}</strong>, valable une fois</p>
<p style="margin:8px 0 0;font-size:28px;letter-spacing:6px;font-weight:bold;color:#1f3b2d">${echapper(c.code)}</p>
</div>
<p style="font-size:15px">Présentez ce code au comptoir. Répondez à cet email pour réserver.</p>
</div>
<p style="font-size:12px;color:#5f5e57;text-align:center">Envoyé par ${echapper(c.garage)} avec Second Tour.
<a href="${echapper(c.lienStop)}" style="color:#5f5e57">Ne plus recevoir de rappel</a></p>
</div></body></html>`;
}

// Lien qui ouvre l'appli SMS du téléphone avec le message déjà écrit.
export function lienSms(telephone: string, texte: string) {
  return `sms:${telephone}?body=${encodeURIComponent(texte)}`;
}
