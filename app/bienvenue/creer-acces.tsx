"use client";

import { useActionState } from "react";
import { creerAcces, type EtatAcces } from "./actions";

export default function CreerAcces({ sessionId, email }: { sessionId: string; email: string | null }) {
  const [etat, action, enCours] = useActionState<EtatAcces, FormData>(creerAcces, { erreur: null });

  return (
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="session_id" value={sessionId} />
      {email && (
        <div>
          <p className="text-sm font-semibold text-gris">Ton identifiant</p>
          <p className="mt-1 break-all font-semibold">{email}</p>
        </div>
      )}
      <div>
        <label htmlFor="mdp" className="block font-semibold">
          Choisis un mot de passe
        </label>
        <input
          id="mdp"
          name="mot_de_passe"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          className="mt-2 h-14 w-full border-2 rounded-2xl border-encre bg-white px-4 text-lg outline-none focus:border-vert"
        />
        <p className="mt-1 text-sm text-gris">8 caractères minimum.</p>
      </div>
      {etat.erreur && (
        <p role="alert" className="border-2 rounded-2xl border-encre bg-jaune p-3 font-semibold text-vert">
          {etat.erreur}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="bouton-pouce etiquette flex w-full items-center justify-center bg-vert px-6 font-titre text-lg text-creme disabled:opacity-60"
      >
        {enCours ? "Ouverture…" : "Ouvrir mon espace"}
      </button>
    </form>
  );
}
