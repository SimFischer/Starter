import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts are bundled locally – no external network requests at runtime.
import '@fontsource-variable/lexend';
import '@fontsource-variable/bricolage-grotesque';
import './styles/global.css';
import { App } from './app/App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
