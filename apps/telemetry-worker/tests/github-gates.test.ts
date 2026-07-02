import { describe, expect, it } from 'vitest';

import ciWorkflow from '../../../.github/workflows/ci.yml?raw';

describe('GitHub automation gates', () => {
  it('exposes an automerge-gate job backed by workspace validation', () => {
    expect(ciWorkflow).toContain('automerge-gate:');
    expect(ciWorkflow).toContain('name: automerge-gate');
    expect(ciWorkflow).toContain('needs: [validate]');
    expect(ciWorkflow).toContain('VALIDATE_RESULT');
    expect(ciWorkflow).toContain('exit 1');
  });
});
