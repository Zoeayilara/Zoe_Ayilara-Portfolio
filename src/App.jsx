import { useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Work from './components/Work';
import Experience from './components/Experience';
import Stack from './components/Stack';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Terminal from './components/Terminal';
import { initScroll, scrollToId } from './motion/scroll';
import { initSpotlight, initMagnetic } from './motion/pointer';

const isTyping = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

export default function App() {
  const [termOpen, setTermOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const openTerminal = useCallback(() => setTermOpen(true), []);
  const closeTerminal = useCallback(() => setTermOpen(false), []);

  useEffect(() => {
    initScroll();
    initSpotlight();
    initMagnetic();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`' && !isTyping(document.activeElement) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setTermOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hire = useCallback(() => {
    setPrefill({
      text: 'Hi Zoe, I’d like to talk about hiring you for a backend project. Here’s what we’re building: ',
      at: Date.now(),
    });
    setTimeout(() => scrollToId('contact'), 150);
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav onTerminal={openTerminal} />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <Stack />
        <About />
        <Contact prefill={prefill} />
      </main>
      <Footer onTerminal={openTerminal} />
      <Terminal open={termOpen} onClose={closeTerminal} onHire={hire} />
    </>
  );
}
