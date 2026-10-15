import { useState } from 'react';
import Header from './components/Header';
import Terminal from './components/Terminal';
import RegisterDialog from './components/RegisterDialog';
import NotFound from './components/NotFound';

const GATEWAY_PATH = '/ops-gateway';

export default function App() {
  const [solved, setSolved] = useState({ recon: false, keyring: false });
  const [registerOpen, setRegisterOpen] = useState(false);

  // Everything except the gateway path shows the 404 page
  const onGateway = window.location.pathname.replace(/\/+$/, '') === GATEWAY_PATH;
  if (!onGateway) return <NotFound />;

  function handleSolve(key) {
    setSolved((s) => ({ ...s, [key]: true }));
  }

  return (
    <div className="app">
      <Header />
      <div className="window">
        <div className="window-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <Terminal
          solved={solved}
          onSolve={handleSolve}
          onRegister={() => setRegisterOpen(true)}
        />
      </div>
      {registerOpen && <RegisterDialog onClose={() => setRegisterOpen(false)} />}
    </div>
  );
}