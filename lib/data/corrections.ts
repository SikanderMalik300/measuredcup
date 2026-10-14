// Corrections log (build spec A9.4 editorial policy). Empty at launch.
// When a number changes, add a row with the date, the page, the old value and the new value.

export interface Correction {
  date: string; // ISO date
  page: string; // slug or page name
  wasWrong: string;
  nowIs: string;
}

export const CORRECTIONS: Correction[] = [];
