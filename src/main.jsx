import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Eye, Database, Cookie, MonitorSmartphone, Server, CheckCircle2, XCircle, LockKeyhole, Globe2, History, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import './styles.css';

const storageChecks = [
  { label: 'Cookies', key: 'cookies', icon: Cookie, explanation: 'Private windows start with a separate cookie jar. After closing, those cookies are usually removed.' },
  { label: 'Local Storage', key: 'localStorage', icon: MonitorSmartphone, explanation: 'Normal-tab local storage is not shared with a fresh private window.' },
  { label: 'Session Storage', key: 'sessionStorage', icon: LockKeyhole, explanation: 'Session storage is tied to the current tab/session and is not carried across like magic.' },
  { label: 'Server Database', key: 'server', icon: Database, explanation: 'A website can still show data that was saved on its own server.' }
];

const quizQuestions = [
  { id: 'history', label: 'Browsing history on this device', answer: true },
  { id: 'cookies', label: 'Normal-window cookies after closing private window', answer: true },
  { id: 'ip', label: 'Your IP address from websites', answer: false },
  { id: 'isp', label: 'Your internet provider or network admin', answer: false },
  { id: 'server', label: 'Information a website saved on its server', answer: false },
  { id: 'downloads', label: 'Downloaded files already saved to the device', answer: false }
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
  const [saved, setSaved] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientStorage, setClientStorage] = useState({ cookies: false, localStorage: false, sessionStorage: false });

  useEffect(() => {
    document.cookie = 'normal_demo_cookie=visible_in_normal_tab; SameSite=Lax; max-age=3600';
    localStorage.setItem('normal_demo_name', name || 'This was saved in the normal tab');
    sessionStorage.setItem('normal_demo_session', 'This exists only in this tab session');
  }, [name]);

  useEffect(() => {
    const run = async () => {
      const hasCookie = document.cookie.includes('normal_demo_cookie');
      const hasLocal = Boolean(localStorage.getItem('normal_demo_name'));
      const hasSession = Boolean(sessionStorage.getItem('normal_demo_session'));
      setClientStorage({ cookies: hasCookie, localStorage: hasLocal, sessionStorage: hasSession });
      if (demoId) {
        setLoading(true);
        try {
          const res = await fetch(`/api/get-demo?id=${encodeURIComponent(demoId)}`);
          setLookup(await res.json());
        } catch (err) {
          setLookup({ ok: false, error: 'Could not contact the server.' });
        } finally {
          setLoading(false);
        }
      }
    };
    run();
  }, [demoId]);

  async function saveDemo(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/save-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      const data = await res.json();
      setSaved(data);
    } catch (err) {
      setSaved({ ok: false, error: 'Save failed. Check your Cloudflare KV binding.' });
    } finally {
      setLoading(false);
    }
  }

  const demoUrl = saved?.id ? `${window.location.origin}${window.location.pathname}?demo=${saved.id}` : '';
  const score = quizQuestions.filter(q => Boolean(quiz[q.id]) === q.answer).length;

  async function copyLink() {
    await navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <Pill type="glow"><Shield size={16} /> Security Awareness Demo</Pill>
          <h1>Incognito is private browsing, not invisibility.</h1>
          <p>
            This mini project demonstrates a common privacy misunderstanding: a private window can block local browser traces, but a website can still show information saved on its server.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="button primary">Try the demo</a>
            <a href="#how" className="button secondary">See how it works</a>
          </div>
        </div>
        <div className="terminal-card">
          <div className="terminal-header"><span></span><span></span><span></span></div>
          <code>
            Normal tab: save name<br />
            Server: stores demo record<br />
            Private tab: opens demo link<br />
            Result: server returns name<br />
            <strong>Lesson: local privacy ≠ anonymity</strong>
          </code>
        </div>
      </section>

      <section id="demo" className="grid two">
        <Card>
          <h2>{demoId ? 'Private-window result' : 'Step 1: Save a name'}</h2>
          {!demoId ? (
            <>
              <p className="muted">Enter a name in a normal browser tab. The app saves it on the server and creates a demo link you can open in a private window.</p>
              <form onSubmit={saveDemo} className="form">
                <label>Your demo name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Example: Paul" />
                <button className="button primary" disabled={loading || !name.trim()}>{loading ? 'Saving...' : 'Create private-tab test link'}</button>
              </form>
              {saved?.ok && (
                <div className="result-box success">
                  <CheckCircle2 />
                  <div>
                    <strong>Demo saved on the server.</strong>
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
              {lookup?.ok && (
                <div className="reveal">
                  <Eye size={42} />
                  <h3>Welcome back, {lookup.record.name}.</h3>
                  <p>This page did not need your normal-tab local storage. It loaded your name from the website server using the demo ID in the URL.</p>
                  <div className="meta-grid">
                    <div><span>Saved at</span><strong>{new Date(lookup.record.createdAt).toLocaleString()}</strong></div>
                    <div><span>Browser clue</span><strong>{lookup.record.browser}</strong></div>
                    <div><span>Device clue</span><strong>{lookup.record.device}</strong></div>
                    <div><span>Server data</span><strong>Found</strong></div>
                  </div>
                </div>
              )}
              {lookup?.ok === false && <div className="result-box danger"><AlertTriangle /> Demo record not found or expired.</div>}
            </>
          )}
        </Card>

        <Card>
          <h2>Storage inspector</h2>
          <p className="muted">This section shows the difference between local browser storage and server-side memory.</p>
          <div className="storage-list">
            {storageChecks.map(item => {
              const Icon = item.icon;
              const found = item.key === 'server' ? Boolean(lookup?.ok || saved?.ok) : clientStorage[item.key];
              return (
                <div className="storage-item" key={item.key}>
                  <Icon />
                  <div><strong>{item.label}</strong><p>{item.explanation}</p></div>
                  {found ? <Pill type="yes">Visible</Pill> : <Pill type="no">Empty</Pill>}
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section id="how" className="grid two">
        <Card>
          <h2>How the demo works</h2>
          <div className="flow">
            <div><MonitorSmartphone /> Normal tab submits name</div>
            <span>↓</span>
            <div><Server /> Cloudflare Pages Function receives it</div>
            <span>↓</span>
            <div><Database /> KV database stores demo record</div>
            <span>↓</span>
            <div><Globe2 /> Private tab opens link with demo ID</div>
            <span>↓</span>
            <div><Eye /> Server returns saved name</div>
          </div>
        </Card>

        <Card>
          <h2>Privacy meter</h2>
          <PrivacyBar label="Browsing history on this device" value={100} />
          <PrivacyBar label="Private-window cookies after close" value={100} />
          <PrivacyBar label="Protection from websites seeing IP" value={0} />
          <PrivacyBar label="Protection from server-side records" value={0} />
          <PrivacyBar label="Protection from logged-in accounts" value={0} />
        </Card>
      </section>

      <section className="grid two">
        <Card>
          <h2>Interactive quiz</h2>
          <p className="muted">Select what private browsing usually helps hide from someone using the same device later.</p>
          <div className="quiz-list">
            {quizQuestions.map(q => (
              <label key={q.id} className="quiz-item">
                <input type="checkbox" checked={Boolean(quiz[q.id])} onChange={e => setQuiz({ ...quiz, [q.id]: e.target.checked })} />
                <span>{q.label}</span>
              </label>
            ))}
          </div>
          <button className="button primary" onClick={() => setQuizDone(true)}>Check my understanding</button>
          {quizDone && <div className="score"><strong>{score} / {quizQuestions.length}</strong><p>Private browsing is mainly device-level privacy. It is not a disguise costume for the internet.</p></div>}
        </Card>

        <Card>
          <h2>Key takeaway</h2>
          <div className="takeaway"><History /><p><strong>Private browsing protects local traces.</strong> It helps keep browsing history, temporary cookies, and form data away from the normal browser profile.</p></div>
          <div className="takeaway warning"><XCircle /><p><strong>It does not make you anonymous.</strong> Websites, servers, networks, and logged-in accounts can still identify or remember activity.</p></div>
          <p className="linkedin-copy">LinkedIn caption idea: “I built a small Cloudflare Pages project to explain a common privacy myth: Incognito mode protects local browser history, but it does not stop server-side recognition.”</p>
        </Card>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
