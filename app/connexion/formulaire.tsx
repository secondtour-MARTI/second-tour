"use client";

import { useActionState } from "react";
import { seConnecter, type EtatConnexion } from "./actions";

export default function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState<EtatConnexion, FormData>(seConnecter, { erreur: null });
  const champ = "mt-2 h-14 w-full border-[3px] border-encre bg-white px-4 text-lg outline-none focus:border-vert";

  return (
    <form action={action} className="mt-5 space-y-4">
      <div>
        <label htmlFor="email" className="block font-semibold">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" className={champ} />
      </div>
      <div>
        <label htmlFor="mdp" className="block font-semibold">Mot de passe</label>
        <input id="mdp" name="mot_de_passe" type="password" required autoComplete="current-password" className={champ} />
      </div>
      {etat.erreur && (
        <p role="alert" className="border-[3px] border-encre bg-jaune p-3 font-semibold text-vert">
          {etat.erreur}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="bouton-pouce etiquette flex w-full items-center justify-center bg-vert px-6 font-titre text-lg text-creme disabled:opacity-60"
      >
        {enCours ? "Connexion…" : "Me connecter"}
      </button>
    </form>
  );
}
