import Header from './Header';

export default function Landing() {
  return (
    <div className="app">
      <Header />
      <main className="landing">
        <div className="poster-frame">
          <img src="/poster.png" alt="DEFCON 2.0 poster" className="poster" />
        </div>
        <p className="hint glitch" data-text="Nothing to see here. Crawl your way in.">
          Nothing to see here. Crawl your way in.
        </p>
      </main>
    </div>
  );
}
