import { useEffect, useRef, useState } from 'react';

const AUTO_ADVANCE_MS = 5600;
const INTERACTION_PAUSE_MS = 7200;
const IMAGE_BASE = '/images/services/web-development';

const STAGE_IMAGES = [
  {
    src: `${IMAGE_BASE}/image1.jpeg`,
    alt: 'Discovery stage project reference screenshot',
  },
  {
    src: `${IMAGE_BASE}/image2.jpeg`,
    alt: 'Design stage website interface screenshot',
  },
  {
    columns: [
      {
        src: `${IMAGE_BASE}/image3.1.png`,
        alt: 'Development stage code screenshot',
      },
      {
        src: `${IMAGE_BASE}/image3.2.png`,
        alt: 'Development stage website screenshot',
      },
    ],
  },
  {
    src: `${IMAGE_BASE}/image4.jpeg`,
    alt: 'Testing and review stage screenshot',
  },
  {
    src: `${IMAGE_BASE}/image3.2.png`,
    alt: 'Launched website screenshot',
    final: true,
  },
];

const PRELOAD_IMAGES = [...new Set([
  STAGE_IMAGES[0].src,
  STAGE_IMAGES[1].src,
  ...STAGE_IMAGES[2].columns.map((image) => image.src),
  STAGE_IMAGES[3].src,
  STAGE_IMAGES[4].src,
])];

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function StageVisual({ index }) {
  const visual = STAGE_IMAGES[index] ?? STAGE_IMAGES[0];

  if (visual.columns) {
    return (
      <div className="web-screenshot-pair">
        {visual.columns.map((image) => (
          <figure className="web-screenshot-card" key={image.src}>
            <img src={image.src} alt={image.alt} loading="eager" decoding="sync" fetchPriority="high" />
          </figure>
        ))}
      </div>
    );
  }

  return (
    <figure className={`web-screenshot-card${visual.final ? ' web-screenshot-card--final' : ''}`}>
      <img src={visual.src} alt={visual.alt} loading="eager" decoding="sync" fetchPriority="high" />
    </figure>
  );
}

export default function WebsiteBuildProcess({ steps }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimer = useRef(null);
  const reducedMotion = useReducedMotion();
  const activeStep = steps[activeIndex];
  const shouldPause = reducedMotion || isHovering || isInteracting;

  useEffect(() => {
    if (shouldPause) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [shouldPause, steps.length]);

  useEffect(() => () => {
    if (interactionTimer.current) {
      window.clearTimeout(interactionTimer.current);
    }
  }, []);

  const pauseAfterInteraction = () => {
    setIsInteracting(true);

    if (interactionTimer.current) {
      window.clearTimeout(interactionTimer.current);
    }

    interactionTimer.current = window.setTimeout(() => {
      setIsInteracting(false);
    }, INTERACTION_PAUSE_MS);
  };

  const selectStage = (index) => {
    setActiveIndex(index);
    pauseAfterInteraction();
  };

  return (
    <section
      className="web-process reveal"
      aria-labelledby="web-process-title"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
    >
      <div className="sp-inner">
        <div className="web-process-head">
          <div className="sp-label">FROM IDEA TO LAUNCH</div>
          <h2 className="sp-subtitle" id="web-process-title">How We Build Your Website</h2>
          <p>A clear, collaborative process that turns your vision into a high-performing digital experience.</p>
        </div>

        <div className="web-stage-preloads" aria-hidden="true">
          {PRELOAD_IMAGES.map((src) => (
            <img src={src} alt="" loading="eager" decoding="async" key={src} />
          ))}
        </div>

        <div className="web-workspace" aria-live="polite">
          <div className="web-workspace-top">
            <div>
              <span className="web-stage-kicker">Stage {activeStep.number}</span>
              <h3>{activeStep.workspaceTitle}</h3>
              <p>{activeStep.description}</p>
            </div>
          </div>

          <div className="web-canvas" key={activeStep.number}>
            <div className="web-stage web-screenshot-stage">
              <StageVisual index={activeIndex} />
            </div>
          </div>
        </div>

        <ol className="web-stage-nav" aria-label="Website build stages">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const isComplete = index < activeIndex;
            return (
              <li className={`web-stage-nav-item${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`} key={step.number}>
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => selectStage(index)}
                >
                  <span className="web-stage-dot">{step.number}</span>
                  <span className="web-stage-copy">
                    <strong>{step.title}</strong>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
