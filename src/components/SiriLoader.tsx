'use client';

export default function SiriLoader() {
  return (
    <div className="siri-loader" role="status" aria-label="Loading companion">
      <div className="siri-blob">
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>
      <div className="siri-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="siri-dot" />
        ))}
      </div>
    </div>
  );
}
