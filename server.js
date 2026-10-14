import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// In production, Hostinger's nginx is exactly one trusted reverse proxy.
// Setting trust proxy = 1 makes req.ip reflect the real client IP from
// X-Forwarded-For rather than the nginx loopback address, so per-IP rate
// limiting works correctly.  In development (no proxy), this is left off
// so a direct client cannot spoof their IP by forging the header.
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const ADMIN_ACCOUNTS_PATH = path.resolve(process.env.ADMIN_ACCOUNTS_FILE || path.join(__dirname, 'data', 'admin-users.json'));
const PROJECT_UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'projects');
// Application attachments are private (résumés): they live under data/, which is never served statically.
const APPLICATION_FILE_DIR = path.join(__dirname, 'data', 'applications');
const MAX_APPLICATION_FILE_BYTES = 4 * 1024 * 1024;
const APPLICATION_FILE_KINDS = {
  resume: { label: 'Resume', extensions: ['pdf', 'doc', 'docx'] },
};
// Leading bytes for each extension, so a renamed executable can't pass as a PDF.
const FILE_SIGNATURES = {
  pdf: [[0x25, 0x50, 0x44, 0x46]],
  doc: [[0xd0, 0xcf, 0x11, 0xe0]],
  docx: [[0x50, 0x4b, 0x03, 0x04]],
  zip: [[0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06]],
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47]],
};
const SESSION_COOKIE = 'ng_admin';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const sessionSecret = process.env.ADMIN_SESSION_SECRET || (process.env.NODE_ENV === 'production' ? '' : crypto.randomBytes(32).toString('hex'));
if (!sessionSecret) throw new Error('ADMIN_SESSION_SECRET must be configured in production');
if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length < 32) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters');
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map();
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(crypto.randomBytes(32).toString('base64url'), 12);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const initialDb = {
  projects: [
    {
      id: 'organicfields',
      name: 'OrganicFields.pk',
      category: 'E-Commerce App',
      shortDescription: 'Fresh produce ordering experience for a growing local brand.',
      fullDescription: 'A compact e-commerce experience focused on fast ordering, seasonal promotions, and a simple mobile-first buying flow.',
      imageUrl: '',
      projectUrl: 'https://organicfields.pk',
      status: 'Live',
      featured: true,
      order: 1,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'zylo',
      name: 'Zylo',
      category: 'Productivity App',
      shortDescription: 'AI-assisted task planning and weekly focus management.',
      fullDescription: 'A polished productivity app concept with AI task creation, focus planning, and clean daily workflow management.',
      imageUrl: '',
      projectUrl: 'https://zylo.app',
      status: 'Active',
      featured: true,
      order: 2,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'rankgrad',
      name: 'RankGrad',
      category: 'Hiring Platform',
      shortDescription: 'Merit-based graduate hiring platform with screened opportunities.',
      fullDescription: 'A hiring platform interface built around screened jobs, graduate profiles, and faster candidate discovery.',
      imageUrl: '',
      projectUrl: 'https://rankgrad.com',
      status: 'Live',
      featured: true,
      order: 3,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'nallgeeks-website',
      name: 'NallGeeks Website',
      category: 'Brand Website',
      shortDescription: 'Premium company website for services, portfolio, and client inquiries.',
      fullDescription: 'The public NallGeeks website, designed around a graphite and orange identity with clear service storytelling.',
      imageUrl: '',
      projectUrl: 'https://nallgeeks.com',
      status: 'In Review',
      featured: false,
      order: 4,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
  ],
  jobs: [
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      type: 'Full-time',
      location: 'Remote / Hybrid',
      summary: 'Build clean, responsive React interfaces for websites, dashboards, and digital products.',
      description: 'You will work on premium public websites, private dashboards, and product interfaces with a focus on clean execution and responsive polish.',
      department: 'Engineering',
      responsibilities: [
        'Build responsive, accessible React interfaces for websites, dashboards and product screens',
        'Turn design files into polished, pixel-accurate components',
        'Work with backend developers to connect interfaces to APIs',
        'Review code and keep the codebase clean and maintainable',
      ],
      qualifications: [
        'Strong experience with React, JavaScript and modern CSS',
        'Eye for detail and responsive design',
        'Comfortable working with REST APIs and Git',
        'A portfolio or public projects we can look at',
      ],
      status: 'Open',
      order: 1,
      createdAt: '2026-09-07T00:00:00.000Z',
      updatedAt: '2026-09-07T00:00:00.000Z',
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      type: 'Project-based',
      location: 'Remote',
      summary: 'Shape premium product flows, website screens, wireframes, and brand-led digital experiences.',
      description: 'You will turn business goals into clear layouts, usable flows, and polished interfaces for NallGeeks and client projects.',
      department: 'Design',
      responsibilities: [
        'Turn business goals into clear user flows, wireframes and high-fidelity screens',
        'Design polished interfaces for websites and digital products',
        'Build and maintain reusable design components in Figma',
        'Hand off designs to developers and review the built result',
      ],
      qualifications: [
        'A portfolio showing end-to-end product or website design work',
        'Strong Figma skills and a solid grasp of layout and typography',
        'Ability to explain design decisions to clients and teammates',
        'Experience with design systems is a plus',
      ],
      status: 'Open',
      order: 2,
      createdAt: '2026-09-07T00:00:00.000Z',
      updatedAt: '2026-09-07T00:00:00.000Z',
    },
    {
      id: 'marketing-intern',
      title: 'Marketing Intern',
      type: 'Internship',
      location: 'Remote',
      summary: 'Support content, research, campaigns, and growth experiments for NallGeeks and client work.',
      description: 'You will help with research, social content, campaign support, and simple growth tasks across the NallGeeks brand.',
      department: 'Growth',
      responsibilities: [
        'Research audiences, competitors and content ideas',
        'Draft and schedule social content across NallGeeks channels',
        'Support campaign setup and report on results',
        'Help run simple growth experiments',
      ],
      qualifications: [
        'Interest in marketing, content or growth',
        'Clear written communication',
        'Willingness to learn tools and analytics quickly',
        'Currently studying or recently graduated is welcome',
      ],
      status: 'Open',
      order: 3,
      createdAt: '2026-09-07T00:00:00.000Z',
      updatedAt: '2026-09-07T00:00:00.000Z',
    },
  ],
  messages: [],
  applications: [
    {
      id: 'app-hassan',
      name: 'Hassan Ali',
      position: 'Frontend Developer',
      email: 'hassan.dev@example.com',
      phone: '',
      portfolio: '',
      date: '2026-09-07T00:00:00.000Z',
      status: 'New',
      details: 'React developer with experience building dashboards, landing pages, and responsive web apps.',
    },
    {
      id: 'app-zara',
      name: 'Zara Sheikh',
      position: 'UI/UX Designer',
      email: 'zara.design@example.com',
      phone: '',
      portfolio: '',
      date: '2026-09-06T00:00:00.000Z',
      status: 'Reviewing',
      details: 'Product designer focused on clean interfaces, user flows, and brand-led digital experiences.',
    },
  ],
};

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'dist')));

const ensureDb = async () => {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.mkdir(PROJECT_UPLOAD_DIR, { recursive: true });

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2));
  }
};

const readDb = async () => {
  await ensureDb();
  const db = JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
  let changed = false;

  if (!Array.isArray(db.jobs)) {
    db.jobs = initialDb.jobs;
    changed = true;
  }

  if (changed) await writeDb(db);
  return db;
};

const writeDb = async (db) => {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
};

const sortProjects = (projects) => [...projects].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
const sortJobs = (jobs) => [...jobs].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

const publicProject = (project) => ({
  id: project.id,
  name: project.name,
  category: project.category,
  shortDescription: project.shortDescription,
  fullDescription: project.fullDescription,
  imageUrl: project.imageUrl,
  projectUrl: project.projectUrl,
  status: project.status,
  featured: Boolean(project.featured),
  order: Number(project.order || 0),
});

const parseCookies = (cookieHeader = '') => Object.fromEntries(
  cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const index = cookie.indexOf('=');
      return index === -1 ? [cookie, ''] : [cookie.slice(0, index), decodeURIComponent(cookie.slice(index + 1))];
    })
);

const sign = (value) => crypto.createHmac('sha256', sessionSecret).update(value).digest('base64url');

const normalizeAdminEmail = (email) => String(email || '').trim().toLowerCase();

const readAdminAccounts = async () => {
  try {
    const store = JSON.parse(await fs.readFile(ADMIN_ACCOUNTS_PATH, 'utf8'));
    return Array.isArray(store.admins) ? store.admins : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const createToken = (admin) => {
  const payload = Buffer.from(JSON.stringify({
    sub: admin.id,
    email: admin.email,
    role: 'admin',
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
};

const readToken = (token) => {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);

  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
};

const requireAdmin = async (req, res, next) => {
  const session = readToken(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
  if (!session || session.role !== 'admin' || !session.sub) {
    return res.status(401).json({ error: 'Admin login required' });
  }
  try {
    const accounts = await readAdminAccounts();
    const admin = accounts.find((account) => account.id === session.sub
      && account.role === 'admin'
      && normalizeAdminEmail(account.email) === normalizeAdminEmail(session.email));
    if (!admin) return res.status(401).json({ error: 'Admin login required' });
    req.admin = { id: admin.id, email: admin.email, name: admin.name, role: 'admin' };
    return next();
  } catch {
    return res.status(500).json({ error: 'Unable to verify admin session' });
  }
};

const loginKeyState = (key, now = Date.now()) => {
  const current = loginAttempts.get(key);
  if (!current || now - current.startedAt >= LOGIN_WINDOW_MS) {
    const fresh = { startedAt: now, attempts: 0 };
    loginAttempts.set(key, fresh);
    return fresh;
  }
  return current;
};

const clearLoginAttempts = (keys) => keys.forEach((key) => loginAttempts.delete(key));

// Generic sliding-window counter shared by the contact and careers endpoints.
// Returns true when the caller should be rate-limited, false otherwise.
const makeRateLimiter = (windowMs, max) => {
  const store = new Map();
  return (key) => {
    const now = Date.now();
    for (const [k, bucket] of store) {
      if (now - bucket.startedAt >= windowMs) store.delete(k);
    }
    const current = store.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      store.set(key, { startedAt: now, attempts: 1 });
      return false;
    }
    if (current.attempts >= max) return true;
    current.attempts += 1;
    return false;
  };
};
const checkContactLimit = makeRateLimiter(60 * 60 * 1000, 5);     // 5 per hour per IP
const checkApplicationLimit = makeRateLimiter(60 * 60 * 1000, 3); // 3 per hour per IP

const validateProject = (project) => {
  const errors = [];
  if (!project.name?.trim()) errors.push('Project name is required');
  if (!project.category?.trim()) errors.push('Category is required');
  if (!project.shortDescription?.trim()) errors.push('Short description is required');
  return errors;
};

const sanitizeProject = (project) => ({
  name: String(project.name || '').trim(),
  category: String(project.category || '').trim(),
  shortDescription: String(project.shortDescription || '').trim(),
  fullDescription: String(project.fullDescription || '').trim(),
  projectUrl: String(project.projectUrl || '').trim(),
  status: String(project.status || 'Active').trim(),
  featured: Boolean(project.featured),
  order: Number(project.order || 0),
});

const validateJob = (job) => {
  const errors = [];
  if (!job.title?.trim()) errors.push('Job title is required');
  if (!job.type?.trim()) errors.push('Job type is required');
  if (!job.location?.trim()) errors.push('Location is required');
  if (!job.summary?.trim()) errors.push('Summary is required');
  return errors;
};

// Accepts an array or a newline-separated string; stores a clean array of non-empty lines.
const toLines = (value) => (Array.isArray(value) ? value : String(value || '').split('\n'))
  .map((line) => String(line).replace(/^\s*[-•*]\s*/, '').trim())
  .filter(Boolean);

const sanitizeJob = (job) => ({
  title: String(job.title || '').trim(),
  type: String(job.type || '').trim(),
  department: String(job.department || '').trim(),
  location: String(job.location || '').trim(),
  summary: String(job.summary || '').trim(),
  description: String(job.description || '').trim(),
  responsibilities: toLines(job.responsibilities),
  qualifications: toLines(job.qualifications),
  status: String(job.status || 'Open').trim(),
  order: Number(job.order || 0),
});

const saveProjectImage = async ({ imageData, imageName, projectId }) => {
  if (!imageData) return '';

  const match = imageData.match(/^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/i);
  if (!match) throw new Error('Project image must be PNG, JPG, WEBP, or GIF');

  const extension = match[1].toLowerCase().replace('jpeg', 'jpg');
  const safeName = String(imageName || projectId).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const filename = `${projectId}-${safeName}.${extension}`;

  await fs.writeFile(path.join(PROJECT_UPLOAD_DIR, filename), Buffer.from(match[2], 'base64'));
  return `/uploads/projects/${filename}`;
};

const formatDate = (dateString) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(dateString));

app.post('/api/admin/login', async (req, res) => {
  const email = normalizeAdminEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const attemptKeys = [`ip:${ip}`, `account:${ip}:${email}`];
  const now = Date.now();

  // Expired buckets are discarded so this small in-memory limiter stays bounded.
  for (const [key, bucket] of loginAttempts) {
    if (now - bucket.startedAt >= LOGIN_WINDOW_MS) loginAttempts.delete(key);
  }
  if (attemptKeys.some((key) => loginKeyState(key, now).attempts >= LOGIN_MAX_ATTEMPTS)) {
    return res.status(429).json({ error: 'Too many sign-in attempts. Try again later.' });
  }

  try {
    const accounts = await readAdminAccounts();
    const admin = accounts.find((account) => normalizeAdminEmail(account.email) === email && account.role === 'admin');
    const passwordHash = admin?.passwordHash || DUMMY_PASSWORD_HASH;
    const validPassword = await bcrypt.compare(password.slice(0, 1024), passwordHash);
    if (!email || email.length > 254 || password.length > 1024 || !admin || !validPassword) {
      attemptKeys.forEach((key) => { loginKeyState(key, now).attempts += 1; });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    clearLoginAttempts(attemptKeys);
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE}=${encodeURIComponent(createToken(admin))}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`
    );
    return res.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch {
    return res.status(500).json({ error: 'Unable to sign in right now' });
  }
});

app.post('/api/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
  return res.json({ success: true });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  return res.json({ admin: { name: req.admin.name, email: req.admin.email, role: req.admin.role } });
});

app.get('/api/projects', async (_req, res) => {
  const db = await readDb();
  return res.json({ projects: sortProjects(db.projects).map(publicProject) });
});

app.get('/api/admin/projects', requireAdmin, async (_req, res) => {
  const db = await readDb();
  return res.json({ projects: sortProjects(db.projects) });
});

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  const project = sanitizeProject(req.body || {});
  const errors = validateProject(project);
  if (errors.length) return res.status(400).json({ error: errors.join(', ') });

  const db = await readDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const imageUrl = await saveProjectImage({ imageData: req.body.imageData, imageName: req.body.imageName, projectId: id });
  const created = { ...project, id, imageUrl, createdAt: now, updatedAt: now };

  db.projects.push(created);
  await writeDb(db);
  return res.status(201).json({ project: created });
});

app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = db.projects.findIndex((project) => project.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  const project = sanitizeProject(req.body || {});
  const errors = validateProject(project);
  if (errors.length) return res.status(400).json({ error: errors.join(', ') });

  const imageUrl = req.body.imageData
    ? await saveProjectImage({ imageData: req.body.imageData, imageName: req.body.imageName, projectId: req.params.id })
    : db.projects[index].imageUrl;

  db.projects[index] = {
    ...db.projects[index],
    ...project,
    imageUrl,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(db);
  return res.json({ project: db.projects[index] });
});

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const before = db.projects.length;
  db.projects = db.projects.filter((project) => project.id !== req.params.id);

  if (db.projects.length === before) return res.status(404).json({ error: 'Project not found' });

  await writeDb(db);
  return res.json({ success: true });
});

app.get('/api/jobs', async (_req, res) => {
  const db = await readDb();
  return res.json({
    jobs: sortJobs(db.jobs).filter((job) => job.status === 'Open'),
  });
});

app.get('/api/admin/jobs', requireAdmin, async (_req, res) => {
  const db = await readDb();
  return res.json({ jobs: sortJobs(db.jobs) });
});

app.post('/api/admin/jobs', requireAdmin, async (req, res) => {
  const job = sanitizeJob(req.body || {});
  const errors = validateJob(job);
  if (errors.length) return res.status(400).json({ error: errors.join(', ') });

  const db = await readDb();
  const now = new Date().toISOString();
  const created = {
    ...job,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  db.jobs.push(created);
  await writeDb(db);
  return res.status(201).json({ job: created });
});

app.put('/api/admin/jobs/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = db.jobs.findIndex((job) => job.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Job not found' });

  const job = sanitizeJob(req.body || {});
  const errors = validateJob(job);
  if (errors.length) return res.status(400).json({ error: errors.join(', ') });

  db.jobs[index] = {
    ...db.jobs[index],
    ...job,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(db);
  return res.json({ job: db.jobs[index] });
});

app.delete('/api/admin/jobs/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const before = db.jobs.length;
  db.jobs = db.jobs.filter((job) => job.id !== req.params.id);

  if (db.jobs.length === before) return res.status(404).json({ error: 'Job not found' });

  await writeDb(db);
  return res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (checkContactLimit(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Please wait a while before trying again.' });
  }

  const t = (v) => String(v || '').trim();

  const cleanFirst   = t(req.body?.firstName).slice(0, 100);
  const cleanLast    = t(req.body?.lastName).slice(0, 100);
  const cleanPhone   = t(req.body?.phone).slice(0, 30);
  const cleanEmail   = t(req.body?.email).slice(0, 254);
  const cleanMessage = t(req.body?.message).slice(0, 5000);

  if (!cleanFirst || !cleanLast || !cleanEmail) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  const cleanServices = Array.isArray(req.body?.services)
    ? req.body.services
        .filter((s) => typeof s === 'string' && s.trim())
        .map((s) => s.trim().slice(0, 100))
        .slice(0, 20)
    : [];

  if (cleanServices.length === 0) {
    return res.status(400).json({ error: 'Select at least one service' });
  }

  const db = await readDb();
  const name = `${cleanFirst} ${cleanLast}`;
  const savedMessage = {
    id: crypto.randomUUID(),
    sender: name,
    email: cleanEmail,
    phone: cleanPhone,
    services: cleanServices,
    subject: `Project inquiry from ${name}`,
    body: cleanMessage,
    status: 'Unread',
    date: new Date().toISOString(),
  };

  db.messages.unshift(savedMessage);
  await writeDb(db);

  if (resend) {
    const from    = process.env.RESEND_FROM_EMAIL || 'NallGeeks <onboarding@resend.dev>';
    const adminTo = process.env.CONTACT_TO_EMAIL  || 'contact@nallgeeks.com';

    // Escape user-supplied strings before embedding in HTML.
    const esc = (s) => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="margin-bottom:4px">New Website Enquiry</h2>
        <p style="color:#888;margin-top:0;font-size:14px">Submitted via nallgeeks.com</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;width:110px;vertical-align:top">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee">${esc(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;vertical-align:top">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${esc(cleanEmail)}" style="color:#e56b00">${esc(cleanEmail)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;vertical-align:top">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee">${esc(cleanPhone) || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;vertical-align:top">Services</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee">${cleanServices.map(esc).join(', ')}</td>
          </tr>
        </table>
        <div style="margin-top:20px">
          <p style="font-weight:600;margin-bottom:8px">Message</p>
          <p style="white-space:pre-wrap;background:#f7f7f7;padding:14px;border-radius:6px;margin:0;line-height:1.6">${esc(cleanMessage) || '—'}</p>
        </div>
        <p style="margin-top:24px;font-size:13px;color:#888">Hit reply to respond directly to ${esc(cleanFirst)}.</p>
      </div>
    `;

    const confirmHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;padding:24px 0">
        <h2 style="margin-bottom:8px">Hi ${esc(cleanFirst)},</h2>
        <p style="line-height:1.6">Thanks for getting in touch.</p>
        <p style="line-height:1.6">Your query has been submitted successfully and the NallGeeks team will contact you shortly.</p>
        ${cleanMessage ? `
        <div style="margin-top:24px">
          <p style="font-weight:600;margin-bottom:8px">A copy of your message</p>
          <p style="white-space:pre-wrap;background:#f7f7f7;padding:14px;border-radius:6px;margin:0;font-style:italic;line-height:1.6">&ldquo;${esc(cleanMessage)}&rdquo;</p>
        </div>
        ` : ''}
        <p style="margin-top:32px;line-height:1.6">Best regards,<br><strong>NallGeeks Team</strong></p>
        <hr style="margin-top:40px;border:none;border-top:1px solid #eee">
        <p style="font-size:12px;color:#aaa;margin-top:12px">NallGeeks · <a href="https://nallgeeks.com" style="color:#aaa">nallgeeks.com</a></p>
      </div>
    `;

    try {
      await resend.emails.send({
        from,
        to: adminTo,
        replyTo: cleanEmail,
        subject: `New Website Enquiry — ${name}`,
        html: adminHtml,
      });
    } catch (err) {
      console.error('[Resend] Admin notification failed:', err?.message);
    }

    try {
      await resend.emails.send({
        from,
        to: cleanEmail,
        replyTo: adminTo,
        subject: 'We received your query | NallGeeks',
        html: confirmHtml,
      });
    } catch (err) {
      console.error('[Resend] User confirmation failed:', err?.message);
    }
  }

  return res.status(201).json({ success: true, message: savedMessage });
});

app.get('/api/admin/messages', requireAdmin, async (_req, res) => {
  const db = await readDb();
  return res.json({
    messages: db.messages.map((message) => ({ ...message, displayDate: formatDate(message.date) })),
  });
});

app.patch('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const message = db.messages.find((item) => item.id === req.params.id);
  if (!message) return res.status(404).json({ error: 'Message not found' });

  message.status = req.body.status === 'Unread' ? 'Unread' : 'Read';
  await writeDb(db);
  return res.json({ message });
});

app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const db = await readDb();
  const before = db.messages.length;
  db.messages = db.messages.filter((message) => message.id !== req.params.id);

  if (db.messages.length === before) return res.status(404).json({ error: 'Message not found' });

  await writeDb(db);
  return res.json({ success: true });
});

app.get('/api/admin/applications', requireAdmin, async (_req, res) => {
  const db = await readDb();
  return res.json({
    applications: db.applications.map((application) => ({ ...application, displayDate: formatDate(application.date) })),
  });
});

// "PDF, DOC or DOCX"
const listFormats = (extensions) => {
  const names = extensions.map((ext) => ext.toUpperCase());
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} or ${names.at(-1)}` : names[0];
};

// Decodes and validates one attached file; returns { name, extension, size, buffer }, null if none was sent.
const readApplicationFile = (kind, file) => {
  if (!file) return null;
  const { label, extensions } = APPLICATION_FILE_KINDS[kind];
  const fail = (message) => Object.assign(new Error(message), { status: 400 });

  const name = path.basename(String(file.name || '')).replace(/[^\w.\- ]/g, '_').slice(-120);
  const extension = path.extname(name).slice(1).toLowerCase();
  if (!extensions.includes(extension)) {
    throw fail(`${label} must be a ${listFormats(extensions)} file`);
  }

  const match = String(file.data || '').match(/^data:[^;,]*;base64,(.+)$/s);
  if (!match) throw fail(`${label} file could not be read`);

  const buffer = Buffer.from(match[1], 'base64');
  if (!buffer.length) throw fail(`${label} file is empty`);
  if (buffer.length > MAX_APPLICATION_FILE_BYTES) throw fail(`${label} file must be 4 MB or smaller`);
  if (!FILE_SIGNATURES[extension].some((sig) => sig.every((byte, k) => buffer[k] === byte))) {
    throw fail(`${label} file does not look like a valid ${extension.toUpperCase()}`);
  }

  return { name, extension, size: buffer.length, buffer };
};

app.post('/api/careers/applications', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (checkApplicationLimit(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Please wait a while before trying again.' });
  }

  const { name, position, email, phone, portfolio, linkedin, details } = req.body || {};
  if (!name || !position || !email) {
    return res.status(400).json({ error: 'Name, position, and email are required' });
  }
  if (!req.body.resume) {
    return res.status(400).json({ error: 'Please attach your resume' });
  }

  let files;
  try {
    files = {
      resume: readApplicationFile('resume', req.body.resume),
    };
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }

  const id = crypto.randomUUID();
  const application = {
    id,
    name: String(name).trim(),
    position: String(position).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    portfolio: String(portfolio || '').trim(),
    linkedin: String(linkedin || '').trim(),
    details: String(details || '').trim(),
    status: 'New',
    date: new Date().toISOString(),
  };

  // Files are stored under an id-named folder with a generated name, so nothing user-supplied ends up in a path.
  for (const [kind, file] of Object.entries(files)) {
    if (!file) continue;
    await fs.mkdir(path.join(APPLICATION_FILE_DIR, id), { recursive: true });
    await fs.writeFile(path.join(APPLICATION_FILE_DIR, id, `${kind}.${file.extension}`), file.buffer);
    application[kind] = { name: file.name, size: file.size, stored: `${kind}.${file.extension}` };
  }

  const db = await readDb();
  db.applications.unshift(application);
  await writeDb(db);
  return res.status(201).json({ success: true, application });
});

app.get('/api/admin/applications/:id/files/:kind', requireAdmin, async (req, res) => {
  const { id, kind } = req.params;
  if (!Object.hasOwn(APPLICATION_FILE_KINDS, kind)) return res.status(404).json({ error: 'File not found' });

  const db = await readDb();
  const file = db.applications.find((application) => application.id === id)?.[kind];
  if (!file?.stored) return res.status(404).json({ error: 'File not found' });

  return res.download(path.join(APPLICATION_FILE_DIR, id, file.stored), file.name, (error) => {
    if (error && !res.headersSent) res.status(404).json({ error: 'File not found' });
  });
});

app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  const db = await readDb();
  return res.json({
    stats: {
      totalProjects: db.projects.length,
      newMessages: db.messages.filter((message) => message.status === 'Unread').length,
      applications: db.applications.length,
      activeProjects: db.projects.filter((project) => ['Active', 'Live'].includes(project.status)).length,
      openJobs: db.jobs.filter((job) => job.status === 'Open').length,
    },
  });
});

// Unmatched /api/* routes return JSON, not the SPA HTML
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// SPA fallback: serve index.html for all remaining routes so React Router works on refresh
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err && !res.headersSent) res.status(404).json({ error: 'Not found' });
  });
});

// Production error handler: never expose stack traces
app.use((err, _req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  const status = typeof err.status === 'number' ? err.status
    : typeof err.statusCode === 'number' ? err.statusCode : 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Internal server error'),
  });
});

app.listen(PORT, () => {
  console.log(`NallGeeks server running on http://localhost:${PORT}`);
});
