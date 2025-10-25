"use client";

export default function SiriLoader() {
  return (
    <div className="siri-loader" role="status" aria-label="Loading companion">
      <div className="siri-core">
        <span className="siri-arc arc-one" />
        <span className="siri-arc arc-two" />
        <span className="siri-arc arc-three" />
        <span className="siri-glow" />
      </div>
      <div className="siri-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="siri-dot" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </div>
  );
}
