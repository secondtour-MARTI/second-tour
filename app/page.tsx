import Link from "next/link";

const benefices = [
  {
    titre: "Le client laisse son numéro en 5 secondes",
    texte:
      "Une affiche avec un QR code sur ton comptoir. Il scanne en payant, c'est fait. Aucun fichier à tenir.",
  },
  {
    titre: "Le rappel part tout seul, au bon moment",
    texte:
      "Vidange après un an, pneus à la saison, révision à l'échéance. Tu n'as rien à penser.",
  },
  {
    titre: "Tu vois ce que ça t'a rapporté",
    texte:
      "Un compteur simple : combien de clients sont revenus, et combien d'euros ils ont laissé.",
  },
];

export default function Accueil() {
  return (
    <main className="min-h-dvh">
      {/* Bandeau marque */}
      <header className="bg-vert px-5 py-3">
        <p className="font-titre text-lg tracking-wide text-creme">
          SECOND<span className="text-jaune"> TOUR</span>
        </p>
      </header>

      {/* Promesse — reprise mot pour mot dans les vidéos */}
      <section className="bg-vert px-5 pb-10 pt-6 text-creme">
        <h1 className="font-titre text-[2.15rem] leading-[1.08] sm:text-5xl">
          Le rappel qui fait revenir tes clients au garage,{" "}
          <span className="bg-jaune px-1 text-vert">tout seul.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-creme/90">
          Un client content ne revient pas parce qu&apos;il oublie, pas parce
          qu&apos;il est déçu. Personne ne le relance. Second Tour s&apos;en
          charge.
        </p>
        <Link
          href="/diagnostic"
          className="bouton-pouce etiquette mt-7 flex w-full items-center justify-center bg-jaune px-6 text-center font-titre text-lg text-vert active:translate-x-[3px] active:translate-y-[3px] active:shadow-none sm:w-auto sm:inline-flex"
        >
          Commencer — c&apos;est gratuit
        </Link>
        <p className="mt-3 text-center text-sm text-creme/75 sm:text-left">
          3 questions, 1 minute. Sans carte bancaire.
        </p>
      </section>

      {/* La douleur, chiffrée */}
      <section className="px-5 py-10">
        <div className="etiquette mx-auto max-w-xl bg-papier p-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-gris">
            Un exemple de calcul
          </p>
          <p className="mt-2">
            40 clients par mois. La moitié ne revient pas l&apos;année suivante.
            150 € le passage.
          </p>
          <p className="mt-4 font-titre text-5xl leading-none text-vert">
            36 000 €
          </p>
          <p className="mt-2 font-semibold">
            par an qui partent chez le garage d&apos;à côté.
          </p>
          <p className="mt-3 text-sm text-gris">
            Le diagnostic gratuit fait ce calcul avec tes chiffres à toi.
          </p>
        </div>
      </section>

      {/* Trois bénéfices */}
      <section className="px-5 pb-12">
        <ol className="mx-auto max-w-xl space-y-6">
          {benefices.map((b, i) => (
            <li key={b.titre} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-encre bg-jaune font-titre text-xl text-vert"
              >
                {i + 1}
              </span>
              <div>
                <h2 className="font-titre text-xl leading-tight">{b.titre}</h2>
                <p className="mt-1 text-gris">{b.texte}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-xl">
          <Link
            href="/diagnostic"
            className="bouton-pouce etiquette flex w-full items-center justify-center bg-vert px-6 font-titre text-lg text-creme active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            Commencer — c&apos;est gratuit
          </Link>
        </div>
      </section>

      <footer className="border-t-[3px] border-encre bg-papier px-5 py-6 text-sm text-gris">
        <p className="font-titre text-encre">SECOND TOUR</p>
        <p className="mt-1">Le rappel qui fait revenir les clients.</p>
      </footer>
    </main>
  );
}
