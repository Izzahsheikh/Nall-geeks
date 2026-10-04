import { useEffect, useRef, useState } from 'react';

const AUTO_ADVANCE_MS = 5600;
const INTERACTION_PAUSE_MS = 7200;

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

function DiscoveryStage() {
  return (
    <div className="web-stage web-stage--discovery">
      <div className="web-notes-panel">
        <div className="web-mini-label">Project brief</div>
        <div className="web-brief-title">NallGeeks website build</div>
        <div className="web-brief-row wide" />
        <div className="web-brief-row" />
        <div className="web-brief-row short" />
      </div>
      <div className="web-goals-panel">
        <div className="web-mini-label">Business goals</div>
        {['Increase qualified leads', 'Clarify service value', 'Improve mobile journey'].map((goal) => (
          <div className="web-goal-item" key={goal}>
            <span aria-hidden="true" />
            {goal}
          </div>
        ))}
      </div>
      <div className="web-moodboard">
        <div className="web-mood-img" />
        <div className="web-mood-stack">
          <span className="ink" />
          <span className="orange" />
          <span className="cream" />
        </div>
        <div className="web-type-sample">Aa</div>
      </div>
      <span className="web-cursor" aria-hidden="true" />
    </div>
  );
}

function DesignStage() {
  return (
    <div className="web-stage web-stage--design">
      <div className="web-design-board">
        <div className="web-wireframe">
          <span className="wf-nav" />
          <span className="wf-hero" />
          <span className="wf-copy one" />
          <span className="wf-copy two" />
          <span className="wf-card a" />
          <span className="wf-card b" />
          <span className="wf-card c" />
        </div>
        <div className="web-polished-preview">
          <div className="web-preview-nav">
            <span>NallGeeks</span>
            <i />
          </div>
          <div className="web-preview-hero">
            <small>Web Development</small>
            <strong>Fast websites for growing teams</strong>
            <button type="button" tabIndex={-1}>Start a project</button>
          </div>
          <div className="web-preview-cards">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

function DevelopmentStage() {
  const codeLines = [
    '<Hero title="Web Development" />',
    '<Services items={strategy} />',
    '<ProjectGrid data={caseStudies} />',
    'deploy({ performance: "fast" })',
  ];

  return (
    <div className="web-stage web-stage--development">
      <div className="web-code-window">
        <div className="web-window-dots" aria-hidden="true"><span /><span /><span /></div>
        {codeLines.map((line, index) => (
          <div className="web-code-line" style={{ '--line-index': index }} key={line}>
            <span className="web-line-num">{String(index + 1).padStart(2, '0')}</span>
            <code>{line}</code>
          </div>
        ))}
      </div>
      <div className="web-live-preview">
        <div className="web-preview-nav">
          <span>NallGeeks</span>
          <i />
        </div>
        <div className="web-live-hero" />
        <div className="web-live-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function TestingStage() {
  return (
    <div className="web-stage web-stage--testing">
      <div className="web-device web-device--desktop">
        <div className="web-device-screen">
          <div className="web-device-hero" />
          <div className="web-device-grid"><span /><span /><span /></div>
        </div>
      </div>
      <div className="web-device web-device--tablet">
        <div className="web-device-screen">
          <div className="web-device-hero" />
          <span />
          <span />
        </div>
      </div>
      <div className="web-device web-device--mobile">
        <div className="web-device-screen">
          <div className="web-device-hero" />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="web-test-panel">
        {['Performance', 'Responsive', 'Forms', 'SEO basics'].map((check, index) => (
          <div className="web-check-row" style={{ '--check-index': index }} key={check}>
            <span aria-hidden="true" />
            {check}
          </div>
        ))}
        <div className="web-test-progress"><span /></div>
      </div>
    </div>
  );
}

function LaunchStage() {
  return (
    <div className="web-stage web-stage--launch">
      <div className="web-launch-browser">
        <div className="web-browser-bar">
          <span />
          <p>nallgeeks.com</p>
          <i>Live</i>
        </div>
        <div className="web-launch-site">
          <div className="web-launch-hero">
            <small>Ready for launch</small>
            <strong>Your website is live.</strong>
          </div>
          <div className="web-launch-content">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="web-deploy-panel">
        <div className="web-mini-label">Deployment</div>
        <div className="web-deploy-bar"><span /></div>
        <div className="web-live-status"><span aria-hidden="true" /> Production healthy</div>
      </div>
    </div>
  );
}

function StageVisual({ index }) {
  const stages = [
    <DiscoveryStage key="discovery" />,
    <DesignStage key="design" />,
    <DevelopmentStage key="development" />,
    <TestingStage key="testing" />,
    <LaunchStage key="launch" />,
  ];

  return stages[index] ?? stages[0];
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

        <div className="web-workspace" aria-live="polite">
          <div className="web-workspace-top">
            <div>
              <span className="web-stage-kicker">Stage {activeStep.number}</span>
              <h3>{activeStep.workspaceTitle}</h3>
              <p>{activeStep.description}</p>
            </div>
            <div className="web-workspace-status">
              <span aria-hidden="true" />
              {shouldPause ? 'Paused' : 'In progress'}
            </div>
          </div>

          <div className="web-canvas" key={activeStep.number}>
            <StageVisual index={activeIndex} />
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
                    <small>{step.description}</small>
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
