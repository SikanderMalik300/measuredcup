import {
  gramAmountsInCups,
  cupFractionsInGrams,
  spoonGramsRows,
  tablespoonsToCupsRows,
  spoonGramsByIngredient,
  cupFractionEquivalents,
  cupFractionLabel,
  gramsToTablespoonsRows,
  quartsToCupsRows,
  threeQuartsRows,
  quartWeightRows,
  SPOON_GRAM_COLS,
  G2TBSP_COLS,
  BUTTER_ROWS,
  HALF_THIRD_ROWS,
  GRAM_AMOUNT_COLS,
  CUP_FRACTION_COLS,
} from '@/lib/calc/tables';
import { INGREDIENTS, getIngredient, differencePercentLabel } from '@/lib/data/ingredients';

function colName(id: string) {
  return getIngredient(id).name;
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}

const th = 'px-3 py-2 text-left text-small font-medium text-muted';
const thNum = 'px-3 py-2 text-right text-small font-medium text-muted';
const td = 'px-3 py-2 text-ink';
const tdNum = 'px-3 py-2 text-right tabular text-ink';
const rowLine = 'border-b border-line';

// USDA vs King Arthur comparison (shared by grams-to-cups and cups-to-grams).
export function ComparisonTable() {
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">
          Grams per US cup, USDA vs King Arthur
        </caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Ingredient</th>
            <th scope="col" className={thNum}>USDA g per cup</th>
            <th scope="col" className={thNum}>King Arthur g per cup</th>
            <th scope="col" className={thNum}>Difference (%)</th>
          </tr>
        </thead>
        <tbody>
          {INGREDIENTS.map((ing) => (
            <tr key={ing.id} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{ing.name}</th>
              <td className={tdNum}>{ing.usdaGramsPerCup}</td>
              <td className={tdNum}>{ing.kaGramsPerCup ?? '-'}</td>
              <td className={tdNum}>{differencePercentLabel(ing)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function GramAmountsTable() {
  const rows = gramAmountsInCups();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">
          Common gram amounts in cups (USDA)
        </caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Grams</th>
            {GRAM_AMOUNT_COLS.map((id) => (
              <th scope="col" key={id} className={thNum}>{colName(id)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.grams} className={rowLine}>
              <th scope="row" className={td + ' font-normal tabular'}>{r.grams} g</th>
              {r.cells.map((c, i) => (
                <td key={i} className={tdNum}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function CupFractionsTable() {
  const rows = cupFractionsInGrams();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Cup fractions in grams (USDA)</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Cups</th>
            {CUP_FRACTION_COLS.map((id) => (
              <th scope="col" key={id} className={thNum}>{colName(id)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={rowLine}>
              <th scope="row" className={td + ' font-normal tabular'}>{r.label}</th>
              {r.cells.map((c, i) => (
                <td key={i} className={tdNum}>{c} g</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function SpoonGramsTable() {
  const rows = spoonGramsRows();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">
          1 tablespoon and 1 teaspoon in grams (USDA)
        </caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Ingredient</th>
            <th scope="col" className={thNum}>1 tbsp</th>
            <th scope="col" className={thNum}>1 tsp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{r.name}</th>
              <td className={tdNum}>{r.tbsp} g</td>
              <td className={tdNum}>{r.tsp} g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function TablespoonsToCupsChart() {
  const rows = tablespoonsToCupsRows();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Tablespoons to cups chart (US)</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={thNum}>Tablespoons</th>
            <th scope="col" className={thNum}>Cups (decimal)</th>
            <th scope="col" className={th}>Measure with</th>
            <th scope="col" className={thNum}>mL</th>
            <th scope="col" className={thNum}>Fluid ounces</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.tbsp} className={rowLine}>
              <th scope="row" className={tdNum + ' font-normal'}>{r.tbsp}</th>
              <td className={tdNum}>{r.cups}</td>
              <td className={td}>{r.measureWith}</td>
              <td className={tdNum}>{r.ml}</td>
              <td className={tdNum}>{r.flOz}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function SpoonGramsByIngredientTable() {
  const rows = spoonGramsByIngredient();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Common spoon amounts in grams (USDA)</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Tablespoons</th>
            {SPOON_GRAM_COLS.map((id) => (
              <th scope="col" key={id} className={thNum}>{colName(id)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.tbsp} className={rowLine}>
              <th scope="row" className={td + ' font-normal tabular'}>{r.tbsp} tbsp</th>
              {r.cells.map((c, i) => (
                <td key={i} className={tdNum}>{c} g</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function CupFractionEquivalentsTable({ fraction }: { fraction: number }) {
  const rows = cupFractionEquivalents(fraction);
  const label = cupFractionLabel(fraction);
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">{label} cup equivalents (US)</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{r.label}</th>
              <td className={tdNum}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function GramsToTablespoonsChart() {
  const rows = gramsToTablespoonsRows();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Grams to tablespoons (USDA)</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Grams</th>
            {G2TBSP_COLS.map((id) => (
              <th scope="col" key={id} className={thNum}>{colName(id)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.grams} className={rowLine}>
              <th scope="row" className={td + ' font-normal tabular'}>{r.grams} g</th>
              {r.cells.map((c, i) => (
                <td key={i} className={tdNum}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function QuartsToCupsChart() {
  const rows = quartsToCupsRows();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Quarts to cups chart (US liquid)</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Quarts</th>
            <th scope="col" className={thNum}>Cups</th>
            <th scope="col" className={thNum}>Pints</th>
            <th scope="col" className={thNum}>Fluid ounces</th>
            <th scope="col" className={thNum}>mL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.quarts} className={rowLine}>
              <th scope="row" className={td + ' font-normal tabular'}>{r.quarts}</th>
              <td className={tdNum}>{r.cups}</td>
              <td className={tdNum}>{r.pints}</td>
              <td className={tdNum}>{r.flOz}</td>
              <td className={tdNum}>{r.ml}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function ThreeQuartsTable() {
  const rows = threeQuartsRows();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Three kinds of quart</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Quart</th>
            <th scope="col" className={thNum}>mL</th>
            <th scope="col" className={thNum}>US cups</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{r.name}</th>
              <td className={tdNum}>{r.ml}</td>
              <td className={tdNum}>{r.cups}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function QuartWeightTable() {
  const rows = quartWeightRows();
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">What a quart weighs (USDA)</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Liquid</th>
            <th scope="col" className={thNum}>Grams</th>
            <th scope="col" className={thNum}>Pounds</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{r.name}</th>
              <td className={tdNum}>{r.grams} g</td>
              <td className={tdNum}>{r.pounds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function ButterTable() {
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">Butter amounts</caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Amount</th>
            <th scope="col" className={th}>Sticks</th>
            <th scope="col" className={th}>Tablespoons</th>
            <th scope="col" className={thNum}>Grams</th>
            <th scope="col" className={thNum}>Ounces</th>
          </tr>
        </thead>
        <tbody>
          {BUTTER_ROWS.map((r) => (
            <tr key={r.amount} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{r.amount}</th>
              <td className={td}>{r.sticks}</td>
              <td className={td}>{r.tablespoons}</td>
              <td className={tdNum}>{r.grams} g</td>
              <td className={tdNum}>{r.ounces}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function HalfThirdTable() {
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">
          Halves and thirds of common measurements
        </caption>
        <thead>
          <tr className={rowLine}>
            <th scope="col" className={th}>Amount</th>
            <th scope="col" className={th}>Half</th>
            <th scope="col" className={th}>One third</th>
          </tr>
        </thead>
        <tbody>
          {HALF_THIRD_ROWS.map((r) => (
            <tr key={r.amount} className={rowLine}>
              <th scope="row" className={td + ' font-normal'}>{r.amount}</th>
              <td className={td}>{r.half}</td>
              <td className={td}>{r.third}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}
