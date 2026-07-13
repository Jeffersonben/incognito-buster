import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck, Eye, Database, Lock, Trash2, RefreshCcw,
  AlertTriangle, Server, Globe, CheckCircle2, MousePointerClick,
  Copy, Info, ArrowRight
} from 'lucide-react';
import './styles.css';

// ── Sub-components (presentation only) ──────────────────────

function Detail({ label, value }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="step">
      <div className="stepNo">{number}</div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

function StorageRow({ name, status, ok }) {
  return (
    <div className="storageRow">
      <span>{name}</span>
      <strong className={ok ? 'yes' : 'no'}>{status}</strong>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────

function App() {
  // ── ALL STATE AND LOGIC PRESERVED EXACTLY ──────────────────
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [record, setRecord] = useState(null);
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState('Checking whether this browser has a saved demo record...');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  async function checkRecord() {
    setLoading(true);
    setMessage('Checking the server for a saved demo record...');
    try {
      const res = await fetch('/api/whoami', { cache: 'no-store' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Check failed');
      if (data.found) {
        setFound(true);
        setRecord(data.record);
        setMessage('A saved demo record was found on the server.');
        setShowPopup(true);
      } else {
        setFound(false);
        setRecord(null);
        setMessage(data.message || 'No saved demo record found yet.');
      }
    } catch (err) {
      setMessage(err.message || 'Could not check the demo record.');
    } finally {
      setLoading(false);
    }
  }

  async function saveName(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('Saving your demo name on the server...');
    try {
      const res = await fetch('/api/save-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, consent })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Save failed');
      setRecord(data.record);
      setFound(true);
      setMessage('Saved. Now open this same website URL in a private/incognito tab.');
    } catch (err) {
      setMessage(err.message || 'Could not save the demo identity.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteRecord() {
    setLoading(true);
    setMessage('Deleting the demo record...');
    try {
      const res = await fetch('/api/delete-demo', { method: 'POST' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Delete failed');
      setRecord(null);
      setFound(false);
      setMessage('Deleted. The site should no longer recognize this demo record.');
    } catch (err) {
      setMessage(err.message || 'Could not delete the demo record.');
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    navigator.clipboard?.writeText(window.location.origin);
    setMessage('Site URL copied. Open a private/incognito window and paste it there.');
  }

  useEffect(() => { checkRecord(); }, []);
  // ── END PRESERVED LOGIC ─────────────────────────────────────

  return (
    <div className="site-frame">

      {/* ── Welcome Back Popup ───────────────────────────────── */}
      {showPopup && found && record && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="badge success" style={{ marginBottom: '16px' }}>
              Server record found
            </div>
            <h2>Welcome back, {record.name}!</h2>
            <p>
              The server recognized you — even from a private tab. Your name was
              saved on the server, not in your browser.
            </p>
            <div className="popup-meta">
              <span><strong>Saved at:</strong> {new Date(record.savedAt).toLocaleString()}</span>
              <span><strong>Method:</strong> {record.method}</span>
            </div>
            <div className="popup-actions">
              <button className="primary button" onClick={() => setShowPopup(false)}>
                <ArrowRight size={16} /> Got it
              </button>
              <button className="danger" onClick={() => { deleteRecord(); setShowPopup(false); }}>
                <Trash2 size={16} /> Delete my record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Nav ─────────────────────────────────────────── */}
      <nav className="topnav">
        <div className="topnav-brand">
          <ShieldCheck size={20} />
          INCOGNITO BUSTER
        </div>
        <div className="topnav-badge">
          <Globe size={13} />
          Educational Demo
        </div>
      </nav>

      <main>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-eyebrow">
            <ShieldCheck size={13} />
          Beginner-friendly demo
          </div>
          <h1>
            Private tab is <em>private</em> on your device,{' '}
            not <span className="accent-word">invisible</span> to websites.
          </h1>
          <p className="hero-sub">
            This simple project shows why a website may still remember something
            after you move from a normal browser tab to a private/incognito tab.
          </p>
          <div className="heroActions">
            <a href="#demo" className="primary">
              <MousePointerClick size={16} /> Start
            </a>
            <button className="secondary" onClick={copyUrl}>
              <Copy size={16} /> Copy site URL
            </button>
          </div>
        </section>

        {/* ── Read This First ─────────────────────────────────── */}
        <div className="section-label"><Info size={13} /> Context</div>
        <section className="plainBox">
          <h2><Info size={20} /> Read this first</h2>
          <p>
            <strong>This site does not hack private browsing.</strong> It only saves the name
            you type on the server for 24 hours. Then, when you open the same site again
            in a private tab, the server checks whether it already has a temporary record
            for your network today.
          </p>
          <p>
            Think of it like a hotel receptionist. Wearing sunglasses does not erase the hotel
            register. Private mode is the sunglasses. The server database is the register.
            Dramatic, but accurate enough for humanity.
          </p>
        </section>

        {/* ── What Private Browsing Does/Doesn't Cover ──────────── */}
        <div className="section-label"><Eye size={13} /> The reality</div>
        <section className="grid two">
          <div className="card">
            <h2>What private browsing usually protects</h2>
            <ul className="checkList">
              <li><CheckCircle2 size={16} /> Browser history on this device</li>
              <li><CheckCircle2 size={16} /> Cookies after the private window closes</li>
              <li><CheckCircle2 size={16} /> Local storage after the private session ends</li>
              <li><CheckCircle2 size={16} /> Form data saved by your browser</li>
            </ul>
          </div>
          <div className="card warn">
            <h2>What private browsing does not fully hide</h2>
            <ul className="checkList">
              <li><AlertTriangle size={16} /> Websites can still receive your request</li>
              <li><AlertTriangle size={16} /> Server-side data can still exist</li>
              <li><AlertTriangle size={16} /> Your network/IP may still be visible to the site</li>
              <li><AlertTriangle size={16} /> Login accounts still identify you</li>
            </ul>
          </div>
        </section>

        {/* ── Demo ────────────────────────────────────────────── */}
        <div className="section-label"><MousePointerClick size={13} /> Try it yourself</div>
        <section className="card" id="demo">
          <h2>Try it in 3 steps</h2>
          <div className="steps">
            <Step number="1" title="Save your name in normal tab">
              Type any display name below and click save.
            </Step>
            <Step number="2" title="Open private/incognito tab">
              Open a private window in your browser.
            </Step>
            <Step number="3" title="Visit the same website URL">
              Do not use a special link. Just open this same site address again.
            </Step>
          </div>

          <form onSubmit={saveName} className="form">
            <label htmlFor="demo-name">Your display name</label>
            <input
              id="demo-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Jeffy"
              maxLength="60"
            />
            <label className="consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              I understand this is an educational demo and my chosen name will be stored
              temporarily for 24 hours.
            </label>
            <button className="primary button" disabled={loading}>
              {loading ? 'Working...' : 'Save Identity'}
            </button>
          </form>

          <div className="status">{message}</div>
        </section>

        {/* ── Result ──────────────────────────────────────────── */}
        {found && record && (
          <section className="result">
            <div className="result-header">
              <div className="badge success"><Eye size={13} /> Server record found</div>
              <h2>Welcome back, {record.name}</h2>
              <p>
                This name came from server-side storage, not from cookies,
                local storage, or browser history.
              </p>
            </div>
            <div className="details">
              <Detail label="Name saved"      value={record.name} />
              <Detail label="Browser"         value={record.browser} />
              <Detail label="Device"          value={record.device} />
              <Detail label="Saved at"        value={new Date(record.savedAt).toLocaleString()} />
              <Detail label="Storage method"  value={record.method} />
              <Detail label="Expiry"          value={record.expiresIn} />
            </div>
            <div>
              <button onClick={deleteRecord} className="danger">
                <Trash2 size={16} /> Delete my demo record
              </button>
            </div>
          </section>
        )}

        {/* ── Storage Inspector + Recognition ─────────────────── */}
        <div className="section-label"><Database size={13} /> Under the hood</div>
        <section className="grid two">
          <div className="card">
            <h2><Database size={20} /> Storage inspector</h2>
            <p>This explains where the saved name comes from.</p>
            <StorageRow name="Cookies"                    status="Not used"                          ok={false} />
            <StorageRow name="Local Storage"              status="Not used"                          ok={false} />
            <StorageRow name="Session Storage"            status="Not used"                          ok={false} />
            <StorageRow name="Cloudflare KV server storage" status={found ? 'Record found' : 'No record'} ok={found} />
          </div>
          <div className="card">
            <h2><Server size={20} /> How this project recognizes the data</h2>
            <p>
              The server creates a temporary hashed key from request information visible
              to the server. It does not store your raw IP address and does not use
              invasive browser fingerprinting.
            </p>
            <div className="flow">
              <span>Normal tab</span>
              <b>→</b>
              <span>Server save</span>
              <b>→</b>
              <span>Private tab</span>
              <b>→</b>
              <span>Server check</span>
            </div>
          </div>
        </section>

        {/* ── Privacy Notes ────────────────────────────────────── */}
        <div className="section-label"><Lock size={13} /> Privacy</div>
        <section className="plainBox">
          <h2><Lock size={20} /> Privacy and safety notes</h2>
          <ul className="plainList">
            <li>The demo stores only your chosen display name, browser type, device type, save time, and a temporary server recognition record.</li>
            <li>The raw IP address is not saved in the database.</li>
            <li>The demo record expires automatically after 24 hours.</li>
            <li>You can delete your demo record using the delete button.</li>
            <li>This may fail if you change network, use VPN, switch device, or your IP changes.</li>
          </ul>
        </section>

        {/* ── Explainer ────────────────────────────────────────── */}
        <div className="section-label"><Globe size={13} /> Explainer</div>
        <section className="plainBox">
          <h2><Globe size={20} /> Beginner explanation</h2>
          <p>
            <strong>Browser side</strong> means data saved inside your browser, like cookies
            or browsing history. Private mode is good at reducing this.
          </p>
          <p>
            <strong>Server side</strong> means data saved by the website on its own
            computer/database. Private mode on your device does not automatically delete that.
          </p>
          <p>
            That is the whole lesson. Not magic, not hacking, just client vs server.
            The web remains annoyingly logical.
          </p>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
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

    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
