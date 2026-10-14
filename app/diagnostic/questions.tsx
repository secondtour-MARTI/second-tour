"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CLIENTS, METIERS, RETOURS, type MetierId } from "@/lib/diagnostic";

type Etape = 0 | 1 | 2;

export default function Questions() {
  const router = useRouter();
  const [etape, setEtape] = useState<Etape>(0);
  const [metier, setMetier] = useState<MetierId | null>(null);
  const [clients, setClients] = useState<number | null>(null);

  const questions = [
    {
      titre: "Qu'est-ce que tes clients viennent faire chez toi, le plus souvent ?",
      aide: "Chaque prestation a son moment naturel pour revenir.",
      options: (Object.keys(METIERS) as MetierId[]).map((id) => ({
        cle: id,
        libelle: METIERS[id].libelle,
        choisir: () => {
          setMetier(id);
          setEtape(1);
        },
      })),
    },
    {
      titre: "Combien de clients passent chez toi en un mois ?",
      aide: "Une estimation suffit.",
      options: CLIENTS.map((o) => ({
        cle: String(o.valeur),
        libelle: o.libelle,
        choisir: () => {
          setClients(o.valeur);
          setEtape(2);
        },
      })),
    },
    {
      titre: "Sur 10 clients contents, combien reviennent d'eux-mêmes au bon moment ?",
      aide:
        metier
          ? `Pour ${METIERS[metier].unePrestation}, le bon moment, c'est environ ${METIERS[metier].delai} après.`
          : "",
      options: RETOURS.map((o) => ({
        cle: String(o.valeur),
        libelle: o.libelle,
        choisir: () => {
          router.push(`/resultat?m=${metier}&c=${clients}&r=${o.valeur}`);
        },
      })),
    },
  ];

  const q = questions[etape];

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-8 pt-4">
      {/* En-tête : retour + progression */}
      <div className="flex items-center gap-3">
        {etape === 0 ? (
          <Link href="/" className="flex h-11 w-11 items-center justify-center text-2xl" aria-label="Retour à l'accueil">
            ←
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setEtape((e) => (e - 1) as Etape)}
            className="flex h-11 w-11 items-center justify-center text-2xl"
            aria-label="Question précédente"
          >
            ←
          </button>
        )}
        <div
          className="h-4 flex-1 border-[3px] border-encre bg-papier"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={etape + 1}
        >
          <div className="h-full bg-jaune transition-all duration-300" style={{ width: `${((etape + 1) / 3) * 100}%` }} />
        </div>
        <span className="w-10 text-right font-titre text-sm">{etape + 1}/3</span>
      </div>

      <h1 key={`t${etape}`} className="mt-8 font-titre text-[1.7rem] leading-tight">
        {q.titre}
      </h1>
      {q.aide && <p className="mt-2 text-gris">{q.aide}</p>}

      <ul key={`o${etape}`} className="mt-7 space-y-3">
        {q.options.map((o) => (
          <li key={o.cle}>
            <button
              type="button"
              onClick={o.choisir}
              className="bouton-pouce flex w-full items-center border-[3px] border-encre bg-papier px-5 text-left text-lg font-semibold shadow-[4px_4px_0_var(--color-encre)] active:translate-x-[3px] active:translate-y-[3px] active:bg-jaune active:shadow-none"
            >
              {o.libelle}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
