import { describe, expect, it } from 'vitest';

import {
  STARTER_STYLE_CARDS,
  extractStyleCardFromReferences,
} from '../src/style-cards';

describe('starter style cards', () => {
  it('ships a neutral option and opinionated starter directions', () => {
    expect(STARTER_STYLE_CARDS.length).toBeGreaterThanOrEqual(5);
    expect(STARTER_STYLE_CARDS[0]?.id).toBe('neutral');
    expect(STARTER_STYLE_CARDS.map((card) => card.id)).toContain('editorial-noir');
  });

  it('keeps each starter card generation-ready with six novice-facing signals', () => {
    for (const card of STARTER_STYLE_CARDS) {
      expect(card.label).toBeTruthy();
      expect(card.signals.mood).toBeTruthy();
      expect(card.signals.color).toBeTruthy();
      expect(card.signals.typography).toBeTruthy();
      expect(card.signals.composition).toBeTruthy();
      expect(card.signals.density).toBeTruthy();
      expect(card.signals.transferNotes).toBeTruthy();
    }
  });

  it('extracts an editable style card proposal from reference notes', () => {
    const card = extractStyleCardFromReferences({
      label: 'Premium tea packaging direction',
      references: [
        {
          id: 'reference_tea_packaging',
          name: 'Tea packaging reference',
          description: 'Quiet premium packaging with foil label hierarchy',
          body: [
            '- Mood: calm, premium, editorial',
            '- Color palette: deep green, ivory, muted gold foil',
            '- Typography: elegant serif headline with tiny uppercase details',
            '- Composition: centered label grid with generous whitespace',
            '- Density: low density front, detailed information on back',
          ].join('\n'),
        },
      ],
    });

    expect(card).toMatchObject({
      id: 'style_premium_tea_packaging_direction',
      label: 'Premium tea packaging direction',
      source: 'extracted',
      status: 'draft',
      signals: {
        mood: expect.stringContaining('calm'),
        color: expect.stringContaining('deep green'),
        typography: expect.stringContaining('serif'),
        composition: expect.stringContaining('centered'),
        density: expect.stringContaining('low density'),
      },
    });
    expect(card.sourceReferences).toEqual([
      { id: 'reference_tea_packaging', name: 'Tea packaging reference' },
    ]);
    expect(card.parameters?.color?.palette).toContain('deep green');
  });
});
