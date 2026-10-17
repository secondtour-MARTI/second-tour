"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { PLANS, type PlanId } from "@/lib/plans";

const clePublique = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "").trim();
const cleValide = clePublique.startsWith("pk_");
const stripePromise = cleValide ? loadStripe(clePublique) : null;

const ORDRE: PlanId[] = ["essentiel", "pro", "annuel"];

type Props = { params: { m: string; c: string; r: string } };

export default function Paiement({ params }: Props) {
  const [plan, setPlan] = useState<PlanId>("pro");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const conteneur = useRef<HTMLDivElement>(null);

  // Monte le formulaire de paiement Stripe directement dans la page, pour la formule choisie.
  useEffect(() => {
    if (!stripePromise) return;
    let annule = false;
    let instance: { destroy: () => void } | null = null;
    setErreur(null);
    setChargement(true);

    (async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe n'a pas pu se charger. Vérifie ta connexion et recharge la page.");
        const checkout = await stripe.initEmbeddedCheckout({
          fetchClientSecret: async () => {
            const rep = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan, ...params }),
            });
            const data = await rep.json().catch(() => ({}));
            if (!rep.ok || !data.clientSecret) {
              throw new Error(data.erreur ?? "Le paiement n'a pas pu démarrer. Réessaie dans un instant.");
            }
            return data.clientSecret as string;
          },
        });
        if (annule) {
          checkout.destroy();
          return;
        }
        instance = checkout;
        if (conteneur.current) checkout.mount(conteneur.current);
        setChargement(false);
      } catch (e) {
        if (!annule) {
          setChargement(false);
          setErreur(e instanceof Error ? e.message : "Le paiement n'a pas pu démarrer. Réessaie dans un instant.");
        }
      }
    })();

    return () => {
      annule = true;
      instance?.destroy();
    };
  }, [plan, params.m, params.c, params.r]); // eslint-disable-line react-hooks/exhaustive-deps

  function choisir(id: PlanId) {
    setPlan(id);
  }

  return (
    <div className="mt-4">
      <div className="space-y-3">
        {ORDRE.map((id) => {
          const p = PLANS[id];
          const actif = plan === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => choisir(id)}
              aria-pressed={actif}
              className={`relative block w-full border-2 rounded-2xl border-encre p-4 text-left transition ${
                actif ? "bg-papier shadow-[0_6px_0_var(--color-vert)] border-vert -translate-y-1" : "bg-papier/60"
              } ${id === "pro" ? "mt-5" : ""}`}
            >
              {id === "pro" && (
                <span className="absolute -top-3.5 left-4 bg-jaune px-2 py-0.5 font-titre text-xs text-vert">
                  LE PLUS CHOISI POUR DÉMARRER
                </span>
              )}
              <span className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`h-6 w-6 shrink-0 rounded-full border-2 border-encre ${actif ? "bg-vert ring-2 ring-inset ring-papier" : ""}`}
                  />
                  <span className="font-titre text-lg">{p.nom}</span>
                </span>
                <span className="text-right">
                  <span className="font-titre text-xl">{p.prix} €</span>
                  <span className="text-sm text-gris">{p.unite}</span>
                  <span className="block text-sm font-semibold text-vert">soit {p.parJour} par jour</span>
                </span>
              </span>
              <ul className="mt-3 space-y-1 pl-9 text-[0.95rem] text-gris">
                {p.points.map((pt) => (
                  <li key={pt}>— {pt}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-center text-sm font-semibold">
          {PLANS[plan].nom} — {PLANS[plan].prix} €{PLANS[plan].unite}. Sans engagement, résiliable à tout moment.
        </p>
        {!stripePromise ? (
          <p className="border-2 rounded-2xl border-encre bg-papier p-4">
            Le paiement n&apos;est pas encore configuré. Reviens dans quelques minutes.
          </p>
        ) : (
          <div className="relative min-h-[420px] border-2 rounded-2xl border-encre bg-white p-1">
            {chargement && !erreur && (
              <p className="absolute inset-x-0 top-10 text-center text-gris">Chargement du paiement sécurisé…</p>
            )}
            <div ref={conteneur} />
          </div>
        )}
        {erreur && (
          <p role="alert" className="mt-3 border-2 rounded-2xl border-encre bg-jaune p-3 font-semibold text-vert">
            {erreur}
          </p>
        )}
        <p className="mt-2 text-center text-xs text-gris">Paiement sécurisé par Stripe. Tes données de carte ne passent jamais par nos serveurs.</p>
      </div>
    </div>
  );
}
