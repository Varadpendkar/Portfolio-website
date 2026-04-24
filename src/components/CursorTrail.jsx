import { useEffect, useState } from "react";

const CursorTrail = () => {
  const [trail, setTrail] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setEnabled(media.matches);

    const onChange = (event) => setEnabled(event.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    let rafId = null;

    const onMove = (event) => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        setTrail((prev) => {
          const next = [
            {
              x: event.clientX,
              y: event.clientY,
              id: `${event.clientX}-${event.clientY}-${Date.now()}`,
            },
            ...prev,
          ];
          return next.slice(0, 12);
        });
        rafId = null;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor-trail" aria-hidden>
      {trail.map((point, index) => (
        <span
          key={point.id}
          className="cursor-dot"
          style={{
            left: point.x,
            top: point.y,
            opacity: Math.max(0.12, 1 - index * 0.12),
            transform: `translate(-50%, -50%) scale(${1 - index * 0.05})`,
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;
