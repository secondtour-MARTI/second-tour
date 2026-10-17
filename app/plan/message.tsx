"use client";

import { useState } from "react";

type Props = { prestation: string; unePrestation: string; depuis: string };

export default function MessageRappel({ prestation, depuis }: Props) {
  const [garage, setGarage] = useState("");
  const [copie, setCopie] = useState(false);

  const nom = garage.trim() || "[nom de ton garage]";
  const texte = `Bonjour, c'est ${nom}. Votre dernier passage pour votre ${prestation} remonte à ${depuis} : c'est le bon moment pour revenir. Sur présentation de ce message, -10 % sur votre ${prestation} ce mois-ci. Répondez à ce SMS pour réserver. (STOP pour ne plus recevoir de rappel)`;

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      setCopie(false);
    }
  }

  return (
    <div className="mt-4">
      <label htmlFor="garage" className="block font-semibold">
        Le nom de ton garage
      </label>
      <input
        id="garage"
        type="text"
        value={garage}
        maxLength={60}
        onChange={(e) => setGarage(e.target.value)}
        placeholder="Ex. : Garage du Centre"
        className="mt-2 h-14 w-full border-2 rounded-2xl border-encre bg-papier px-4 text-lg outline-none focus:border-vert"
        autoComplete="organization"
      />

      <div className="etiquette mt-4 bg-papier p-4">
        <p className="text-xs font-semibold text-gris">Aperçu du SMS</p>
        <p className="mt-2 whitespace-pre-line">{texte}</p>
      </div>

      <button
        type="button"
        onClick={copier}
        className="bouton-pouce mt-4 flex w-full items-center justify-center border-2 rounded-2xl border-encre bg-jaune font-titre text-vert"
      >
        {copie ? "Copié ✓" : "Copier le message"}
      </button>
    </div>
  );
}
