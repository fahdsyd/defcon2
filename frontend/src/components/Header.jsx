import { DEFCON_ASCII, HACKER_ASCII } from '../lib/content';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="Event logo" className="logo" />
      </div>
      <div className="header-center">
        <pre className="defcon-ascii">{DEFCON_ASCII}</pre>
        <div className="tagline">RECON | BREACH | EXPLOIT</div>
        <div className="subtagline">A 4 HOUR ATTACK-DEFENSE CYBERWARFARE COMPETITION</div>
        <div className="motto">"NOT JUST A GAME. A WAR OF SKILLS."</div>
      </div>
      <div className="header-right">
        <pre className="hacker-ascii">{HACKER_ASCII}</pre>
      </div>
    </header>
  );
}