import { useEffect, useRef, useState } from 'react';
import logo from '../assets/nallgeeks-logo-mark.png';

const SERVICES = [
  { num: '01', icon: '</>', title: 'Web Development', desc: 'We write lean, fast code. No plugin bloat — just clean builds that load instantly.' },
  { num: '02', icon: '📱', title: 'Mobile Apps', desc: 'One codebase, two platforms. No lag, no glitches — just apps that work.' },
  { num: '03', icon: '🎨', title: 'UI/UX Design', desc: 'Design that earns trust before a single word is read.' },
  { num: '04', icon: '⊞', title: 'Software Management', desc: 'Tools shaped around your workflow — not the other way around.' },
  { num: '05', icon: '🔍', title: 'Search Engine Optimization', desc: 'Rank higher, get found faster — we optimize your site for search engines that matter.' },
  { num: '06', icon: '🤖', title: 'AI & Automation', desc: 'Eliminate the repetitive. Build AI into your product or process.' },
];

/*
 * Where the branches leave the logo, as fractions of the logo image: horizontally centred, on the
 * lowest visible pixel of the "NG" glyph at that centre line. (The PNG has transparent padding, so
 * the bottom of the image box would leave the lines floating below the mark.)
 */
const LOGO_ANCHOR = { x: 0.5, y: 0.821 };

/* Position of `el` inside `ancestor`. Offsets ignore CSS transforms, so the card entrance/hover motion can't skew the lines. */
const offsetWithin = (el, ancestor) => {
  let x = 0;
  let y = 0;
  for (let node = el; node && node !== ancestor; node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
};

/*
 * Org-chart tree: one trunk down from the logo to a horizontal bar, then a vertical drop from the bar to the
 * top-centre of every card. The bar sits halfway between the logo and the cards. The outer drops are drawn as
 * one continuous path with the bar so their corners join cleanly.
 */
const treePath = ({ start, ends }) => {
  const barY = start.y + (Math.min(...ends.map((e) => e.y)) - start.y) / 2;
  const first = ends[0];
  const last = ends[ends.length - 1];
  const inner = ends.slice(1, -1).map((e) => `M ${e.x},${barY} V ${e.y}`);
  return [
    `M ${start.x},${start.y} V ${barY}`,
    `M ${first.x},${first.y} V ${barY} H ${last.x} V ${last.y}`,
    ...inner,
  ].join(' ');
};

export default function Services() {
  const sectionRef = useRef(null);
  const hubRef = useRef(null);
  const logoRef = useRef(null);
  const cardRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [tree, setTree] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  /* Measure the logo and every card, in the hub's own pixel space, and redo it whenever layout changes. */
  useEffect(() => {
    const hub = hubRef.current;
    const img = logoRef.current;
    if (!hub || !img) return;

    const measure = () => {
      if (!img.naturalWidth) return;

      const at = offsetWithin(img, hub);
      const scale = Math.min(img.offsetWidth / img.naturalWidth, img.offsetHeight / img.naturalHeight);
      const drawnW = img.naturalWidth * scale;
      const drawnH = img.naturalHeight * scale;
      const start = {
        x: at.x + (img.offsetWidth - drawnW) / 2 + LOGO_ANCHOR.x * drawnW,
        y: at.y + (img.offsetHeight - drawnH) / 2 + LOGO_ANCHOR.y * drawnH,
      };

      /* x from sub-pixel rects (cards only ever move vertically, so it's unaffected by their transforms); y from offsets. */
      const hubLeft = hub.getBoundingClientRect().left;
      const ends = cardRefs.current.map((card) => {
        const rect = card.getBoundingClientRect();
        return { x: rect.left - hubLeft + rect.width / 2, y: offsetWithin(card, hub).y };
      });

      setTree({ width: hub.offsetWidth, height: hub.offsetHeight, start, ends });
    };

    measure();
    img.addEventListener('load', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(hub);
    cardRefs.current.forEach((card) => card && ro.observe(card));
    return () => {
      img.removeEventListener('load', measure);
      ro.disconnect();
    };
  }, []);

  return (
    <section id="services" className="services-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-head reveal visible">
          <div className="section-eyebrow">What We Do</div>
          <h2>
            From idea to interface,
            <br />
            one team does it all.
          </h2>
        </div>

        <div className={`services-hub${isVisible ? ' is-visible' : ''}`} ref={hubRef}>
          <div className="services-badge-wrap">
            <div className="services-badge">
              <img
                ref={logoRef}
                src={logo}
                alt="NallGeeks logo"
              />
            </div>
          </div>

          {tree && (
            <svg
              className="services-tree"
              width={tree.width}
              height={tree.height}
              viewBox={`0 0 ${tree.width} ${tree.height}`}
              aria-hidden="true"
            >
              <path d={treePath(tree)} />
            </svg>
          )}

          <div className="services-tree-gap" />

          <div className="svc-row">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`svc-card${isVisible ? ' is-visible' : ''}`}
                style={{ '--svc-index': i }}
              >
                <div className="svc-card-top">
                  <span className="svc-num">{s.num}</span>
                  <span className="svc-icon">{s.icon}</span>
                </div>
                <div className="svc-title">{s.title}</div>
                <div className="svc-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}