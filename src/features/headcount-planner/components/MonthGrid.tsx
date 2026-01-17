import { useEffect, useMemo } from 'react';
import { MonthColumn } from './MonthColumn';
import { PlacedRole } from './PlacedRole';
import { RunwayLine } from './RunwayLine';
import { CashBalanceChart } from './CashBalanceChart';
import { usePlannerContext } from '../hooks/usePlannerContext';
import { COLUMN_WIDTH } from '../types';
import { HEADER_HEIGHT, ROW_HEIGHT, ROW_GAP } from '../constants';
import { calculateCashBalanceTimeline } from '../utils/cashBalanceCalculator';

export function MonthGrid() {
  const {
    months,
    placedRoles,
    scrollContainerRef,
    handleScroll,
    runway,
    financials,
    cashBalanceChartExpanded,
    actions: { handleToggleCashBalanceChartExpanded },
  } = usePlannerContext();

  const runOutMonth = placedRoles.length > 0 ? runway.runOutMonth : null;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef, handleScroll]);

  const monthIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    months.forEach((month, index) => {
      map.set(month, index);
    });
    return map;
  }, [months]);

  const monthlyBalances = useMemo(
    () => calculateCashBalanceTimeline(
      placedRoles,
      financials.fundingAmount,
      financials.mrr,
      financials.mrrGrowthRate,
      financials.otherCosts,
      financials.otherCostsGrowthRate,
      months
    ),
    [placedRoles, financials, months]
  );

  const rolesWithRows = useMemo(() => {
    const sorted = [...placedRoles].sort((a, b) =>
      a.startMonth.localeCompare(b.startMonth)
    );

    return sorted.map((role, index) => ({
      ...role,
      rowIndex: index,
    }));
  }, [placedRoles]);

  const rolesMinHeight = rolesWithRows.length > 0
    ? rolesWithRows.length * (ROW_HEIGHT + ROW_GAP) + 100
    : 0;

  const totalWidth = months.length * COLUMN_WIDTH;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-(--color-bg) flex flex-col scrollbar-hide"
      >
        <div className="relative flex-1" style={{ width: totalWidth, minHeight: rolesMinHeight + HEADER_HEIGHT }}>
          <div className="absolute inset-0 flex">
            {months.map((monthKey) => {
              const monthIndex = monthIndexMap.get(monthKey);
              const runOutIndex = runOutMonth ? monthIndexMap.get(runOutMonth) : undefined;
              const isPastRunway = monthIndex !== undefined && runOutIndex !== undefined && monthIndex >= runOutIndex;

              return (
                <MonthColumn
                  key={monthKey}
                  monthKey={monthKey}
                  isPastRunway={isPastRunway}
                />
              );
            })}
          </div>

          <RunwayLine runOutMonth={runOutMonth} monthIndexMap={monthIndexMap} />

          <div className="relative">
            {rolesWithRows.map((role) => {
              const monthIndex = monthIndexMap.get(role.startMonth);
              if (monthIndex === undefined) return null;

              return (
                <PlacedRole
                  key={role.id}
                  placedRole={role}
                  monthIndex={monthIndex}
                  totalMonths={months.length}
                  rowIndex={role.rowIndex}
                />
              );
            })}
          </div>
        </div>

        <div className="sticky z-20 bottom-0">
          <div
            style={{
              width: totalWidth,
              height: 32,
              background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
            }}
          />
          <CashBalanceChart
            monthlyBalances={monthlyBalances}
            fundingAmount={financials.fundingAmount}
            totalWidth={totalWidth}
            expanded={cashBalanceChartExpanded}
            onToggleExpanded={handleToggleCashBalanceChartExpanded}
          />
        </div>
      </div>
    </div>
  );
}
