// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EntryView } from '../../src/components/EntryView';
import { I18nProvider } from '../../src/i18n';
import type { AppConfig } from '../../src/types';

vi.mock('../../src/providers/registry', () => ({
  fetchConnectors: vi.fn(async () => []),
  fetchConnectorStatuses: vi.fn(async () => []),
}));

const originalFetch = globalThis.fetch;
const originalEventSource = globalThis.EventSource;
const originalResizeObserver = globalThis.ResizeObserver;
const originalScrollIntoView = Element.prototype.scrollIntoView;

class StubEventSource {
  constructor(_url: string | URL) {}
  addEventListener() {}
  close() {}
}

class StubResizeObserver {
  observe() {}
  disconnect() {}
}

function renderEntryView() {
  const config = {
    mode: 'daemon',
    apiKey: '',
    baseUrl: 'http://127.0.0.1:17456',
    model: 'local-cli',
    agentId: null,
    skillId: null,
    designSystemId: null,
    mediaProviders: {},
  } satisfies AppConfig;

  render(
    <I18nProvider initial="en">
      <EntryView
        skills={[]}
        designTemplates={[]}
        designSystems={[]}
        projects={[]}
        templates={[]}
        onDeleteTemplate={vi.fn(async () => true)}
        promptTemplates={[]}
        defaultDesignSystemId={null}
        config={config}
        agents={[]}
        onCreateProject={vi.fn()}
        onImportClaudeDesign={vi.fn()}
        onOpenProject={vi.fn()}
        onOpenLiveArtifact={vi.fn()}
        onDeleteProject={vi.fn()}
        onRenameProject={vi.fn()}
        onChangeDefaultDesignSystem={vi.fn()}
        onOpenSettings={vi.fn()}
        onAdoptPet={vi.fn()}
        onAdoptPetInline={vi.fn()}
        onTogglePet={vi.fn()}
      />
    </I18nProvider>,
  );
}

describe('EntryView references tab', () => {
  afterEach(() => {
    cleanup();
    globalThis.fetch = originalFetch;
    if (originalEventSource) {
      globalThis.EventSource = originalEventSource;
    } else {
      // @ts-expect-error jsdom shim cleanup
      delete globalThis.EventSource;
    }
    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver;
    } else {
      // @ts-expect-error jsdom shim cleanup
      delete globalThis.ResizeObserver;
    }
    Element.prototype.scrollIntoView = originalScrollIntoView;
    vi.restoreAllMocks();
  });

  it('opens a first-class reference board from the home tabs', async () => {
    globalThis.EventSource = StubEventSource as unknown as typeof EventSource;
    globalThis.ResizeObserver = StubResizeObserver as unknown as typeof ResizeObserver;
    Element.prototype.scrollIntoView = vi.fn();
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url === '/api/memory') {
        return new Response(JSON.stringify({
          enabled: true,
          rootDir: '/tmp/memory',
          index: '# Memory\n',
          entries: [
            {
              id: 'reference_packaging_ref',
              name: 'Packaging reference',
              description: 'Foil label and dense product hierarchy',
              type: 'reference',
              updatedAt: Date.now(),
            },
            {
              id: 'user_ui_preferences',
              name: 'UI preferences',
              description: 'General UI preferences',
              type: 'user',
              updatedAt: Date.now(),
            },
          ],
          extraction: null,
        }), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      if (url === '/api/memory/extractions') {
        return new Response(JSON.stringify({ extractions: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({}), { status: 404 });
    }) as typeof fetch;

    renderEntryView();

    fireEvent.click(screen.getByRole('tab', { name: 'References' }));

    expect(await screen.findByText('Reference board')).toBeTruthy();
    expect(screen.getByText('Packaging reference')).toBeTruthy();
    expect(screen.queryByText('UI preferences')).toBeNull();
  });
});
