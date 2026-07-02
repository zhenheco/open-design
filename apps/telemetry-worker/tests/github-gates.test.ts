import { describe, expect, it } from 'vitest';

import diffReviewScript from '../../../.github/scripts/diff_review.py?raw';
import ciWorkflow from '../../../.github/workflows/ci.yml?raw';
import diffReviewWorkflow from '../../../.github/workflows/diff-review.yml?raw';

describe('GitHub automation gates', () => {
  it('exposes an automerge-gate job backed by workspace validation', () => {
    expect(ciWorkflow).toContain('automerge-gate:');
    expect(ciWorkflow).toContain('name: automerge-gate');
    expect(ciWorkflow).toContain('needs: [validate]');
    expect(ciWorkflow).toContain('VALIDATE_RESULT');
    expect(ciWorkflow).toContain('exit 1');
  });

  it('runs diff-review as a fail-closed pull_request_target status', () => {
    expect(diffReviewWorkflow).toContain('pull_request_target:');
    expect(diffReviewWorkflow).toContain('statuses: write');
    expect(diffReviewWorkflow).toContain('context=diff-review-verdict');
    expect(diffReviewWorkflow).toContain('DEEPSEEK_API_KEY');
    expect(diffReviewWorkflow).toContain('GEMINI_API_KEY');
    expect(diffReviewWorkflow).toContain('python3 .github/scripts/diff_review.py review');
  });

  it('ships the local diff reviewer used by the workflow', () => {
    expect(diffReviewScript).toContain('MODEL_ANGLES');
    expect(diffReviewScript).toContain('redact_secrets');
    expect(diffReviewScript).toContain('review_diff');
  });
});
