import { useState, useCallback } from 'react';
import GlobeView from './components/Globe';
import GeopoliticsPanel from './components/GeopoliticsPanel';
import './App.css';

const API_BASE = 'http://localhost:3001/api';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCountrySelect = useCallback(async (country) => {
    setSelected(country);
    setData(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/geopolitics/${country.code}?countryName=${encodeURIComponent(country.name)}`
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch data');
      }
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setData(null);
    setError(null);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="header-icon">&#127758;</span>
          <span>GeoScope</span>
        </div>
        <p className="header-sub">Click any country to explore its geopolitical situation</p>
      </header>
      <GlobeView onCountrySelect={handleCountrySelect} selectedCode={selected?.code} />
      <GeopoliticsPanel
        country={selected}
        data={data}
        loading={loading}
        error={error}
        onClose={handleClose}
      />
    </div>
  );
}
