import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SPACE_BG = "#050d1a";
const FILTERS = ["All", "ML/DL", "NLP", "CV", "Data", "Deploy", "Web", "Tools"];

const CATEGORY_COLORS = {
  "ML/DL": "#4a9eff",
  NLP: "#b07eff",
  CV: "#ff7e4a",
  Data: "#4affb0",
  Deploy: "#ffe44a",
  Web: "#ff4a7e",
  Tools: "#aaffee",
};

const RAW_SKILLS = [
  {
    name: "Python",
    category: "ML/DL",
    proficiency: 5,
    projects: 12,
    baseX: 0.5,
    baseY: 0.42,
    depth: 0.9,
  },
  {
    name: "TensorFlow",
    category: "ML/DL",
    proficiency: 4,
    projects: 5,
    baseX: 0.38,
    baseY: 0.3,
    depth: 0.7,
  },
  {
    name: "PyTorch",
    category: "ML/DL",
    proficiency: 4,
    projects: 4,
    baseX: 0.62,
    baseY: 0.28,
    depth: 0.7,
  },
  {
    name: "Scikit-learn",
    category: "ML/DL",
    proficiency: 5,
    projects: 7,
    baseX: 0.3,
    baseY: 0.44,
    depth: 0.6,
  },
  {
    name: "Keras",
    category: "ML/DL",
    proficiency: 4,
    projects: 5,
    baseX: 0.55,
    baseY: 0.2,
    depth: 0.5,
  },
  {
    name: "LightGBM",
    category: "ML/DL",
    proficiency: 4,
    projects: 3,
    baseX: 0.42,
    baseY: 0.56,
    depth: 0.8,
  },

  {
    name: "NLTK",
    category: "NLP",
    proficiency: 3,
    projects: 3,
    baseX: 0.22,
    baseY: 0.62,
    depth: 0.4,
  },
  {
    name: "spaCy",
    category: "NLP",
    proficiency: 3,
    projects: 3,
    baseX: 0.14,
    baseY: 0.5,
    depth: 0.5,
  },
  {
    name: "Transformers",
    category: "NLP",
    proficiency: 3,
    projects: 4,
    baseX: 0.18,
    baseY: 0.35,
    depth: 0.6,
  },
  {
    name: "Gemini API",
    category: "NLP",
    proficiency: 4,
    projects: 2,
    baseX: 0.1,
    baseY: 0.22,
    depth: 0.3,
  },
  {
    name: "Mistral LLM",
    category: "NLP",
    proficiency: 3,
    projects: 1,
    baseX: 0.26,
    baseY: 0.2,
    depth: 0.4,
  },

  {
    name: "OpenCV",
    category: "CV",
    proficiency: 4,
    projects: 4,
    baseX: 0.75,
    baseY: 0.52,
    depth: 0.7,
  },
  {
    name: "YOLO",
    category: "CV",
    proficiency: 3,
    projects: 2,
    baseX: 0.85,
    baseY: 0.38,
    depth: 0.5,
  },
  {
    name: "Pillow",
    category: "CV",
    proficiency: 3,
    projects: 3,
    baseX: 0.82,
    baseY: 0.62,
    depth: 0.4,
  },

  {
    name: "Pandas",
    category: "Data",
    proficiency: 5,
    projects: 10,
    baseX: 0.36,
    baseY: 0.7,
    depth: 0.8,
  },
  {
    name: "NumPy",
    category: "Data",
    proficiency: 5,
    projects: 10,
    baseX: 0.5,
    baseY: 0.76,
    depth: 0.9,
  },
  {
    name: "Matplotlib",
    category: "Data",
    proficiency: 4,
    projects: 7,
    baseX: 0.24,
    baseY: 0.8,
    depth: 0.6,
  },
  {
    name: "Seaborn",
    category: "Data",
    proficiency: 4,
    projects: 5,
    baseX: 0.62,
    baseY: 0.72,
    depth: 0.5,
  },

  {
    name: "Flask",
    category: "Deploy",
    proficiency: 4,
    projects: 3,
    baseX: 0.76,
    baseY: 0.78,
    depth: 0.7,
  },
  {
    name: "Gradio",
    category: "Deploy",
    proficiency: 4,
    projects: 3,
    baseX: 0.88,
    baseY: 0.72,
    depth: 0.5,
  },
  {
    name: "Streamlit",
    category: "Deploy",
    proficiency: 4,
    projects: 4,
    baseX: 0.88,
    baseY: 0.56,
    depth: 0.6,
  },
  {
    name: "Docker",
    category: "Deploy",
    proficiency: 3,
    projects: 2,
    baseX: 0.9,
    baseY: 0.2,
    depth: 0.4,
  },
  {
    name: "AWS",
    category: "Deploy",
    proficiency: 2,
    projects: 1,
    baseX: 0.92,
    baseY: 0.34,
    depth: 0.3,
  },

  {
    name: "React",
    category: "Web",
    proficiency: 3,
    projects: 3,
    baseX: 0.68,
    baseY: 0.14,
    depth: 0.5,
  },
  {
    name: "HTML/CSS",
    category: "Web",
    proficiency: 4,
    projects: 5,
    baseX: 0.56,
    baseY: 0.08,
    depth: 0.4,
  },
  {
    name: "Tailwind",
    category: "Web",
    proficiency: 3,
    projects: 2,
    baseX: 0.76,
    baseY: 0.1,
    depth: 0.3,
  },

  {
    name: "Git",
    category: "Tools",
    proficiency: 5,
    projects: 15,
    baseX: 0.42,
    baseY: 0.14,
    depth: 0.7,
  },
  {
    name: "Jupyter",
    category: "Tools",
    proficiency: 5,
    projects: 12,
    baseX: 0.3,
    baseY: 0.1,
    depth: 0.6,
  },
  {
    name: "SQL",
    category: "Tools",
    proficiency: 4,
    projects: 4,
    baseX: 0.16,
    baseY: 0.72,
    depth: 0.5,
  },
];

const SKILLS = RAW_SKILLS.map((skill, id) => ({
  id,
  ...skill,
  color: CATEGORY_COLORS[skill.category],
  twinkleOffset: Math.random() * Math.PI * 2,
}));

const EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 4],
  [2, 4],
  [3, 5],
  [6, 7],
  [6, 8],
  [7, 8],
  [8, 9],
  [8, 10],
  [11, 12],
  [11, 13],
  [14, 15],
  [14, 16],
  [14, 17],
  [15, 16],
  [15, 17],
  [18, 19],
  [18, 20],
  [19, 20],
  [21, 22],
  [23, 24],
  [23, 25],
  [24, 25],
  [26, 27],
  [0, 14],
  [0, 15],
  [0, 26],
  [3, 14],
  [14, 15],
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

const hexToRgba = (hex, alpha) => {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const drawStar = (ctx, x, y, outerR, innerR, points = 4) => {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
};

const SkillConstellation = () => {
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);

  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const bgStarsRef = useRef([]);

  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const hoveredIdRef = useRef(null);
  const activeFilterRef = useRef("All");
  const isMobileRef = useRef(false);

  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState(null);

  activeFilterRef.current = activeFilter;

  const legendCategories = useMemo(
    () => FILTERS.filter((item) => item !== "All"),
    [],
  );

  const getFilterColor = useCallback((filter) => {
    if (filter === "All") return "#ffffff";
    return CATEGORY_COLORS[filter] || "#ffffff";
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = canvasWrapperRef.current;
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const width = rect.width;
    const isMobile = window.innerWidth < 768;
    const height = isMobile ? 400 : 600;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    sizeRef.current = { width, height, dpr };
    isMobileRef.current = isMobile;

    const starCount = isMobile ? 60 : 120;
    bgStarsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.2 + Math.random() * 0.8,
      opacity: 0.05 + Math.random() * 0.1,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const computeRenderPosition = useCallback((skill, width, height, offset) => {
    const baseX = skill.baseX * width;
    const baseY = skill.baseY * height;

    return {
      x: baseX + offset.x * skill.depth * 28,
      y: baseY + offset.y * skill.depth * 28,
    };
  }, []);

  const updateTooltipPosition = useCallback((x, y) => {
    const tooltipEl = tooltipRef.current;
    const { width, height } = sizeRef.current;
    if (!tooltipEl || width === 0 || height === 0) return;

    const left = clamp(x + 16, 0, Math.max(0, width - 200));
    const top = clamp(y - 60, 0, Math.max(0, height - 120));

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
  }, []);

  const handlePointerMove = useCallback(
    (localX, localY) => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;

      const centerX = width / 2;
      const centerY = height / 2;

      if (!isMobileRef.current) {
        targetOffsetRef.current.x = clamp((localX - centerX) / centerX, -1, 1);
        targetOffsetRef.current.y = clamp((localY - centerY) / centerY, -1, 1);
      }

      const currentFilter = activeFilterRef.current;
      let nearest = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      SKILLS.forEach((skill) => {
        const visible =
          currentFilter === "All" || skill.category === currentFilter;
        if (!visible) return;

        const position = computeRenderPosition(
          skill,
          width,
          height,
          currentOffsetRef.current,
        );
        const outerR = 3 + skill.proficiency * 1.8;
        const distance = Math.hypot(localX - position.x, localY - position.y);
        const threshold = Math.max(outerR + 12, 20);

        if (distance < threshold && distance < nearestDistance) {
          nearest = skill;
          nearestDistance = distance;
        }
      });

      const nextHoveredId = nearest ? nearest.id : null;
      if (hoveredIdRef.current !== nextHoveredId) {
        hoveredIdRef.current = nextHoveredId;
        setHoveredSkill(nearest);
      }

      if (nearest) {
        updateTooltipPosition(localX, localY);
      }
    },
    [computeRenderPosition, updateTooltipPosition],
  );

  const onMouseMove = useCallback(
    (event) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      handlePointerMove(localX, localY);
    },
    [handlePointerMove],
  );

  const onTouchMove = useCallback(
    (event) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || event.touches.length === 0) return;

      const touch = event.touches[0];
      const localX = touch.clientX - rect.left;
      const localY = touch.clientY - rect.top;
      handlePointerMove(localX, localY);
    },
    [handlePointerMove],
  );

  const onPointerLeave = useCallback(() => {
    hoveredIdRef.current = null;
    setHoveredSkill(null);
    targetOffsetRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    resizeCanvas();

    const observer = new ResizeObserver(() => resizeCanvas());
    if (canvasWrapperRef.current) {
      observer.observe(canvasWrapperRef.current);
    }

    return () => observer.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    if (
      hoveredSkill &&
      activeFilter !== "All" &&
      hoveredSkill.category !== activeFilter
    ) {
      hoveredIdRef.current = null;
      setHoveredSkill(null);
    }
  }, [activeFilter, hoveredSkill]);

  useEffect(() => {
    let startTime = performance.now();

    const loop = (now) => {
      const ctx = ctxRef.current;
      const { width, height } = sizeRef.current;
      if (!ctx || width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const t = now - startTime;
      const isMobile = isMobileRef.current;

      if (isMobile) {
        targetOffsetRef.current.x = Math.sin(t * 0.0003) * 0.3;
        targetOffsetRef.current.y = Math.cos(t * 0.0004) * 0.3;
      }

      currentOffsetRef.current.x = lerp(
        currentOffsetRef.current.x,
        targetOffsetRef.current.x,
        0.06,
      );
      currentOffsetRef.current.y = lerp(
        currentOffsetRef.current.y,
        targetOffsetRef.current.y,
        0.06,
      );

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = SPACE_BG;
      ctx.fillRect(0, 0, width, height);

      // 1) Ambient stars
      bgStarsRef.current.forEach((star) => {
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.001 + star.twinkleOffset);
        ctx.globalAlpha = star.opacity * pulse;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const filter = activeFilterRef.current;
      const renderData = SKILLS.map((skill) => {
        const visible = filter === "All" || skill.category === filter;
        const position = computeRenderPosition(
          skill,
          width,
          height,
          currentOffsetRef.current,
        );
        return {
          ...skill,
          visible,
          renderX: position.x,
          renderY: position.y,
          outerBase: 3 + skill.proficiency * 1.8,
        };
      });

      const visibleCount = renderData.filter((item) => item.visible).length;

      // 2) Edges
      EDGES.forEach(([aIndex, bIndex]) => {
        const a = renderData[aIndex];
        const b = renderData[bIndex];
        if (!a?.visible || !b?.visible) return;

        const highlighted =
          hoveredIdRef.current === a.id || hoveredIdRef.current === b.id;
        const opacity = highlighted ? 0.7 : 0.18;

        const gradient = ctx.createLinearGradient(
          a.renderX,
          a.renderY,
          b.renderX,
          b.renderY,
        );
        gradient.addColorStop(0, hexToRgba(a.color, opacity));
        gradient.addColorStop(1, hexToRgba(b.color, opacity));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = highlighted ? 1.2 : 0.5;
        ctx.beginPath();
        ctx.moveTo(a.renderX, a.renderY);
        ctx.lineTo(b.renderX, b.renderY);
        ctx.stroke();
      });

      // 3) Glow halos
      renderData.forEach((skill) => {
        if (!skill.visible) return;

        const hovered = hoveredIdRef.current === skill.id;
        const twinkleScale =
          1 + 0.06 * Math.sin(t * 0.002 + skill.twinkleOffset);
        const outerR = skill.outerBase * twinkleScale;
        const haloRadius = outerR * (hovered ? 4 : 2.5);

        const gradient = ctx.createRadialGradient(
          skill.renderX,
          skill.renderY,
          0,
          skill.renderX,
          skill.renderY,
          haloRadius,
        );
        gradient.addColorStop(0, hexToRgba(skill.color, hovered ? 0.35 : 0.27));
        gradient.addColorStop(1, hexToRgba(skill.color, 0));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(skill.renderX, skill.renderY, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4) Star bodies
      renderData.forEach((skill) => {
        const hovered = hoveredIdRef.current === skill.id;
        const twinkleScale =
          1 + 0.06 * Math.sin(t * 0.002 + skill.twinkleOffset);
        const outerR = skill.outerBase * twinkleScale;
        const innerR = outerR * 0.38;
        const rotation = t * 0.0004 + skill.twinkleOffset;

        const baseShadowBlur = isMobile ? 4 : visibleCount > 5 ? 6 : 9;
        const hoverShadowBlur = isMobile ? 6 : 22;

        ctx.save();
        ctx.translate(skill.renderX, skill.renderY);
        ctx.rotate(rotation);

        ctx.globalAlpha = skill.visible ? 1 : 0.08;
        ctx.fillStyle = skill.color;
        ctx.shadowColor = skill.visible ? skill.color : "transparent";
        ctx.shadowBlur = skill.visible
          ? hovered
            ? hoverShadowBlur
            : baseShadowBlur
          : 0;

        drawStar(ctx, 0, 0, outerR, innerR, 4);
        ctx.fill();
        ctx.restore();
      });

      // 5) Labels
      renderData.forEach((skill) => {
        if (!skill.visible) return;

        const hovered = hoveredIdRef.current === skill.id;
        const twinkleScale =
          1 + 0.06 * Math.sin(t * 0.002 + skill.twinkleOffset);
        const outerR = skill.outerBase * twinkleScale;

        const showLabel = isMobile
          ? skill.proficiency === 5 || hovered
          : skill.proficiency >= 4 || hovered;

        if (!showLabel) return;

        ctx.save();
        ctx.textAlign = "center";
        ctx.font = "500 11px 'JetBrains Mono', monospace";
        ctx.fillStyle = hexToRgba(skill.color, hovered ? 1 : 0.6);
        ctx.shadowColor = skill.color;
        ctx.shadowBlur = hovered ? 10 : 0;
        ctx.fillText(skill.name, skill.renderX, skill.renderY + outerR + 14);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [computeRenderPosition]);

  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3">
          <span
            style={{
              color: "#4a9eff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
              letterSpacing: "0.1em",
            }}
          >
            03. SKILLS
          </span>
        </div>

        <h2
          style={{
            color: "white",
            fontSize: "clamp(28px,4vw,48px)",
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          My Tech Stack
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            marginBottom: "24px",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
          }}
        >
          Hover a star. Each constellation is a skill domain.
        </p>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            const color = getFilterColor(filter);

            return (
              <motion.button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "transparent",
                  border: `0.5px solid ${active ? color : "rgba(255,255,255,0.2)"}`,
                  color: active ? color : "rgba(255,255,255,0.5)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "11px",
                  borderRadius: "20px",
                  padding: "4px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                {filter}
              </motion.button>
            );
          })}
        </div>

        <div
          ref={canvasWrapperRef}
          style={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            border: "0.5px solid rgba(255,255,255,0.08)",
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={onPointerLeave}
          onTouchMove={onTouchMove}
          onTouchEnd={onPointerLeave}
        >
          <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0.16 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 65%)",
              }}
            />
          </AnimatePresence>

          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              pointerEvents: "none",
              opacity: hoveredSkill ? 1 : 0,
              transition: "opacity 0.15s",
              minWidth: "190px",
              maxWidth: "220px",
              background: "rgba(5, 13, 26, 0.92)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              borderLeft: hoveredSkill
                ? `2px solid ${hoveredSkill.color}`
                : "2px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontFamily: "JetBrains Mono, monospace",
              zIndex: 4,
            }}
          >
            {hoveredSkill && (
              <>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    ✦ {hoveredSkill.name}
                  </span>
                  <span
                    style={{
                      background: `${hoveredSkill.color}22`,
                      color: hoveredSkill.color,
                      fontSize: "10px",
                      borderRadius: "999px",
                      padding: "2px 8px",
                    }}
                  >
                    {hoveredSkill.category}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "11px",
                  }}
                >
                  Used in {hoveredSkill.projects} projects
                </p>

                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <span
                      key={`${hoveredSkill.id}-dot-${idx}`}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "999px",
                        background:
                          idx < hoveredSkill.proficiency
                            ? hoveredSkill.color
                            : "rgba(255,255,255,0.16)",
                        boxShadow:
                          idx < hoveredSkill.proficiency
                            ? `0 0 8px ${hexToRgba(hoveredSkill.color, 0.6)}`
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {legendCategories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: CATEGORY_COLORS[category],
                }}
              />
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "11px",
                }}
              >
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillConstellation;
