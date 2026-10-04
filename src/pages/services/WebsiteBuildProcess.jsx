import { useEffect, useRef, useState } from 'react';

const IMAGE_BASE = '/images/services/web-development';
const LAUNCH_VIDEO = '/uploads/projects/ngpartitions.mp4';
const PROJECT_DOMAIN = 'ngpartitions.co.uk';
const LAYER_FADE_MS = 500;

/*
 * One project (N&G Partitions), five moments. The copy, the preview layer and the active tab are all driven by the same
 * index so they change together. Each layer's internal CSS animation is timed to finish within its stage `duration`.
 */
const STAGES = [
  {
    label: 'Discovery',
    heading: 'Understanding The Client',
    sentence: 'We learn about the business, its audience and what the website needs to achieve.',
    duration: 4600,
  },
  {
    label: 'Design',
    heading: 'Shaping The Experience',
    sentence: 'We turn those insights into a clear structure, visual direction and interface.',
    duration: 4800,
  },
  {
    label: 'Development',
    heading: 'Building The Website',
    sentence: 'We turn the approved design into a fast, responsive and functional website.',
    duration: 4800,
  },
  {
    label: 'Testing',
    heading: 'Refining Every Detail',
    sentence: 'We test the experience across devices and polish every important interaction.',
    duration: 5000,
  },
  {
    label: 'Launch',
    heading: 'Taking It Live',
    sentence: 'After final checks, the finished website is ready for real customers.',
    duration: 5200,
  },
];

const TOTAL = STAGES.length;
const pad = (value) => String(value).padStart(2, '0');

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

function useInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);

    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

// Outgoing content drifts up, incoming content rises in from below.
function stageClass(index, activeIndex, previousIndex) {
  if (index === activeIndex) return ' is-active';
  if (index === previousIndex) return ' is-leaving';
  return '';
}

function LaunchVideo({ isActive, canPlay }) {
  const videoRef = useRef(null);

  // Start from the beginning whenever Launch becomes active; pause and rewind once the layer has faded out.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (isActive && canPlay) {
      video.currentTime = 0;
      video.play().catch(() => {});
      return undefined;
    }

    const timer = window.setTimeout(() => {
      video.pause();
      video.currentTime = 0;
    }, LAYER_FADE_MS);

    return () => window.clearTimeout(timer);
  }, [isActive, canPlay]);

  return (
    <video
      ref={videoRef}
      src={LAUNCH_VIDEO}
      poster={`${IMAGE_BASE}/web1.png`}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-label="The finished N&G Partitions website, live"
    />
  );
}

function Preview({ activeIndex, previousIndex, canPlayVideo }) {
  const layer = (index, className, children) => (
    <div
      className={`build-layer ${className}${stageClass(index, activeIndex, previousIndex)}`}
      aria-hidden={index !== activeIndex}
    >
      {children}
    </div>
  );

  return (
    <div className="build-preview">
      <div className="build-preview-bar">{PROJECT_DOMAIN}</div>

      <div className="build-preview-canvas">
        {layer(0, 'build-layer--discovery', (
          <img src={`${IMAGE_BASE}/image1.jpeg`} width="1375" height="768" decoding="async" alt="N&G Partitions project brief: business, audience, goals and visual direction" />
        ))}

        {layer(1, 'build-layer--design', (
          <>
            <div className="build-wireframe" aria-hidden="true">
              <span className="wf-nav" />
              <span className="wf-eyebrow" />
              <span className="wf-title" />
              <span className="wf-title wf-title--short" />
              <span className="wf-copy" />
              <span className="wf-button" />
              <span className="wf-cards"><i /><i /><i /><i /></span>
            </div>
            <img src={`${IMAGE_BASE}/image2.jpeg`} width="1063" height="650" decoding="async" alt="The N&G Partitions homepage design" />
          </>
        ))}

        {layer(2, 'build-layer--development', (
          <>
            <figure className="build-code">
              <img src={`${IMAGE_BASE}/image3.1.png`} width="600" height="454" decoding="async" alt="Source code for the N&G Partitions website" />
            </figure>
            <figure className="build-site">
              <img src={`${IMAGE_BASE}/image3.2.png`} width="635" height="534" decoding="async" alt="The N&G Partitions website rendering from the code" />
            </figure>
          </>
        ))}

        {layer(3, 'build-layer--testing', (
          <div className="build-devices">
            <img src={`${IMAGE_BASE}/image4.jpeg`} width="2701" height="1228" decoding="async" alt="The N&G Partitions website on desktop, tablet and mobile" />
          </div>
        ))}

        {layer(4, 'build-layer--launch', (
          <LaunchVideo isActive={activeIndex === TOTAL - 1} canPlay={canPlayVideo} />
        ))}
      </div>
    </div>
  );
}

export default function WebsiteBuildProcess() {
  const [{ activeIndex, previousIndex }, setStage] = useState({ activeIndex: 0, previousIndex: -1 });
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(sectionRef);
  const activeStage = STAGES[activeIndex];

  const goTo = (index) => {
    if (index === activeIndex) return;
    setStage({ activeIndex: index, previousIndex: activeIndex });
  };

  // Loop 1 → 5 → 1 … Any change of stage (including a click) restarts the timer, so the sequence continues from there.
  useEffect(() => {
    if (reducedMotion || !inView) return undefined;

    const timer = window.setTimeout(() => {
      setStage({ activeIndex: (activeIndex + 1) % TOTAL, previousIndex: activeIndex });
    }, activeStage.duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, activeStage.duration, inView, reducedMotion]);

  // Keep the active tab visible when the strip scrolls horizontally on small screens.
  useEffect(() => {
    const list = tabsRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;

    const item = list.children[activeIndex];
    if (!item) return;
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, reducedMotion]);

  const handleTabKeys = (event) => {
    const keys = { ArrowRight: activeIndex + 1, ArrowLeft: activeIndex - 1, Home: 0, End: TOTAL - 1 };
    if (!(event.key in keys)) return;

    event.preventDefault();
    const target = (keys[event.key] + TOTAL) % TOTAL;
    goTo(target);
    tabsRef.current?.querySelectorAll('button')[target]?.focus();
  };

  return (
    <section ref={sectionRef} className="web-process web-process--build reveal" aria-labelledby="web-process-title">
      <div className="sp-inner">
        <header className="build-header">
          <span className="sp-label">From idea to launch</span>
          <h2 className="sp-subtitle" id="web-process-title">How We Build Your Website</h2>
          <p>From understanding your business to launching the finished website, every step is built around a clear purpose.</p>
        </header>

        <div className="build-flow">
          <div className="build-stages" aria-live="polite">
            {STAGES.map((stage, index) => (
              <div
                className={`build-stage${stageClass(index, activeIndex, previousIndex)}`}
                aria-hidden={index !== activeIndex}
                key={stage.label}
              >
                <span className="build-stage-meta"><b>{pad(index + 1)}</b> — {stage.label}</span>
                <h3>{stage.heading}</h3>
                <p>{stage.sentence}</p>
              </div>
            ))}
          </div>

          <Preview activeIndex={activeIndex} previousIndex={previousIndex} canPlayVideo={inView && !reducedMotion} />

          <ol className="build-tabs" aria-label="Website build stages" ref={tabsRef} onKeyDown={handleTabKeys}>
            {STAGES.map((stage, index) => {
              const isActive = index === activeIndex;

              return (
                <li className={isActive ? 'is-active' : undefined} key={stage.label}>
                  <button
                    type="button"
                    aria-current={isActive ? 'step' : undefined}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => goTo(index)}
                  >
                    <span className="build-tab-num">{pad(index + 1)}</span>
                    <span className="build-tab-name">{stage.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
