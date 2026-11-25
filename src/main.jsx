import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/jetbrains-mono';
import './styles/base.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// For the people who open devtools first.
console.log(
  '%cHi, you found the console.%c\nThe site is open source: https://github.com/Zoeayilara/Zoe_Ayilara-Portfolio\nPress ` on the page for a terminal, or try `sudo hire zoe`.',
  'font: 700 16px system-ui; color: #2b44e0',
  'font: 13px system-ui; color: #33404f',
);
