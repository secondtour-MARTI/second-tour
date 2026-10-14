import type { Metadata } from "next";
import Link from "next/link";
import { calculer, euros, lireReponses } from "@/lib/diagnostic";
import MessageRappel from "./message";

export const metadata: Metadata = {
  title: "Ton plan de rappels — Second Tour",
  description: "Ton calendrier de rappels et ton premier message, prêts à servir.",
};

type Props = { searchParams: Promise<{ m?: string; c?: string; r?: string }> };

const verrouille = [
  "L'affiche QR pour ton comptoir : le client laisse son numéro en payant",
  "L'envoi automatique de chaque rappel, au bon moment, sans y penser",
  "L'offre de retour à usage unique, validée au comptoir en un toucher",
  "Le compteur : clients revenus et euros générés par les rappels",
];

export default async function Plan({ searchParams }: Props) {
  const reponses = lireReponses(await searchParams);

  if (!reponses) {
    return (
      <main className="flex min-h-dvh flex-col justify-center px-5">
        <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
          <p className="font-titre text-2xl text-vert">On a besoin de tes réponses.</p>
          <p className="mt-3 text-gris">Ton plan se construit à partir du diagnostic. Une minute, trois questions.</p>
          <Link href="/diagnostic" className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert">
            Faire le diagnostic
          </Link>
        </div>
      </main>
    );
  }

  const r = calculer(reponses);
  const m = r.metier;
  const query = `m=${reponses.metier}&c=${reponses.clients}&r=${reponses.retour}`;

  const etapes = [
    { quand: "Le jour du passage", quoi: "Le client laisse son numéro ou son email en payant." },
    { quand: m.rappel.charAt(0).toUpperCase() + m.rappel.slice(1), quoi: "Il reçoit ton rappel avec une offre de retour." },
    { quand: "Dans les 30 jours", quoi: "Il revient, montre son offre, tu la valides. Le compteur avance." },
  ];

  return (
    <main className="min-h-dvh pb-12">
      <header className="bg-vert px-5 py-3">
        <p className="font-titre text-lg tracking-wide text-creme">
          SECOND<span className="text-jaune"> TOUR</span>
        </p>
      </header>

      <section className="bg-vert px-5 pb-8 pt-5 text-creme">
        <p className="text-sm font-semibold uppercase tracking-widest text-jaune">Ton plan de rappels</p>
        <h1 className="mt-2 font-titre text-[1.9rem] leading-tight">Voilà ton plan, prêt.</h1>
        <p className="mt-3 text-creme/90">
          Fait pour {m.unePrestation}. Objectif : faire revenir une partie des {r.perdusParAn} clients qui oublient chaque année.
        </p>
      </section>

      {/* 1. Calendrier — gratuit */}
      <section className="px-5 pt-8">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-xl">1. Quand rappeler tes clients</h2>
          <ol className="mt-4 border-l-[3px] border-encre pl-5">
            {etapes.map((e, i) => (
              <li key={e.quand} className={`relative ${i < etapes.length - 1 ? "pb-5" : ""}`}>
                <span aria-hidden="true" className="absolute -left-[31px] top-1 h-4 w-4 border-[3px] border-encre bg-jaune" />
                <p className="font-semibold">{e.quand}</p>
                <p className="text-gris">{e.quoi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 2. Message — gratuit et utilisable tout de suite */}
      <section className="px-5 pt-8">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-xl">2. Ton premier message de rappel</h2>
          <p className="mt-1 text-gris">Il est à toi : tu peux l&apos;envoyer à la main dès aujourd&apos;hui.</p>
          <MessageRappel prestation={m.prestation} unePrestation={m.unePrestation} depuis={m.rappelCourt} />
        </div>
      </section>

      {/* 3. Verrouillé */}
      <section className="px-5 pt-10">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-xl">3. Ce qui le fait tourner tout seul</h2>
          <ul className="mt-4 space-y-3">
            {verrouille.map((v) => (
              <li key={v} className="flex items-start gap-3 border-[3px] border-dashed border-gris/60 bg-papier/60 p-4 text-gris">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="5" y="11" width="14" height="10" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <span>{v}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-[3px] border-encre bg-jaune p-5">
            <p className="font-semibold text-vert">
              Avec un retour sur 10 seulement, ça représente <strong className="font-titre">{euros(r.gainAnnuel)}</strong> par an pour toi.
            </p>
          </div>

          <Link
            href={`/activer?${query}`}
            className="bouton-pouce etiquette mt-6 flex w-full items-center justify-center bg-vert px-6 text-center font-titre text-lg text-creme active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            Garder mon plan et l&apos;activer
          </Link>
        </div>
      </section>
    </main>
  );
}
