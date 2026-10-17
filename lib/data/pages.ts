// Single page registry (build spec A2). Sitemaps, hubs, related links, breadcrumbs and llms.txt are
// generated from this file. FAQ text is stored here so the visible accordion and the FAQPage JSON-LD
// read from one source (build spec A12).

export type SourceKey = 'usda' | 'kingArthur' | 'nist';
export type Category = 'converters' | 'recipe-tools' | 'data';
export type PageKind = 'home' | 'tool' | 'hub' | 'data' | 'trust';

export interface SourceRef {
  key: SourceKey;
  note?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PageEntry {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  kind: PageKind;
  category?: Category;
  tileLine?: string; // one muted line used on home and hub tiles
  related: string[];
  lastUpdated: string; // ISO date
  sources: SourceRef[];
  photoId?: string;
  faq?: FaqItem[];
  inSitemap: boolean;
}

export const LAST_UPDATED = '2026-10-14';

export const CATEGORIES: Record<Category, { slug: string; title: string }> = {
  converters: { slug: '/converters/', title: 'Kitchen converters' },
  'recipe-tools': { slug: '/recipe-tools/', title: 'Recipe tools' },
  data: { slug: '/data/', title: 'Ingredient data' },
};

export const PAGES: PageEntry[] = [
  {
    slug: '/',
    title: 'MeasuredCup: Kitchen Converters for Baking',
    metaDescription:
      'Convert grams to cups, cups to grams, butter sticks and tablespoons by ingredient. Free kitchen tools using USDA and King Arthur weights.',
    h1: 'Kitchen converters that know your ingredient',
    kind: 'home',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }, { key: 'nist' }],
    inSitemap: true,
  },

  // ---- Tool pages ----
  {
    slug: '/grams-to-cups/',
    title: 'Grams to Cups Converter by Ingredient | MeasuredCup',
    metaDescription:
      'Convert grams to US cups for flour, sugar, butter, honey and 20 more ingredients. Uses USDA and King Arthur weights, with tablespoons for leftovers.',
    h1: 'Grams to Cups Converter',
    kind: 'tool',
    category: 'converters',
    tileLine: 'Any weight to US cups, for 23 ingredients',
    related: ['/cups-to-grams/', '/grams-to-tablespoons/', '/tablespoons-to-grams/', '/data/ingredient-weights/'],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }, { key: 'nist' }],
    photoId: 'scale-flour',
    faq: [
      {
        q: 'How many cups is 100 grams of flour?',
        a: "100 g of all-purpose flour is 0.8 cups by USDA's 125 g per cup, which is 3/4 cup plus 2 1/2 teaspoons. By King Arthur's 120 g per cup it's 0.83 cups, which is 3/4 cup plus 1 tablespoon and 1 teaspoon.",
      },
      {
        q: 'How many grams is 1 cup of sugar?',
        a: '1 cup of granulated white sugar weighs 200 g according to USDA FoodData Central. King Arthur lists 198 g. Packed brown sugar is heavier at 220 g, and powdered sugar is lighter at about 120 g.',
      },
      {
        q: 'Why do different websites give different gram weights for a cup?',
        a: 'They use different sources and different ways of filling the cup. USDA measures a standard household cup, while test kitchens like King Arthur measure the way their recipes were developed. Flour shows one of the biggest gaps: USDA lists bread flour at 137 g per cup, King Arthur at 120 g.',
      },
      {
        q: 'Is a cup the same in the US and the UK?',
        a: 'No. A US customary cup is 236.6 mL. UK, Australian and Canadian recipes usually mean a 250 mL metric cup, about 6% larger. This converter uses US cups.',
      },
      {
        q: 'How many grams of butter is 1 cup?',
        a: '1 cup of butter is 227 g, which is 2 US sticks. Half a cup, or one stick, is 113 g.',
      },
      {
        q: 'Can I convert grams to cups without knowing the ingredient?',
        a: 'Only for water and similar liquids, where 1 cup is about 237 g. For dry ingredients the answer changes a lot: 100 g is 1/2 cup of sugar but about 1 1/4 cups of rolled oats.',
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/cups-to-grams/',
    title: 'Cups to Grams Converter for Baking | MeasuredCup',
    metaDescription:
      'Convert US cups to grams for 23 baking ingredients. 1 cup flour is 125 g, sugar 200 g, butter 227 g. Fractions like 2/3 and 3/4 cup welcome.',
    h1: 'Cups to Grams Converter',
    kind: 'tool',
    category: 'converters',
    tileLine: 'Fractions welcome: 2/3 cup, 1 1/2 cups',
    related: ['/grams-to-cups/', '/tablespoons-to-grams/', '/cups-in-a-quart/', '/data/ingredient-weights/'],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }, { key: 'nist' }],
    photoId: 'four-cups',
    faq: [
      {
        q: 'How many grams is 1 cup of flour?',
        a: "1 cup of all-purpose flour is 125 g in USDA FoodData Central and 120 g in King Arthur's chart. Bread flour and cake flour are listed at 137 g per cup by USDA.",
      },
      {
        q: 'How many grams is 3/4 cup of sugar?',
        a: "3/4 cup of granulated sugar is 150 g using USDA's 200 g per cup.",
      },
      {
        q: 'How many grams is 1/2 cup of butter?',
        a: '1/2 cup of butter is one US stick, 113 g or 4 ounces.',
      },
      {
        q: 'How many grams is 2/3 cup?',
        a: 'It depends on the ingredient: 2/3 cup of all-purpose flour is 83.3 g (USDA), granulated sugar is 133 g, and whole milk is 162.7 g.',
      },
      {
        q: 'Is a cup of water 250 grams?',
        a: 'Not in the US. A US cup holds 236.6 mL, so water weighs about 237 g. 250 g is a metric cup, used in Australia and often in the UK.',
      },
      {
        q: 'Should I use USDA or King Arthur numbers?',
        a: "Use King Arthur figures for King Arthur recipes and similar test-kitchen recipes, since that's how they were written. Use USDA when the recipe doesn't say. Most ingredients differ by less than 5%, but bread and cake flour, cornstarch, oil, oats, milk, rice and powdered sugar differ by 6% to 13%.",
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/tablespoons-to-grams/',
    title: 'Tablespoons to Grams by Ingredient | MeasuredCup',
    metaDescription:
      'How many grams in a tablespoon? Water 14.8 g, flour 7.8 g, sugar 12.5 g, butter 14.2 g, honey 21.2 g. Convert tablespoons and teaspoons for 23 ingredients.',
    h1: 'Tablespoons to Grams Converter',
    kind: 'tool',
    category: 'converters',
    tileLine: 'Spoons to grams for 23 ingredients',
    related: ['/grams-to-tablespoons/', '/tablespoons-to-cups/', '/cups-to-grams/', '/grams-to-cups/'],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }, { key: 'nist' }],
    photoId: 'nested-spoons',
    faq: [
      {
        q: 'How many grams are in a tablespoon?',
        a: 'For water, 14.8 g. For flour about 7.8 g, sugar 12.5 g, butter 14.2 g and honey 21.2 g. The answer always depends on the ingredient.',
      },
      {
        q: 'How many grams are in a teaspoon of sugar?',
        a: "About 4.2 g of granulated sugar, using USDA's 200 g per cup divided by 48.",
      },
      {
        q: 'How many tablespoons are in 100 grams of butter?',
        a: 'About 7 tablespoons, since each level tablespoon of butter weighs 14.2 g.',
      },
      {
        q: 'Is a tablespoon 15 ml?',
        a: 'Close. A US tablespoon is 14.8 mL, and many nutrition labels round it to 15 mL. A UK tablespoon is 15 mL and an Australian one is 20 mL.',
      },
      {
        q: 'How many teaspoons are in a tablespoon?',
        a: 'Three US teaspoons make one US tablespoon.',
      },
      {
        q: 'How many grams of salt is a teaspoon?',
        a: 'About 6 g of fine table salt. Kosher salt is lighter per spoon because the crystals are bigger and trap more air.',
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/butter-converter/',
    title: 'Butter Converter: Sticks, Cups, Tbsp and Grams | MeasuredCup',
    metaDescription:
      '1 stick of butter is 1/2 cup, 8 tablespoons, 4 ounces or 113 grams. Convert butter between sticks, cups, tablespoons, grams and ounces.',
    h1: 'Butter Converter: Sticks, Cups, Tablespoons and Grams',
    kind: 'tool',
    category: 'converters',
    tileLine: 'Sticks, cups, tablespoons, grams, ounces',
    related: ['/cups-to-grams/', '/tablespoons-to-grams/', '/half-a-measurement/', '/recipe-scaler/'],
    lastUpdated: LAST_UPDATED,
    sources: [
      { key: 'nist', note: 'ounce to gram' },
      { key: 'usda', note: 'butter, 1 cup' },
      { key: 'kingArthur', note: '8 tbsp = 113 g' },
    ],
    photoId: 'butter-flour-eggs',
    faq: [
      {
        q: 'How many grams is a stick of butter?',
        a: "113 grams (4 ounces). That's 1/2 cup or 8 tablespoons.",
      },
      { q: 'How many sticks is 1 cup of butter?', a: '2 sticks.' },
      {
        q: 'How many tablespoons are in a stick of butter?',
        a: '8 tablespoons. Most US wrappers print a line for each one.',
      },
      {
        q: 'How much is 250 grams of butter in sticks?',
        a: 'About 2.2 sticks: 2 full sticks plus about 1 1/2 tablespoons.',
      },
      {
        q: 'How many sticks is 3/4 cup of butter?',
        a: '1 1/2 sticks, which is 12 tablespoons or 170 g.',
      },
      {
        q: 'Does melted butter measure the same as solid butter?',
        a: "By weight, yes. By volume, close enough for most recipes, since butter's density barely changes when melted. Weigh it if the recipe gives grams.",
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/half-a-measurement/',
    title: 'Half a Measurement Calculator (Cups & Spoons) | MeasuredCup',
    metaDescription:
      'Half of 3/4 cup is 1/4 cup plus 2 tablespoons. Halve, third or double any cup, tablespoon or teaspoon amount and get measuring-spoon combinations.',
    h1: 'Half of a Measurement Calculator',
    kind: 'tool',
    category: 'recipe-tools',
    tileLine: 'Halve, third or double a single amount',
    related: ['/recipe-scaler/', '/tablespoons-in-1-3-cup/', '/tablespoons-to-cups/', '/tablespoons-to-grams/'],
    lastUpdated: LAST_UPDATED,
    sources: [
      { key: 'nist', note: 'cup = 16 tbsp = 48 tsp' },
      { key: 'usda', note: 'large egg 50 g' },
    ],
    photoId: 'copper-cups-paper',
    faq: [
      {
        q: 'What is half of 3/4 cup?',
        a: '1/4 cup plus 2 tablespoons, which is 6 tablespoons.',
      },
      { q: 'What is half of 2/3 cup?', a: '1/3 cup.' },
      { q: 'What is half of 1/3 cup?', a: '2 tablespoons plus 2 teaspoons.' },
      { q: 'What is half of 1/4 cup?', a: '2 tablespoons.' },
      { q: 'What is half of a tablespoon?', a: '1 1/2 teaspoons.' },
      {
        q: 'How do I halve one egg?',
        a: 'Beat one large egg, then use half by weight, about 25 g, which is a little over 1 1/2 tablespoons.',
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/recipe-scaler/',
    title: 'Recipe Scaler: Resize Any Recipe by Servings | MeasuredCup',
    metaDescription:
      'Paste a recipe and change the servings. Scales cups, spoons, grams and eggs, then rounds to measuring-cup fractions you can actually use.',
    h1: 'Recipe Scaler',
    kind: 'tool',
    category: 'recipe-tools',
    tileLine: 'Paste a recipe, change the servings',
    related: ['/half-a-measurement/', '/cups-to-grams/', '/cups-in-a-quart/', '/grams-to-cups/'],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'nist' }],
    photoId: 'cookbooks-counter',
    faq: [
      {
        q: 'How do I scale a recipe?',
        a: 'Divide the servings you want by the servings the recipe makes. Multiply every ingredient by that number.',
      },
      {
        q: 'How do I double a recipe?',
        a: 'Multiply each ingredient by 2. Keep the oven temperature, use a bigger pan or two pans, and expect a longer bake if the batter is deeper.',
      },
      {
        q: 'What is 3/4 cup times 1.5?',
        a: '1 1/8 cups, which is 1 cup plus 2 tablespoons.',
      },
      {
        q: 'Do I double the baking time when I double a recipe?',
        a: 'No. Baking time depends on batter depth. Keep the depth the same with a larger pan and the time stays close to the original.',
      },
      {
        q: 'How do I cut a recipe that uses 3 eggs in half?',
        a: 'Use 1 egg plus half of a beaten second egg, about 25 g.',
      },
      {
        q: 'Can the scaler handle grams?',
        a: 'Yes. Gram, kilogram, ounce and pound amounts are multiplied directly and kept in their original unit.',
      },
    ],
    inSitemap: true,
  },

  {
    slug: '/tablespoons-in-1-4-cup/',
    title: 'How Many Tablespoons in 1/4 Cup? 4, Plus Grams | MeasuredCup',
    metaDescription:
      '1/4 cup is 4 tablespoons, 12 teaspoons or 2 fluid ounces (59.1 mL). See what 1/4 cup of flour, sugar, butter, oil and 19 more ingredients weighs in grams.',
    h1: 'How Many Tablespoons in 1/4 Cup?',
    kind: 'tool',
    category: 'converters',
    tileLine: '4 tbsp, plus grams for 23 ingredients',
    related: ['/tablespoons-in-1-8-cup/', '/tablespoons-in-1-3-cup/', '/tablespoons-to-cups/', '/tablespoons-to-grams/'],
    lastUpdated: '2026-10-16',
    sources: [{ key: 'nist' }, { key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'butter-flour-eggs',
    faq: [
      {
        q: 'How many tablespoons are in 1/4 cup?',
        a: "4. A US cup holds 16 tablespoons, and a quarter of 16 is 4. That's the same for dry and liquid ingredients, because both are volume measures.",
      },
      {
        q: 'How many teaspoons are in 1/4 cup?',
        a: '12 teaspoons. There are 3 teaspoons in a tablespoon, and 1/4 cup is 4 tablespoons.',
      },
      {
        q: 'How many grams is 1/4 cup of flour?',
        a: "About 31.3 g of all-purpose flour using USDA's 125 g per cup, or 30 g using King Arthur's 120 g per cup.",
      },
      {
        q: 'How many grams is 1/4 cup of sugar?',
        a: "50 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 55 g, and powdered sugar about 30 g.",
      },
      {
        q: 'How much butter is 1/4 cup?',
        a: "4 tablespoons, which is half a US stick. By weight that's about 57 g.",
      },
      {
        q: 'Is 1/4 cup the same as 2 ounces?',
        a: 'For volume, yes: 1/4 cup is 2 US fluid ounces. By weight it depends on the ingredient. 1/4 cup of flour is about 1.1 oz (31.3 g), while 1/4 cup of honey is about 3 oz (84.8 g).',
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/grams-to-tablespoons/',
    title: 'Grams to Tablespoons Converter by Ingredient | MeasuredCup',
    metaDescription:
      'Convert grams to tablespoons and teaspoons for 23 ingredients. 10 g of flour is 1.3 tbsp, sugar 0.8 tbsp and butter 0.7 tbsp, using USDA and King Arthur data.',
    h1: 'Grams to Tablespoons Converter',
    kind: 'tool',
    category: 'converters',
    tileLine: 'Grams to spoons for 23 ingredients',
    related: ['/tablespoons-to-grams/', '/grams-to-cups/', '/tablespoons-to-cups/', '/butter-converter/'],
    lastUpdated: '2026-10-16',
    sources: [{ key: 'usda' }, { key: 'kingArthur' }, { key: 'nist' }],
    photoId: 'scale-flour',
    faq: [
      {
        q: 'How many grams is 1 tablespoon?',
        a: 'It depends on the ingredient. 1 tablespoon of water is 14.8 g, all-purpose flour about 7.8 g, sugar 12.5 g, butter 14.2 g and honey 21.2 g (USDA FoodData Central).',
      },
      {
        q: 'Is 1 tablespoon 15 grams?',
        a: 'Only for water and similar liquids, which weigh about 14.8 g per tablespoon. Flour is about half that, and honey is about 21 g.',
      },
      {
        q: 'How many tablespoons is 10 grams of sugar?',
        a: "0.8 tablespoons, which is 2.4 teaspoons, using USDA's 12.5 g per tablespoon.",
      },
      {
        q: 'How many tablespoons is 100 grams of butter?',
        a: 'About 7 tablespoons (7.05), one less than a US stick of 8 tablespoons.',
      },
      {
        q: 'How many tablespoons is 20 grams of flour?',
        a: "About 2 1/2 tablespoons: 2.56 using USDA's 125 g per cup, or 2.67 using King Arthur's 120 g per cup.",
      },
      {
        q: 'How do I convert grams to teaspoons?',
        a: "Divide grams by the grams in one teaspoon, which is the grams per cup ÷ 48. For sugar that's 4.2 g per teaspoon, so 10 g is 2.4 teaspoons.",
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/tablespoons-to-cups/',
    title: 'Tablespoons to Cups Converter + Chart | MeasuredCup',
    metaDescription:
      '16 tablespoons make 1 cup. Convert tablespoons to cups with real measuring-cup answers like 1/2 cup + 2 tbsp, plus mL, fluid ounces and grams by ingredient.',
    h1: 'Tablespoons to Cups Converter',
    kind: 'tool',
    category: 'converters',
    tileLine: '16 tbsp = 1 cup, with a full chart',
    related: ['/tablespoons-in-1-8-cup/', '/tablespoons-in-1-4-cup/', '/tablespoons-to-grams/', '/cups-to-grams/'],
    lastUpdated: '2026-10-16',
    sources: [{ key: 'nist' }, { key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'copper-cups-paper',
    faq: [
      {
        q: 'How many tablespoons are in a cup?',
        a: '16. That holds for any ingredient, because both are volume measures. Half a cup is 8 tablespoons and a quarter cup is 4.',
      },
      {
        q: 'Does 6 tablespoons equal 1/4 cup?',
        a: 'No. 1/4 cup is 4 tablespoons. 6 tablespoons is 3/8 cup, which you can measure as 1/4 cup + 2 tbsp.',
      },
      {
        q: 'How many cups is 10 tablespoons?',
        a: "0.625 cups, or 1/2 cup + 2 tbsp. In grams that's about 78 g of all-purpose flour, 125 g of sugar or 142 g of butter.",
      },
      {
        q: 'How many tablespoons are in 1/3 cup?',
        a: "5 tablespoons plus 1 teaspoon. A third of a cup doesn't divide evenly into tablespoons.",
      },
      {
        q: 'How many tablespoons of butter make a cup?',
        a: '16 tablespoons, which is 2 US sticks or 227 g.',
      },
      {
        q: 'Is a tablespoon the same as a fluid ounce?',
        a: 'No. A tablespoon is half a fluid ounce. 2 tablespoons make 1 fluid ounce, and 16 tablespoons make 8 fluid ounces, which is 1 cup.',
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/tablespoons-in-1-8-cup/',
    title: 'How Many Tablespoons in 1/8 Cup? 2, Plus Grams | MeasuredCup',
    metaDescription:
      '1/8 cup is 2 tablespoons, 6 teaspoons or 1 fluid ounce (29.6 mL). See what 1/8 cup of flour, sugar, butter, oil and 19 more ingredients weighs in grams.',
    h1: 'How Many Tablespoons in 1/8 Cup?',
    kind: 'tool',
    category: 'converters',
    tileLine: '2 tbsp, plus grams for 23 ingredients',
    related: ['/tablespoons-to-cups/', '/tablespoons-in-1-4-cup/', '/tablespoons-to-grams/', '/butter-converter/'],
    lastUpdated: '2026-10-16',
    sources: [{ key: 'nist' }, { key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'four-cups',
    faq: [
      {
        q: 'Is 2 tablespoons 1/8 of a cup?',
        a: 'Yes. A US cup holds 16 tablespoons, so 1/8 cup is exactly 2 tablespoons.',
      },
      {
        q: 'How many teaspoons are in 1/8 cup?',
        a: '6 teaspoons. There are 3 teaspoons in a tablespoon, and 1/8 cup is 2 tablespoons.',
      },
      {
        q: 'How many grams is 1/8 cup of flour?',
        a: "About 15.6 g of all-purpose flour using USDA's 125 g per cup, or 15 g using King Arthur's 120 g per cup.",
      },
      {
        q: 'How many grams is 1/8 cup of sugar?',
        a: "25 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 27.5 g.",
      },
      {
        q: 'How much is 1/8 cup of oil?',
        a: '2 tablespoons, 1 fluid ounce or 29.6 mL. Vegetable oil weighs about 27.3 g at that volume.',
      },
      {
        q: 'What is half of 1/8 cup?',
        a: '1 tablespoon, which is 3 teaspoons or 1/2 fluid ounce.',
      },
    ],
    inSitemap: true,
  },

  {
    slug: '/tablespoons-in-1-3-cup/',
    title: 'How Many Tablespoons in 1/3 Cup? Plus Grams | MeasuredCup',
    metaDescription:
      '1/3 cup is 5 tablespoons plus 1 teaspoon (16 teaspoons, 78.9 mL). See what 1/3 cup of flour, sugar, butter, water and 19 more ingredients weighs in grams.',
    h1: 'How Many Tablespoons in 1/3 Cup?',
    kind: 'tool',
    category: 'converters',
    tileLine: '5 tbsp + 1 tsp, plus grams',
    related: ['/tablespoons-in-1-4-cup/', '/tablespoons-to-cups/', '/half-a-measurement/', '/tablespoons-to-grams/'],
    lastUpdated: '2026-10-17',
    sources: [{ key: 'nist' }, { key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'copper-cups-paper',
    faq: [
      {
        q: 'How many tablespoons are in 1/3 cup?',
        a: '5 tablespoons plus 1 teaspoon, which is 5 1/3 tablespoons. A cup holds 16 tablespoons, and 16 ÷ 3 leaves one third of a tablespoon, which is exactly 1 teaspoon.',
      },
      {
        q: 'Is 5 tablespoons a third of a cup?',
        a: 'Almost. 5 tablespoons is 1 teaspoon short of 1/3 cup. Add one level teaspoon to make it exact.',
      },
      {
        q: 'Is 6 tablespoons equal to 1/3 cup?',
        a: 'No. 6 tablespoons is 3/8 cup, which is 2 teaspoons more than 1/3 cup.',
      },
      {
        q: 'How many grams is 1/3 cup of flour?',
        a: "About 41.7 g of all-purpose flour using USDA's 125 g per cup, or 40 g using King Arthur's 120 g per cup.",
      },
      {
        q: 'How much butter is 1/3 cup?',
        a: "5 tablespoons plus 1 teaspoon, about 2/3 of a US stick. By weight that's about 75.7 g.",
      },
      {
        q: 'How many tablespoons are in 2/3 cup?',
        a: "10 tablespoons plus 2 teaspoons. It's double the 1/3 cup amount.",
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/cups-in-a-quart/',
    title: 'How Many Cups in a Quart? 4, Plus Dry Quarts | MeasuredCup',
    metaDescription:
      'A US quart is 4 cups, 2 pints or 32 fluid ounces (946 mL). See the quarts to cups chart, plus why a dry quart of berries holds about 4.65 cups.',
    h1: 'How Many Cups in a Quart?',
    kind: 'tool',
    category: 'converters',
    tileLine: '4 cups, plus pints, gallons and mL',
    related: ['/tablespoons-to-cups/', '/cups-to-grams/', '/recipe-scaler/', '/half-a-measurement/'],
    lastUpdated: '2026-10-17',
    sources: [{ key: 'nist' }, { key: 'usda' }],
    photoId: 'four-cups',
    faq: [
      {
        q: 'How many cups are in a quart?',
        a: "4 cups in a US liquid quart. That's the same as 2 pints or 32 fluid ounces.",
      },
      {
        q: 'Is 2 cups a quart?',
        a: 'No. 2 cups is a pint, which is half a quart. You need 4 cups for a full quart.',
      },
      {
        q: 'How many cups are in 2 quarts?',
        a: '8 cups. Multiply quarts by 4.',
      },
      {
        q: 'How many ounces are in a quart?',
        a: '32 US fluid ounces. By weight, a quart of water is about 948 g, or 2.09 pounds.',
      },
      {
        q: 'How many cups are in a quart of strawberries?',
        a: 'Berries are sold by the dry quart, which is about 4.65 US cups by volume. That\'s larger than a liquid quart, so expect a little more than 4 cups of whole berries.',
      },
      {
        q: 'Is a quart bigger than a liter?',
        a: 'No, slightly smaller. A US quart is 946 mL, about 95% of a liter. A liter is about 4.23 US cups.',
      },
      {
        q: 'How many cups are in a gallon?',
        a: '16 cups. A gallon is 4 quarts, and each quart is 4 cups.',
      },
    ],
    inSitemap: true,
  },

  // ---- Data page ----
  {
    slug: '/data/ingredient-weights/',
    title: 'Cup Weights by Ingredient: USDA vs King Arthur | MeasuredCup',
    metaDescription:
      'Grams per US cup, tablespoon and teaspoon for 23 baking ingredients, comparing USDA FoodData Central and King Arthur Baking. Free CSV download.',
    h1: 'Ingredient Weights per Cup: USDA vs King Arthur',
    kind: 'data',
    category: 'data',
    tileLine: 'Grams per cup, tbsp and tsp, with sources',
    related: ['/grams-to-cups/', '/cups-to-grams/', '/tablespoons-to-grams/'],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'scale-brown-sugar',
    faq: [
      {
        q: 'Is the CSV free to use?',
        a: 'Yes. The CSV is free to reuse with a link to MeasuredCup under CC BY 4.0, and the underlying USDA data is public domain.',
      },
      {
        q: 'How often is the table updated?',
        a: 'When USDA publishes a new FoodData Central release or a source changes its chart. Changes are logged on the editorial policy page.',
      },
      {
        q: 'Why is bread flour heavier than all-purpose in USDA data?',
        a: "USDA's portion data lists 137 g per cup for bread flour against 125 g for all-purpose. Bread flour's higher protein and coarser grind can pack more densely in a cup.",
      },
      {
        q: 'Can I use these numbers for nutrition labels?',
        a: "No. These are kitchen averages. Food labels must follow FDA rules and the product's own tested data.",
      },
    ],
    inSitemap: true,
  },

  // ---- Hubs ----
  {
    slug: '/converters/',
    title: 'Kitchen Converters by Ingredient | MeasuredCup',
    metaDescription:
      'Grams to cups, cups to grams, tablespoons to grams and a butter converter, each weight shown per ingredient using USDA and King Arthur data.',
    h1: 'Kitchen converters',
    kind: 'hub',
    category: 'converters',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'scale-flour',
    faq: [
      {
        q: 'Which is more accurate, cups or grams?',
        a: "Grams. A cup of flour can vary by 20% depending on how it's filled, while a kitchen scale is accurate to about 1 g.",
      },
      {
        q: 'Do these converters work for UK recipes?',
        a: 'Yes for grams. For cups, note that UK and Australian recipes often mean a 250 mL cup, about 6% larger than a US cup.',
      },
      {
        q: 'Where do the ingredient weights come from?',
        a: "USDA FoodData Central and King Arthur Baking's published chart. Each tool lists the exact sources and access dates.",
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/recipe-tools/',
    title: 'Recipe Tools: Halve, Double and Scale Recipes | MeasuredCup',
    metaDescription:
      'Halve, third, double or resize a whole recipe. These tools rebuild amounts into standard US measuring cups and spoons you can actually use.',
    h1: 'Recipe tools',
    kind: 'hub',
    category: 'recipe-tools',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'nist' }, { key: 'usda' }],
    photoId: 'copper-cups-paper',
    faq: [
      {
        q: 'Can I halve any recipe?',
        a: 'Most recipes, yes. Measure leaveners carefully, use a smaller pan with about half the area, and check doneness early.',
      },
      {
        q: 'Does baking time change when I halve a recipe?',
        a: 'Only if the batter depth changes. In a pan with half the area, the batter is just as deep and bakes in about the same time.',
      },
      {
        q: 'How do I halve an egg?',
        a: 'Beat one large egg and use about 25 g, a little over 1 1/2 tablespoons.',
      },
    ],
    inSitemap: true,
  },
  {
    slug: '/data/',
    title: 'Ingredient Data | MeasuredCup',
    metaDescription:
      'The ingredient weights behind every MeasuredCup converter, with their USDA and King Arthur sources and a free CSV download.',
    h1: 'Ingredient data',
    kind: 'hub',
    category: 'data',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }],
    photoId: 'scale-brown-sugar',
    inSitemap: true,
  },

  // ---- Trust and legal ----
  {
    slug: '/about/',
    title: 'About MeasuredCup',
    metaDescription:
      'MeasuredCup is a set of free kitchen converters built by Sikander Malik, using public USDA data and the King Arthur Baking weight chart.',
    h1: 'About MeasuredCup',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/how-we-calculate/',
    title: 'How We Calculate | MeasuredCup',
    metaDescription:
      'The units, ingredient weights, rounding and checks behind every MeasuredCup converter, with sources and access dates.',
    h1: 'How we calculate',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [{ key: 'usda' }, { key: 'kingArthur' }, { key: 'nist' }],
    inSitemap: true,
  },
  {
    slug: '/editorial-policy/',
    title: 'Editorial Policy | MeasuredCup',
    metaDescription:
      'Who writes MeasuredCup, how tools are built and tested, how we use AI, and our public corrections log.',
    h1: 'Editorial policy',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/authors/sikander-malik/',
    title: 'Sikander Malik | MeasuredCup',
    metaDescription:
      'Sikander Malik is a web developer and the founder of MeasuredCup, working from USDA FoodData Central and published manufacturer charts.',
    h1: 'Sikander Malik',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/contact/',
    title: 'Contact | MeasuredCup',
    metaDescription:
      'Spotted a number that looks wrong, or a tool you would like us to build? Send a message and we usually reply within 3 business days.',
    h1: 'Contact',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/privacy/',
    title: 'Privacy Policy | MeasuredCup',
    metaDescription:
      'How MeasuredCup handles data: Cloudflare hosting and privacy-friendly analytics, the Web3Forms contact form, and optional analytics.',
    h1: 'Privacy policy',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/terms/',
    title: 'Terms of Use | MeasuredCup',
    metaDescription:
      'Plain-language terms for using MeasuredCup: free use, no warranty, values are averages, and the CSV license.',
    h1: 'Terms of use',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/disclaimer/',
    title: 'Disclaimer | MeasuredCup',
    metaDescription:
      "MeasuredCup's converters give averages for typical US products. Weights vary by brand, humidity and how an ingredient is measured.",
    h1: 'Disclaimer',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/affiliate-disclosure/',
    title: 'Affiliate Disclosure | MeasuredCup',
    metaDescription:
      'Some links on MeasuredCup may be affiliate links. Affiliate relationships never change a number in our tools.',
    h1: 'Affiliate disclosure',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
  {
    slug: '/sitemap/',
    title: 'Sitemap | MeasuredCup',
    metaDescription:
      'Every page on MeasuredCup, grouped by section, with a one-line description of each.',
    h1: 'Sitemap',
    kind: 'trust',
    related: [],
    lastUpdated: LAST_UPDATED,
    sources: [],
    inSitemap: true,
  },
];

const BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

export function getPage(slug: string): PageEntry {
  const p = BY_SLUG.get(slug);
  if (!p) throw new Error(`Unknown page: ${slug}`);
  return p;
}

export function findPage(slug: string): PageEntry | undefined {
  return BY_SLUG.get(slug);
}

export function toolPages(): PageEntry[] {
  return PAGES.filter((p) => p.kind === 'tool');
}

export function pagesInCategory(category: Category): PageEntry[] {
  return PAGES.filter((p) => p.category === category && (p.kind === 'tool' || p.kind === 'data'));
}

export function sitemapPages(): PageEntry[] {
  return PAGES.filter((p) => p.inSitemap);
}
