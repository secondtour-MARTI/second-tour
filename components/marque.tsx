import Link from "next/link";

// Logo : deux flèches qui tournent, comme un client qui revient.
export default function Marque({ clair = false }: { clair?: boolean }) {
  return (
    <Link href="/" className={`inline-flex min-h-11 items-center gap-2 ${clair ? "text-papier" : "text-encre"}`}>
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8">
        <circle cx="16" cy="16" r="15" fill="#ffb21a" stroke="#0e1a33" strokeWidth="2" />
        <path d="M9 15a7 7 0 0 1 12-5l2-2v6h-6l2-2a4.5 4.5 0 0 0-7.5 3z" fill="#0e1a33" />
        <path d="M23 17a7 7 0 0 1-12 5l-2 2v-6h6l-2 2a4.5 4.5 0 0 0 7.5-3z" fill="#0e1a33" />
      </svg>
      <span className="font-titre text-xl">Second Tour</span>
    </Link>
  );
}
