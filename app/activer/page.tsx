import Marque from "@/components/marque";
import type { Metadata } from "next";
import { calculer, euros, lireReponses } from "@/lib/diagnostic";
import { GARANTIE_JOURS, PLANS } from "@/lib/plans";
import { EMAIL_CONTACT } from "@/lib/config";
import Paiement from "./paiement";

export const metadata: Metadata = {
  title: "Activer mon plan — Second Tour",
  description: "Garde ton plan de rappels et laisse-le tourner tout seul. Satisfait ou remboursé 30 jours.",
};

type Props = { searchParams: Promise<{ m?: string; c?: string; r?: string }> };

const faq = [
  {
    q: "Est-ce que ça marche pour mon garage ?",
    r: "Oui, si tes clients reviennent pour un entretien régulier : vidange, pneus, révision, lavage, contrôle technique. Tu choisis le délai de rappel de chaque prestation, Second Tour s'occupe du reste.",
  },
  {
    q: "Combien de temps ça me prend ?",
    r: "Dix minutes pour démarrer : tu poses l'affiche QR sur ton comptoir. Ensuite, quelques secondes par client, au moment où il paie. Les rappels partent tout seuls.",
  },
  {
    q: "Et si je veux arrêter ?",
    r: `Tu résilies quand tu veux, sans frais et sans engagement : un email à ${EMAIL_CONTACT} suffit. L'abonnement s'arrête à la fin de la période payée. Et pendant les ${GARANTIE_JOURS} premiers jours, tu es remboursé intégralement.`,
  },
  {
    q: "À quoi sert exactement ce que je paie ?",
    r: "À faire revenir des clients que tu perds aujourd'hui sans le savoir : la collecte des numéros, l'envoi automatique des rappels au bon moment, l'offre de retour, et le compteur qui te montre ce que ça t'a rapporté.",
  },
];

export default async function Activer({ searchParams }: Props) {
  const params = await searchParams;
  const reponses = lireReponses(params);
  const r = reponses ? calculer(reponses) : null;
  const coutAnnuelPro = PLANS.pro.prix * 12;

  return (
    <main className="min-h-dvh pb-12">
      <header className="bg-vert px-5 py-3">
        <Marque clair />
      </header>

      {/* 1. Ce qui a été fait pour lui + garantie visible sans défiler */}
      <section className="bg-vert px-5 pb-6 pt-5 text-creme">
        <h1 className="font-titre text-[1.9rem] leading-tight">Voilà ton plan, prêt.</h1>
        <p className="mt-2 text-creme/90">
          {r
            ? `Ton calendrier de rappels pour ${r.metier.unePrestation} et ton premier message sont faits. Il ne reste qu'à les faire tourner tout seuls.`
            : "Ton calendrier de rappels et ton premier message sont faits. Il ne reste qu'à les faire tourner tout seuls."}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 border-2 border-jaune px-3 py-1.5 text-sm font-semibold text-jaune">
          <span aria-hidden="true">✓</span> Satisfait ou remboursé {GARANTIE_JOURS} jours
        </p>
      </section>

      {/* 2. Ce que ça rapporte, comparé au prix */}
      {r && (
        <section className="px-5 pt-6">
          <div className="mx-auto grid max-w-xl grid-cols-2 border-2 rounded-2xl border-encre bg-papier">
            <div className="border-r-[3px] border-encre p-4">
              <p className="text-sm text-gris">Ce que ça peut te rapporter</p>
              <p className="mt-1 font-titre text-2xl leading-tight text-vert">{euros(r.gainAnnuel)}</p>
              <p className="text-sm text-gris">par an</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gris">Ce que ça coûte (Pro)</p>
              <p className="mt-1 font-titre text-2xl leading-tight">{euros(coutAnnuelPro)}</p>
              <p className="text-sm text-gris">par an</p>
            </div>
          </div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gris">
            Avec une hypothèse prudente : un client oublieux sur 10 qui revient.
          </p>
        </section>
      )}

      {/* 3 à 6. Formules + paiement sur le même écran */}
      <section className="px-5 pt-8">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-xl">Choisis ta formule</h2>
          <Paiement params={{ m: params.m ?? "", c: params.c ?? "", r: params.r ?? "" }} />
        </div>
      </section>

      {/* 4. Garantie en clair */}
      <section className="px-5 pt-10">
        <div className="etiquette mx-auto max-w-xl bg-papier p-5">
          <h2 className="font-titre text-xl">Satisfait ou remboursé, {GARANTIE_JOURS} jours</h2>
          <p className="mt-2">
            Si Second Tour ne te convient pas, écris à <strong>{EMAIL_CONTACT}</strong> dans les {GARANTIE_JOURS} jours
            qui suivent ton premier paiement. Pas de justification à donner. Tu es remboursé intégralement sur ta carte
            sous 5 jours ouvrés, et ton abonnement est arrêté.
          </p>
        </div>
      </section>

      {/* 7. Questions fréquentes */}
      <section className="px-5 pt-10">
        <div className="mx-auto max-w-xl">
          <h2 className="font-titre text-xl">Questions fréquentes</h2>
          <div className="mt-4 space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group border-2 rounded-2xl border-encre bg-papier">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="font-titre text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-4 pb-4 text-gris">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
