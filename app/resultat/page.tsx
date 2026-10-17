import type { Metadata } from "next";
import Link from "next/link";
import Marque from "@/components/marque";
import Compteur from "@/components/compteur";
import { CLIENTS, PART_RECUPEREE, calculer, euros, lireReponses } from "@/lib/diagnostic";

export const metadata: Metadata = {
  title: "Ton résultat — Second Tour",
  description: "Ce que tes clients qui oublient de revenir te coûtent, chiffré avec tes réponses.",
};

type Props = { searchParams: Promise<{ m?: string; c?: string; r?: string }> };

export default async function Resultat({ searchParams }: Props) {
  const params = await searchParams;
  const reponses = lireReponses(params);

  if (!reponses) {
    return (
      <main className="flex min-h-dvh flex-col justify-center px-5">
        <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
          <p className="font-titre text-2xl text-vert">Il manque une réponse.</p>
          <p className="mt-3 text-gris">Reprends le diagnostic, ça prend une minute.</p>
          <Link href="/diagnostic" className="bouton-pouce mt-6 flex items-center justify-center border-2 rounded-2xl border-encre bg-jaune font-titre text-vert">
            Refaire le diagnostic
          </Link>
        </div>
      </main>
    );
  }

  const r = calculer(reponses);
  const libelleClients = CLIENTS.find((c) => c.valeur === reponses.clients)!.libelle.toLowerCase();
  const query = `m=${reponses.metier}&c=${reponses.clients}&r=${reponses.retour}`;

  return (
    <main className="min-h-dvh pb-10">
      <header className="bg-vert px-5 py-3">
        <Marque clair />
      </header>

      {/* Ses réponses, avec ses mots */}
      <section className="bg-vert px-5 pb-8 pt-5 text-creme">
        <p className="text-sm font-semibold text-jaune">Ton résultat</p>
        <p className="mt-3 text-lg">
          Si on résume : {r.metier.phrase}, avec {libelleClients} clients par mois.{" "}
          {reponses.retour === 0
            ? "Et tu ne sais pas combien reviennent. C'est justement le problème : personne ne le suit."
            : `Sur 10 clients contents, environ ${reponses.retour} reviennent d'eux-mêmes.`}
        </p>
      </section>

      {/* Ce que ça coûte aujourd'hui */}
      <section className="px-5 pt-8">
        <div className="etiquette mx-auto max-w-xl bg-papier p-5">
          <p className="font-semibold">Ce que tu laisses partir aujourd&apos;hui :</p>
          <Compteur valeur={r.perteAnnuelle} prefixe="−" className="mt-3 block font-titre text-5xl leading-none text-alerte" />
          <p className="mt-2 font-semibold">par an.</p>
          <p className="mt-4 text-sm text-gris">
            Environ {r.perdusParAn} clients par an qui ne reviennent pas
            {reponses.retour === 0 ? ` (on a compté ${r.retourUtilise} sur 10 qui reviennent)` : ""}, à{" "}
            {euros(r.metier.panier)} le passage. Ils ne sont pas déçus : ils ont oublié, et personne ne les a relancés.
          </p>
        </div>
      </section>

      {/* Ce que Second Tour changerait */}
      <section className="px-5 pt-8">
        <div className="mx-auto max-w-xl rounded-[28px] border-2 border-encre bg-voyant p-5 text-papier shadow-[0_6px_0_#0e1a33]">
          <p className="font-semibold text-papier">
            Si un rappel envoyé au bon moment en fait revenir seulement {Math.round(PART_RECUPEREE * 10)} sur 10 :
          </p>
          <Compteur valeur={r.gainAnnuel} prefixe="+" className="mt-3 block font-titre text-5xl leading-none" />
          <p className="mt-2 font-semibold text-papier">
            par an, soit {r.recuperes} clients qui repassent pour leur {r.metier.prestation}.
          </p>
          <p className="mt-3 text-sm text-papier/85">
            Une hypothèse volontairement prudente. Tu verras le vrai chiffre dans ton compteur.
          </p>
        </div>
      </section>

      <section className="px-5 pt-8">
        <div className="mx-auto max-w-xl">
          <Link
            href={`/plan?${query}`}
            className="bouton-pouce etiquette flex w-full items-center justify-center bg-vert px-6 text-center font-titre text-lg text-creme"
          >
            Voir mon plan de rappels
          </Link>
          <p className="mt-3 text-center text-sm text-gris">Gratuit. Prêt en un instant.</p>
        </div>
      </section>
    </main>
  );
}
