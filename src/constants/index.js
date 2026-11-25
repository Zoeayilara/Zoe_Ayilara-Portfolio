import {
  frontend,
  backend,
  ux,
  prototyping,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  git,
  figma,
  docker,
  postgresql,
  rubyrails,
  graphql,
  komikult,
  leaderboard,
  math,
  movie,
  nyeusi,
  space,
  coverhunt,
  dcc,
  kelhel,
  microverse,
  microchip,
  database,
  python,
  api,
  mysql,
  sqlite,
  bowen,
  github,
  studycircle,
  fegbogun,
} from '../assets';

export const navLinks = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'projects',
    title: 'Projects',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
];

const services = [
  {
    title: 'Web Developer',
    icon: frontend,
  },
  {
    title: 'Backend Engineer',
    icon: backend,
  },
  {
    title: 'AI & ML Enthusiast',
    icon: microchip, // Replace with a better icon if available
  },
  {
    title: 'Database Design',
    icon: database, // Replace with a DB-related icon if available
  },
];


const technologies = [
  {
    name: 'HTML 5',
    icon: html,
  },
  {
    name: 'CSS 3',
    icon: css,
  },
  {
    name: 'JavaScript',
    icon: javascript,
  },
  {
    name: 'TypeScript',
    icon: typescript,
  },
  {
    name: 'React JS',
    icon: reactjs,
  },
  {
    name: 'Python',
    icon: python,
  },
  {
    name: 'Tailwind CSS',
    icon: tailwind,
  },
  {
    name: 'Node JS',
    icon: nodejs,
  },
  {
    name: 'FastAPI',
    icon: api,
  },
  {
    name: 'SQLite',
    icon: sqlite,
  },
  {
    name: 'postgresql',
    icon: postgresql,
  },
  {
    name: 'Docker',
    icon: docker,
  },
  {
    name: 'git',
    icon: git,
  },
  {
    name: 'figma',
    icon: figma,
  },
  {
    name: 'MySQL',
    icon: mysql,
  },
];

const experiences = [
  {
    title: 'Backend Developer (Intern)',
    company_name: 'Circo Orange Internship Programme – Team Vanguard-circle',
    icon: backend,
    iconBg: '#1e3c72',
    date: '2026',
    points: [
      'Built the StudyCircle backend with Express, Prisma and PostgreSQL (Neon), using Firebase for auth.',
      'Built group invites with email delivery, task and session reminders, and Google Calendar sync over OAuth2.',
      'Wrote the API contract and ER diagram and connected the React frontend to the live API.',
      'Deployed the frontend and backend on Render.',
    ],
  },
  {
    title: 'Freelance Web Developer',
    company_name: 'Client Projects',
    icon: github,
    iconBg: '#292929',
    date: '2025 – Present',
    points: [
      'Built and launched a website for an author to showcase their books.',
      'Handle the full process for clients: requirements, build, deployment and domain setup.',
    ],
  },
  {
    title: 'IT Support Intern / Assistant Hardware Executive',
    company_name: 'Bowen University',
    icon: bowen,
    iconBg: '#2a5298',
    date: 'March 2025 – June 2025',
    points: [
      'Provided tech support to faculty and students.',
      'Maintained computer labs and kept software up to date.',
      'Built and deployed a student records management tool.',
      'Documented IT processes for the team.',
    ],
  },
];

const projects = [
  {
    id: 'project-1',
    name: 'StudyCircle',
    description:
      'A web app for university students to form study circles, share tasks and resources, track streaks and get reminders. I built the backend: Express, Prisma, PostgreSQL, Firebase Auth.',
    tags: [
      { name: 'nodejs', color: 'blue-text-gradient' },
      { name: 'postgresql', color: 'green-text-gradient' },
      { name: 'prisma', color: 'pink-text-gradient' },
    ],
    image: studycircle,
    repo: '',
    demo: 'https://studycircle-vyo1.onrender.com/',
  },
  {
    id: 'project-2',
    name: 'Author Site',
    description:
      'A website I built for a client, an author, to present their books and literary work to readers.',
    tags: [
      { name: 'client', color: 'blue-text-gradient' },
      { name: 'website', color: 'green-text-gradient' },
    ],
    image: fegbogun,
    repo: '',
    demo: 'https://fegbogun.com/',
  },
  {
    id: 'project-3',
    name: 'Leaderboard',
    description:
      'A leaderboard app that pulls player scores from a REST API and lets players submit new ones.',
    tags: [
      { name: 'javascript', color: 'blue-text-gradient' },
      { name: 'restapi', color: 'green-text-gradient' },
      { name: 'scss', color: 'pink-text-gradient' },
    ],
    image: leaderboard,
    repo: 'https://github.com/Zoeayilara/Leaderboard.git',
    demo: 'https://zoeayilara.github.io/Leaderboard/',
  },
  {
    id: 'project-4',
    name: 'Movico',
    description: `Search any movie or show to see its ratings and details.`,
    tags: [
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'api', color: 'green-text-gradient' },
    ],
    image: movie,
    repo: 'https://github.com/Zoeayilara/Movico.git',
    demo: 'https://movie-metro.netlify.app/',
  },
  {
    id: 'project-5',
    name: 'ComicVerse',
    description: 'A browsable list of Marvel characters.',
    tags: [
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'tailwind', color: 'pink-text-gradient' },
    ],
    image: komikult,
    repo: 'https://github.com/Zoeayilara/ComicVerse.git',
    demo: 'https://zoeayilara.github.io/ComicVerse/',
  },
];

export { services, technologies, experiences, projects };
