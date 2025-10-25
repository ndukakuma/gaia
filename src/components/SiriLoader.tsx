"use client";

export default function SiriLoader() {
  return (
    <div className="siri-loader" role="status" aria-label="Loading companion">
      <div className="siri-wave">
        <span />
        <span />
        <span />
      </div>
      <div className="siri-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="siri-dot" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </div>
  );
}
