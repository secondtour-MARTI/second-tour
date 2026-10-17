import Link from "next/link";
import Marque from "@/components/marque";
import Compteur from "@/components/compteur";

const etapes = [
  {
    titre: "Le client laisse son numéro en payant",
    texte: "Il scanne l'affiche posée sur ton comptoir. 5 secondes, aucun fichier à tenir.",
    couleur: "bg-jaune",
  },
  {
    titre: "Le rappel part tout seul, au bon moment",
    texte: "Vidange au bout d'un an, pneus avant la saison. Avec une petite offre pour revenir chez toi.",
    couleur: "bg-voyant",
  },
  {
    titre: "Tu vois ce que ça t'a rapporté",
    texte: "Clients revenus, euros encaissés : ton compteur avance à chaque retour.",
    couleur: "bg-papier",
  },
];

// La vignette de vidange collée sur le pare-brise : l'objet que tout garagiste reconnaît.
function Vignette() {
  return (
    <div className="anim-posee relative mx-auto w-[min(100%,330px)] rotate-3">
      <div className="rounded-[28px] border-2 border-encre bg-papier p-5 text-encre shadow-[0_8px_0_#0e1a33]">
        <div className="flex items-center justify-between">
          <p className="font-titre text-lg">Prochaine vidange</p>
          <span className="anim-voyant inline-block h-3.5 w-3.5 rounded-full bg-jaune ring-2 ring-encre" aria-hidden="true" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-creme px-3 py-2">
            <p className="text-sm text-gris">Le</p>
            <p className="anim-ecrire font-titre text-2xl">14 octobre 2027</p>
          </div>
          <div className="rounded-xl bg-creme px-3 py-2">
            <p className="text-sm text-gris">Ou à</p>
            <p className="anim-ecrire-2 font-titre text-2xl">96 500 km</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-gris">Garage du Centre</p>
      </div>
      <div className="anim-tampon absolute -bottom-5 -right-3 rounded-2xl border-2 border-encre bg-voyant px-3 py-2 font-titre text-papier shadow-[0_4px_0_#0e1a33]">
        Rappel envoyé
      </div>
    </div>
  );
}

export default function Accueil() {
  return (
    <main className="min-h-dvh overflow-hidden">
      {/* Promesse : reprise mot pour mot dans les vidéos */}
      <section className="relative bg-vert px-5 pb-16 pt-4 text-papier">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-vert-clair" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-16 h-40 w-40 rounded-full border-[18px] border-jaune/90" />
        <div className="relative mx-auto max-w-5xl">
          <Marque clair />
          <div className="mt-8 grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="font-titre text-[2.6rem] leading-[1.02] sm:text-6xl">
                Le rappel qui fait revenir tes clients au garage, tout seul.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-papier/85">
                Un client content ne revient pas parce qu&apos;il oublie, pas parce qu&apos;il est déçu. Personne ne le
                relance. Second Tour s&apos;en charge.
              </p>
              <Link
                href="/diagnostic"
                className="bouton-pouce etiquette mt-8 flex w-full items-center justify-center bg-jaune px-8 font-titre text-xl text-encre sm:inline-flex sm:w-auto"
              >
                Commencer gratuitement
              </Link>
              <p className="mt-3 text-center text-sm text-papier/75 sm:text-left">
                3 questions, 1 minute. Sans carte bancaire.
              </p>
            </div>
            <Vignette />
          </div>
        </div>
      </section>

      {/* La douleur, chiffrée */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-3xl leading-tight">Ce que coûtent les clients qui oublient</h2>
          <p className="mt-2 text-gris">
            Exemple : 40 clients par mois, la moitié ne revient pas l&apos;année suivante, 150 € le passage.
          </p>
          <div className="mt-6 rounded-[28px] border-2 border-encre bg-alerte p-6 text-papier shadow-[0_6px_0_#0e1a33]">
            <Compteur valeur={36000} prefixe="−" className="block font-titre text-6xl leading-none" />
            <p className="mt-2 text-lg font-bold">par an, partis chez le garage d&apos;à côté.</p>
          </div>
          <p className="mt-4 text-gris">Le diagnostic gratuit fait ce calcul avec tes chiffres à toi.</p>
        </div>
      </section>

      {/* Le fonctionnement, en trois temps */}
      <section className="bg-papier px-5 py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-3xl leading-tight">Comment ça marche</h2>
          <ol className="mt-8 space-y-5">
            {etapes.map((e, i) => (
              <li key={e.titre} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-encre ${e.couleur} font-titre text-xl shadow-[0_3px_0_#0e1a33]`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-titre text-xl leading-tight">{e.titre}</h3>
                  <p className="mt-1 text-gris">{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/diagnostic"
            className="bouton-pouce etiquette mt-10 flex w-full items-center justify-center bg-vert px-6 font-titre text-xl text-papier"
          >
            Calculer ce que je perds
          </Link>
        </div>
      </section>
    </main>
  );
}
