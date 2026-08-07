import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './responsive.css';
import { applyPerformanceMode } from './utils/performance';

const rootElement = document.getElementById('root') as HTMLElement;

// Set the rendering tier before the first paint so low-power devices never
// briefly initialize the expensive version of the experience.
applyPerformanceMode();

if (!rootElement.getAttribute('data-root-mounted')) {
  rootElement.setAttribute('data-root-mounted', 'true');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
