import type { PlacedRole } from '../types';

export interface MonthlyBalance {
  month: string;
  balance: number;
  burn: number;
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
  const startMonth = now.getMonth() + 1;
  const currentMonthKey = `${startYear}-${String(startMonth).padStart(2, '0')}`;

  const salaryDeltaByMonth = new Map<string, number>();
  let salaryCosts = 0;
  for (const role of placedRoles) {
    const monthlySalary = role.salary / 12;
    if (role.startMonth < currentMonthKey) {
      salaryCosts += monthlySalary;
    } else {
      salaryDeltaByMonth.set(
        role.startMonth,
        (salaryDeltaByMonth.get(role.startMonth) ?? 0) + monthlySalary
      );
    }
  }

  const result: MonthlyBalance[] = [];
  let cashBalance = fundingAmount;

  for (const monthKey of months) {
    const [year, month] = monthKey.split('-').map(Number);
    const monthIndex = (year - startYear) * 12 + (month - startMonth);

    if (monthIndex < 0) {
      result.push({ month: monthKey, balance: fundingAmount, burn: 0 });
      continue;
    }

    const salaryDelta = salaryDeltaByMonth.get(monthKey);
    if (salaryDelta) {
      salaryCosts += salaryDelta;
    }

    const otherCostsThisMonth = otherCosts * Math.pow(1 + otherCostsGrowthRate, monthIndex);
    const monthlyCosts = salaryCosts + otherCostsThisMonth;
    const monthlyRevenue = mrr * Math.pow(1 + mrrGrowthRate, monthIndex);
    const netCashFlow = monthlyRevenue - monthlyCosts;

    cashBalance += netCashFlow;
    result.push({ month: monthKey, balance: cashBalance, burn: monthlyCosts });

    if (cashBalance <= 0) {
      break;
    }
  }

  return result;
}
