import { randomInt } from "crypto";
import { headers } from "next/headers";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O ni 1/I : lisible au comptoir

export function codeAleatoire(longueur = 6) {
  let s = "";
  for (let i = 0; i < longueur; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return s;
}

export function dansNJours(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export async function origineSite() {
  const h = await headers();
  const hote = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (hote.startsWith("localhost") ? "http" : "https");
  return `${proto}://${hote}`;
}

// Téléphone français (06…, 07…, +33…) ou email. Renvoie null si invalide.
export function lireContact(brut: string): { telephone: string | null; email: string | null } | null {
  const v = brut.trim();
  if (!v) return null;
  if (v.includes("@")) {
    const email = v.toLowerCase();
    return /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/.test(email) ? { telephone: null, email } : null;
  }
  let chiffres = v.replace(/[\s.\-()]/g, "");
  if (chiffres.startsWith("+33")) chiffres = "0" + chiffres.slice(3);
  else if (chiffres.startsWith("0033")) chiffres = "0" + chiffres.slice(4);
  return /^0[1-9]\d{8}$/.test(chiffres) ? { telephone: chiffres, email: null } : null;
}

export function texteCourt(v: FormDataEntryValue | null, max = 80) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function montant(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const n = Number(v.replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n >= 0 && n < 100000 ? Math.round(n * 100) / 100 : null;
}

// Date de passage saisie (AAAA-MM-JJ) : ni dans le futur, ni plus vieille que 3 ans.
export function lireDatePassage(v: FormDataEntryValue | null): string | null | "invalide" {
  if (typeof v !== "string" || !v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "invalide";
  const d = new Date(v + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return "invalide";
  const maintenant = Date.now();
  if (d.getTime() > maintenant + 86400000) return "invalide";
  if (d.getTime() < maintenant - 3 * 365 * 86400000) return "invalide";
  return v;
}

// Date du rappel = date du passage + délai. Si elle est déjà dépassée, le rappel part dès demain.
export function dateRappel(datePassage: string, delaiJours: number) {
  const d = new Date(datePassage + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + delaiJours);
  const demain = dansNJours(1);
  const iso = d.toISOString().slice(0, 10);
  return iso < demain ? demain : iso;
}
