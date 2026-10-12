import type { Metadata } from "next";
import { PracticeProgress } from "../../components/PracticeProgress";

export const metadata: Metadata = { title: "Your progress", alternates: { canonical: "/progress" }, robots: { index: false, follow: true } };
export default function ProgressPage() { return <PracticeProgress />; }
