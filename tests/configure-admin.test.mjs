import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scryptSync } from 'node:crypto';
import { configureAdmin } from '../scripts/configure-admin.mjs';

test('chosen password is hashed, settings preserved and reset rotates sessions', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'portfolio-admin-test-'));
  const path = join(folder, '.env.local');
  try {
    writeFileSync(path, 'SUPABASE_URL=https://example.supabase.co\nADMIN_PASSWORD_HASH=\n');
    const password = 'a memorable test passphrase';
    await configureAdmin({ path, prompt: async () => password });
    const content = readFileSync(path, 'utf8');
    assert.ok(content.includes('SUPABASE_URL=https://example.supabase.co'));
    assert.ok(!content.includes(password));
    const [, salt, hash] = content.match(/ADMIN_PASSWORD_HASH=([^:]+):([^\n]+)/);
    assert.equal(scryptSync(password, salt, 64).toString('hex'), hash);
    await assert.rejects(configureAdmin({ path, prompt: async () => password }), /--reset/);
    await configureAdmin({ path, reset: true, prompt: async () => 'another memorable test phrase' });
    const updated = readFileSync(path, 'utf8');
    assert.notEqual(updated.match(/ADMIN_SESSION_SECRET=(.*)/)[1], content.match(/ADMIN_SESSION_SECRET=(.*)/)[1]);
    assert.equal(updated.match(/ADMIN_PASSWORD_HASH=/g).length, 1);
  } finally { rmSync(folder, { recursive: true }); }
});

test('invalid or mismatched passwords leave the file untouched', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'portfolio-admin-test-'));
  const path = join(folder, '.env.local');
  try {
    writeFileSync(path, 'SUPABASE_URL=unchanged\n');
    await assert.rejects(configureAdmin({ path, prompt: async () => 'short' }), /12–256/);
    let count = 0;
    await assert.rejects(configureAdmin({ path, prompt: async () => count++ ? 'different confirmation' : 'a memorable test phrase' }), /did not match/);
    assert.equal(readFileSync(path, 'utf8'), 'SUPABASE_URL=unchanged\n');
  } finally { rmSync(folder, { recursive: true }); }
});
