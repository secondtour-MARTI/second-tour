// Les formules. Partagé client/serveur : aucune donnée secrète ici.

export const PLANS = {
  essentiel: {
    nom: "Essentiel",
    prix: 29,
    intervalle: "month" as const,
    parJour: "0,97 €",
    unite: "/mois",
    points: ["Rappels automatiques par email", "Offre de retour à usage unique", "Compteur de clients revenus"],
  },
  pro: {
    nom: "Pro",
    prix: 49,
    intervalle: "month" as const,
    parJour: "1,63 €",
    unite: "/mois",
    points: ["Tout Essentiel", "Rappels par SMS : le canal que tes clients lisent", "Affiche QR prête à imprimer"],
  },
  annuel: {
    nom: "Pro à l'année",
    prix: 490,
    intervalle: "year" as const,
    parJour: "1,34 €",
    unite: "/an",
    points: ["Tout Pro", "2 mois offerts", "Un seul paiement par an"],
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const estPlan = (v: unknown): v is PlanId => typeof v === "string" && v in PLANS;

export const GARANTIE_JOURS = 30;
