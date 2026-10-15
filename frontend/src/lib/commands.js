import { ABOUT_TEXT, CHALLENGES, FILES, HELP_TEXT, KEYWORDS } from './content';

// Returns output lines plus any side effects for the App to apply.
export function runCommand(raw, solved) {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const cmd = (parts[0] || '').toLowerCase();
  const args = parts.slice(1);
  const out = { lines: [], solve: null, openRegister: false, clear: false };

  switch (cmd) {
    case '':
      break;

    case 'help':
      out.lines = HELP_TEXT;
      break;

    case 'about':
      out.lines = ABOUT_TEXT;
      break;

    case 'challenges': {
      const done = CHALLENGES.filter((c) => solved[c.key]).length;
      out.lines = [
        `There are ${CHALLENGES.length} challenges. Progress: ${done}/${CHALLENGES.length}`,
        '',
        ...CHALLENGES.map((c) => {
          const status = solved[c.key] ? '[SOLVED]' : '[OPEN]  ';
          return `  [${c.id}] ${status} ${c.title.padEnd(22)} [${c.difficulty}]  ${c.desc}`;
        }),
      ];
      break;
    }

    case 'ls': {
      const showHidden = args.includes('-a');
      const names = Object.keys(FILES).filter((n) => showHidden || !n.startsWith('.'));
      out.lines = [names.join('  ')];
      break;
    }

    case 'cat': {
      if (args.length === 0) {
        out.lines = ['cat: missing file operand'];
        break;
      }
      const name = args[0];
      if (FILES[name]) {
        out.lines = FILES[name];
      } else {
        out.lines = [`cat: ${name}: No such file or directory`];
      }
      break;
    }

    case 'submit': {
      if (args.length === 0) {
        out.lines = ['Usage: submit <keyword>'];
        break;
      }
      const given = args.join(' ');
      const match = CHALLENGES.find((c) => KEYWORDS[c.key] === given);
      if (!match) {
        out.lines = ['[-] Incorrect keyword.'];
      } else if (solved[match.key]) {
        out.lines = [`[=] Challenge ${match.id} already solved.`];
      } else {
        out.lines = [`[+] Correct! Challenge ${match.id} solved.`];
        out.solve = match.key;
      }
      break;
    }

    case 'register': {
      const allDone = CHALLENGES.every((c) => solved[c.key]);
      if (allDone) {
        out.lines = ['Registration unlocked! Opening registration form...'];
        out.openRegister = true;
      } else {
        out.lines = ['[-] Access denied. Solve all challenges first. Type challenges to see progress.'];
      }
      break;
    }

    case 'clear':
      out.clear = true;
      break;

    default:
      out.lines = [`${cmd}: command not found. Type help for available commands.`];
  }

  return out;
}