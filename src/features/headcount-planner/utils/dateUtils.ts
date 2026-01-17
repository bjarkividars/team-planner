export function formatMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function parseMonthKey(key: string): Date {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function generateMonthRange(startDate: Date, count: number): string[] {
  const months: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = addMonths(startDate, i);
    months.push(formatMonthKey(date));
  }
  return months;
}

export function generateMonthsBefore(startDate: Date, count: number): string[] {
  const months: string[] = [];
  for (let i = count; i > 0; i--) {
    const date = addMonths(startDate, -i);
    months.push(formatMonthKey(date));
  }
  return months;
}

export function getCurrentMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}
