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

      {/* ── Top Nav ─────────────────────────────────────────── */}
      <nav className="topnav">
        <div className="topnav-brand">
          <ShieldCheck size={20} />
          INCOGNITO MYTH BUSTER
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
            Beginner-friendly privacy demo
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
              <MousePointerClick size={16} /> Start the demo
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
            <label htmlFor="demo-name">Your demo display name</label>
            <input
              id="demo-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Paul"
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
              {loading ? 'Working...' : 'Save demo identity'}
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
            <h2><Server size={20} /> How this project recognizes the demo</h2>
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
        Built for educational cybersecurity awareness. No personalized links,
        no raw IP storage, no fingerprinting circus.
      </footer>

    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
