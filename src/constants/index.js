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
    title: 'Database Administrator',
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
  title: 'IT Support Intern/Assitant-HArdware Executive',
  company_name: 'Bowen University',
  icon: bowen,
  iconBg: '#1e3c72',
  date: 'March 2025 – June 2025',
  points: [
    'Provided tech support to faculty and students.',
    'Maintained computer labs and updated software.',
    'Built and deployed a student records management tool.',
    'Documented IT processes for improved workflows.',
  ],
},
  {
  title: 'Student Developer',
  company_name: 'Self-Initiated Projects',
  icon: github,
  iconBg: '#292929',
  date: '2023 – Present',
  points: [
    'Built a personalized nutrition app using React Native and FastAPI.',
    'Developed an energy management dashboard with real-time updates.',
    'Worked on fraud detection using machine learning and Python.',
    'Built several CRUD applications with Django, SQLite, and Bootstrap.',
  ],
},
{
  title: 'Full Stack Developer (Freelance)',
  company_name: 'Personal Projects',
  icon: backend,
  iconBg: '#222222',
  date: '2023 – Present',
  points: [
    'Built full-stack web applications using Django/FastAPI for the backend and React for the frontend.',
    'Developed secure user authentication systems and real-time features.',
    'Integrated relational databases (SQLite/PostgreSQL) for dynamic data handling.',
    'Styled responsive UI components using Tailwind CSS and Bootstrap.',
  ],
},

 {
  title: 'AI/ML Developer (Student Research)',
  company_name: 'Final Year Project',
  icon: microchip, 
  iconBg: '#2a5298',
  date: '2025',
  points: [
    'Developed an AI-powered energy management system for commercial buildings.',
    'Trained machine learning models to predict energy usage based on historical data.',
    'Integrated real-time monitoring dashboard using React and Bootstrap.',
    'Collaborated on hardware-software integration with sensors for live data capture.',
  ],
},

];

const projects = [
  {
    id: 'project-1',
    name: 'KomiKult',
    description: 'A comic characters list app that displays Marvel characters.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'mongodb',
        color: 'green-text-gradient',
      },
      {
        name: 'tailwind',
        color: 'pink-text-gradient',
      },
    ],
    image: komikult,
    repo: 'https://github.com/shaqdeff/KomiKult',
    demo: 'https://shaqdeff.github.io/KomiKult/',
  },
  {
    id: 'project-2',
    name: 'Leaderboard',
    description:
      'A leaderboard list app that displays scores submitted by different players.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'restapi',
        color: 'green-text-gradient',
      },
      {
        name: 'scss',
        color: 'pink-text-gradient',
      },
    ],
    image: leaderboard,
    repo: 'https://github.com/shaqdeff/Leaderboard',
    demo: 'https://shaqdeff.github.io/Leaderboard/',
  },
  {
    id: 'project-3',
    name: 'Math Magicians',
    description: 'This is a single-page calculator app built with React',
    tags: [
      {
        name: 'nextjs',
        color: 'blue-text-gradient',
      },
      {
        name: 'supabase',
        color: 'green-text-gradient',
      },
      {
        name: 'css',
        color: 'pink-text-gradient',
      },
    ],
    image: math,
    repo: 'https://github.com/shaqdeff/Math-Magicians',
    demo: 'https://inspiring-medovik-37d3b3.netlify.app/',
  },
  {
    id: 'project-4',
    name: 'Movie Metro',
    description: `A single-page application that allows users to search for any movie or show's ratings and its details.`,
    tags: [
      {
        name: 'nextjs',
        color: 'blue-text-gradient',
      },
      {
        name: 'supabase',
        color: 'green-text-gradient',
      },
      {
        name: 'css',
        color: 'pink-text-gradient',
      },
    ],
    image: movie,
    repo: 'https://github.com/shaqdeff/Movie-Metro',
    demo: 'https://movie-metro.netlify.app/',
  },
  {
    id: 'project-5',
    name: 'Nyeusi Fest Site',
    description:
      'This is a demo concert website for a music festival called Nyeusi.',
    tags: [
      {
        name: 'nextjs',
        color: 'blue-text-gradient',
      },
      {
        name: 'supabase',
        color: 'green-text-gradient',
      },
      {
        name: 'css',
        color: 'pink-text-gradient',
      },
    ],
    image: nyeusi,
    repo: 'https://github.com/shaqdeff/Nyeusi-Fest-Site',
    demo: 'https://shaqdeff.github.io/Nyeusi-Fest-Site/',
  },
];

export { services, technologies, experiences, projects };
