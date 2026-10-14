// Site-wide constants. Site name is "MeasuredCup" identically everywhere (build spec A3).

export const SITE_NAME = 'MeasuredCup';
export const SITE_URL = 'https://measuredcup.com';
export const SITE_EMAIL = 'hello@measuredcup.com';
export const SITE_TAGLINE = 'Kitchen converters for baking';

export const AUTHOR = {
  name: 'Sikander Malik',
  id: `${SITE_URL}/authors/sikander-malik/#person`,
  url: `${SITE_URL}/authors/sikander-malik/`,
  jobTitle: 'Founder and tool builder',
};

export const ORG_LOGO = `${SITE_URL}/logo-512.png`;

// Shared disclaimer line shown on every tool page (build spec A5 item 14).
export const DISCLAIMER =
  'Values are averages for typical US products. Brands vary, so weigh with a kitchen scale when a recipe needs to be exact.';

// Shared source links with access dates.
export const SOURCES = {
  usda: {
    name: 'USDA FoodData Central SR Legacy',
    url: 'https://fdc.nal.usda.gov/download-datasets/',
    accessed: '2026-10-14',
  },
  kingArthur: {
    name: 'King Arthur Baking Ingredient Weight Chart',
    url: 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart',
    accessed: '2026-10-14',
  },
  nist: {
    name: 'NIST Handbook 44 Appendix C',
    url: 'https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44',
    accessed: '2026-10-14',
  },
} as const;
