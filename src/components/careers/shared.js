import { useEffect, useMemo, useState } from 'react';

/* ─── Internship tracks ────────────────────────────────────────────── */
export const INTERN_TRACKS = [
  { value: 'Web Development' },
  { value: 'Mobile Apps' },
  { value: 'UI/UX Design' },
  { value: 'Software Management' },
  { value: 'Search Engine Optimization', label: 'SEO' },
];
export const trackLabel = (t) => t.label || t.value;

/* ─── Fallback jobs (used when /api/jobs is down) ───────────────────── */
const FALLBACK_OPENINGS = [
  {
    id: 'graphic-designer',
    type: 'Full-time · Design',
    title: 'Graphic Designer',
    location: 'Remote / Islamabad',
    summary:
      'Create visual identities, digital experiences, campaign assets and brand materials across NallGeeks and our client work.',
    description:
      'You will shape how NallGeeks and our clients look and feel — from brand identities and campaign assets to the visual layer of the websites and products we ship.\n\nYou will work closely with our designers and engineers so that what gets designed is what gets built.',
    responsibilities: [
      'Design brand identities, logos and visual systems for client and in-house projects',
      'Produce campaign, social and marketing assets that stay consistent with each brand',
      'Collaborate with UI/UX designers and developers to carry visual direction into shipped products',
      'Prepare clean, well-organised source files and hand-off assets',
      'Take feedback from clients and teammates and iterate quickly',
    ],
    qualifications: [
      'A portfolio that shows strong typography, layout and brand thinking',
      'Fluency in Figma and the Adobe Creative Suite (or equivalent tools)',
      'Ability to explain and defend design decisions clearly',
      'Comfortable managing several projects and deadlines at once',
      'Motion design or illustration skills are a plus',
    ],
  },
  {
    id: 'internship',
    type: 'Internship · Multiple tracks',
    title: 'Internship',
    location: 'Remote',
    summary:
      'Work alongside our core team on real client projects while developing practical skills and building your portfolio.',
    description:
      'Our internship puts you on real client projects alongside the core team. Choose the track that fits you — web development, mobile apps, UI/UX design, software management or SEO.',
    responsibilities: [
      'Contribute to live client projects under the guidance of a senior team member',
      'Take on scoped tasks in your chosen track and see them through to delivery',
      'Join team reviews and share progress regularly',
    ],
    qualifications: [
      'Currently studying, recently graduated, or self-taught with a growing portfolio',
      'Genuine interest in the track you apply for',
      'Willingness to learn quickly and ask good questions',
    ],
  },
];

export const isInternRole = (title = '') => /intern/i.test(title);

const DEPARTMENTS = [
  { test: /design|brand|\bux\b|\bui\b/i, label: 'Design' },
  { test: /mobile|android|ios|flutter/i, label: 'Mobile' },
  { test: /seo|market|growth|content/i, label: 'Growth' },
  { test: /develop|engineer|front|back|stack|web/i, label: 'Engineering' },
  { test: /manage|product|project|delivery/i, label: 'Delivery' },
  { test: /intern/i, label: 'Internship' },
];

const EMPLOYMENT = /full[\s-]?time|part[\s-]?time|contract|freelance|project[\s-]?based|internship|intern|remote/i;
const titleCase = (v) =>
  v.replace(/full[\s-]?time/i, 'Full-time')
   .replace(/part[\s-]?time/i, 'Part-time')
   .replace(/project[\s-]?based/i, 'Project-based')
   .replace(/^intern$/i, 'Internship');

/* Accepts an array or a newline-separated string (as saved from the admin form). */
const toList = (value) => {
  const items = Array.isArray(value) ? value : String(value || '').split('\n');
  return items.map((item) => String(item).replace(/^\s*[-•*]\s*/, '').trim()).filter(Boolean);
};

const slugify = (v = '') => String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseOpening(opening) {
  const chunks = String(opening.type || '').split(/[·|,]/).map((s) => s.trim()).filter(Boolean);
  const intern = isInternRole(opening.title);
  const rawEmp = chunks.find((c) => EMPLOYMENT.test(c));
  const employment = titleCase(rawEmp || (intern ? 'Internship' : 'Full-time'));
  const rawDept = opening.department || chunks.find((c) => c !== rawEmp);
  const department =
    rawDept || DEPARTMENTS.find((d) => d.test.test(opening.title || ''))?.label || 'Team';
  return {
    key: opening.id || slugify(opening.title),
    title: opening.title,
    summary: opening.summary,
    description: String(opening.description || '').trim(),
    responsibilities: toList(opening.responsibilities),
    qualifications: toList(opening.qualifications),
    location: opening.location || 'Remote',
    department,
    employment,
  };
}

/* ─── Data hook ─────────────────────────────────────────────────────── */
export function useOpenings() {
  const [openings, setOpenings] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let list = FALLBACK_OPENINGS;
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (data.jobs?.length > 0) list = data.jobs;
      } catch {
        /* keep fallback */
      }
      if (cancelled) return;
      setOpenings(list);
      setStatus('ready');
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const parsed = useMemo(() => openings.map(parseOpening), [openings]);
  const roles = useMemo(() => parsed.filter((r) => !isInternRole(r.title)), [parsed]);
  const internship = useMemo(() => parsed.find((r) => isInternRole(r.title)), [parsed]);

  return { openings: parsed, roles, internship, status };
}

export const jobHref = (job) => `/careers/${encodeURIComponent(job.key)}`;
export const applyHref = (job, track) =>
  `${jobHref(job)}/apply${track ? `?track=${encodeURIComponent(track)}` : ''}`;
