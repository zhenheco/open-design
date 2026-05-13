import type { ProjectKind, ProjectPlatform } from './api/projects.js';

export type ArtifactIntentId = string;

export type ArtifactIntentGroup =
  | 'social'
  | 'ads-marketing'
  | 'web-app'
  | 'brand-identity'
  | 'documents'
  | 'presentations'
  | 'print-products'
  | 'packaging'
  | 'merchandise'
  | 'signage'
  | 'video-motion'
  | 'custom';

export type ArtifactIntentUnit = 'px' | 'mm' | 'in';

export interface ArtifactIntentGroupInfo {
  id: ArtifactIntentGroup;
  label: string;
}

export interface ArtifactIntentDimensions {
  width: number;
  height: number;
  unit: ArtifactIntentUnit;
  dpi?: number;
}

export interface ArtifactIntentMetadata {
  id: ArtifactIntentId;
  label: string;
  group: ArtifactIntentGroup;
  dimensions?: ArtifactIntentDimensions;
  mediumConstraints: string[];
  outputExpectations: string[];
  printReady: boolean;
}

export interface ArtifactIntentPreset extends ArtifactIntentMetadata {
  defaultKind: ProjectKind;
  defaultPlatformTargets: ProjectPlatform[];
}

export const ARTIFACT_INTENT_GROUPS: readonly ArtifactIntentGroupInfo[] = [
  { id: 'social', label: 'Social' },
  { id: 'ads-marketing', label: 'Ads and marketing' },
  { id: 'web-app', label: 'Web and app' },
  { id: 'brand-identity', label: 'Brand identity' },
  { id: 'documents', label: 'Documents' },
  { id: 'presentations', label: 'Presentations' },
  { id: 'print-products', label: 'Print products' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'merchandise', label: 'Merchandise' },
  { id: 'signage', label: 'Signage and large format' },
  { id: 'video-motion', label: 'Video and motion' },
  { id: 'custom', label: 'Custom' },
];

function px(width: number, height: number): ArtifactIntentDimensions {
  return { width, height, unit: 'px' };
}

function mm(width: number, height: number, dpi = 300): ArtifactIntentDimensions {
  return { width, height, unit: 'mm', dpi };
}

function intent(input: {
  id: string;
  label: string;
  group: ArtifactIntentGroup;
  dimensions?: ArtifactIntentDimensions;
  constraints: string[];
  expectations: string[];
  printReady?: boolean;
  kind?: ProjectKind;
  platformTargets?: ProjectPlatform[];
}): ArtifactIntentPreset {
  return {
    id: input.id,
    label: input.label,
    group: input.group,
    defaultKind: input.kind ?? 'prototype',
    defaultPlatformTargets: input.platformTargets ?? ['responsive'],
    ...(input.dimensions ? { dimensions: input.dimensions } : {}),
    mediumConstraints: input.constraints,
    outputExpectations: input.expectations,
    printReady: input.printReady ?? false,
  };
}

export const INITIAL_ARTIFACT_INTENTS: readonly ArtifactIntentPreset[] = [
  intent({ id: 'instagram-post', label: 'Instagram post', group: 'social', dimensions: px(1080, 1080), constraints: ['square social composition'], expectations: ['shareable social visual'] }),
  intent({ id: 'instagram-story', label: 'Instagram story', group: 'social', dimensions: px(1080, 1920), constraints: ['vertical story safe zones'], expectations: ['mobile-first story visual'] }),
  intent({ id: 'facebook-cover', label: 'Facebook cover', group: 'social', dimensions: px(1640, 924), constraints: ['wide social header'], expectations: ['brand cover visual'] }),
  intent({ id: 'linkedin-banner', label: 'LinkedIn banner', group: 'social', dimensions: px(1584, 396), constraints: ['professional wide header'], expectations: ['profile or company banner'] }),
  intent({ id: 'youtube-thumbnail', label: 'YouTube thumbnail', group: 'social', dimensions: px(1280, 720), constraints: ['high-contrast thumbnail'], expectations: ['clickable video cover'] }),
  intent({ id: 'tiktok-cover', label: 'TikTok cover', group: 'social', dimensions: px(1080, 1920), constraints: ['vertical cover composition'], expectations: ['short-form video cover'] }),
  intent({ id: 'pinterest-pin', label: 'Pinterest pin', group: 'social', dimensions: px(1000, 1500), constraints: ['vertical discovery card'], expectations: ['pin-ready visual'] }),
  intent({ id: 'social-carousel', label: 'Social carousel', group: 'social', dimensions: px(1080, 1080), constraints: ['multi-slide social sequence'], expectations: ['carousel structure'] }),

  intent({ id: 'edm', label: 'EDM', group: 'ads-marketing', dimensions: px(600, 1200), constraints: ['email-safe narrow layout', 'mobile-readable sections'], expectations: ['email marketing layout', 'CTA-forward content structure'] }),
  intent({ id: 'newsletter', label: 'Newsletter', group: 'ads-marketing', dimensions: px(600, 1400), constraints: ['email content hierarchy'], expectations: ['newsletter-ready layout'] }),
  intent({ id: 'dm', label: 'DM', group: 'ads-marketing', dimensions: mm(210, 99), constraints: ['direct-mail print surface'], expectations: ['print-aware promotional layout'], printReady: true }),
  intent({ id: 'flyer', label: 'Flyer', group: 'ads-marketing', dimensions: mm(210, 297), constraints: ['single-page promotional print'], expectations: ['flyer layout'], printReady: true }),
  intent({ id: 'brochure', label: 'Brochure', group: 'ads-marketing', dimensions: mm(297, 210), constraints: ['fold-aware marketing print'], expectations: ['brochure panel structure'], printReady: true }),
  intent({ id: 'poster', label: 'Poster', group: 'ads-marketing', dimensions: mm(420, 594), constraints: ['large-format hierarchy'], expectations: ['poster layout'], printReady: true }),
  intent({ id: 'display-ad', label: 'Display ad', group: 'ads-marketing', dimensions: px(1200, 628), constraints: ['paid media crop safety'], expectations: ['ad creative'] }),
  intent({ id: 'sales-sheet', label: 'Sales sheet', group: 'ads-marketing', dimensions: mm(210, 297), constraints: ['one-page sales information'], expectations: ['printable sales collateral'], printReady: true }),

  intent({ id: 'landing-page', label: 'Landing page', group: 'web-app', dimensions: px(1440, 1200), constraints: ['responsive web page', 'browser preview'], expectations: ['editable HTML artifact', 'responsive layout'] }),
  intent({ id: 'website-section', label: 'Website section', group: 'web-app', dimensions: px(1440, 800), constraints: ['section-level responsive layout'], expectations: ['web section'] }),
  intent({ id: 'hero', label: 'Hero', group: 'web-app', dimensions: px(1440, 760), constraints: ['first viewport web composition'], expectations: ['hero section'] }),
  intent({ id: 'pricing-page', label: 'Pricing page', group: 'web-app', dimensions: px(1440, 1200), constraints: ['conversion-focused pricing layout'], expectations: ['pricing page'] }),
  intent({ id: 'dashboard', label: 'Dashboard', group: 'web-app', dimensions: px(1440, 1024), constraints: ['data-dense product UI'], expectations: ['dashboard screen'] }),
  intent({ id: 'app-screen', label: 'App screen', group: 'web-app', dimensions: px(390, 844), constraints: ['mobile app viewport'], expectations: ['app screen'] }),
  intent({ id: 'product-page', label: 'Product page', group: 'web-app', dimensions: px(1440, 1400), constraints: ['commerce content hierarchy'], expectations: ['product detail page'] }),

  intent({ id: 'logo-concept', label: 'Logo concept', group: 'brand-identity', dimensions: px(1200, 1200), constraints: ['identity mark exploration'], expectations: ['logo concept board'] }),
  intent({ id: 'brand-board', label: 'Brand board', group: 'brand-identity', dimensions: px(1600, 1200), constraints: ['brand system summary'], expectations: ['brand board'] }),
  intent({ id: 'business-card', label: 'Business card', group: 'print-products', dimensions: mm(90, 54), constraints: ['two-sided physical print surface', 'safe area and trim awareness'], expectations: ['print handoff', 'front/back card concept'], printReady: true }),
  intent({ id: 'letterhead', label: 'Letterhead', group: 'brand-identity', dimensions: mm(210, 297), constraints: ['stationery print surface'], expectations: ['letterhead layout'], printReady: true }),
  intent({ id: 'email-signature', label: 'Email signature', group: 'brand-identity', dimensions: px(600, 220), constraints: ['email client-safe block'], expectations: ['signature layout'] }),

  intent({ id: 'proposal', label: 'Proposal', group: 'documents', dimensions: mm(210, 297), constraints: ['multi-section document'], expectations: ['proposal page system'], printReady: true }),
  intent({ id: 'report', label: 'Report', group: 'documents', dimensions: mm(210, 297), constraints: ['document hierarchy'], expectations: ['report layout'], printReady: true }),
  intent({ id: 'resume', label: 'Resume', group: 'documents', dimensions: mm(210, 297), constraints: ['resume scanability'], expectations: ['resume layout'], printReady: true }),
  intent({ id: 'worksheet', label: 'Worksheet', group: 'documents', dimensions: mm(210, 297), constraints: ['fillable print layout'], expectations: ['worksheet page'], printReady: true }),
  intent({ id: 'menu', label: 'Menu', group: 'documents', dimensions: mm(210, 297), constraints: ['restaurant information hierarchy'], expectations: ['menu layout'], printReady: true }),
  intent({ id: 'certificate', label: 'Certificate', group: 'documents', dimensions: mm(297, 210), constraints: ['formal landscape print'], expectations: ['certificate layout'], printReady: true }),

  intent({ id: 'pitch-deck', label: 'Pitch deck', group: 'presentations', dimensions: px(1920, 1080), constraints: ['slide narrative'], expectations: ['deck structure'], kind: 'deck' }),
  intent({ id: 'sales-deck', label: 'Sales deck', group: 'presentations', dimensions: px(1920, 1080), constraints: ['sales story slides'], expectations: ['sales deck'], kind: 'deck' }),
  intent({ id: 'lesson-deck', label: 'Lesson deck', group: 'presentations', dimensions: px(1920, 1080), constraints: ['teaching slide sequence'], expectations: ['lesson deck'], kind: 'deck' }),
  intent({ id: 'webinar-slides', label: 'Webinar slides', group: 'presentations', dimensions: px(1920, 1080), constraints: ['webinar presentation'], expectations: ['webinar slide deck'], kind: 'deck' }),

  intent({ id: 'postcard', label: 'Postcard', group: 'print-products', dimensions: mm(148, 105), constraints: ['two-sided postcard'], expectations: ['print handoff'], printReady: true }),
  intent({ id: 'invitation', label: 'Invitation', group: 'print-products', dimensions: mm(127, 178), constraints: ['event print card'], expectations: ['invitation layout'], printReady: true }),
  intent({ id: 'sticker', label: 'Sticker', group: 'print-products', dimensions: mm(75, 75), constraints: ['die-cut sticker awareness'], expectations: ['sticker art'], printReady: true }),
  intent({ id: 'label', label: 'Label', group: 'print-products', dimensions: mm(100, 50), constraints: ['product label safe area'], expectations: ['label layout'], printReady: true }),
  intent({ id: 'booklet', label: 'Booklet', group: 'print-products', dimensions: mm(148, 210), constraints: ['multi-page print'], expectations: ['booklet system'], printReady: true }),
  intent({ id: 'catalog', label: 'Catalog', group: 'print-products', dimensions: mm(210, 297), constraints: ['product catalog pages'], expectations: ['catalog page system'], printReady: true }),

  intent({ id: 'box', label: 'Box', group: 'packaging', dimensions: mm(200, 120), constraints: ['packaging panel layout', 'dieline awareness'], expectations: ['packaging concept'], printReady: true }),
  intent({ id: 'sleeve', label: 'Sleeve', group: 'packaging', dimensions: mm(220, 80), constraints: ['wraparound packaging surface'], expectations: ['sleeve design'], printReady: true }),
  intent({ id: 'pouch', label: 'Pouch', group: 'packaging', dimensions: mm(140, 200), constraints: ['flexible pouch front'], expectations: ['pouch design'], printReady: true }),
  intent({ id: 'bottle-label', label: 'Bottle label', group: 'packaging', dimensions: mm(180, 90), constraints: ['cylindrical label wrap'], expectations: ['bottle label'], printReady: true }),
  intent({ id: 'paper-bag', label: 'Paper bag', group: 'packaging', dimensions: mm(240, 320), constraints: ['bag face print area'], expectations: ['bag design'], printReady: true }),
  intent({ id: 'hang-tag', label: 'Hang tag', group: 'packaging', dimensions: mm(50, 90), constraints: ['small print tag'], expectations: ['hang tag'], printReady: true }),

  intent({ id: 't-shirt', label: 'T-shirt', group: 'merchandise', dimensions: px(4500, 5400), constraints: ['apparel print area'], expectations: ['shirt graphic'], printReady: true }),
  intent({ id: 'tote-bag', label: 'Tote bag', group: 'merchandise', dimensions: px(3600, 4200), constraints: ['fabric print area'], expectations: ['tote graphic'], printReady: true }),
  intent({ id: 'mug', label: 'Mug', group: 'merchandise', dimensions: px(2700, 1050), constraints: ['wraparound mug print'], expectations: ['mug artwork'], printReady: true }),
  intent({ id: 'water-bottle', label: 'Water bottle', group: 'merchandise', dimensions: px(2400, 900), constraints: ['cylindrical product print'], expectations: ['bottle artwork'], printReady: true }),

  intent({ id: 'yard-sign', label: 'Yard sign', group: 'signage', dimensions: mm(610, 457), constraints: ['outdoor sign legibility'], expectations: ['large-format sign'], printReady: true }),
  intent({ id: 'storefront-sign', label: 'Storefront sign', group: 'signage', dimensions: mm(1200, 400), constraints: ['distance legibility'], expectations: ['signage concept'], printReady: true }),
  intent({ id: 'roll-up-banner', label: 'Roll-up banner', group: 'signage', dimensions: mm(850, 2000), constraints: ['vertical event signage'], expectations: ['roll-up banner'], printReady: true }),
  intent({ id: 'trade-show-panel', label: 'Trade show panel', group: 'signage', dimensions: mm(1000, 2200), constraints: ['large event panel'], expectations: ['trade show graphic'], printReady: true }),

  intent({ id: 'short-video', label: 'Short video', group: 'video-motion', dimensions: px(1080, 1920), constraints: ['vertical motion composition'], expectations: ['short video structure'], kind: 'video' }),
  intent({ id: 'video-cover', label: 'Video cover', group: 'video-motion', dimensions: px(1280, 720), constraints: ['video thumbnail'], expectations: ['cover frame'] }),
  intent({ id: 'animated-social-post', label: 'Animated social post', group: 'video-motion', dimensions: px(1080, 1080), constraints: ['loopable social motion'], expectations: ['animated post plan'], kind: 'video' }),
  intent({ id: 'lower-third', label: 'Lower third', group: 'video-motion', dimensions: px(1920, 250), constraints: ['broadcast overlay safe area'], expectations: ['lower-third graphic'] }),

  intent({ id: 'custom-size', label: 'Custom size', group: 'custom', constraints: ['user-defined dimensions'], expectations: ['custom artifact constraints'] }),
  intent({ id: 'custom-ratio', label: 'Custom ratio', group: 'custom', dimensions: px(1200, 800), constraints: ['user-defined aspect ratio'], expectations: ['custom ratio artifact'] }),
  intent({ id: 'uploaded-spec', label: 'Uploaded spec', group: 'custom', constraints: ['printer or platform-defined requirements'], expectations: ['spec-driven artifact constraints'], printReady: true }),
];

export function findArtifactIntentPreset(id: ArtifactIntentId): ArtifactIntentPreset {
  return INITIAL_ARTIFACT_INTENTS.find((item) => item.id === id)
    ?? INITIAL_ARTIFACT_INTENTS[0]!;
}

export function toArtifactIntentMetadata(
  preset: ArtifactIntentPreset,
): ArtifactIntentMetadata {
  const { defaultKind: _defaultKind, defaultPlatformTargets: _defaultPlatformTargets, ...metadata } = preset;
  return {
    ...metadata,
    mediumConstraints: [...metadata.mediumConstraints],
    outputExpectations: [...metadata.outputExpectations],
    ...(metadata.dimensions ? { dimensions: { ...metadata.dimensions } } : {}),
  };
}
