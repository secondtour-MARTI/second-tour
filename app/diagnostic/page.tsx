import type { Metadata } from "next";
import Questions from "./questions";

export const metadata: Metadata = {
  title: "Diagnostic gratuit — Second Tour",
  description:
    "3 questions pour chiffrer ce que tes clients qui oublient de revenir te coûtent chaque année.",
};

export default function Diagnostic() {
  return <Questions />;
}
