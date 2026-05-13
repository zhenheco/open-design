import { describe, expect, it } from 'vitest';

import {
  ARTIFACT_INTENT_GROUPS,
  INITIAL_ARTIFACT_INTENTS,
} from '../src/artifact-intents';

describe('artifact intent catalog', () => {
  it('covers every first-class guided creation group', () => {
    expect(ARTIFACT_INTENT_GROUPS.map((group) => group.id)).toEqual([
      'social',
      'ads-marketing',
      'web-app',
      'brand-identity',
      'documents',
      'presentations',
      'print-products',
      'packaging',
      'merchandise',
      'signage',
      'video-motion',
      'custom',
    ]);

    for (const group of ARTIFACT_INTENT_GROUPS) {
      expect(
        INITIAL_ARTIFACT_INTENTS.some((intent) => intent.group === group.id),
      ).toBe(true);
    }
  });

  it('keeps every intent generation-ready with defaults', () => {
    expect(INITIAL_ARTIFACT_INTENTS.length).toBeGreaterThan(30);

    for (const intent of INITIAL_ARTIFACT_INTENTS) {
      expect(intent.id).toBeTruthy();
      expect(intent.label).toBeTruthy();
      expect(intent.defaultKind).toBeTruthy();
      expect(intent.defaultPlatformTargets.length).toBeGreaterThan(0);
      expect(intent.mediumConstraints.length).toBeGreaterThan(0);
      expect(intent.outputExpectations.length).toBeGreaterThan(0);
      if (intent.id !== 'custom-size' && intent.id !== 'uploaded-spec') {
        expect(intent.dimensions).toBeTruthy();
      }
    }
  });
});
