import type http from 'node:http';
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { startServer } from '../src/server.js';

interface StartedServer {
  url: string;
  server: http.Server;
}

const dataDir = process.env.OD_DATA_DIR as string;

let baseUrl: string;
let server: http.Server;

beforeAll(async () => {
  const started = (await startServer({
    port: 0,
    returnServer: true,
  })) as StartedServer;
  baseUrl = started.url;
  server = started.server;
});

afterAll(() => (
  server
    ? new Promise<void>((resolve) => server.close(() => resolve()))
    : undefined
));

beforeEach(async () => {
  await fsp.rm(path.join(dataDir, 'taste-profile'), { recursive: true, force: true });
});

describe('taste profile routes', () => {
  it('accepts a draft Style card into the long-term taste profile', async () => {
    const getEmpty = await fetch(`${baseUrl}/api/taste-profile`);
    expect(getEmpty.status).toBe(200);
    expect(await getEmpty.json()).toMatchObject({
      profile: { styleCards: [], updatedAt: null },
    });

    const acceptRes = await fetch(`${baseUrl}/api/taste-profile/style-cards`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        styleCard: {
          id: 'style_premium_packaging_direction',
          label: 'Premium packaging direction',
          source: 'extracted',
          status: 'draft',
          signals: {
            mood: 'premium, confident',
            color: 'deep green, ivory, muted gold foil',
            typography: 'elegant serif with uppercase details',
            composition: 'centered label grid',
            density: 'low density front, detailed back',
            transferNotes: 'Adapt packaging signals without copying source art.',
          },
          sourceReferences: [
            { id: 'reference_packaging_ref', name: 'Packaging reference' },
          ],
        },
      }),
    });
    expect(acceptRes.status).toBe(200);
    const accepted = await acceptRes.json() as {
      styleCard: { id: string; status?: string };
      profile: { styleCards: Array<{ id: string; status?: string }> };
    };
    expect(accepted.styleCard).toMatchObject({
      id: 'style_premium_packaging_direction',
      status: 'accepted',
    });
    expect(accepted.profile.styleCards).toEqual([
      expect.objectContaining({
        id: 'style_premium_packaging_direction',
        status: 'accepted',
      }),
    ]);

    const getProfile = await fetch(`${baseUrl}/api/taste-profile`);
    const profile = await getProfile.json() as {
      profile: { styleCards: Array<{ id: string; signals: { color: string } }> };
    };
    expect(profile.profile.styleCards[0]?.signals.color).toContain('deep green');

    const promptRes = await fetch(`${baseUrl}/api/taste-profile/system-prompt`);
    expect(promptRes.status).toBe(200);
    const prompt = await promptRes.json() as { body: string };
    expect(prompt.body).toContain('## Taste profile');
    expect(prompt.body).toContain('Premium packaging direction');
    expect(prompt.body).toContain('deep green, ivory, muted gold foil');
    expect(prompt.body).toContain('Adapt these accepted style signals across media');
    expect(prompt.body).toContain('Packaging reference');
  });
});
