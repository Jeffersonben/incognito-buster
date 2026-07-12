import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Shield,
  Database,
  Cookie,
  MonitorSmartphone,
  Server,
  CheckCircle2,
  XCircle,
  LockKeyhole,
  Globe2,
  Copy,
  ExternalLink,
  AlertTriangle,
  Fingerprint,
  Trash2,
  Eye,
  FileText,
  Timer,
  UserCheck,
  KeyRound
} from 'lucide-react';
import './styles.css';

const quizQuestions = [
  { id: 'history', label: 'Browsing history on the same device', answer: true },
  { id: 'cookies', label: 'Private-window cookies after closing the private window', answer: true },
  { id: 'server', label: 'Information saved on a website server', answer: false },
  { id: 'ip', label: 'Your IP address from websites', answer: false },
  { id: 'login', label: 'Your identity after logging into the same account', answer: false }
];

const recognitionMethods = [
  {
    title: 'Consent demo ID',
    status: 'Used here',
    safe: true,
    text: 'A random ID is placed in the private-tab test link. The server uses that ID to load the saved record. It is transparent and reliable.'
  },
  {
    title: 'User login',
    status: 'Common',
    safe: true,
    text: 'If a user logs into the same account in private mode, the website knows them because they identified themselves.'
  },
  {
    title: 'IP and device clues',
    status: 'Explained only',
    safe: false,
    text: 'Some services may compare network and browser clues. This can be privacy-sensitive, so this project does not use it.'
  },
  {
    title: 'Browser fingerprinting',
    status: 'Not used',
    safe: false,
    text: 'Fingerprinting combines many browser signals. It is intentionally avoided here because this is an educational project, not a tracking machine.'
  }
];

function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get('demo');
}

function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Pill({ children, type = 'neutral' }) {
  return <span className={`pill ${type}`}>{children}</span>;
}

function PrivacyBar({ label, value }) {
  return (
    <div className="bar-row">
      <div className="bar-label"><span>{label}</span><strong>{value}%</strong></div>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function App() {
  const demoId = useMemo(getIdFromUrl, []);
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [saved, setSaved] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quiz, setQuiz] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [clientStorage, setClientStorage] = useState({ cookies: false, localStorage: false, sessionStorage: false });

  useEffect(() => {
    const hasCookie = document.cookie.includes('normal_demo_cookie');
    const hasLocal = Boolean(localStorage.getItem('normal_demo_name'));
    const hasSession = Boolean(sessionStorage.getItem('normal_demo_session'));
    setClientStorage({ cookies: hasCookie, localStorage: hasLocal, sessionStorage: hasSession });
  }, []);

  useEffect(() => {
    if (!demoId) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-demo?id=${encodeURIComponent(demoId)}`);
        setLookup(await res.json());
      } catch (err) {
        setLookup({ ok: false, error: 'Could not contact the server.' });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [demoId]);

  async function saveDemo(e) {
    e.preventDefault();
    if (!name.trim() || !consent) return;
    setLoading(true);
    try {
      document.cookie = 'normal_demo_cookie=created_in_normal_tab; SameSite=Lax; max-age=3600';
      localStorage.setItem('normal_demo_name', name.trim());
      sessionStorage.setItem('normal_demo_session', 'normal tab only');
      const res = await fetch('/api/save-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), consent })
      });
      const data = await res.json();
      setSaved(data);
      setClientStorage({ cookies: true, localStorage: true, sessionStorage: true });
    } catch (err) {
      setSaved({ ok: false, error: 'Save failed. Check your Cloudflare KV binding.' });
    } finally {
      setLoading(false);
    }
  }

  const activeId = demoId || saved?.id;
  const demoUrl = saved?.id ? `${window.location.origin}${window.location.pathname}?demo=${saved.id}` : '';
  const score = quizQuestions.filter(q => Boolean(quiz[q.id]) === q.answer).length;

  async function copyLink() {
    await navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function deleteDemo() {
    if (!activeId) return;
    setLoading(true);
    try {
      await fetch('/api/delete-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeId })
      });
      setDeleted(true);
      setLookup(null);
      setSaved(null);
    } finally {
      setLoading(false);
    }
  }

  const record = lookup?.record;

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <Pill type="glow"><Shield size={16} /> Consent-first privacy demo</Pill>
          <h1>Private browsing is not a magic invisibility cloak.</h1>
          <p>
            This Cloudflare Pages project shows how a website can remember server-side data even when the user opens a private window. It uses a safe demo ID, not fingerprinting, because recruiters enjoy ethics almost as much as clean code.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="button primary">Try safe demo</a>
            <a href="#recognition" className="button secondary">Recognition methods</a>
          </div>
        </div>
        <div className="terminal-card">
          <div className="terminal-header"><span></span><span></span><span></span></div>
          <code>
            Step 1: user gives consent<br />
            Step 2: server stores chosen name<br />
            Step 3: private tab opens demo ID link<br />
            Step 4: server returns saved record<br />
            <strong>No raw IP. No fingerprinting. No nonsense.</strong>
          </code>
        </div>
      </section>

      <section className="notice">
        <FileText />
        <div>
          <strong>Educational privacy notice</strong>
          <p>This demo temporarily stores your chosen display name, browser type, device type, timestamp, and a random demo ID. It does not collect passwords, raw IP addresses, precise location, browsing history, or cross-site tracking data. Demo records expire after 24 hours.</p>
        </div>
      </section>

      <section id="demo" className="grid two">
        <Card>
          <h2>{demoId ? 'Private-window result' : 'Create a demo identity'}</h2>
          {!demoId ? (
            <>
              <p className="muted">Type a name, consent to the educational demo, then open the generated link in a private browser window.</p>
              <form onSubmit={saveDemo} className="form">
                <label>Your demo name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Example: Paul" />
                <label className="consent-box">
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                  <span>I understand this site will temporarily save my chosen name and basic browser/device details for this educational demo.</span>
                </label>
                <button className="button primary" disabled={loading || !name.trim() || !consent}>{loading ? 'Saving...' : 'Create private-tab test link'}</button>
              </form>
              {saved?.ok && (
                <div className="result-box success">
                  <CheckCircle2 />
                  <div>
                    <strong>Demo identity saved on the server.</strong>
                    <p>Open this link in a private/incognito window:</p>
                    <div className="link-row"><input readOnly value={demoUrl} /><button onClick={copyLink}><Copy size={16} /> {copied ? 'Copied' : 'Copy'}</button></div>
                    <a className="button secondary full" href={demoUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Open test link</a>
                  </div>
                </div>
              )}
              {saved?.ok === false && <div className="result-box danger"><AlertTriangle />{saved.error}</div>}
            </>
          ) : (
            <>
              {loading && <p>Checking server record...</p>}
              {record && !deleted && (
                <div className="reveal">
                  <Eye size={42} />
                  <h3>Welcome back, {record.name}.</h3>
                  <p>This came from Cloudflare KV server storage using the demo ID in the URL. Your private window did not need normal-tab cookies or local storage.</p>
                  <div className="meta-grid">
                    <div><span>Storage source</span><strong>{record.storageSource}</strong></div>
                    <div><span>Consent mode</span><strong>{record.consentMode}</strong></div>
                    <div><span>Browser clue</span><strong>{record.browser}</strong></div>
                    <div><span>Device clue</span><strong>{record.device}</strong></div>
                    <div><span>Created</span><strong>{new Date(record.createdAt).toLocaleString()}</strong></div>
                    <div><span>Times opened</span><strong>{record.openCount}</strong></div>
                  </div>
                </div>
              )}
              {lookup?.ok === false && <div className="result-box danger"><AlertTriangle /> {lookup.error}</div>}
            </>
          )}
          {activeId && !deleted && <button className="button danger-btn full" onClick={deleteDemo} disabled={loading}><Trash2 size={16} /> Delete my demo record</button>}
          {deleted && <div className="result-box success"><CheckCircle2 /> Demo record deleted.</div>}
        </Card>

        <Card>
          <h2>Logged details</h2>
          <p className="muted">Show recruiters exactly what is stored. Transparent logs, not mysterious internet wizardry.</p>
          <div className="log-list">
            {(record?.visitLog || []).map((item, index) => (
              <div className="log-item" key={`${item.at}-${index}`}>
                <Timer />
                <div><strong>{item.event}</strong><p>{new Date(item.at).toLocaleString()} • {item.browser} • {item.device}</p></div>
              </div>
            ))}
            {!record && <p className="empty-state">Create or open a demo link to see visit logs here.</p>}
          </div>
        </Card>
      </section>

      <section className="grid two">
        <Card>
          <h2>Storage inspector</h2>
          <div className="storage-list">
            <div className="storage-item"><Cookie /><div><strong>Cookies</strong><p>Private windows use a separate temporary cookie jar.</p></div>{clientStorage.cookies ? <Pill type="yes">Normal tab has data</Pill> : <Pill type="no">Not found</Pill>}</div>
            <div className="storage-item"><MonitorSmartphone /><div><strong>Local Storage</strong><p>Normal-tab local storage is not the proof here.</p></div>{clientStorage.localStorage ? <Pill type="yes">Normal tab has data</Pill> : <Pill type="no">Not found</Pill>}</div>
            <div className="storage-item"><LockKeyhole /><div><strong>Session Storage</strong><p>Session storage is tied to the tab session.</p></div>{clientStorage.sessionStorage ? <Pill type="yes">Normal tab has data</Pill> : <Pill type="no">Not found</Pill>}</div>
            <div className="storage-item"><Database /><div><strong>Server Database</strong><p>Cloudflare KV can return data to a private window if it has the demo ID.</p></div>{record || saved?.ok ? <Pill type="yes">Server data found</Pill> : <Pill type="no">No demo record</Pill>}</div>
          </div>
        </Card>

        <Card id="recognition">
          <h2>How websites can recognize returning visitors</h2>
          <p className="muted">This section explains the concept safely. Only the consent demo ID is used in this app.</p>
          <div className="method-grid">
            {recognitionMethods.map(method => (
              <div className="method" key={method.title}>
                <div className="method-head"><Fingerprint /><strong>{method.title}</strong><Pill type={method.safe ? 'yes' : 'warn'}>{method.status}</Pill></div>
                <p>{method.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid two">
        <Card>
          <h2>Privacy meter</h2>
          <PrivacyBar label="Local browsing history protection" value={100} />
          <PrivacyBar label="Temporary private-window cookie cleanup" value={100} />
          <PrivacyBar label="Protection from server-side records" value={0} />
          <PrivacyBar label="Protection after logging into same account" value={0} />
        </Card>

        <Card>
          <h2>Quick knowledge check</h2>
          <p className="muted">Select what private browsing usually protects.</p>
          <div className="quiz-list">
            {quizQuestions.map(q => (
              <label key={q.id} className="quiz-item">
                <input type="checkbox" checked={Boolean(quiz[q.id])} onChange={e => setQuiz({ ...quiz, [q.id]: e.target.checked })} />
                <span>{q.label}</span>
              </label>
            ))}
          </div>
          <button className="button primary" onClick={() => setQuizDone(true)}>Check answer</button>
          {quizDone && <div className="score"><strong>{score} / {quizQuestions.length}</strong><p>Private browsing is mainly local-device privacy. It is not an internet disguise kit, sadly.</p></div>}
        </Card>
      </section>

      <section className="grid two">
        <Card>
          <h2>Architecture</h2>
          <div className="flow">
            <div><UserCheck /> Consent + name</div><span>↓</span>
            <div><Server /> Cloudflare Pages Function</div><span>↓</span>
            <div><Database /> Cloudflare KV, expires in 24h</div><span>↓</span>
            <div><KeyRound /> Random demo ID link</div><span>↓</span>
            <div><Globe2 /> Private window loads same server record</div>
          </div>
        </Card>

        <Card>
          <h2>Recruiter-friendly takeaway</h2>
          <div className="takeaway"><CheckCircle2 /><p><strong>Technical concept:</strong> private mode limits local browser traces, but server-side persistence still works.</p></div>
          <div className="takeaway"><Shield /><p><strong>Ethical choice:</strong> this project avoids raw IP storage, fingerprinting, precise location, and silent tracking.</p></div>
          <div className="takeaway warning"><XCircle /><p><strong>What it does not claim:</strong> it does not hack or bypass private browsing. It explains its limits.</p></div>
          <p className="linkedin-copy">LinkedIn caption: “I redesigned my Incognito Myth Buster project using consent-based server memory. It explains how private browsing protects local history, while server-side records can still exist.”</p>
        </Card>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
