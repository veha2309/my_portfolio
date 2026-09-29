import { randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { emitKeypressEvents } from 'node:readline';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function readPassword(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Run this command in an interactive terminal to enter your password privately.');
  }
  return new Promise((resolvePassword, reject) => {
    let value = '';
    const wasRaw = Boolean(process.stdin.isRaw);
    emitKeypressEvents(process.stdin);
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    const finish = () => {
      process.stdin.removeListener('keypress', onKey);
      process.stdin.setRawMode(wasRaw);
      process.stdin.pause();
      process.stdout.write('\n');
    };
    const onKey = (text, key = {}) => {
      if ((key.ctrl && key.name === 'c') || (key.ctrl && key.name === 'd')) {
        finish(); reject(new Error('Cancelled. No settings changed.')); return;
      }
      if (key.name === 'return' || key.name === 'enter') {
        finish(); resolvePassword(value); return;
      }
      if (key.name === 'backspace') { value = Array.from(value).slice(0, -1).join(''); return; }
      if (!key.ctrl && !key.meta && text && !/[\x00-\x1f\x7f]/.test(text)) value += text;
    };
    process.stdin.on('keypress', onKey);
  });
}

export async function configureAdmin({ path = new URL('../.env.local', import.meta.url), reset = false, prompt = readPassword } = {}) {
  let existing = '';
  try { existing = readFileSync(path, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!reset && /^ADMIN_(PASSWORD_HASH|SESSION_SECRET)=\S+/m.test(existing)) {
    throw new Error('Admin settings already exist. Use --reset to choose a new password and rotate sessions.');
  }
  const password = await prompt('Choose your admin password (12–256 characters; input hidden): ');
  if (password.length < 12 || password.length > 256 || !password.trim()) {
    throw new Error('Use 12–256 characters. A memorable multi-word passphrase works well. No settings changed.');
  }
  const confirmation = await prompt('Confirm your password (input hidden): ');
  if (password !== confirmation) throw new Error('Passwords did not match. No settings changed.');
  const salt = randomBytes(16).toString('hex');
  const hash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  const preserved = existing.replace(/^ADMIN_(PASSWORD_HASH|SESSION_SECRET)=[^\r\n]*(?:\r?\n|$)/gm, '');
  writeFileSync(path, `${preserved}${preserved.endsWith('\n') || !preserved ? '' : '\n'}ADMIN_PASSWORD_HASH=${hash}\nADMIN_SESSION_SECRET=${randomBytes(48).toString('hex')}\n`, { mode: 0o600 });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await configureAdmin({ reset: process.argv.includes('--reset') });
    console.log('Your password is set. Only its hash and a new session secret were saved to .env.local. Copy ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET into Vercel server environment settings and redeploy to activate them. Your password is never printed or stored as plain text.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
