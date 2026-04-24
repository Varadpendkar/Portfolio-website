import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const pipelineNodes = [
  {
    id: "input",
    label: "Data Input",
    color: "#00D9FF",
    detail: "CSV • Databases • APIs • Images",
    projectFilter: "All",
  },
  {
    id: "prep",
    label: "Preprocessing",
    color: "#FF6B35",
    detail: "Cleaning, normalization, missing value handling",
    projectFilter: "ML/DL",
  },
  {
    id: "feature",
    label: "Feature Engineering",
    color: "#FFB800",
    detail: "TF-IDF, embeddings, statistical transforms",
    projectFilter: "NLP",
  },
  {
    id: "model",
    label: "Model Training",
    color: "#9D4EDD",
    detail: "Gradient updates, tuning, evaluation cycles",
    projectFilter: "MLOps",
  },
  {
    id: "output",
    label: "Predictions",
    color: "#00E676",
    detail: "Confidence scores and explainable outputs",
    projectFilter: "Web Apps",
  },
];

const MLPipeline = ({ onSelect }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [metric, setMetric] = useState({ epoch: 1, loss: 0.52, accuracy: 84 });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetric((prev) => {
        const nextEpoch = prev.epoch >= 100 ? 1 : prev.epoch + 1;
        const nextLoss = Math.max(0.09, +(prev.loss - 0.004).toFixed(3));
        const nextAcc = Math.min(
          98,
          prev.accuracy + (nextEpoch % 5 === 0 ? 1 : 0),
        );

        return {
          epoch: nextEpoch,
          loss: nextEpoch === 1 ? 0.52 : nextLoss,
          accuracy: nextEpoch === 1 ? 84 : nextAcc,
        };
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: `p-${index}`,
        delay: index * 0.2,
      })),
    [],
  );

  return (
    <div className="pipeline-shell" role="presentation">
      <div className="pipeline-track">
        {pipelineNodes.map((node, index) => (
          <div key={node.id} className="pipeline-step-wrap">
            <button
              className="pipeline-step"
              style={{ "--node-color": node.color }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => onSelect(node.projectFilter)}
              aria-label={`${node.label}: ${node.detail}`}
            >
              <span className="pipeline-step-label">{node.label}</span>
              {hoveredNode === node.id && (
                <span className="pipeline-tooltip">{node.detail}</span>
              )}
            </button>

            {index < pipelineNodes.length - 1 && (
              <div className="pipeline-connector" aria-hidden>
                <motion.span
                  className="pipeline-dot"
                  animate={{ x: [0, 62] }}
                  transition={{
                    duration: 1.2,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0.25,
                    delay: index * 0.18,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pipeline-metrics glass-morphism">
        <p>Epoch {metric.epoch}/100</p>
        <p>Loss: {metric.loss}</p>
        <p>Accuracy: {metric.accuracy}%</p>
      </div>

      <div className="pipeline-particles" aria-hidden>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="data-particle"
            animate={{ x: [0, 260], opacity: [0, 1, 0] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MLPipeline;
