export const ABOUT_TEXT = [
  'DEFCON 2.0 :: Cyberwarfare Registration',
  '----------------------------------------',
  'Host       : NIT Warangal',
  'Duration   : 4 Hours',
  'Format     : Attack-Defense',
  'Teams      : 1 to 4 members per team',
  '',
  'Teams attack rival services while defending their own.',
  'Every flag captured is points. Every breach is a lesson.',
  '',
  '  node: recon',
];

export const CHALLENGES = [
  { id: 1, key: 'recon', title: 'The Welcome Message', difficulty: 'EASY', desc: 'Find the hidden keyword in the event info.' },
  { id: 2, key: 'keyring', title: 'A Misdirection', difficulty: 'EASY', desc: 'Not everything shows up with ls.' },
];

export const KEYWORDS = {
  recon: 'recon',
  keyring: 'DEFCON-2026-NITW',
};

export const FILES = {
  'briefing.txt': [
    'MISSION BRIEFING',
    'Your team defends its service and attacks the others.',
    'Check the schedule. Keep your access keys safe.',
  ],
  'schedule.txt': [
    'SCHEDULE',
    '09:00  Kickoff',
    '09:30  Round 1 begins',
    '13:30  Final round',
    '13:30  Scoreboard freeze',
  ],
  'server.log': [
    '[INFO] service started on port 8080',
    '[WARN] unauthorized access attempt from 10.0.0.42',
    '[INFO] service healthy',
  ],
  '.keyring': [
    KEYWORDS.keyring,
  ],
};

export const HELP_TEXT = [
  'Available commands:',
  '  help                 Show this message',
  '  about                Event details',
  '  challenges           List challenges and progress',
  '  ls                   List files (ls -a shows hidden files)',
  '  cat <file>           Show a file',
  '  submit <keyword>     Submit a keyword for a challenge',
  '  register             Open registration (unlocks after all challenges)',
  '  clear                Clear the terminal',
];

export const HACKER_ASCII = ` ⠉⠉⠉⠉⠁⠀⠀⠀⠀⠒⠂⠰⠤⢤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠻⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠠⠀⠐⠒⠒⠀⠀⠈⠉⠉⠉⠉⢉⣉⣉⣉⣙⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡀⠤⠒⠒⠉⠁⠀⠀⠀⠀⠳⣤⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⠛⠛⠉⠛⠛⠶⢦⣤⡐⢀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠉⢳⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⡤⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⠛⠛⠳⠶⢶⣦⠤⣄⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⣄⠉⠑⢄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⡀⠀⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⡄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄
  FIND. EXPLOIT.
  DEFEND. DOMINATE.`;

export const DEFCON_ASCII = `██████╗ ███████╗███████╗ ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝██╔════╝██╔═══██╗████╗  ██║
██║  ██║█████╗  █████╗  ██║     ██║   ██║██╔██╗ ██║
██║  ██║██╔══╝  ██╔══╝  ██║     ██║   ██║██║╚██╗██║
██████╔╝███████╗██║     ╚██████╗╚██████╔╝██║ ╚████║
╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝`;