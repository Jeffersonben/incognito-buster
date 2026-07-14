import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck, Eye, EyeOff, Server, Globe, Trash2,
  ChevronDown, ChevronRight, Copy, Clock, Lock, Ban,
  History, Database, HardDrive, ClipboardList, Wifi, Key,
  ArrowRight, MousePointerClick,
} from 'lucide-react';
import './styles.css';

// ─────────────────────────────────────────────────────────
//  Shared tiny components
// ─────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

/** 3-dot progress indicator. step = 1 | 2 | 3 */
function ProgressDots({ step }) {
  return (
    <div className="progress-dots" aria-label={`Step ${step} of 3`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`pdot ${n <= step ? 'pdot-active' : ''} ${n === step ? 'pdot-current' : ''}`}
        />
      ))}
    </div>
  );
}

/** Accordion item used in the explanation modal */
function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion-item ${open ? 'accordion-open' : ''}`}>
      <button
        className="accordion-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown size={16} className="accordion-chevron" />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

/** Full-screen explanation modal */
function ExplainModal({ onClose, onDelete, record }) {
  // Close on Escape
  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-card explain-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Explanation"
      >
        {/* Header */}
        <div className="explain-header">
          <div className="badge success">
            <Eye size={12} /> The trick revealed
          </div>
          <button className="explain-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <h2 style={{ marginBottom: 20 }}>How did the website remember you?</h2>

        <div className="accordion-list">
          <AccordionItem title="What actually happened?" defaultOpen>
            <p>
              When you typed your name, it was saved on the <strong>server</strong> — not in your browser.
              Private browsing only clears browser-side data like cookies and history.
              The server doesn't care which browser mode you're using.
            </p>
          </AccordionItem>

          <AccordionItem title="What private browsing actually protects">
            <ul className="checkList" style={{ marginTop: 0 }}>
              <li><ShieldCheck size={15} strokeWidth={2.5} color="#22c55e" /> Browser history</li>
              <li><ShieldCheck size={15} strokeWidth={2.5} color="#22c55e" /> Cookies (cleared after session)</li>
              <li><ShieldCheck size={15} strokeWidth={2.5} color="#22c55e" /> Local &amp; session storage</li>
              <li><ShieldCheck size={15} strokeWidth={2.5} color="#22c55e" /> Form data &amp; autofill</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="What it does NOT automatically hide">
            <ul className="checkList" style={{ marginTop: 0 }}>
              <li><Server size={15} strokeWidth={2.5} color="#d97706" /> Data already saved on a server</li>
              <li><Key size={15} strokeWidth={2.5} color="#d97706" /> Sessions on websites you're logged into</li>
              <li><Wifi size={15} strokeWidth={2.5} color="#d97706" /> Your network requests &amp; IP address</li>
              <li><Globe size={15} strokeWidth={2.5} color="#d97706" /> What the website can observe</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Privacy &amp; ethics">
            <p>
              No raw IP address is stored or logged. Recognition uses a hashed, salted key that cannot be reversed.
              All data expires automatically after 24 hours. This is a purely educational demonstration.
            </p>
            <div className="explain-chips">
              <span className="pchip"><Ban size={12} /> No IP stored</span>
              <span className="pchip"><Lock size={12} /> Hashed key only</span>
              <span className="pchip"><Clock size={12} /> 24h auto-expiry</span>
            </div>
          </AccordionItem>
        </div>

        {record && (
          <div className="explain-delete">
            <button className="danger" onClick={onDelete}>
              <Trash2 size={14} /> Delete my demo record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Screen components
// ─────────────────────────────────────────────────────────

/** SCREEN 0 — Landing */
function LandingScreen({ onStart, onExplain }) {
  return (
    <div className="wizard-landing hero-full">

      {/* ── Floating decorative micro-dots ─────────────────── */}
      <span className="hero-dot hero-dot-1" aria-hidden="true" />
      <span className="hero-dot hero-dot-2" aria-hidden="true" />
      <span className="hero-dot hero-dot-3" aria-hidden="true" />
      <span className="hero-dot hero-dot-4" aria-hidden="true" />
      <span className="hero-dot hero-dot-5" aria-hidden="true" />

      {/* ── Corner grid accent marks ────────────────────────── */}
      <span className="hero-corner hero-corner-tl" aria-hidden="true" />
      <span className="hero-corner hero-corner-tr" aria-hidden="true" />
      <span className="hero-corner hero-corner-bl" aria-hidden="true" />

      <div className="hero hero-centered">

        {/* 1 — Eyebrow */}
        <div className="hero-eyebrow hero-entry hero-entry-1">
          <ShieldCheck size={13} />
          Interactive Experiment
        </div>

        {/* 2 — Headline */}
        <h1 className="hero-entry hero-entry-2">
          Can a website remember you inside a{' '}
          <em>Private</em> Window?
        </h1>

        {/* 3 — Subtitle */}
        <p className="hero-sub hero-entry hero-entry-3">
          A 30-second interactive experiment.
        </p>

        {/* 4 — CTAs */}
        <div className="heroActions hero-entry hero-entry-4">
          <button id="cta-start" className="primary btn-hero-start" onClick={onStart}>
            <MousePointerClick size={16} /> Start Experiment
          </button>
          <button id="cta-explain" className="secondary" onClick={onExplain}>
            How does this work?
          </button>
        </div>

        {/* 5 — Curiosity hook */}
        <p className="hero-curiosity hero-entry hero-entry-5" aria-hidden="true">
          Most people expect the website to forget them.
        </p>

        {/* 6 — Animated teaser diagram */}
        <div className="hero-flow-diagram hero-entry hero-entry-6" aria-hidden="true">
          <div className="hfd-node hfd-normal">
            <Monitor />
            <span>Normal window</span>
          </div>
          <div className="hfd-connector">
            <div className="hfd-line" />
            <div className="hfd-traveling-dot" />
          </div>
          <div className="hfd-node hfd-server">
            <ServerIcon />
            <span>Website</span>
          </div>
          <div className="hfd-connector">
            <div className="hfd-line" />
            <div className="hfd-traveling-dot hfd-dot-delay" />
          </div>
          <div className="hfd-node hfd-private">
            <EyeOff size={16} strokeWidth={2} />
            <span>Private window</span>
          </div>
          <div className="hfd-connector">
            <div className="hfd-line" />
            <div className="hfd-traveling-dot hfd-dot-delay-2" />
          </div>
          <div className="hfd-node hfd-question">
            <span className="hfd-q-mark">?</span>
            <span>What happens?</span>
          </div>
        </div>

        {/* 7 — Scroll hint */}
        <div className="scroll-hint hero-entry hero-entry-7" aria-hidden="true">
          <div className="scroll-bar" />
        </div>

      </div>
    </div>
  );
}

/* Inline micro SVG icons for the flow diagram */
function Monitor() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
function ServerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  );
}

/** SCREEN 1 — Enter name */
function Step1Screen({ onSave, loading }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  }

  return (
    <div className="wizard-screen screen-fade-in">
      <ProgressDots step={1} />

      <div className="wizard-content">
        <div className="badge" style={{ marginBottom: 20 }}>Step 1 of 3</div>
        <h2>What's your name?</h2>
        <p style={{ marginBottom: 24, color: 'var(--ink-muted)' }}>
          Pick any display name. It will be saved on the server.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            ref={inputRef}
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jeffy"
            maxLength={60}
            autoComplete="off"
            required
          />
          <button
            id="btn-continue"
            className="primary button"
            disabled={loading || !name.trim()}
          >
            {loading ? 'Saving…' : 'Save & Continue'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="wizard-note">
          <Lock size={11} /> Stored for 24 hours only for this demonstration.
        </p>
      </div>
    </div>
  );
}

/** SCREEN 2 — Open in private tab */
function Step2Screen({ onCopy, loading }) {
  return (
    <div className="wizard-screen screen-fade-in">
      <ProgressDots step={2} />

      <div className="wizard-content">
        <div className="badge success" style={{ marginBottom: 20 }}>
          <Eye size={12} /> Name saved
        </div>
        <h2>Now open this site in a Private Window.</h2>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 28 }}>
          Use the same URL. No special link needed.
        </p>

        {/* Browser illustration */}
        <div className="browser-illo-wrap">
          <div className="browser-illo browser-normal">
            <div className="browser-bar">
              <span className="browser-dot" /><span className="browser-dot" /><span className="browser-dot" />
              <span className="browser-url">incognito-buster.pages.dev</span>
            </div>
            <div className="browser-body">
              <span className="browser-label">Normal window</span>
            </div>
          </div>

          <div className="browser-arrow-down">↓</div>

          <div className="browser-illo browser-private">
            <div className="browser-bar browser-bar-private">
              <EyeOff size={12} color="var(--purple)" />
              <span className="browser-url">incognito-buster.pages.dev</span>
            </div>
            <div className="browser-body">
              <span className="browser-label">Private / Incognito window</span>
            </div>
          </div>
        </div>

        <button id="btn-copy-url" className="secondary button" onClick={onCopy} style={{ margin: '24px 0 0' }}>
          <Copy size={14} /> Copy site URL
        </button>

        <div className={`waiting-pulse ${loading ? 'waiting-loading' : ''}`}>
          <span className="waiting-dot" />
          I'll wait…
        </div>
      </div>
    </div>
  );
}

/** SCREEN 3 — Surprise reveal */
function SurpriseScreen({ record, onReveal, onDelete, loading }) {
  return (
    <div className="surprise-wrap screen-fade-in">
      <div className="surprise-inner">
        <div className="surprise-emoji">👀</div>

        <div className="surprise-line surprise-line-1">
          I remember you.
        </div>

        <div className="surprise-line surprise-line-2">
          Welcome back,{' '}
          <span className="surprise-name">{record?.name ?? '…'}</span>
        </div>

        <div className="surprise-line surprise-line-3">
          This information came from my server.
        </div>

        <div className="surprise-server-badge">
          <Server size={13} />
          Server-side recognition — not cookies, not local storage
        </div>

        <button
          id="btn-reveal"
          className="primary surprise-reveal-btn"
          onClick={onReveal}
        >
          Reveal the trick <ChevronRight size={15} />
        </button>

        {record && (
          <button
            className="surprise-delete-link"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={11} /> {loading ? 'Deleting…' : 'Delete my record'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Main App
// ─────────────────────────────────────────────────────────

function App() {
  // ── screen: 'landing' | 'step1' | 'step2' | 'surprise' | (modal on top)
  const [screen, setScreen] = useState('landing');
  const [showExplain, setShowExplain] = useState(false);

  // ── ALL API STATE ─────────────────────────────────────
  const [record, setRecord] = useState(null);
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // ── Check for existing record on mount ───────────────
  useEffect(() => {
    async function checkRecord() {
      setLoading(true);
      try {
        const res = await fetch('/api/whoami', { cache: 'no-store' });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Check failed');
        if (data.found) {
          setFound(true);
          setRecord(data.record);
          // Jump straight to surprise if we already have a record
          setScreen('surprise');
        }
      } catch (err) {
        setStatusMsg(err.message || 'Could not check the demo record.');
      } finally {
        setLoading(false);
      }
    }
    checkRecord();
  }, []);

  // ── Save name ─────────────────────────────────────────
  async function saveName(name) {
    setLoading(true);
    setStatusMsg('Saving your name on the server…');
    try {
      const res = await fetch('/api/save-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, consent: true }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Save failed');
      setRecord(data.record);
      setFound(true);
      setStatusMsg('Saved. Open this same website in a private window.');
      setScreen('step2');
    } catch (err) {
      setStatusMsg(err.message || 'Could not save the demo identity.');
    } finally {
      setLoading(false);
    }
  }

  // ── Delete record ─────────────────────────────────────
  async function deleteRecord() {
    setLoading(true);
    try {
      const res = await fetch('/api/delete-demo', { method: 'POST' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Delete failed');
      setRecord(null);
      setFound(false);
      setShowExplain(false);
      setScreen('landing');
    } catch (err) {
      setStatusMsg(err.message || 'Could not delete the demo record.');
    } finally {
      setLoading(false);
    }
  }

  // ── Copy URL ──────────────────────────────────────────
  function copyUrl() {
    navigator.clipboard?.writeText(window.location.origin);
    setStatusMsg('URL copied! Paste it into a private window.');
  }

  // ─────────────────────────────────────────────────────
  return (
    <div className="site-frame">

      {/* ── Explanation Modal (layered over any screen) ── */}
      {showExplain && (
        <ExplainModal
          onClose={() => setShowExplain(false)}
          onDelete={deleteRecord}
          record={record}
        />
      )}

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="topnav">
        <button
          className="topnav-brand nav-brand-btn"
          onClick={() => setScreen('landing')}
          aria-label="Go to home"
        >
          <ShieldCheck size={20} />
          INCOGNITO BUSTER
        </button>
        <div className="topnav-badge">
          <Globe size={13} />
          Interactive Demo
        </div>
      </nav>

      {/* ── Main content area ────────────────────────────── */}
      <main className="wizard-main">

        {screen === 'landing' && (
          <LandingScreen
            onStart={() => {
              // If already has a record, go straight to surprise
              if (found && record) { setScreen('surprise'); return; }
              setScreen('step1');
            }}
            onExplain={() => setShowExplain(true)}
          />
        )}

        {screen === 'step1' && (
          <Step1Screen onSave={saveName} loading={loading} />
        )}

        {screen === 'step2' && (
          <Step2Screen onCopy={copyUrl} loading={loading} />
        )}

        {screen === 'surprise' && (
          <SurpriseScreen
            record={record}
            onReveal={() => setShowExplain(true)}
            onDelete={deleteRecord}
            loading={loading}
          />
        )}

        {/* Status message — subtle, appears on all wizard screens except landing */}
        {statusMsg && screen !== 'landing' && (
          <div className="global-status">{statusMsg}</div>
        )}

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer>
        <div className="footer-inner">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Incognito Buster &mdash; Educational cybersecurity demo.
          </p>
          <div className="footer-links">
            <a href="https://github.com/Jeffersonben/incognito-buster" target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> GitHub
            </a>
            <a href="https://lk.linkedin.com/in/jeyakulendran-jefferson-benjamin-05589a336" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
