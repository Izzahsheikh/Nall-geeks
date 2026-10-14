#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Idempotent data correction for the existing data/db.json schema.
// Defaults to dry-run. Production paths must be supplied explicitly.
const projects = [
  {
    id: 'ng-partitions',
    name: 'NG Partitions',
    aliases: ['N&G Partitions LTD', 'N&G Partitions'],
    category: 'Commercial Interiors / Web',
    shortDescription: 'Precision Interior Specialists',
    fullDescription: 'A considered digital presence for a UK commercial interiors specialist, designed around clarity, restraint and architectural precision. The experience turns technical services and project work into a structured visual story built to communicate trust from the first interaction.',
    imageUrl: '',
    projectUrl: 'https://ngpartitions.co.uk',
    featured: false,
    order: 1,
  },
  {
    id: 'dan-mot',
    name: 'Dan MOT',
    aliases: ['MOT Norwich'],
    category: 'Automotive / Web',
    shortDescription: 'Trusted MOT & Car Servicing',
    fullDescription: "A trust-first digital presence for a local Norwich garage. The site is built to rank in local search, convert mobile visitors quickly, and communicate the garage's straightforward, reliable approach to car care — without noise or unnecessary complexity.",
    imageUrl: '',
    projectUrl: 'https://mot-norwich.co.uk/',
    featured: false,
    order: 2,
  },
  {
    id: 'trip2airport',
    name: 'Trip2Airport',
    aliases: [],
    category: 'Transport / Web',
    shortDescription: 'Airport Transfers, Simplified',
    fullDescription: 'A booking-first web experience for a professional airport transfer service. The design strips away friction at every stage — clear pricing, fast load, and a mobile experience that guides passengers from landing page to confirmed booking without a single unnecessary step.',
    imageUrl: '',
    projectUrl: 'https://www.trip2airport.co.uk/',
    featured: false,
    order: 3,
  },
  {
    id: 'gogo-tyres',
    name: 'GoGo Tyres',
    aliases: ['GoGo Tyre Norwich'],
    category: 'Automotive / Web',
    shortDescription: 'Tyres Fitted the Modern Way',
    fullDescription: 'A dark, performance-driven identity for a Norwich tyre garage that leads with speed and trust. Every design decision — from the bold typographic hierarchy to the mobile-first layout — serves one goal: get local customers from search to booked appointment in seconds.',
    imageUrl: '',
    projectUrl: 'https://gogotyre.co.uk',
    featured: false,
    order: 4,
  },
];

const dummyProjectIds = new Set(['organicfields', 'zylo', 'rankgrad', 'nallgeeks-website']);
const dummyProjectNames = new Set(['organicfields.pk', 'zylo', 'rankgrad', 'nallgeeks website']);
const dummyApplicationIds = new Set(['app-hassan', 'app-zara']);
const dummyApplications = new Set([
  'hassan ali|hassan.dev@example.com',
  'zara sheikh|zara.design@example.com',
]);
const projectFields = ['name', 'category', 'shortDescription', 'fullDescription', 'imageUrl', 'projectUrl', 'featured', 'order'];

const usage = () => {
  console.log(`Usage:\n  node scripts/migrate-production-business-data.js --db /absolute/path/to/data/db.json [--dry-run | --apply]\n\nDry-run is the default. --apply writes a verified backup beside the database before atomically replacing it.`);
};

function parseArgs(args) {
  let databasePath = '';
  let mode = 'dry-run';
  let modeWasSet = false;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--db') {
      if (databasePath) throw new Error('Pass --db only once.');
      databasePath = args[++i] || '';
    } else if (arg === '--apply' || arg === '--dry-run') {
      if (modeWasSet) throw new Error('Choose only one of --dry-run or --apply.');
      mode = arg === '--apply' ? 'apply' : 'dry-run';
      modeWasSet = true;
    }
    else if (arg === '--help' || arg === '-h') return { help: true };
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!databasePath) throw new Error('Pass the production database path explicitly with --db.');
  return { databasePath: path.resolve(databasePath), mode };
}

const normalized = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const normalizedUrl = (value) => String(value || '').trim().toLowerCase().replace(/\/$/, '');
const digest = (data) => crypto.createHash('sha256').update(data).digest('hex');
const pretty = (value) => `${JSON.stringify(value, null, 2)}\n`;

function validateDatabase(db) {
  if (!db || Array.isArray(db) || typeof db !== 'object') throw new Error('Database root must be a JSON object.');
  for (const key of ['projects', 'jobs', 'messages', 'applications']) {
    if (!Array.isArray(db[key])) throw new Error(`Expected "${key}" to be an array; refusing to modify this database.`);
  }
}

function isDummyProject(project) {
  return dummyProjectIds.has(String(project.id || '').toLowerCase())
    || dummyProjectNames.has(normalized(project.name));
}

function isDummyApplication(application) {
  return dummyApplicationIds.has(String(application.id || '').toLowerCase())
    || dummyApplications.has(`${normalized(application.name)}|${normalized(application.email)}`);
}

function planMigration(source) {
  validateDatabase(source);
  const original = structuredClone(source);
  const db = structuredClone(source);
  const removedProjects = db.projects.filter(isDummyProject);
  const removedApplications = db.applications.filter(isDummyApplication);
  db.projects = db.projects.filter((project) => !isDummyProject(project));
  db.applications = db.applications.filter((application) => !isDummyApplication(application));

  const projectActions = [];
  const claimed = new Set();
  for (const target of projects) {
    const matchKeys = new Set([target.id, target.name, ...target.aliases].map(normalized));
    const matchUrls = new Set([normalizedUrl(target.projectUrl)]);
    const matches = db.projects.filter((existing) => (
      matchKeys.has(normalized(existing.id))
      || matchKeys.has(normalized(existing.name))
      || matchUrls.has(normalizedUrl(existing.projectUrl))
    ));
    if (matches.length > 1) {
      throw new Error(`More than one existing project matches ${target.name}; resolve these records manually before retrying.`);
    }
    const existing = matches[0];
    if (existing && claimed.has(existing)) throw new Error(`An existing record matched multiple target projects near ${target.name}.`);
    if (existing) {
      claimed.add(existing);
      const next = { ...existing };
      const changedFields = [];
      for (const field of projectFields) {
        // A blank local image value is not permission to erase production media.
        if (field === 'imageUrl' && !target.imageUrl) continue;
        if (JSON.stringify(existing[field]) === JSON.stringify(target[field])) continue;
        next[field] = target[field];
        changedFields.push(field);
      }
      if (changedFields.length) {
        Object.assign(existing, next);
        projectActions.push({ action: 'update', name: target.name, id: existing.id, changedFields });
      } else {
        projectActions.push({ action: 'keep', name: target.name, id: existing.id });
      }
    } else {
      const { aliases, ...record } = target;
      db.projects.push(record);
      projectActions.push({ action: 'add', name: target.name, id: target.id });
    }
  }

  return {
    db,
    changed: JSON.stringify(original) !== JSON.stringify(db),
    removedProjects: removedProjects.map(({ id, name }) => ({ id, name })),
    removedApplications: removedApplications.map(({ id, name }) => ({ id, name })),
    projectActions,
    preserved: {
      messages: db.messages.length,
      jobs: db.jobs.length,
      applications: db.applications.length,
      projectCountAfter: db.projects.length,
    },
  };
}

async function writeAtomic(databasePath, content) {
  const tempPath = path.join(path.dirname(databasePath), `.${path.basename(databasePath)}.${process.pid}.tmp`);
  try {
    const { mode } = await fs.stat(databasePath);
    const handle = await fs.open(tempPath, 'wx', mode & 0o777);
    try {
      await handle.writeFile(content, 'utf8');
      await handle.sync();
    } finally {
      await handle.close();
    }
    await fs.chmod(tempPath, mode & 0o777);
    JSON.parse(await fs.readFile(tempPath, 'utf8'));
    await fs.rename(tempPath, databasePath);
  } catch (error) {
    await fs.rm(tempPath, { force: true });
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return usage();
  const databasePath = await fs.realpath(options.databasePath);
  const { mode } = options;
  const originalContent = await fs.readFile(databasePath);
  const database = JSON.parse(originalContent.toString('utf8'));
  const plan = planMigration(database);
  const beforeHash = digest(originalContent);

  const report = {
    mode,
    databasePath,
    databaseSha256: beforeHash,
    changes: {
      removeDummyProjects: plan.removedProjects,
      removeSampleApplications: plan.removedApplications,
      genuineProjects: plan.projectActions,
      resultingCounts: plan.preserved,
      messagesAndJobs: 'preserved without modification',
      statuses: 'not added or inferred',
    },
    wouldModifyDatabase: plan.changed,
  };

  if (mode === 'dry-run' || !plan.changed) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const date = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${databasePath}.backup-${date}`;
  await fs.copyFile(databasePath, backupPath, fs.constants.COPYFILE_EXCL);
  await fs.chmod(backupPath, 0o600);
  const backupContent = await fs.readFile(backupPath);
  if (digest(backupContent) !== beforeHash) {
    await fs.rm(backupPath, { force: true });
    throw new Error('Backup verification failed; original database was left unchanged.');
  }

  const currentContent = await fs.readFile(databasePath);
  if (digest(currentContent) !== beforeHash) {
    throw new Error(`Database changed during backup. No write performed. Verified backup kept at ${backupPath}`);
  }

  await writeAtomic(databasePath, pretty(plan.db));
  Object.assign(report, {
    applied: true,
    backupPath,
    backupSha256: digest(backupContent),
    databaseSha256After: digest(await fs.readFile(databasePath)),
  });
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(`Migration stopped: ${error.message}`);
  process.exitCode = 1;
});
