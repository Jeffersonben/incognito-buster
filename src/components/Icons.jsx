import React from 'react';

function EmojiIcon({ symbol, size = 18 }) {
  return <span className="icon" aria-hidden="true" style={{ fontSize: `${size}px` }}>{symbol}</span>;
}

export const ShieldCheck = (props) => <EmojiIcon symbol="🛡️" {...props} />;
export const Copy = (props) => <EmojiIcon symbol="📋" {...props} />;
export const MousePointerClick = (props) => <EmojiIcon symbol="👆" {...props} />;
export const Eye = (props) => <EmojiIcon symbol="👁️" {...props} />;
export const Trash2 = (props) => <EmojiIcon symbol="🗑️" {...props} />;
export const AlertTriangle = (props) => <EmojiIcon symbol="⚠️" {...props} />;
export const CheckCircle2 = (props) => <EmojiIcon symbol="✅" {...props} />;
export const Database = (props) => <EmojiIcon symbol="🗄️" {...props} />;
export const Globe = (props) => <EmojiIcon symbol="🌐" {...props} />;
export const Info = (props) => <EmojiIcon symbol="ℹ️" {...props} />;
export const Lock = (props) => <EmojiIcon symbol="🔒" {...props} />;
export const Server = (props) => <EmojiIcon symbol="🖥️" {...props} />;
