export type PrintSpecSource = 'paste' | 'upload' | 'preset';

export interface PrintSpecRequirements {
  colorMode: 'cmyk-compatible' | 'rgb-ok';
  bleedMm?: number;
  safeAreaMm?: number;
  dpi?: number;
  finish?: string;
  material?: string;
}

export interface PrintSpecMetadata {
  id: string;
  label: string;
  source: PrintSpecSource;
  rawText: string;
  requirements: PrintSpecRequirements;
  checklist: string[];
}

export interface PrintSpecPreset {
  id: string;
  label: string;
  spec: PrintSpecMetadata;
  createdAt: number;
  updatedAt: number;
}

export interface PrintSpecPresetsResponse {
  presets: PrintSpecPreset[];
}

export interface UpsertPrintSpecPresetRequest {
  label?: string;
  spec: PrintSpecMetadata;
}

export interface UpsertPrintSpecPresetResponse {
  preset: PrintSpecPreset;
  presets: PrintSpecPreset[];
}

export function buildPrintSpecMetadata(input: {
  label?: string;
  source?: PrintSpecSource;
  text: string;
}): PrintSpecMetadata | undefined {
  const rawText = input.text.trim();
  if (!rawText) return undefined;
  const label = normalize(input.label || 'Print vendor spec');
  const requirements = extractPrintRequirements(rawText);
  return {
    id: derivePrintSpecId(label),
    label,
    source: input.source ?? 'paste',
    rawText,
    requirements,
    checklist: buildChecklist(requirements),
  };
}

function extractPrintRequirements(text: string): PrintSpecRequirements {
  const lower = text.toLowerCase();
  const bleedMm = pickMm(lower, /bleed[^0-9]*(\d+(?:\.\d+)?)\s*mm/i)
    ?? pickMm(lower, /出血[^0-9]*(\d+(?:\.\d+)?)\s*mm/i);
  const safeAreaMm = pickMm(lower, /(?:safe|safety)[^0-9]*(\d+(?:\.\d+)?)\s*mm/i)
    ?? pickMm(lower, /安全[^0-9]*(\d+(?:\.\d+)?)\s*mm/i);
  const dpi = pickInt(lower, /(\d{2,4})\s*dpi/i);
  const requirements: PrintSpecRequirements = {
    colorMode: lower.includes('cmyk') || lower.includes('四色') ? 'cmyk-compatible' : 'rgb-ok',
  };
  if (bleedMm !== undefined) requirements.bleedMm = bleedMm;
  if (safeAreaMm !== undefined) requirements.safeAreaMm = safeAreaMm;
  if (dpi !== undefined) requirements.dpi = dpi;
  const finish = findLine(text, ['finish', 'foil', 'lamination', 'uv', '加工', '燙', '霧膜']);
  if (finish) requirements.finish = finish;
  const material = findLine(text, ['paper', 'stock', 'material', 'gsm', '材質', '紙']);
  if (material) requirements.material = material;
  return requirements;
}

function buildChecklist(requirements: PrintSpecRequirements): string[] {
  const checklist = [
    'Use CMYK-compatible colors and avoid relying on screen-only RGB glow.',
    'Keep live text and important marks inside the safe area.',
    'Include print handoff notes with size, bleed, safe area, DPI, and finish assumptions.',
  ];
  if (requirements.bleedMm !== undefined) checklist.push(`Extend backgrounds ${requirements.bleedMm}mm into bleed.`);
  if (requirements.dpi !== undefined) checklist.push(`Prepare raster assets at ${requirements.dpi} DPI or higher.`);
  return checklist;
}

function derivePrintSpecId(label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 64);
  return `print_${slug || 'spec'}`;
}

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function pickMm(text: string, re: RegExp): number | undefined {
  const match = re.exec(text);
  if (!match?.[1]) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function pickInt(text: string, re: RegExp): number | undefined {
  const match = re.exec(text);
  if (!match?.[1]) return undefined;
  const value = Number.parseInt(match[1], 10);
  return Number.isFinite(value) ? value : undefined;
}

function findLine(text: string, keywords: string[]): string | undefined {
  return text
    .split(/\r?\n/)
    .map((line) => normalize(line.replace(/^[-*]\s*/, '')))
    .find((line) => keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase())));
}
