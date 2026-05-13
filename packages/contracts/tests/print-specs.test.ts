import { describe, expect, it } from 'vitest';

import { buildPrintSpecMetadata } from '../src/print-specs';

describe('print specs', () => {
  it('extracts print handoff requirements from vendor text', () => {
    const spec = buildPrintSpecMetadata({
      label: 'Business card vendor spec',
      text: [
        'CMYK only',
        'Bleed: 3mm',
        'Safe area: 2mm',
        '300 DPI',
        'Paper stock: 350gsm matte',
        'Finish: spot UV logo',
      ].join('\n'),
    });

    expect(spec).toMatchObject({
      id: 'print_business_card_vendor_spec',
      requirements: {
        colorMode: 'cmyk-compatible',
        bleedMm: 3,
        safeAreaMm: 2,
        dpi: 300,
      },
    });
    expect(spec?.checklist).toEqual(expect.arrayContaining([
      'Use CMYK-compatible colors and avoid relying on screen-only RGB glow.',
      'Extend backgrounds 3mm into bleed.',
      'Prepare raster assets at 300 DPI or higher.',
    ]));
  });
});
