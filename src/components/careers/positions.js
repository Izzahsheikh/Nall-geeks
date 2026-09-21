/*
 * Careers content: the company profile and every open position.
 *
 * This is the ONE place to edit. The Careers page (cards), each job's detail page and the application page all read from here.
 *
 * ── Adding or changing a role ────────────────────────────────────────────────────────────────────────────────────
 * Each entry in POSITIONS becomes one card on /careers and one page at /careers/<id>.
 *
 *   id           URL slug, lowercase-with-dashes:  'web-development-intern'  ->  /careers/web-development-intern
 *   title        Card and page heading:            'Web Development Intern'
 *   category     Department tag on the card:       'Web Development'
 *   type         Employment type. 'Full-time' | 'Internship' | 'Part-time' | 'Contract'. Cards are grouped by this.
 *   location     Shown with a pin icon:            'Remote', 'Islamabad', 'Remote / Islamabad'
 *   description  The "Role Description" on the detail page: an array of blocks, in reading order:
 *                  'A plain string'              -> a paragraph
 *                  { heading: 'Responsibilities' } -> a sub-heading
 *                  { list: ['One', 'Two'] }        -> a bulleted list
 *
 * To remove a role, delete its entry. Order here is the order on the page (within each type group).
 *
 * NOTE: the descriptions below are interim copy, so the pages read complete until the real role content is pasted in.
 */

export const COMPANY = {
  name: 'NallGeeks',
  description: 'A software studio designing and building web, mobile and cloud products for founders and brands.',
  location: 'Islamabad',
  logoSrc: '/nallgeeks-logo-mark.png',
};

const internshipDescription = (track) => [
  `Join the NallGeeks team as a ${track} intern and work on real client projects alongside our core team, building practical skills and a portfolio you can be proud of.`,
  { heading: "What you'll do" },
  {
    list: [
      'Contribute to live client projects under the guidance of a senior team member',
      'Take on scoped tasks in your track and see them through to delivery',
      'Join team reviews and share your progress regularly',
    ],
  },
  { heading: "Who we're looking for" },
  {
    list: [
      'Currently studying, recently graduated, or self-taught with a growing portfolio',
      'A genuine interest in the track you are applying for',
      'Willingness to learn quickly and to ask good questions',
    ],
  },
];

export const POSITIONS = [
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'Design',
    type: 'Full-time',
    location: 'Remote / Islamabad',
    description: [
      'You will shape how NallGeeks and our clients look and feel, from brand identities and campaign assets to the visual layer of the websites and products we ship.',
      'You will work closely with our designers and engineers so that what gets designed is what gets built.',
      { heading: 'Responsibilities' },
      {
        list: [
          'Design brand identities, logos and visual systems for client and in-house projects',
          'Produce campaign, social and marketing assets that stay consistent with each brand',
          'Collaborate with UI/UX designers and developers to carry visual direction into shipped products',
          'Prepare clean, well-organised source files and hand-off assets',
          'Take feedback from clients and teammates and iterate quickly',
        ],
      },
      { heading: 'Qualifications' },
      {
        list: [
          'A portfolio that shows strong typography, layout and brand thinking',
          'Fluency in Figma and the Adobe Creative Suite (or equivalent tools)',
          'Ability to explain and defend design decisions clearly',
          'Comfortable managing several projects and deadlines at once',
        ],
      },
    ],
  },
  {
    id: 'mobile-app-intern',
    title: 'Mobile App Intern',
    category: 'Mobile App',
    type: 'Internship',
    location: 'Remote',
    description: internshipDescription('Mobile App'),
  },
  {
    id: 'web-development-intern',
    title: 'Web Development Intern',
    category: 'Web Development',
    type: 'Internship',
    location: 'Remote',
    description: internshipDescription('Web Development'),
  },
  {
    id: 'ui-ux-design-intern',
    title: 'UI/UX Design Intern',
    category: 'UI/UX Design',
    type: 'Internship',
    location: 'Remote',
    description: internshipDescription('UI/UX Design'),
  },
  {
    id: 'software-management-intern',
    title: 'Software Management Intern',
    category: 'Software Management',
    type: 'Internship',
    location: 'Remote',
    description: internshipDescription('Software Management'),
  },
  {
    id: 'seo-intern',
    title: 'SEO Intern',
    category: 'SEO',
    type: 'Internship',
    location: 'Remote',
    description: internshipDescription('SEO'),
  },
];

export const getPosition = (id) => POSITIONS.find((position) => position.id === id);

export const jobHref = (position) => `/careers/${encodeURIComponent(position.id)}`;
export const applyHref = (position) => `${jobHref(position)}/apply`;

// Positions grouped by employment type, in a stable, sensible order (unknown types come last, in the order they appear).
const TYPE_ORDER = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const GROUP_LABELS = { 'Full-time': 'Full-time roles', 'Part-time': 'Part-time roles', Contract: 'Contract roles', Internship: 'Internships' };

export const groupedPositions = () => {
  const types = [...new Set(POSITIONS.map((position) => position.type))];
  types.sort((a, b) => {
    const rank = (t) => (TYPE_ORDER.includes(t) ? TYPE_ORDER.indexOf(t) : TYPE_ORDER.length);
    return rank(a) - rank(b);
  });
  return types.map((type) => ({
    type,
    label: GROUP_LABELS[type] || type,
    positions: POSITIONS.filter((position) => position.type === type),
  }));
};
