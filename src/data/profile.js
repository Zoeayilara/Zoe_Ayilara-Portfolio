// Single source of truth for everything the site says.
// Sections, the terminal and the stack filter all read from here.

export const profile = {
  name: 'Zoe Ayilara',
  handle: 'zoeayilara',
  role: 'Backend developer',
  location: 'Nigeria',
  school: 'Bowen University, Iwo',
  email: 'zoeayilara@gmail.com',
  github: 'https://github.com/Zoeayilara',
  resume:
    'https://drive.google.com/file/d/171LNpqb0appqmvBIS9RSCIZSH_3KT90M/view?usp=sharing',
  tagline: 'I build the part of the app you don’t see.',
  intro:
    'APIs, databases, auth, background jobs. I write the backend that keeps a product honest when real people start using it, and I can build the frontend that talks to it.',
};

// Tech ids used across projects and experience, so the stack
// section can show where each one was actually used.
export const stack = [
  {
    group: 'Languages',
    items: [
      { id: 'python', label: 'Python' },
      { id: 'javascript', label: 'JavaScript' },
      { id: 'typescript', label: 'TypeScript' },
      { id: 'sql', label: 'SQL' },
      { id: 'java', label: 'Java' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { id: 'node', label: 'Node.js' },
      { id: 'express', label: 'Express' },
      { id: 'django', label: 'Django' },
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'flask', label: 'Flask' },
      { id: 'rest', label: 'REST APIs' },
    ],
  },
  {
    group: 'Data & auth',
    items: [
      { id: 'postgres', label: 'PostgreSQL' },
      { id: 'mysql', label: 'MySQL' },
      { id: 'sqlite', label: 'SQLite' },
      { id: 'prisma', label: 'Prisma' },
      { id: 'firebase', label: 'Firebase Auth' },
      { id: 'oauth', label: 'OAuth 2.0' },
    ],
  },
  {
    group: 'Machine learning',
    items: [
      { id: 'distilbert', label: 'DistilBERT' },
      { id: 'xgboost', label: 'XGBoost' },
      { id: 'mlp', label: 'Neural networks' },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { id: 'react', label: 'React' },
      { id: 'html', label: 'HTML & CSS' },
      { id: 'tailwind', label: 'Tailwind' },
    ],
  },
  {
    group: 'Shipping',
    items: [
      { id: 'docker', label: 'Docker' },
      { id: 'git', label: 'Git' },
      { id: 'render', label: 'Render' },
      { id: 'postman', label: 'Postman' },
      { id: 'mixpanel', label: 'Mixpanel' },
    ],
  },
];

export const featured = {
  id: 'studycircle',
  name: 'StudyCircle',
  year: '2026',
  role: 'Backend developer',
  summary:
    'A web app that helps university students form study circles, split up tasks, keep streaks and actually show up to sessions. I designed the schema and built the whole API.',
  live: 'https://studycircle-vyo1.onrender.com/',
  tech: ['node', 'express', 'prisma', 'postgres', 'firebase', 'oauth', 'react', 'render', 'mixpanel', 'javascript', 'rest', 'sql', 'git', 'postman'],
  // Architecture shown as a request path. Node ids are referenced by endpoints.
  nodes: [
    { id: 'client', label: 'React client', note: 'Vite, Firebase SDK' },
    { id: 'api', label: 'Express API', note: 'Node, REST' },
    { id: 'orm', label: 'Prisma', note: 'typed queries' },
    { id: 'db', label: 'PostgreSQL', note: 'Neon' },
  ],
  sidecars: [
    { id: 'auth', label: 'Firebase Admin', note: 'token check' },
    { id: 'jobs', label: 'Reminder scheduler', note: 'every 5 min' },
    { id: 'mail', label: 'Resend', note: 'invite email' },
    { id: 'gcal', label: 'Google Calendar', note: 'OAuth 2.0' },
  ],
  endpoints: [
    {
      method: 'GET',
      path: '/users/me/dashboard',
      title: 'One call for the whole dashboard',
      detail:
        'Stats, circles, streaks and upcoming tasks come back in a single response, so the dashboard renders once instead of firing four requests.',
      touches: ['auth', 'orm', 'db'],
      response: {
        stats: { circles: 3, tasksDue: 4, longestStreak: 12 },
        circles: [{ id: 'c_81', name: 'CSC 401 revision', members: 6 }],
        upcoming: [{ task: 'Graph theory past questions', due: '2026-11-27' }],
      },
    },
    {
      method: 'POST',
      path: '/groups',
      title: 'Create a circle with a member cap',
      detail:
        'Creates the circle and its owner membership together, and the member limit is enforced on every join, not just in the UI.',
      touches: ['auth', 'orm', 'db'],
      response: { id: 'c_82', name: 'Compilers squad', maxMembers: 8, inviteCode: 'K7Q2XM' },
      status: 201,
    },
    {
      method: 'GET',
      path: '/groups/invite/:inviteCode',
      title: 'Invite links that work logged out',
      detail:
        'A public preview endpoint lets someone see the circle before signing up. Invites also go out by email through Resend, with a QR code to share.',
      touches: ['orm', 'db', 'mail'],
      response: { circle: 'Compilers squad', members: 5, spotsLeft: 3, status: 'PENDING' },
    },
    {
      method: 'JOB',
      path: 'startReminderScheduler()',
      title: 'Reminders that respect a free-tier budget',
      detail:
        'Scans for tasks due in 24 hours, sessions starting in 30 minutes and missed sessions. I moved the poll from 60s to 5 minutes after it started burning through the database’s compute hours.',
      touches: ['jobs', 'orm', 'db', 'mail'],
      response: { scanned: { tasks: 41, sessions: 9 }, remindersSent: 6, interval: '5m' },
    },
    {
      method: 'GET',
      path: '/calendar/oauth/callback',
      title: 'Google Calendar sync, done safely',
      detail:
        'Full OAuth 2.0 flow with an HMAC-signed state parameter, compared in constant time to block CSRF, plus token refresh and per-user sync settings.',
      touches: ['gcal', 'orm', 'db'],
      response: { connected: true, sync: { sessions: true, assignments: true }, stateVerified: true },
    },
  ],
};

export const infera = {
  id: 'infera',
  name: 'Infera',
  year: '2026',
  summary:
    'A phishing detection system built in Django. It combines a DistilBERT text model with XGBoost and a small neural network, and runs as a web app on Render.',
  metrics: [
    { value: '90.9%', label: 'accuracy on the test set' },
    { value: '0.93', label: 'weighted F1 score' },
  ],
  tech: ['python', 'django', 'distilbert', 'xgboost', 'mlp', 'render'],
};

export const clientWork = [
  {
    id: 'author',
    name: 'Author website',
    url: 'https://fegbogun.com/',
    domain: 'fegbogun.com',
    year: '2025',
    summary:
      'A site for an author to present their books and writing to readers. Built for a paying client and live on their own domain.',
    tech: [],
  },
];

export const earlier = [
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    summary: 'Scores pulled from and posted to a REST API.',
    live: 'https://zoeayilara.github.io/Leaderboard/',
    repo: 'https://github.com/Zoeayilara/Leaderboard',
    tech: ['javascript', 'rest', 'html'],
  },
  {
    id: 'movico',
    name: 'Movico',
    summary: 'Search a movie or show and see its ratings and details.',
    live: 'https://movie-metro.netlify.app/',
    repo: 'https://github.com/Zoeayilara/Movico',
    tech: ['react', 'javascript', 'rest'],
  },
  {
    id: 'comicverse',
    name: 'ComicVerse',
    summary: 'A browsable index of Marvel characters.',
    live: 'https://zoeayilara.github.io/ComicVerse/',
    repo: 'https://github.com/Zoeayilara/ComicVerse',
    tech: ['react', 'tailwind', 'javascript'],
  },
];

// Newest first. Rendered as a commit log, so order matters.
export const experience = [
  {
    hash: 'a41f9c2',
    when: '2026',
    title: 'Backend developer',
    org: 'Circo Orange Internship Programme',
    team: 'Team Vanguard-circle',
    points: [
      'Built the StudyCircle API: Express, Prisma, PostgreSQL on Neon, Firebase Auth.',
      'Shipped invites, reminders, an activity feed with uploads, and Google Calendar sync.',
      'Wrote the API contract and ER diagram, and deployed both apps on Render.',
    ],
    tech: ['node', 'express', 'prisma', 'postgres', 'firebase', 'oauth', 'render', 'postman'],
  },
  {
    hash: 'e92b6a0',
    when: '2025 – now',
    title: 'Freelance web developer',
    org: '',
    points: ['Build and launch websites for paying clients, from first brief to live site.'],
    tech: [],
  },
  {
    hash: '7c03e1d',
    when: 'Ongoing',
    title: 'Hardware director',
    org: 'NACOS, Bowen University',
    points: [
      'Run the hardware unit with an assistant director and report monthly to the executive.',
      'Built the unit’s web app for tracking equipment records.',
    ],
    tech: [],
  },
  {
    hash: '3d5a8f4',
    when: 'Mar – Jun 2025',
    title: 'IT support intern',
    org: 'Bowen University',
    points: [
      'Supported staff and students and kept the computer labs running.',
      'Built and deployed a student records tool.',
    ],
    tech: [],
  },
];

export const allTechLabels = Object.fromEntries(
  stack.flatMap((g) => g.items.map((i) => [i.id, i.label])),
);
