import { useEffect, useRef, useState } from 'react';
import { runCommand } from '../lib/commands';

const PROMPT = 'participant@DEFCON:~$';

const BOOT = [
  'Welcome to DEFCON 2.0 Registration Terminal.',
  'Complete the challenges to unlock registration.',
  "Type 'help' for available commands.",
  '',
];

export default function Terminal({ solved, onSolve, onRegister }) {
  const [history, setHistory] = useState(BOOT.map((text) => ({ type: 'out', text })));
  const [input, setInput] = useState('');
  const [past, setPast] = useState([]);
  const [pastIdx, setPastIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  function handleSubmit(e) {
    e.preventDefault();
    const line = input;
    const res = runCommand(line, solved);

    if (res.clear) {
      setHistory([]);
    } else {
      setHistory((h) => [
        ...h,
        { type: 'cmd', text: line },
        ...res.lines.map((text) => ({ type: 'out', text })),
      ]);
    }

    if (res.solve) onSolve(res.solve);
    if (res.openRegister) onRegister();

    if (line.trim()) {
      setPast((p) => [...p, line]);
    }
    setPastIdx(-1);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp' && past.length) {
      e.preventDefault();
      const idx = pastIdx < 0 ? past.length - 1 : Math.max(0, pastIdx - 1);
      setPastIdx(idx);
      setInput(past[idx]);
    } else if (e.key === 'ArrowDown' && pastIdx >= 0) {
      e.preventDefault();
      const idx = pastIdx + 1;
      if (idx >= past.length) {
        setPastIdx(-1);
        setInput('');
      } else {
        setPastIdx(idx);
        setInput(past[idx]);
      }
    }
  }

  function toneOf(text) {
    if (text.startsWith('[+]')) return 'tone-ok';
    if (text.startsWith('[-]') || text.includes('denied') || text.includes('not found')) return 'tone-err';
    return '';
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      {history.map((line, i) =>
        line.type === 'cmd' ? (
          <div key={i} className="line">
            <span className="prompt">{PROMPT}</span> {line.text}
          </div>
        ) : (
          <div key={i} className={`line ${toneOf(line.text)}`}>
            {line.text || '\u00A0'}
          </div>
        )
      )}
      <form onSubmit={handleSubmit} className="line input-line">
        <span className="prompt">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}