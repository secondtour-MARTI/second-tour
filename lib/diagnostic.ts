// Données et calculs du diagnostic. Partagé entre les questions et le résultat.

export const METIERS = {
  entretien: {
    libelle: "Entretien & vidange",
    phrase: "tu fais de l'entretien et des vidanges",
    prestation: "vidange",
    unePrestation: "une vidange",
    delai: "12 mois",
    rappel: "11 mois après le passage",
    rappelCourt: "presque un an",
    panier: 180,
  },
  pneus: {
    libelle: "Pneus",
    phrase: "tu montes des pneus",
    prestation: "changement de pneus",
    unePrestation: "un changement de pneus",
    delai: "6 mois",
    rappel: "5 mois après le passage, avant la saison",
    rappelCourt: "6 mois",
    panier: 120,
  },
  lavage: {
    libelle: "Lavage & esthétique",
    phrase: "tu fais du lavage et de l'esthétique auto",
    prestation: "lavage",
    unePrestation: "un lavage",
    delai: "1 mois",
    rappel: "4 semaines après le passage",
    rappelCourt: "un mois",
    panier: 35,
  },
  ct: {
    libelle: "Contrôle technique",
    phrase: "tu fais du contrôle technique",
    prestation: "contrôle technique",
    unePrestation: "un contrôle technique",
    delai: "2 ans",
    rappel: "23 mois après le passage",
    rappelCourt: "presque deux ans",
    panier: 80,
  },
} as const;

export type MetierId = keyof typeof METIERS;

export const CLIENTS = [
  { valeur: 20, libelle: "Moins de 30" },
  { valeur: 50, libelle: "Entre 30 et 80" },
  { valeur: 110, libelle: "Entre 80 et 150" },
  { valeur: 180, libelle: "Plus de 150" },
] as const;

// Sur 10 clients contents, combien reviennent d'eux-mêmes ? 0 = « je ne sais pas »
export const RETOURS = [
  { valeur: 2, libelle: "2 sur 10, à peu près" },
  { valeur: 4, libelle: "4 sur 10" },
  { valeur: 6, libelle: "6 sur 10" },
  { valeur: 8, libelle: "8 sur 10" },
  { valeur: 0, libelle: "Je n'en sais rien" },
] as const;

// Hypothèse prudente, affichée telle quelle à l'utilisateur.
export const PART_RECUPEREE = 0.1;
// Taux supposé quand la personne ne sait pas.
const RETOUR_PAR_DEFAUT = 5;

export type Reponses = { metier: MetierId; clients: number; retour: number };

export function lireReponses(p: {
  m?: string;
  c?: string;
  r?: string;
}): Reponses | null {
  const metier = p.m as MetierId;
  const clients = Number(p.c);
  const retour = Number(p.r);
  if (!metier || !(metier in METIERS)) return null;
  if (!CLIENTS.some((o) => o.valeur === clients)) return null;
  if (!RETOURS.some((o) => o.valeur === retour)) return null;
  return { metier, clients, retour };
}

export function calculer(r: Reponses) {
  const m = METIERS[r.metier];
  const retour = r.retour === 0 ? RETOUR_PAR_DEFAUT : r.retour;
  const perdusParAn = Math.round(r.clients * 12 * ((10 - retour) / 10));
  const perteAnnuelle = perdusParAn * m.panier;
  const recuperes = Math.round(perdusParAn * PART_RECUPEREE);
  const gainAnnuel = recuperes * m.panier;
  return { metier: m, retourUtilise: retour, perdusParAn, perteAnnuelle, recuperes, gainAnnuel };
}

export const euros = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " €";
