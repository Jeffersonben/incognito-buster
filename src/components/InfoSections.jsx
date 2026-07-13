import React from 'react';
import { AlertTriangle, CheckCircle2, Database, Globe, Info, Lock, Server } from './Icons.jsx';
import { StorageRow } from './SmallPieces.jsx';

export function ReadFirst() {
  return <section className="plainBox">
    <h2><Info size={22}/> Read this first</h2>
    <p><strong>This site does not hack private browsing.</strong> It only saves the name you type on the server for 24 hours. Then, when you open the same site again in a private tab, the server checks whether it already has a temporary record for your network today.</p>
    <p>Think of it like a hotel receptionist. Wearing sunglasses does not erase the hotel register. Private mode is the sunglasses. The server database is the register. Dramatic, but accurate enough for humanity.</p>
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
      <p>This explains where the saved name comes from.</p>
      <StorageRow name="Cookies" status="Not used" ok={false}/>
      <StorageRow name="Local Storage" status="Not used" ok={false}/>
      <StorageRow name="Session Storage" status="Not used" ok={false}/>
      <StorageRow name="Cloudflare KV server storage" status={found ? 'Record found' : 'No record'} ok={found}/>
    </div>
    <div className="card">
      <h2><Server/> How this project recognizes the data</h2>
      <p>The server creates a temporary hashed key from request information visible to the server. It does not store your raw IP address and does not use invasive browser fingerprinting.</p>
      <div className="flow"><span>Normal tab</span><b>→</b><span>Server save</span><b>→</b><span>Private tab</span><b>→</b><span>Server check</span></div>
    </div>
  </section>;
}

export function PrivacyNotes() {
  return <section className="plainBox">
    <h2><Lock/> Privacy and safety notes</h2>
    <ul className="plainList">
      <li>The demo stores only your chosen display name, browser type, device type, save time, and a temporary server recognition record.</li>
      <li>The raw IP address is not saved in the database.</li>
      <li>The demo record expires automatically after 24 hours.</li>
      <li>You can delete your demo record using the delete button.</li>
      <li>This may fail if you change network, use VPN, switch device, or your IP changes.</li>
    </ul>
  </section>;
}

export function BeginnerExplanation() {
  return <section className="plainBox dark">
    <h2><Globe/> Beginner explanation</h2>
    <p><strong>Browser side</strong> means data saved inside your browser, like cookies or browsing history. Private mode is good at reducing this.</p>
    <p><strong>Server side</strong> means data saved by the website on its own computer/database. Private mode on your device does not automatically delete that.</p>
    <p>That is the whole lesson. Not magic, not hacking, just client vs server. The web remains annoyingly logical.</p>
  </section>;
}
