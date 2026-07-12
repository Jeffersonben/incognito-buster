import React from 'react';
import { Step } from './SmallPieces.jsx';

export function DemoForm({ name, setName, consent, setConsent, loading, message, saveName }) {
  return <section className="card" id="demo">
    <h2>Try it in 3 steps</h2>
    <div className="steps">
      <Step number="1" title="Save your name in normal tab">Type any display name below and click save.</Step>
      <Step number="2" title="Open private/incognito tab">Open a private window in your browser.</Step>
      <Step number="3" title="Visit the same website URL">Do not use a special link. Just open this same site address again.</Step>
    </div>
    <form onSubmit={saveName} className="form">
      <label>Your demo display name</label>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Example: Paul" maxLength="60" />
      <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> I understand this is an educational demo and my chosen name will be stored temporarily for 24 hours.</label>
      <button className="primary button" disabled={loading}>{loading ? 'Working...' : 'Save demo identity'}</button>
    </form>
    <div className="status">{message}</div>
  </section>;
}
