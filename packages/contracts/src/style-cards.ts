export type StyleCardId = string;
export type StyleCardSource = 'starter' | 'reference' | 'extracted';
export type StyleCardStatus = 'draft' | 'accepted' | 'ignored';

export interface StyleCardSignals {
  mood: string;
  color: string;
  typography: string;
  composition: string;
  density: string;
  transferNotes: string;
}

export interface StyleCardMetadata {
  id: StyleCardId;
  label: string;
  source: StyleCardSource;
  status?: StyleCardStatus;
  signals: StyleCardSignals;
  parameters?: StyleCardParameterSet;
  sourceReferences?: StyleCardReference[];
  createdAt?: number;
  updatedAt?: number;
}

export interface StyleCardReference {
  id: string;
  name: string;
}

export interface StyleCardReferenceInput extends StyleCardReference {
  description?: string;
  body?: string;
}

export interface StyleCardExtractionInput {
  label?: string;
  references: readonly StyleCardReferenceInput[];
}

export interface StyleCardParameterSet {
  mood: {
    keywords: string[];
    energy: string;
    formality: string;
  };
  color: {
    palette: string[];
    contrast: string;
    avoid: string[];
  };
  typography: {
    headline: string;
    body: string;
    details: string;
  };
  composition: {
    grid: string;
    focalPoint: string;
    whitespace: string;
  };
  density: {
    level: string;
    informationPacing: string;
  };
  imagery: {
    treatment: string;
    texture: string;
  };
  motion: {
    tempo: string;
    transitions: string;
  };
  print: {
    material: string;
    finish: string;
  };
  transfer: {
    notes: string;
    constraints: string[];
  };
}

export const STARTER_STYLE_CARDS: readonly StyleCardMetadata[] = [
  {
    id: 'neutral',
    label: 'Neutral default',
    source: 'starter',
    signals: {
      mood: 'clear, practical, product-appropriate',
      color: 'balanced neutral foundation with one purposeful accent',
      typography: 'clean system sans with strong hierarchy',
      composition: 'predictable grid with clear focal point',
      density: 'medium density with readable spacing',
      transferNotes: 'adapt to the selected artifact intent without adding a strong style bias',
    },
  },
  {
    id: 'editorial-noir',
    label: 'Editorial noir',
    source: 'starter',
    signals: {
      mood: 'dramatic, refined, high-confidence',
      color: 'black and warm white with one sharp accent',
      typography: 'condensed editorial sans headlines with restrained body copy',
      composition: 'asymmetric magazine-like grid with decisive scale jumps',
      density: 'medium-high information density with deliberate whitespace',
      transferNotes: 'use editorial contrast and hierarchy without copying a magazine cover',
    },
  },
  {
    id: 'playful-bold',
    label: 'Playful bold',
    source: 'starter',
    signals: {
      mood: 'energetic, friendly, optimistic',
      color: 'bright primary palette with clear contrast and limited accents',
      typography: 'rounded or geometric sans with large friendly headings',
      composition: 'chunky modular layout with simple focal areas',
      density: 'low-medium density with generous breathing room',
      transferNotes: 'carry the playful rhythm across media while preserving readability',
    },
  },
  {
    id: 'premium-calm',
    label: 'Premium calm',
    source: 'starter',
    signals: {
      mood: 'quiet, polished, trustworthy',
      color: 'muted neutrals with a restrained premium accent',
      typography: 'elegant sans or soft serif with careful spacing',
      composition: 'centered or balanced layout with high whitespace discipline',
      density: 'low density and calm pacing',
      transferNotes: 'translate the premium restraint into the target format without making it empty',
    },
  },
  {
    id: 'utility-tech',
    label: 'Utility tech',
    source: 'starter',
    signals: {
      mood: 'precise, efficient, credible',
      color: 'cool neutral UI palette with status and action colors',
      typography: 'system sans with optional monospace details',
      composition: 'data-aware grid with compact modules',
      density: 'medium-high density optimized for scanning',
      transferNotes: 'keep the operational clarity when moving between web, print, and social formats',
    },
  },
  {
    id: 'organic-craft',
    label: 'Organic craft',
    source: 'starter',
    signals: {
      mood: 'warm, handmade, tactile',
      color: 'earth-informed palette with natural contrast',
      typography: 'humanist serif or relaxed sans with tactile details',
      composition: 'soft asymmetry with material or texture cues',
      density: 'medium density with hand-finished spacing',
      transferNotes: 'transfer material feel and warmth without defaulting to generic beige',
    },
  },
];

export function findStarterStyleCard(id: StyleCardId): StyleCardMetadata {
  return STARTER_STYLE_CARDS.find((card) => card.id === id)
    ?? STARTER_STYLE_CARDS[0]!;
}

export function cloneStyleCardMetadata(card: StyleCardMetadata): StyleCardMetadata {
  const next: StyleCardMetadata = {
    ...card,
    signals: { ...card.signals },
  };
  if (card.parameters) next.parameters = cloneParameters(card.parameters);
  if (card.sourceReferences) {
    next.sourceReferences = card.sourceReferences.map((ref) => ({ ...ref }));
  }
  return next;
}

export function extractStyleCardFromReferences(input: StyleCardExtractionInput): StyleCardMetadata {
  const references = input.references.filter((ref) => ref.id && ref.name);
  const fallbackLabel = references.length === 1
    ? `${references[0]!.name} direction`
    : 'Extracted style direction';
  const label = normalizeWhitespace(input.label || fallbackLabel);
  const text = references
    .map((ref) => [ref.name, ref.description, ref.body].filter(Boolean).join('\n'))
    .join('\n\n');
  const mood = pickSignal(text, ['mood', 'feel', 'feeling', 'style', 'tone', 'atmosphere', 'vibe'], 'calm, coherent, reference-informed');
  const color = pickSignal(text, ['color', 'colour', 'palette', '配色', '色彩'], 'palette derived from the references with controlled contrast');
  const typography = pickSignal(text, ['typography', 'type', 'font', 'serif', 'sans', '字體', '字型'], 'typography chosen to match the reference personality');
  const composition = pickSignal(text, ['composition', 'layout', 'grid', 'hierarchy', '版面', '構圖'], 'structured layout with a clear focal hierarchy');
  const density = pickSignal(text, ['density', 'spacing', 'dense', 'compact', 'minimal', 'information', '留白', '密度'], 'medium density with intentional spacing');
  const referenceNames = references.map((ref) => ref.name).join(', ');
  const transferNotes = `Adapt signals from ${referenceNames || 'the selected references'} to the target medium without copying source artwork, logos, or protected layouts.`;
  const parameters: StyleCardParameterSet = {
    mood: {
      keywords: splitSignal(mood),
      energy: inferEnergy(mood),
      formality: inferFormality(mood),
    },
    color: {
      palette: splitSignal(color),
      contrast: inferContrast(color),
      avoid: [],
    },
    typography: {
      headline: typography,
      body: typography,
      details: findDetail(text, ['uppercase', 'caption', 'microcopy', 'details']) || 'keep supporting text disciplined and readable',
    },
    composition: {
      grid: composition,
      focalPoint: findDetail(text, ['focal', 'hero', 'label', 'headline']) || 'single clear primary focal point',
      whitespace: findDetail(text, ['whitespace', 'space', 'spacing', '留白']) || density,
    },
    density: {
      level: density,
      informationPacing: density,
    },
    imagery: {
      treatment: findDetail(text, ['image', 'imagery', 'photo', 'illustration', 'texture']) || 'use imagery only when it reinforces the style signal',
      texture: findDetail(text, ['texture', 'paper', 'material', 'foil', 'grain']) || 'no mandatory texture',
    },
    motion: {
      tempo: findDetail(text, ['motion', 'animation', 'tempo']) || 'none unless the target medium is motion',
      transitions: findDetail(text, ['transition', 'easing']) || 'keep transitions simple and style-consistent',
    },
    print: {
      material: findDetail(text, ['paper', 'stock', 'material']) || 'unspecified',
      finish: findDetail(text, ['foil', 'spot uv', 'emboss', 'finish']) || 'unspecified',
    },
    transfer: {
      notes: transferNotes,
      constraints: ['Do not copy source artwork', 'Translate style signals across media'],
    },
  };

  const now = Date.now();
  return {
    id: deriveStyleCardId(label),
    label,
    source: 'extracted',
    status: 'draft',
    signals: {
      mood,
      color,
      typography,
      composition,
      density,
      transferNotes,
    },
    parameters,
    sourceReferences: references.map((ref) => ({ id: ref.id, name: ref.name })),
    createdAt: now,
    updatedAt: now,
  };
}

function cloneParameters(parameters: StyleCardParameterSet): StyleCardParameterSet {
  return {
    mood: { ...parameters.mood, keywords: [...parameters.mood.keywords] },
    color: { ...parameters.color, palette: [...parameters.color.palette], avoid: [...parameters.color.avoid] },
    typography: { ...parameters.typography },
    composition: { ...parameters.composition },
    density: { ...parameters.density },
    imagery: { ...parameters.imagery },
    motion: { ...parameters.motion },
    print: { ...parameters.print },
    transfer: { ...parameters.transfer, constraints: [...parameters.transfer.constraints] },
  };
}

function deriveStyleCardId(label: string): string {
  const slug = normalizeWhitespace(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
  return `style_${slug || 'extracted_direction'}`;
}

function normalizeWhitespace(value: string): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function pickSignal(text: string, keywords: readonly string[], fallback: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line.replace(/^[-*]\s*/, '')))
    .filter(Boolean);
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    const match = lines.find((line) => line.toLowerCase().includes(lowerKeyword));
    if (match) return stripSignalPrefix(match);
  }
  return fallback;
}

function stripSignalPrefix(line: string): string {
  return normalizeWhitespace(line.replace(/^[A-Za-z ]{2,24}[:：]\s*/, ''));
}

function splitSignal(signal: string): string[] {
  return signal
    .split(/[,;/]| and /i)
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean)
    .slice(0, 8);
}

function findDetail(text: string, keywords: readonly string[]): string {
  return pickSignal(text, keywords, '');
}

function inferEnergy(mood: string): string {
  const lower = mood.toLowerCase();
  if (/(bold|energetic|dynamic|playful|loud)/.test(lower)) return 'high';
  if (/(calm|quiet|minimal|serene|soft)/.test(lower)) return 'low';
  return 'medium';
}

function inferFormality(mood: string): string {
  const lower = mood.toLowerCase();
  if (/(premium|editorial|luxury|formal|refined)/.test(lower)) return 'formal';
  if (/(playful|casual|friendly)/.test(lower)) return 'casual';
  return 'neutral';
}

function inferContrast(color: string): string {
  const lower = color.toLowerCase();
  if (/(black|white|sharp|high contrast)/.test(lower)) return 'high';
  if (/(muted|soft|low contrast|pastel)/.test(lower)) return 'low-medium';
  return 'medium';
}
