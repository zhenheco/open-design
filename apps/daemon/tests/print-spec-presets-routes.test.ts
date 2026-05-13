import type http from 'node:http';
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { startServer } from '../src/server.js';

const dataDir = process.env.OD_DATA_DIR as string;

let baseUrl: string;
let server: http.Server;

beforeAll(async () => {
  const started = (await startServer({
    port: 0,
    returnServer: true,
  })) as { url: string; server: http.Server };
  baseUrl = started.url;
  server = started.server;
});

afterAll(() => (
  server
    ? new Promise<void>((resolve) => server.close(() => resolve()))
    : undefined
));

beforeEach(async () => {
  await fsp.rm(path.join(dataDir, 'print-spec-presets'), { recursive: true, force: true });
});

describe('print spec preset routes', () => {
  it('stores and lists reusable print specs', async () => {
    const create = await fetch(`${baseUrl}/api/print-spec-presets`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        label: 'Business card vendor',
        spec: {
          id: 'print_business_card_print_spec',
          label: 'Business card print spec',
          source: 'paste',
          rawText: 'CMYK only\nBleed: 3mm\nSafe area: 2mm\n300 DPI',
          requirements: {
            colorMode: 'cmyk-compatible',
            bleedMm: 3,
            safeAreaMm: 2,
            dpi: 300,
          },
          checklist: ['Use CMYK-compatible colors and avoid relying on screen-only RGB glow.'],
        },
      }),
    });
    expect(create.status).toBe(200);
    const created = await create.json() as {
      preset: { id: string; spec: { source: string; requirements: { bleedMm: number } } };
    };
    expect(created.preset).toMatchObject({
      id: 'preset_business_card_vendor',
      spec: {
        source: 'preset',
        requirements: { bleedMm: 3 },
      },
    });

    const list = await fetch(`${baseUrl}/api/print-spec-presets`);
    expect(list.status).toBe(200);
    const listed = await list.json() as { presets: Array<{ id: string }> };
    expect(listed.presets.map((preset) => preset.id)).toEqual(['preset_business_card_vendor']);
  });
});
