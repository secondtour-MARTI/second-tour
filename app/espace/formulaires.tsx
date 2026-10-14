"use client";

import { useActionState, useEffect, useRef } from "react";
import { ajouterClient, enregistrerGarage, validerOffre, type Etat } from "./actions";
import { METIERS, type MetierId } from "@/lib/diagnostic";

const initial: Etat = { ok: null, erreur: null };
const champ = "mt-2 h-14 w-full border-[3px] border-encre bg-white px-4 text-lg outline-none focus:border-vert";
const bouton =
  "bouton-pouce etiquette flex w-full items-center justify-center px-6 font-titre text-lg disabled:opacity-60 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

function Message({ etat }: { etat: Etat }) {
  if (etat.erreur)
    return (
      <p role="alert" className="border-[3px] border-encre bg-jaune p-3 font-semibold text-vert">
        {etat.erreur}
      </p>
    );
  if (etat.ok)
    return (
      <p role="status" className="border-[3px] border-vert bg-papier p-3 font-semibold text-vert">
        ✓ {etat.ok}
      </p>
    );
  return null;
}

export function FormGarage({ nom, metier, offre }: { nom: string; metier: string; offre: string }) {
  const [etat, action, enCours] = useActionState(enregistrerGarage, initial);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block font-semibold">Nom de ton garage</label>
        <input id="nom" name="nom" defaultValue={nom} required maxLength={60} placeholder="Ex. : Garage du Centre" className={champ} />
      </div>
      <div>
        <label htmlFor="metier" className="block font-semibold">Ta prestation principale</label>
        <select id="metier" name="metier" defaultValue={metier || "entretien"} className={champ}>
          {(Object.keys(METIERS) as MetierId[]).map((id) => (
            <option key={id} value={id}>
              {METIERS[id].libelle} — rappel {METIERS[id].rappel}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="offre" className="block font-semibold">Ton offre de retour</label>
        <input id="offre" name="offre" defaultValue={offre} maxLength={40} placeholder="-10 %" className={champ} />
        <p className="mt-1 text-sm text-gris">Valable une seule fois, sur présentation du code reçu.</p>
      </div>
      <Message etat={etat} />
      <button type="submit" disabled={enCours} className={`${bouton} bg-vert text-creme`}>
        {enCours ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

export function FormClient() {
  const [etat, action, enCours] = useActionState(ajouterClient, initial);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (etat.ok) ref.current?.reset();
  }, [etat]);

  return (
    <form ref={ref} action={action} className="space-y-4">
      <div>
        <label htmlFor="contact" className="block font-semibold">Portable ou email du client</label>
        <input id="contact" name="contact" required inputMode="email" autoComplete="off" placeholder="06 12 34 56 78" className={champ} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prenom" className="block font-semibold">Prénom</label>
          <input id="prenom" name="prenom" maxLength={40} autoComplete="off" className={champ} />
        </div>
        <div>
          <label htmlFor="montant" className="block font-semibold">Montant (€)</label>
          <input id="montant" name="montant" inputMode="decimal" placeholder="180" className={champ} />
        </div>
      </div>
      <label className="flex items-start gap-3">
        <input type="checkbox" name="accord" value="oui" required className="mt-1 h-6 w-6 shrink-0 accent-[#1f3b2d]" />
        <span>Le client est d&apos;accord pour recevoir un rappel de ma part.</span>
      </label>
      <Message etat={etat} />
      <button type="submit" disabled={enCours} className={`${bouton} bg-jaune text-vert`}>
        {enCours ? "Ajout…" : "Ajouter le client"}
      </button>
    </form>
  );
}

export function FormOffre() {
  const [etat, action, enCours] = useActionState(validerOffre, initial);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (etat.ok) ref.current?.reset();
  }, [etat]);

  return (
    <form ref={ref} action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="code" className="block font-semibold">Code du client</label>
          <input
            id="code"
            name="code"
            required
            maxLength={8}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="K7MP2Q"
            className={`${champ} font-mono uppercase tracking-widest`}
          />
        </div>
        <div>
          <label htmlFor="montant_retour" className="block font-semibold">Montant (€)</label>
          <input id="montant_retour" name="montant_retour" required inputMode="decimal" placeholder="180" className={champ} />
        </div>
      </div>
      <Message etat={etat} />
      <button type="submit" disabled={enCours} className={`${bouton} bg-vert text-creme`}>
        {enCours ? "Validation…" : "Valider l'offre"}
      </button>
    </form>
  );
}
