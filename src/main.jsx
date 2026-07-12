import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Eye, Database, Lock, Trash2, RefreshCcw, AlertTriangle, Server, Globe, CheckCircle2 } from 'lucide-react';
import './styles.css';

function formatDate(value) {
  if (!value) return 'Not available';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function App() {
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking server-side memory...');
  const [record, setRecord] = useState(null);
  const [currentVisit, setCurrentVisit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const storageSnapshot = useMemo(() => {
    let localItems = 0;
    let sessionItems = 0;
    try { localItems = window.localStorage.length; } catch {}
    try { sessionItems = window.sessionStorage.length; } catch {}
    return {
      cookies: document.cookie ? 'Has cookies' : 'No visible cookies',
      localStorage: localItems === 0 ? 'Empty or unavailable' : `${localItems} item(s)` ,
      sessionStorage: sessionItems === 0 ? 'Empty or unavailable' : `${sessionItems} item(s)`
    };
  }, [status]);

  async function checkIdentity() {
    setStatus('checking');
    setMessage('Checking server-side memory...');
    try {
      const res = await fetch('/api/whoami', { cache: 'no-store' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Check failed');
      if (data.known) {
        setRecord(data.record);
        setCurrentVisit(null);
        setStatus('known');
        setMessage(`Welcome back, ${data.record.name}.`);
      } else {
        setRecord(null);
        setCurrentVisit(data.currentVisit);
        setStatus('unknown');
        setMessage('No matching server-side demo record found for this visit.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Could not check identity.');
    }
  }

  useEffect(() => {
    checkIdentity();
  }, []);

  async function saveDemo(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving demo identity on the server...');
    try {
      const res = await fetch('/api/save-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, consent })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Save failed');
      setMessage('Saved. Now open the same site URL in a private/incognito tab. No personal link needed.');
      await checkIdentity();
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Could not save demo identity.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteDemo() {
    setDeleting(true);
    setMessage('Deleting this demo record...');
    try {
      const res = await fetch('/api/delete-demo', { method: 'POST' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Delete failed');
      setRecord(null);
      setStatus('unknown');
      setMessage('Deleted. Refresh or open a private tab to confirm the server no longer recognizes this visit.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Could not delete demo record.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge"><ShieldCheck size={16} /> Consent-based privacy demo</div>
        <h1>Incognito Reality Check</h1>
        <p className="subtitle">
          A recruiter-friendly demo showing how private browsing protects local device history, while a website can still remember consented server-side data.
        </p>
        <div className="heroActions">
          <a href="#demo" className="button primary">Try the demo</a>
          <a href="#privacy" className="button secondary">Read privacy design</a>
        </div>
      </section>

      <section className="grid" id="demo">
        <div className="card mainCard">
          <div className="cardHeader">
            <Eye />
            <div>
              <h2>Live recognition status</h2>
              <p>{message}</p>
            </div>
          </div>

          <div className={`statusBox ${status}`}>
            {status === 'known' ? <CheckCircle2 /> : status === 'error' ? <AlertTriangle /> : <RefreshCcw />}
            <span>{status === 'known' ? 'Server-side record found' : status === 'checking' ? 'Checking...' : status === 'error' ? 'Something needs fixing' : 'No record found yet'}</span>
          </div>

          {record ? (
            <div className="resultPanel">
              <h3>Welcome back, {record.name}</h3>
              <p>This name came from Cloudflare KV server storage, not from cookies, localStorage, or sessionStorage.</p>
              <div className="facts">
                <span>Browser: <b>{record.browser}</b></span>
                <span>Device: <b>{record.device}</b></span>
                <span>Saved: <b>{formatDate(record.firstSavedAt)}</b></span>
                <span>Last seen: <b>{formatDate(record.lastSeenAt)}</b></span>
                <span>Expires: <b>{record.expiresIn}</b></span>
              </div>
              <button className="button danger" onClick={deleteDemo} disabled={deleting}>
                <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete my demo record'}
              </button>
            </div>
          ) : (
            <form onSubmit={saveDemo} className="form">
              <label>
                Your demo name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Paul" maxLength={60} />
              </label>
              <label className="check">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>I understand this educational demo will temporarily store my chosen name and a hashed recognition key for 24 hours.</span>
              </label>
              <button className="button primary" disabled={saving || !name.trim() || !consent}>
                {saving ? 'Saving...' : 'Save demo identity'}
              </button>
              {currentVisit && (
                <p className="hint">Current visit: {currentVisit.browser}, {currentVisit.device}</p>
              )}
            </form>
          )}
        </div>

        <div className="card">
          <div className="cardHeader"><Database /><div><h2>Storage inspector</h2><p>What this browser currently exposes.</p></div></div>
          <div className="storageList">
            <div><span>Cookies</span><b>{storageSnapshot.cookies}</b></div>
            <div><span>Local Storage</span><b>{storageSnapshot.localStorage}</b></div>
            <div><span>Session Storage</span><b>{storageSnapshot.sessionStorage}</b></div>
            <div><span>Server KV</span><b>{record ? 'Record found' : 'No match yet'}</b></div>
          </div>
        </div>
      </section>

      <section className="card wide">
        <div className="cardHeader"><Server /><div><h2>How the no-link version works</h2><p>Same public URL. No personal link. No raw IP storage.</p></div></div>
        <div className="steps">
          <div><b>1</b><span>User gives consent and saves a name.</span></div>
          <div><b>2</b><span>Cloudflare Function builds a short-lived one-way hash from the network IP and current date.</span></div>
          <div><b>3</b><span>The name and safe visit details are stored in Cloudflare KV for 24 hours.</span></div>
          <div><b>4</b><span>When the same public site URL opens in a private tab, the server checks whether that temporary hash exists.</span></div>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <div className="cardHeader"><Lock /><div><h2>What private browsing protects</h2><p>Mostly local traces on the device.</p></div></div>
          <ul className="cleanList good">
            <li>Browsing history on this device</li>
            <li>Most cookies after the private session closes</li>
            <li>Local storage created inside that private session</li>
            <li>Form history and cached traces</li>
          </ul>
        </div>
        <div className="card">
          <div className="cardHeader"><Globe /><div><h2>What it does not fully hide</h2><p>The internet still has receipts. Naturally.</p></div></div>
          <ul className="cleanList warn">
            <li>Server-side records created by websites</li>
            <li>Your network/IP as seen by the website</li>
            <li>Browser and device information sent in requests</li>
            <li>Activity from accounts you log into</li>
          </ul>
        </div>
      </section>

      <section className="card wide" id="privacy">
        <div className="cardHeader"><ShieldCheck /><div><h2>Privacy design</h2><p>Built to explain the concept, not stalk anyone like a bargain-bin ad network.</p></div></div>
        <div className="privacyGrid">
          <div><b>No raw IP stored</b><span>The server uses a one-way hash for recognition.</span></div>
          <div><b>Consent required</b><span>The user must actively agree before data is saved.</span></div>
          <div><b>24-hour expiry</b><span>Records automatically expire from Cloudflare KV.</span></div>
          <div><b>No fingerprinting</b><span>The demo avoids canvas, font, audio, GPU, and hidden fingerprinting.</span></div>
          <div><b>Delete button</b><span>Users can remove the demo record.</span></div>
          <div><b>Educational purpose</b><span>The UI explains the difference between local privacy and server memory.</span></div>
        </div>
        <p className="smallPrint">
          Limitation: this recognition may fail if the user changes network, VPN, or public IP. On shared Wi-Fi, multiple users may share one network key. That limitation is part of the lesson: server-side recognition can be possible, but it is not magic.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
