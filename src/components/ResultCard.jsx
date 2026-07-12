import React from 'react';
import { Eye, Trash2 } from './Icons.jsx';
import { Detail } from './SmallPieces.jsx';

export function ResultCard({ found, record, deleteRecord }) {
  if (!found || !record) return null;

  return <section className="result">
    <div>
      <div className="badge success"><Eye size={18}/> Server record found</div>
      <h2>Welcome back, {record.name}</h2>
      <p>This name came from server-side storage, not from cookies, local storage, or browser history.</p>
    </div>
    <div className="details">
      <Detail label="Name saved" value={record.name} />
      <Detail label="Browser" value={record.browser} />
      <Detail label="Device" value={record.device} />
      <Detail label="Saved at" value={new Date(record.savedAt).toLocaleString()} />
      <Detail label="Storage method" value={record.method} />
      <Detail label="Expiry" value={record.expiresIn} />
    </div>
    <button onClick={deleteRecord} className="danger"><Trash2 size={18}/> Delete my demo record</button>
  </section>;
}
