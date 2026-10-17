"use client";

import { useActionState } from "react";
import { inscrire, type EtatInscription } from "./actions";

export default function FormulaireInscription({ slug, garage, offre }: { slug: string; garage: string; offre: string }) {
  const [etat, action, enCours] = useActionState<EtatInscription, FormData>(inscrire, { ok: false, erreur: null });
  const champ = "mt-2 h-14 w-full border-2 rounded-2xl border-encre bg-white px-4 text-lg outline-none focus:border-vert";

  if (etat.ok) {
    return (
      <div className="mt-6 text-center">
        <p className="font-titre text-3xl text-vert">C&apos;est noté, merci !</p>
        <p className="mt-3 text-lg">
          {garage} vous enverra un seul rappel quand ce sera le moment, avec votre offre {offre}.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div>
        <label htmlFor="contact" className="block font-semibold">Votre portable ou votre email</label>
        <input id="contact" name="contact" required autoComplete="tel" placeholder="06 12 34 56 78" className={champ} />
      </div>
      <div>
        <label htmlFor="prenom" className="block font-semibold">Votre prénom <span className="font-normal text-gris">(facultatif)</span></label>
        <input id="prenom" name="prenom" maxLength={40} autoComplete="given-name" className={champ} />
      </div>
      <label className="flex items-start gap-3">
        <input type="checkbox" name="accord" value="oui" required className="mt-1 h-6 w-6 shrink-0 accent-[#1b3faf]" />
        <span>J&apos;accepte de recevoir un rappel de {garage} pour mon prochain entretien. Je peux me désinscrire à tout moment.</span>
      </label>
      {etat.erreur && (
        <p role="alert" className="border-2 rounded-2xl border-encre bg-jaune p-3 font-semibold text-vert">{etat.erreur}</p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="bouton-pouce etiquette flex w-full items-center justify-center bg-vert px-6 font-titre text-lg text-creme disabled:opacity-60"
      >
        {enCours ? "Envoi…" : "Me prévenir au bon moment"}
      </button>
    </form>
  );
}
