import React from 'react';

export function Detail({ label, value }) {
  return <div className="detail"><span>{label}</span><strong>{value}</strong></div>;
}

export function Step({ number, title, children }) {
  return <div className="step"><div className="stepNo">{number}</div><div><h3>{title}</h3><p>{children}</p></div></div>;
}

export function StorageRow({ name, status, ok }) {
  return <div className="storageRow"><span>{name}</span><strong className={ok ? 'yes' : 'no'}>{status}</strong></div>;
}
