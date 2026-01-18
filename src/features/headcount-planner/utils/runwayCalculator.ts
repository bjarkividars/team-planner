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
  const startMonthIndex = now.getMonth();
  const startMonth = startMonthIndex + 1;
  const startMonthKey = `${startYear}-${String(startMonth).padStart(2, '0')}`;

  let cashBalance = fundingAmount;
  let runOutMonth: string | null = null;
  let profitableMonth: string | null = null;

  const maxMonths = 2400;
  const salaryDeltaByIndex = new Map<number, number>();
  let salaryCosts = 0;
  for (const role of placedRoles) {
    const monthlySalary = role.salary / 12;
    if (role.startMonth <= startMonthKey) {
      salaryCosts += monthlySalary;
      continue;
    }
    const [year, month] = role.startMonth.split('-').map(Number);
    const monthIndex = (year - startYear) * 12 + (month - startMonth);
    salaryDeltaByIndex.set(monthIndex, (salaryDeltaByIndex.get(monthIndex) ?? 0) + monthlySalary);
  }

  let monthlyRevenue = mrr;
  let otherCostsThisMonth = otherCosts;
  const revenueGrowthFactor = 1 + mrrGrowthRate;
  const costGrowthFactor = 1 + otherCostsGrowthRate;

  for (let i = 0; i < maxMonths; i++) {
    const salaryDelta = salaryDeltaByIndex.get(i);
    if (salaryDelta) {
      salaryCosts += salaryDelta;
    }

    const monthlyCosts = salaryCosts + otherCostsThisMonth;
    const netCashFlow = monthlyRevenue - monthlyCosts;
    cashBalance += netCashFlow;

    const year = startYear + Math.floor((startMonthIndex + i) / 12);
    const month = ((startMonthIndex + i) % 12) + 1;
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;

    if (cashBalance < 0) {
      runOutMonth = monthKey;
      break;
    }

    if (!profitableMonth && netCashFlow >= 0 && monthlyCosts > 0) {
      profitableMonth = monthKey;
    }

    monthlyRevenue *= revenueGrowthFactor;
    otherCostsThisMonth *= costGrowthFactor;
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
