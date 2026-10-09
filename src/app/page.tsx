import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/Brand";
import { SupporterTools } from "../components/SupporterTools";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot" /> A little game about a big idea</span>
            <h1 id="hero-title">Learn Kaspa.<br /><span>Pass it on.</span></h1>
            <p>Geek Mini turns Kaspa basics into a quick challenge you can play, share, or put on your own site. Made for the curious and the community that brings them in.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/daily">Play today’s five <span aria-hidden="true">↗</span></Link>
              <Link className="button button-quiet" href="#share">Share with your community <span aria-hidden="true">↓</span></Link>
            </div>
            <div className="hero-notes"><span>Free to play</span><span>No sign-in</span><span>About 2 minutes</span></div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="panel-top"><span>GEEK // MINI</span><span>01 / 05</span></div>
            <div className="panel-center"><span className="panel-k">K</span><div className="panel-orbit panel-orbit-one" /><div className="panel-orbit panel-orbit-two" /></div>
            <div className="panel-bottom"><span>QUESTION 01</span><strong>What makes Kaspa different?</strong><span className="panel-answer"><span className="answer-indicator">✓</span> Blocks can coexist in a DAG</span></div>
          </div>
        </section>

        <section id="play" className="play-section shell" aria-labelledby="play-title">
          <div className="section-heading"><div><span className="eyebrow">Pick your pace</span><h2 id="play-title">Play a round.</h2></div><p>52 source-backed questions about Kaspa. Explanations and a review after every round.</p></div>
          <div className="mode-grid">
            <Link className="mode-card" href="/daily"><span className="mode-index">01 / DAILY</span><div className="mode-symbol" aria-hidden="true">◇</div><h3>Daily Challenge</h3><p>Five questions, one shared set each UTC day. A good first stop.</p><span className="mode-link">Start daily <span aria-hidden="true">↗</span></span></Link>
            <Link className="mode-card" href="/speed"><span className="mode-index">02 / FAST</span><div className="mode-symbol" aria-hidden="true">⌁</div><h3>Speed Round</h3><p>Ten questions in 30 seconds. See how much you know at speed.</p><span className="mode-link">Start speed <span aria-hidden="true">↗</span></span></Link>
          </div>
        </section>

        <section id="share" className="share-section shell" aria-labelledby="share-title">
          <div className="share-copy"><span className="eyebrow">Made to travel</span><h2 id="share-title">Give your community something to play.</h2><p>Choose Daily or Speed, preview the card and copy an embed for your website. Or send a challenge link to your community.</p></div>
          <SupporterTools />
        </section>

        <section className="closing-section shell"><span className="eyebrow">The bigger world</span><h2>Curiosity starts here.<br /><span>Keep going with Geek Protocol.</span></h2><p>Geek Mini is a lightweight introduction to the learning games and community at Geek Protocol.</p><a className="button button-outline" href="https://www.geekprotocol.xyz/" target="_blank" rel="noopener noreferrer">Explore Geek Protocol <span aria-hidden="true">↗</span></a></section>
      </main>
      <SiteFooter />
    </>
  );
}
