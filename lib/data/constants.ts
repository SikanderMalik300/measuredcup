// Volume and weight constants for MeasuredCup.
// Every value below has a source. US customary units are primary; metric shown alongside.
// See measuredcup-build-spec.md A6.1.

// US customary cup.
// Source: NIST Handbook 44 Appendix C (US customary units),
// https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44 (accessed 2026-10-14).
export const ML_PER_CUP = 236.5882365;

// US tablespoon = 1/16 cup.
// Source: NIST Handbook 44 (accessed 2026-10-14).
export const ML_PER_TBSP = 14.78676478;

// US teaspoon = 1/48 cup.
// Source: NIST Handbook 44 (accessed 2026-10-14).
export const ML_PER_TSP = 4.928921594;

// US legal cup used on nutrition labels.
// Source: FDA, 21 CFR 101.9(b)(5)(viii) (accessed 2026-10-14).
export const ML_PER_LEGAL_CUP = 240;

// US fluid ounce.
// Source: NIST Handbook 44 (accessed 2026-10-14).
export const ML_PER_FL_OZ = 29.5735295625;

// US liquid pint, quart and gallon. Source: NIST Handbook 44 Appendix C (accessed 2026-10-16).
export const ML_PER_PINT = 473.176473;
export const ML_PER_QUART = 946.352946;
export const ML_PER_GALLON = 3785.411784;

// US dry quart (67.200625 cubic inches) and the UK imperial quart, for comparison only.
// Source: NIST Handbook 44 Appendix C (accessed 2026-10-16).
export const ML_PER_DRY_QUART = 1101.220942715;
export const ML_PER_IMPERIAL_QUART = 1136.5225;

// Avoirdupois ounce (weight).
// Source: NIST Handbook 44 (accessed 2026-10-14).
export const G_PER_OZ = 28.349523125;

// One stick of US butter = 1/2 cup = 8 tbsp = 4 oz.
// Source: US butter wrapper convention; 4 oz x 28.349523125 g = 113.398 g, rounded to 113.4 g.
export const BUTTER_STICK_G = 113.4;

// Large egg, without shell.
// Source: USDA FoodData Central SR Legacy, "Egg, whole, raw, fresh" (fdc_id 171287),
// portion "1 large" = 50 g, https://fdc.nal.usda.gov/ (SR Legacy 2018-04, accessed 2026-10-14).
export const LARGE_EGG_G = 50;

// Units per cup, derived.
export const TBSP_PER_CUP = 16;
export const TSP_PER_CUP = 48;
export const TSP_PER_TBSP = 3;

// Butter unit conversions are defined by the stick convention, not ingredient density.
// 1 stick = 113.4 g, 1 cup butter = 2 sticks, 1 tbsp butter = 1 stick / 8.
export const BUTTER_CUP_G = BUTTER_STICK_G * 2; // 226.8 g
export const BUTTER_TBSP_G = BUTTER_STICK_G / 8; // 14.175 g
export const BUTTER_TSP_G = BUTTER_STICK_G / 24; // 4.725 g
export const BUTTER_POUND_G = G_PER_OZ * 16; // 453.592 g
