import type { PlacedRole } from '../types';

export interface RunwayResult {
  runOutMonth: string | null;
  runOutLabel: string | null;
  isProfitable: boolean;
  profitableMonth: string | null;
  profitableLabel: string | null;
}

export function calculateRunway(
  placedRoles: PlacedRole[],
  fundingAmount: number,
  mrr: number,
  mrrGrowthRate: number,
  otherCosts: number,
  otherCostsGrowthRate: number
): RunwayResult {
  if (placedRoles.length === 0 && otherCosts === 0) {
    return {
      runOutMonth: null,
      runOutLabel: null,
      isProfitable: mrr > 0,
      profitableMonth: null,
      profitableLabel: null,
    };
  }

  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth();

  let cashBalance = fundingAmount;
  let runOutMonth: string | null = null;
  let profitableMonth: string | null = null;

  const maxMonths = 240;
  for (let i = 0; i < maxMonths; i++) {
    const projectedDate = new Date(startYear, startMonth + i, 1);
    const monthKey = `${projectedDate.getFullYear()}-${String(projectedDate.getMonth() + 1).padStart(2, '0')}`;

    const salaryCosts = placedRoles
      .filter(role => role.startMonth <= monthKey)
      .reduce((sum, role) => sum + role.salary / 12, 0);

    const otherCostsThisMonth = otherCosts * Math.pow(1 + otherCostsGrowthRate, i);
    const monthlyCosts = salaryCosts + otherCostsThisMonth;
    const monthlyRevenue = mrr * Math.pow(1 + mrrGrowthRate, i);
    const netCashFlow = monthlyRevenue - monthlyCosts;

    cashBalance += netCashFlow;

    if (cashBalance < 0) {
      runOutMonth = monthKey;
      break;
    }

    if (!profitableMonth && netCashFlow >= 0 && monthlyCosts > 0) {
      profitableMonth = monthKey;
    }
  }

  const formatLabel = (monthKey: string | null): string | null => {
    if (!monthKey) return null;
    const [year, monthNum] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return {
    runOutMonth,
    runOutLabel: formatLabel(runOutMonth),
    isProfitable: profitableMonth !== null,
    profitableMonth,
    profitableLabel: formatLabel(profitableMonth),
  };
}
