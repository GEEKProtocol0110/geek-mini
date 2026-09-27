import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Geek Mini home">
      <Image src="/geek-protocol-logo.png" alt="" width={48} height={48} priority />
      <span className="brand-wordmark">GEEK<span className="brand-slash">{"//"}</span>MINI</span>
      {!compact && <span className="brand-byline">by Geek Protocol</span>}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner shell">
        <Brand />
        <nav aria-label="Main navigation" className="site-nav">
          <Link href="/#play">Play</Link>
          <Link href="/#share">For supporters</Link>
          <a className="nav-outer" href="https://www.geekprotocol.xyz/" target="_blank" rel="noopener noreferrer">Geek Protocol <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <span>Geek Mini · Learn Kaspa. Share curiosity.</span>
      <span>Free practice · No wallet · No rewards</span>
      <a href="https://www.geekprotocol.xyz/" target="_blank" rel="noopener noreferrer">Explore Geek Protocol ↗</a>
    </footer>
  );
}
