import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { MetricSubpage } from './pages/MetricSubpage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/metric/:metricId" element={<MetricSubpage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
