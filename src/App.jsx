import React from 'react';
import { Copy, MousePointerClick, ShieldCheck } from './components/Icons.jsx';
import { useDemo } from './hooks/useDemo.js';
import { DemoForm } from './components/DemoForm.jsx';
import { ResultCard } from './components/ResultCard.jsx';
import { BeginnerExplanation, PrivacyNotes, ProtectionCards, ReadFirst, StorageInspector } from './components/InfoSections.jsx';

export function App() {
  const demo = useDemo();

  return <main>
    <section className="hero">
      <div className="badge"><ShieldCheck size={18}/> Beginner-friendly demo</div>
      <h1>Private tab is private on your device, not invisible to websites.</h1>
      <p className="sub">This simple project shows why a website may still remember something after you move from a normal browser tab to a private/incognito tab.</p>
      <div className="heroActions">
        <a href="#demo" className="primary"><MousePointerClick size={18}/> Start</a>
        <button className="secondary" onClick={demo.copyUrl}><Copy size={18}/> Copy site URL</button>
      </div>
    </section>

    <ReadFirst />
    <ProtectionCards />
    <DemoForm {...demo} />
    <ResultCard found={demo.found} record={demo.record} deleteRecord={demo.deleteRecord} />
    <StorageInspector found={demo.found} />
    <PrivacyNotes />
    <BeginnerExplanation />

    <footer>
      <div className="footer-inner">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Incognito Buster &mdash; Built for educational cybersecurity awareness.
        </p>
        <div className="footer-links">
          <a href="https://github.com/Jeffersonben/incognito-buster" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
            GitHub
          </a>
          <a href="https://lk.linkedin.com/in/jeyakulendran-jefferson-benjamin-05589a336" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  </main>;
}
