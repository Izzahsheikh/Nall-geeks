import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import { Resend } from 'resend';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const PROJECT_UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'projects');
// Application attachments are private (résumés): they live under data/, which is never served statically.
const APPLICATION_FILE_DIR = path.join(__dirname, 'data', 'applications');
const MAX_APPLICATION_FILE_BYTES = 4 * 1024 * 1024;
const APPLICATION_FILE_KINDS = {
  resume: { label: 'Resume', extensions: ['pdf', 'doc', 'docx'] },
  portfolioFile: { label: 'Portfolio', extensions: ['pdf', 'zip', 'jpg', 'jpeg', 'png'] },
};
const APPLICATION_AVAILABILITY = ['Immediately', '2 Weeks Notice', '1 Month Notice', 'Other'];
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
const sessionSecret = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
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

app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

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

const createToken = (email) => {
  const payload = Buffer.from(JSON.stringify({
    email,
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

const requireAdmin = (req, res, next) => {
  const session = readToken(parseCookies(req.headers.cookie)[SESSION_COOKIE]);

  if (!session) {
    return res.status(401).json({ error: 'Admin login required' });
  }

  req.admin = session;
  return next();
};

const comparePassword = (password) => {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedPassword && !expectedHash) return false;

  if (expectedHash) {
    return crypto.createHash('sha256').update(password).digest('hex') === expectedHash;
  }

  return password === expectedPassword;
};

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

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH)) {
    return res.status(500).json({ error: 'Admin credentials are not configured on the server' });
  }

  if (email !== adminEmail || !comparePassword(String(password || ''))) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(createToken(email))}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`
  );
  return res.json({ admin: { email } });
});

app.post('/api/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
  return res.json({ success: true });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  return res.json({ admin: { email: req.admin.email } });
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
  const { firstName, lastName, phone, email, company, message } = req.body || {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = await readDb();
  const savedMessage = {
    id: crypto.randomUUID(),
    sender: `${firstName} ${lastName}`.trim(),
    email,
    phone: phone || '',
    company: company || '',
    subject: company ? `Project inquiry from ${company}` : `Project inquiry from ${firstName} ${lastName}`,
    body: message || '',
    status: 'Unread',
    date: new Date().toISOString(),
  };

  db.messages.unshift(savedMessage);
  await writeDb(db);

  if (resend) {
    try {
      await resend.emails.send({
        from: 'NallGeeks Website <onboarding@resend.dev>',
        to: process.env.CONTACT_TO_EMAIL || 'contact@nallgeeks.com',
        replyTo: email,
        subject: `New inquiry from ${firstName} ${lastName}`,
        text: [
          `Name: ${firstName} ${lastName}`,
          `Email: ${email}`,
          `Phone: ${phone || '-'}`,
          `Company: ${company || '-'}`,
          '',
          'Message:',
          message || '-',
        ].join('\n'),
      });
    } catch (err) {
      console.error('Resend error:', err);
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
  const { name, position, email, phone, portfolio, linkedin, availability, availabilityNote, details } = req.body || {};
  if (!name || !position || !email) {
    return res.status(400).json({ error: 'Name, position, and email are required' });
  }
  if (availability && !APPLICATION_AVAILABILITY.includes(availability)) {
    return res.status(400).json({ error: 'Choose one of the listed availability options' });
  }
  if (!req.body.resume) {
    return res.status(400).json({ error: 'Please attach your resume' });
  }

  let files;
  try {
    files = {
      resume: readApplicationFile('resume', req.body.resume),
      portfolioFile: readApplicationFile('portfolioFile', req.body.portfolioFile),
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
    availability: String(availability || '').trim(),
    availabilityNote: availability === 'Other' ? String(availabilityNote || '').trim().slice(0, 300) : '',
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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
