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
      <div className="badge"><ShieldCheck size={18}/> Beginner-friendly privacy demo</div>
      <h1>Private tab is private on your device, not invisible to websites.</h1>
      <p className="sub">This simple project shows why a website may still remember something after you move from a normal browser tab to a private/incognito tab.</p>
      <div className="heroActions">
        <a href="#demo" className="primary"><MousePointerClick size={18}/> Start the demo</a>
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

    <footer>Built for educational cybersecurity awareness. No personalized links, no raw IP storage, no fingerprinting circus.</footer>
  </main>;
}
