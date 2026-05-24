import ReactMarkdown from 'react-markdown';
import './GeopoliticsPanel.css';

export default function GeopoliticsPanel({ country, data, loading, error, onClose }) {
  if (!country) return null;

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-country">{country.name}</h2>
          <span className="panel-badge">Geopolitical Briefing</span>
        </div>
        <button className="panel-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>

      <div className="panel-body">
        {loading && (
          <div className="panel-loading">
            <div className="spinner" />
            <p>Analyzing geopolitical situation...</p>
          </div>
        )}

        {error && !loading && (
          <div className="panel-error">
            <p>&#9888; {error}</p>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="panel-analysis">
              <ReactMarkdown>{data.analysis}</ReactMarkdown>
            </div>

            {data.sources?.length > 0 && (
              <div className="panel-sources">
                <h4>Sources</h4>
                {data.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" className="source-link">
                    {s.title}
                  </a>
                ))}
              </div>
            )}

            <div className="panel-updated">
              Last updated:{' '}
              {new Date(data.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
