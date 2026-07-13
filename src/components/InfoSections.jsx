import React from 'react';
import { AlertTriangle, CheckCircle2, Database, Globe, Info, Lock, Server } from './Icons.jsx';
import { StorageRow } from './SmallPieces.jsx';

export function ReadFirst() {
  return <section className="plainBox">
    <h2><Info size={22}/> How it works</h2>
    <p>Your name is saved on the server for 24 hours. When you revisit in a private tab, the server recognizes you — not via cookies or local storage, but a server-side record.</p>
  </section>;
}

export function ProtectionCards() {
  return <section className="grid two">
    <div className="card">
      <h2>What private browsing usually protects</h2>
      <ul className="checkList">
        <li><CheckCircle2/> Browser history on this device</li>
        <li><CheckCircle2/> Cookies after the private window closes</li>
        <li><CheckCircle2/> Local storage after the private session ends</li>
        <li><CheckCircle2/> Form data saved by your browser</li>
      </ul>
    </div>
    <div className="card warn">
      <h2>What private browsing does not fully hide</h2>
      <ul className="checkList">
        <li><AlertTriangle/> Websites can still receive your request</li>
        <li><AlertTriangle/> Server-side data can still exist</li>
        <li><AlertTriangle/> Your network/IP may still be visible to the site</li>
        <li><AlertTriangle/> Login accounts still identify you</li>
      </ul>
    </div>
  </section>;
}

export function StorageInspector({ found }) {
  return <section className="grid two">
    <div className="card">
      <h2><Database/> Storage inspector</h2>
      <StorageRow name="Cookies"           status="Not used" ok={false}/>
      <StorageRow name="Local Storage"     status="Not used" ok={false}/>
      <StorageRow name="Session Storage"   status="Not used" ok={false}/>
      <StorageRow name="KV server storage" status={found ? 'Record found' : 'No record'} ok={found}/>
    </div>
    <div className="card">
      <h2><Server/> How recognition works</h2>
      <p>A temporary hashed key is built from your request. No raw IP stored. No fingerprinting.</p>
      <div className="flow"><span>Normal tab</span><b>→</b><span>Server save</span><b>→</b><span>Private tab</span><b>→</b><span>Server check</span></div>
    </div>
  </section>;
}

export function PrivacyNotes() {
  return <section className="plainBox">
    <h2><Lock/> Privacy notes</h2>
    <ul className="plainList">
      <li>Only your display name, browser type, and save time are stored.</li>
      <li>No raw IP address is saved.</li>
      <li>Record expires in 24 hours — delete it anytime with the delete button.</li>
    </ul>
  </section>;
}

export function BeginnerExplanation() {
  return <section className="plainBox dark">
    <h2><Globe/> The key lesson</h2>
    <p><strong>Browser side</strong> (cookies, history) — private mode clears this. <strong>Server side</strong> (website's database) — private mode has no effect. That's the whole lesson.</p>
  </section>;
}
