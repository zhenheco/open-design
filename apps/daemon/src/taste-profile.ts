import { promises as fsp } from 'node:fs';
import path from 'node:path';
import type { StyleCardMetadata } from '@open-design/contracts/style-cards';
import type { TasteProfile } from '@open-design/contracts/api/taste-profile';

const PROFILE_DIR = 'taste-profile';
const PROFILE_FILE = 'style-cards.json';

function profilePath(dataDir: string): string {
  return path.join(dataDir, PROFILE_DIR, PROFILE_FILE);
}

async function ensureProfileDir(dataDir: string): Promise<void> {
  await fsp.mkdir(path.join(dataDir, PROFILE_DIR), { recursive: true });
}

export async function readTasteProfile(dataDir: string): Promise<TasteProfile> {
  try {
    const raw = await fsp.readFile(profilePath(dataDir), 'utf8');
    const parsed = JSON.parse(raw) as Partial<TasteProfile>;
    return {
      styleCards: Array.isArray(parsed.styleCards)
        ? parsed.styleCards.filter(isStyleCard)
        : [],
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null,
    };
  } catch {
    return { styleCards: [], updatedAt: null };
  }
}

export async function acceptTasteProfileStyleCard(
  dataDir: string,
  input: unknown,
): Promise<{ styleCard: StyleCardMetadata; profile: TasteProfile }> {
  if (!isStyleCard(input)) {
    throw new Error('styleCard with six signals is required');
  }
  const now = Date.now();
  const accepted: StyleCardMetadata = {
    ...input,
    source: isStyleCardSource(input.source) ? input.source : 'extracted',
    status: 'accepted',
    signals: { ...input.signals },
    updatedAt: now,
  };
  if (typeof input.createdAt === 'number') accepted.createdAt = input.createdAt;
  else accepted.createdAt = now;
  if (input.parameters) accepted.parameters = input.parameters;
  if (input.sourceReferences) {
    accepted.sourceReferences = input.sourceReferences.map((ref) => ({ ...ref }));
  }

  const current = await readTasteProfile(dataDir);
  const nextCards = [
    accepted,
    ...current.styleCards.filter((card) => card.id !== accepted.id),
  ];
  const profile: TasteProfile = { styleCards: nextCards, updatedAt: now };
  await ensureProfileDir(dataDir);
  await fsp.writeFile(profilePath(dataDir), JSON.stringify(profile, null, 2));
  return { styleCard: accepted, profile };
}

export async function composeTasteProfileBody(dataDir: string): Promise<string> {
  const profile = await readTasteProfile(dataDir);
  const accepted = profile.styleCards.filter((card) => card.status === 'accepted');
  if (accepted.length === 0) return '';
  const lines = ['## Taste profile', ''];
  for (const card of accepted) {
    lines.push(`- **${card.label}** (\`${card.id}\`)`);
    lines.push(`  - Mood: ${card.signals.mood}`);
    lines.push(`  - Color: ${card.signals.color}`);
    lines.push(`  - Typography: ${card.signals.typography}`);
    lines.push(`  - Composition: ${card.signals.composition}`);
    lines.push(`  - Density: ${card.signals.density}`);
    lines.push(`  - Transfer: ${card.signals.transferNotes}`);
    if (card.sourceReferences?.length) {
      lines.push(
        `  - Sources: ${card.sourceReferences
          .map((ref) => `${ref.name} (${ref.id})`)
          .join('; ')}`,
      );
    }
    lines.push(
      '  - Cross-medium rule: Adapt these accepted style signals across media without copying source artwork, logos, protected layouts, or the original medium one-to-one.',
    );
  }
  return lines.join('\n').trim();
}

function isStyleCard(value: unknown): value is StyleCardMetadata {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<StyleCardMetadata>;
  const signals = record.signals;
  return (
    typeof record.id === 'string'
    && typeof record.label === 'string'
    && !!signals
    && typeof signals.mood === 'string'
    && typeof signals.color === 'string'
    && typeof signals.typography === 'string'
    && typeof signals.composition === 'string'
    && typeof signals.density === 'string'
    && typeof signals.transferNotes === 'string'
  );
}

function isStyleCardSource(value: unknown): value is StyleCardMetadata['source'] {
  return value === 'starter' || value === 'reference' || value === 'extracted';
}
