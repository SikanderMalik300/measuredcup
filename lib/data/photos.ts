// Photo registry (measuredcup-design.md section 7, measuredcup-photos.md).
// Files are processed by scripts/process-images.mjs into AVIF, WebP and JPEG at the widths below and
// written to public/photos/. All photos are real photographs under the Unsplash License, checked by
// the browser agent. Hero caption and the homepage "Photo credits" section are generated from here.

export interface Photo {
  id: string;
  file: string; // base filename (without extension) under public/photos/
  sourceUrl: string; // photo page
  downloadUrl: string; // direct download used at build
  photographer: string;
  photographerUrl: string;
  source: 'Unsplash';
  license: 'Unsplash License';
  alt: string;
  focalX: number; // 0..1
  focalY: number; // 0..1
  usedOn: string[]; // page slugs
}

export const PHOTOS: Photo[] = [
  {
    id: 'hero-flour-cup',
    file: 'hero-flour-cup',
    sourceUrl: 'https://unsplash.com/photos/O-WdR304HnM',
    downloadUrl: 'https://unsplash.com/photos/O-WdR304HnM/download?force=true',
    photographer: 'Ben McLeod',
    photographerUrl: 'https://unsplash.com/@ben_mcleod',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Hands holding a metal measuring cup filled with flour above a mixing bowl',
    focalX: 0.5,
    focalY: 0.45,
    usedOn: ['/'],
  },
  {
    id: 'scale-flour',
    file: 'scale-flour',
    sourceUrl: 'https://unsplash.com/photos/u3gMcNvqrnI',
    downloadUrl: 'https://unsplash.com/photos/u3gMcNvqrnI/download?force=true',
    photographer: 'Arwen',
    photographerUrl: 'https://unsplash.com/@arwen42',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Container of white flour on a black digital kitchen scale showing 125.0',
    focalX: 0.5,
    focalY: 0.55,
    usedOn: ['/grams-to-cups/', '/converters/'],
  },
  {
    id: 'four-cups',
    file: 'four-cups',
    sourceUrl: 'https://unsplash.com/photos/mLlM83CsG3I',
    downloadUrl: 'https://unsplash.com/photos/mLlM83CsG3I/download?force=true',
    photographer: 'Mae Mu',
    photographerUrl: 'https://unsplash.com/@picoftasty',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Four measuring cups with wooden handles in a row on a white table',
    focalX: 0.5,
    focalY: 0.45,
    usedOn: ['/cups-to-grams/'],
  },
  {
    id: 'nested-spoons',
    file: 'nested-spoons',
    sourceUrl: 'https://unsplash.com/photos/yvRG4QXsIIY',
    downloadUrl: 'https://unsplash.com/photos/yvRG4QXsIIY/download?force=true',
    photographer: '裴锦书 (pei_jinshu)',
    photographerUrl: 'https://unsplash.com/@pei_jinshu',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Set of stainless steel measuring spoons nested together on a white surface',
    focalX: 0.45,
    focalY: 0.5,
    usedOn: ['/tablespoons-to-grams/'],
  },
  {
    id: 'butter-flour-eggs',
    file: 'butter-flour-eggs',
    sourceUrl: 'https://unsplash.com/photos/Zqh5l1JWs5M',
    downloadUrl: 'https://unsplash.com/photos/Zqh5l1JWs5M/download?force=true',
    photographer: 'Lauren Gray',
    photographerUrl: 'https://unsplash.com/@laurenagray',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Bowl of cubed butter beside brown eggs and a measuring cup of flour on a striped kitchen towel',
    focalX: 0.7,
    focalY: 0.75,
    usedOn: ['/butter-converter/'],
  },
  {
    id: 'copper-cups-paper',
    file: 'copper-cups-paper',
    sourceUrl: 'https://unsplash.com/photos/AemWnTSPxoE',
    downloadUrl: 'https://unsplash.com/photos/AemWnTSPxoE/download?force=true',
    photographer: 'Kara Eads',
    photographerUrl: 'https://unsplash.com/@karaeads',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Copper measuring cups and measuring spoons laid on a sheet of white paper',
    focalX: 0.35,
    focalY: 0.4,
    usedOn: ['/half-a-measurement/', '/recipe-tools/'],
  },
  {
    id: 'cookbooks-counter',
    file: 'cookbooks-counter',
    sourceUrl: 'https://unsplash.com/photos/yjYxtxLOiF4',
    downloadUrl: 'https://unsplash.com/photos/yjYxtxLOiF4/download?force=true',
    photographer: 'Annie Spratt',
    photographerUrl: 'https://unsplash.com/@anniespratt',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Two open cookbooks resting on a wooden kitchen counter',
    focalX: 0.55,
    focalY: 0.6,
    usedOn: ['/recipe-scaler/'],
  },
  {
    id: 'scale-brown-sugar',
    file: 'scale-brown-sugar',
    sourceUrl: 'https://unsplash.com/photos/zfom3V5vnhg',
    downloadUrl: 'https://unsplash.com/photos/zfom3V5vnhg/download?force=true',
    photographer: 'Arwen',
    photographerUrl: 'https://unsplash.com/@arwen42',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Bowl of brown sugar on a digital kitchen scale',
    focalX: 0.5,
    focalY: 0.4,
    usedOn: ['/data/ingredient-weights/', '/data/'],
  },
];

const BY_ID = new Map(PHOTOS.map((p) => [p.id, p]));

export function getPhoto(id: string): Photo {
  const p = BY_ID.get(id);
  if (!p) throw new Error(`Unknown photo: ${id}`);
  return p;
}

export function findPhoto(id: string | undefined): Photo | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function homepagePhotos(): Photo[] {
  return PHOTOS.filter((p) => p.usedOn.includes('/'));
}
