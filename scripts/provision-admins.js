import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(projectRoot, '.env.local') });
const accountsPath = path.resolve(process.env.ADMIN_ACCOUNTS_FILE || path.join(projectRoot, 'data', 'admin-users.json'));
const administrators = [
  { name: 'Izzah', email: 'Izzahsheikh667@gmail.com' },
  { name: 'Fawaz', email: 'mfawaz182@gmail.com' },
];

function promptSecret(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Run this command in an interactive terminal so passwords can be entered without echo.');
  }
  return new Promise((resolve, reject) => {
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    let value = '';
    const finish = (error) => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk) {
        if (character === '\u0003') return finish(new Error('Provisioning cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (character >= ' ') value += character;
      }
    };
    process.stdin.on('data', onData);
  });
}

function matchesSecret(first, second) {
  const a = Buffer.from(first);
  const b = Buffer.from(second);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function readExistingStore() {
  try {
    const store = JSON.parse(await fs.readFile(accountsPath, 'utf8'));
    return { version: 1, admins: Array.isArray(store.admins) ? store.admins : [] };
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 1, admins: [] };
    throw new Error('Could not read the existing administrator store. No accounts were changed.');
  }
}

async function main() {
  const store = await readExistingStore();
  const now = new Date().toISOString();
  for (const person of administrators) {
    let password;
    let confirmation;
    do {
      password = await promptSecret(`Set ${person.name}'s initial password (12–72 UTF-8 bytes): `);
      confirmation = await promptSecret('Confirm password: ');
      if (!matchesSecret(password, confirmation)) process.stdout.write('The entries did not match. Please try again.\n');
    } while (!matchesSecret(password, confirmation));

    if (Buffer.byteLength(password, 'utf8') < 12 || Buffer.byteLength(password, 'utf8') > 72) {
      throw new Error('Passwords must be between 12 and 72 UTF-8 bytes. Run the command again to retry.');
    }

    const emailNormalized = person.email.trim().toLowerCase();
    const existingIndex = store.admins.findIndex(account => String(account.email || '').trim().toLowerCase() === emailNormalized);
    const existing = existingIndex >= 0 ? store.admins[existingIndex] : null;
    const account = {
      id: existing?.id || crypto.randomUUID(),
      name: person.name,
      email: person.email,
      role: 'admin',
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    password = '';
    confirmation = '';
    if (existingIndex >= 0) store.admins[existingIndex] = account;
    else store.admins.push(account);
  }

  await fs.mkdir(path.dirname(accountsPath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${accountsPath}.${process.pid}.tmp`;
  const file = await fs.open(temporaryPath, 'w', 0o600);
  try {
    await file.writeFile(`${JSON.stringify(store, null, 2)}\n`, 'utf8');
    await file.sync();
  } finally {
    await file.close();
  }
  await fs.rename(temporaryPath, accountsPath);
  await fs.chmod(accountsPath, 0o600);
  process.stdout.write(`Administrator accounts provisioned or updated: ${administrators.map(person => person.email).join(', ')}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
