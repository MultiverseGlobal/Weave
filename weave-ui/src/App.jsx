import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sequencer from './pages/Sequencer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sequencer/:playlistId" element={<Sequencer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
