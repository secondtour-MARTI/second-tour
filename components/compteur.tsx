"use client";

import { useEffect, useRef, useState } from "react";

// Montant qui défile jusqu'à sa valeur quand il apparaît à l'écran.
export default function Compteur({ valeur, prefixe = "", className }: { valeur: number; prefixe?: string; className?: string }) {
  const [affiche, setAffiche] = useState(valeur);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAffiche(0);
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        obs.disconnect();
        const debut = performance.now();
        const duree = 1100;
        const tick = (t: number) => {
          const p = Math.min(1, (t - debut) / duree);
          setAffiche(Math.round(valeur * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valeur]);

  return (
    <span ref={ref} className={className} aria-label={`${prefixe}${valeur.toLocaleString("fr-FR")} €`}>
      {prefixe}
      {new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(affiche)} €
    </span>
  );
}
