import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import './styles.css';

export function renderApp(rootElement = document.getElementById('root')) {
  if (!rootElement) return;
  createRoot(rootElement).render(<App />);
}

renderApp();
