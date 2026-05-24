import { useRef, useState, useEffect, useCallback } from 'react';
import Globe from 'react-globe.gl';

const COUNTRIES_URL =
  'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

export default function GlobeView({ onCountrySelect, selectedCode }) {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    fetch(COUNTRIES_URL)
      .then(r => r.json())
      .then(d => setCountries(d.features));
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current && countries.length) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.3;
    }
  }, [countries]);

  const getColor = useCallback(
    d => {
      if (d.properties.ADM0_A3 === selectedCode) return 'rgba(255, 165, 0, 0.65)';
      if (d === hovered) return 'rgba(100, 210, 255, 0.45)';
      return 'rgba(100, 180, 255, 0.07)';
    },
    [hovered, selectedCode]
  );

  const handleClick = useCallback(
    polygon => {
      if (!polygon) return;
      const { ADMIN, ADM0_A3 } = polygon.properties;
      onCountrySelect({ name: ADMIN, code: ADM0_A3 });
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false;
      }
    },
    [onCountrySelect]
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#3a86ff"
        atmosphereAltitude={0.15}
        polygonsData={countries}
        polygonCapColor={getColor}
        polygonSideColor={() => 'rgba(100, 180, 255, 0.04)'}
        polygonStrokeColor={() => 'rgba(150, 210, 255, 0.35)'}
        polygonLabel={({ properties: p }) =>
          `<div style="background:rgba(0,0,0,0.75);padding:4px 10px;border-radius:6px;font-size:13px;color:#fff;font-family:system-ui">${p.ADMIN}</div>`
        }
        onPolygonHover={setHovered}
        onPolygonClick={handleClick}
        polygonsTransitionDuration={200}
      />
    </div>
  );
}
