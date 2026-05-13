import { promises as fsp } from 'node:fs';
import path from 'node:path';
import type { PrintSpecMetadata, PrintSpecPreset } from '@open-design/contracts/print-specs';

const PRESET_DIR = 'print-spec-presets';
const PRESET_FILE = 'presets.json';

function presetsPath(dataDir: string): string {
  return path.join(dataDir, PRESET_DIR, PRESET_FILE);
}

export async function listPrintSpecPresets(dataDir: string): Promise<PrintSpecPreset[]> {
  try {
    const raw = await fsp.readFile(presetsPath(dataDir), 'utf8');
    const parsed = JSON.parse(raw) as { presets?: unknown[] };
    return Array.isArray(parsed.presets)
      ? parsed.presets.filter(isPreset)
      : [];
  } catch {
    return [];
  }
}

export async function upsertPrintSpecPreset(
  dataDir: string,
  input: { label?: string; spec?: PrintSpecMetadata },
): Promise<{ preset: PrintSpecPreset; presets: PrintSpecPreset[] }> {
  if (!input.spec || !isPrintSpec(input.spec)) {
    throw new Error('print spec is required');
  }
  const now = Date.now();
  const label = input.label?.trim() || input.spec.label;
  const preset: PrintSpecPreset = {
    id: derivePresetId(label),
    label,
    spec: { ...input.spec, source: 'preset' },
    createdAt: now,
    updatedAt: now,
  };
  const current = await listPrintSpecPresets(dataDir);
  const previous = current.find((item) => item.id === preset.id);
  if (previous) preset.createdAt = previous.createdAt;
  const presets = [
    preset,
    ...current.filter((item) => item.id !== preset.id),
  ];
  await fsp.mkdir(path.join(dataDir, PRESET_DIR), { recursive: true });
  await fsp.writeFile(presetsPath(dataDir), JSON.stringify({ presets }, null, 2));
  return { preset, presets };
}

function isPreset(value: unknown): value is PrintSpecPreset {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PrintSpecPreset>;
  return (
    typeof record.id === 'string'
    && typeof record.label === 'string'
    && isPrintSpec(record.spec)
    && typeof record.createdAt === 'number'
    && typeof record.updatedAt === 'number'
  );
}

function isPrintSpec(value: unknown): value is PrintSpecMetadata {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PrintSpecMetadata>;
  return (
    typeof record.id === 'string'
    && typeof record.label === 'string'
    && typeof record.rawText === 'string'
    && !!record.requirements
    && Array.isArray(record.checklist)
  );
}

function derivePresetId(label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 64);
  return `preset_${slug || 'print_spec'}`;
}
