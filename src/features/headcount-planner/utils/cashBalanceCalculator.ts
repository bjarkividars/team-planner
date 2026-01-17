import type { PlacedRole } from '../types';

export interface MonthlyBalance {
  month: string;
  balance: number;
}

export function calculateCashBalanceTimeline(
  placedRoles: PlacedRole[],
  fundingAmount: number,
  mrr: number,
  mrrGrowthRate: number,
  otherCosts: number,
  otherCostsGrowthRate: number,
  months: string[]
): MonthlyBalance[] {
  if (months.length === 0) return [];

  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth();

  const monthIndexMap = new Map<string, number>();
  for (let i = 0; i < 120; i++) {
    const projectedDate = new Date(startYear, startMonth + i, 1);
    const monthKey = `${projectedDate.getFullYear()}-${String(projectedDate.getMonth() + 1).padStart(2, '0')}`;
    monthIndexMap.set(monthKey, i);
  }

  const result: MonthlyBalance[] = [];

  for (const monthKey of months) {
    const i = monthIndexMap.get(monthKey);

    if (i === undefined || i < 0) {
      result.push({ month: monthKey, balance: fundingAmount });
      continue;
    }

    let cashBalance = fundingAmount;
    for (let j = 0; j <= i; j++) {
      const projectedDate = new Date(startYear, startMonth + j, 1);
      const projectedMonthKey = `${projectedDate.getFullYear()}-${String(projectedDate.getMonth() + 1).padStart(2, '0')}`;

      const salaryCosts = placedRoles
        .filter(role => role.startMonth <= projectedMonthKey)
        .reduce((sum, role) => sum + role.salary / 12, 0);

      const otherCostsThisMonth = otherCosts * Math.pow(1 + otherCostsGrowthRate, j);
      const monthlyCosts = salaryCosts + otherCostsThisMonth;
      const monthlyRevenue = mrr * Math.pow(1 + mrrGrowthRate, j);
      const netCashFlow = monthlyRevenue - monthlyCosts;

      cashBalance += netCashFlow;
    }

    result.push({ month: monthKey, balance: cashBalance });
  }

  return result;
}
