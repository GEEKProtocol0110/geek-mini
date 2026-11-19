import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/Brand";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Geek Mini stores: practice scores in your browser, and an optional anonymous public leaderboard entry you can remove.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell" style={{ maxWidth: 760, paddingBlock: 32 }}>
        <span className="eyebrow">GEEK MINI · PRIVACY</span>
        <h1>Privacy</h1>
        <p>Effective November 19, 2026. Geek Mini is a free Kaspa knowledge game by Geek Protocol. There are no accounts, wallets, payments, ads or analytics.</p>

        <h2>Practice</h2>
        <p>Daily and Speed practice scores and the Speed cooldown are saved in this browser&apos;s local storage only. Clear them on <Link href="/progress">Your progress</Link> or with your browser&apos;s site-data controls.</p>

        <h2>Public leaderboard (optional)</h2>
        <p>Choosing a public challenge creates an anonymous Mini identity: a random code in an HttpOnly cookie and an automatic name such as &quot;Mini Geek 1A2B3C4D5E6F&quot;. The leaderboard shows that name and your score. We never ask for your real name. Scores are checked by the Geek Protocol HQ server, which stores the round, your answers and your standing.</p>
        <p>Rounds expire after one hour and Daily slots after two days. Your Mini identity expires after 90 days without play; Daily boards expire after 35 days without an update and Speed boards after 90 days. You can remove your standings and identity at any time on the <Link href="/leaderboard">Mini leaderboard</Link>. Clearing this site&apos;s cookies loses control of an identity, so remove it first if you want it gone.</p>

        <h2>Abuse protection and hosting</h2>
        <p>To prevent spam, the server uses limited request counters, which may include your network address. The site is hosted on Vercel, and the leaderboard uses the Geek Protocol HQ database; both receive standard request details such as your IP address.</p>

        <h2>Contact</h2>
        <p>Questions: email <strong>geek.coin.protocol@gmail.com</strong>. See also the <a href="https://www.geekprotocol.xyz/privacy/">Geek Protocol HQ privacy notice</a>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
