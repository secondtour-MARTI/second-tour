"use client";

export default function BoutonImprimer() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bouton-pouce etiquette flex w-full items-center justify-center bg-vert px-6 font-titre text-lg text-creme"
    >
      Imprimer ou enregistrer en PDF
    </button>
  );
}
