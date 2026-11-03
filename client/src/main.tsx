import ReactDOM from 'react-dom/client'
import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>,
);
