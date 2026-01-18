import { useEffect, useMemo } from 'react';
import { MonthColumn } from './MonthColumn';
import { PlacedRole } from './PlacedRole';
import { RunwayLine } from './RunwayLine';
import { BurnChartDialog } from './BurnChartDialog';
import { usePlannerContext } from '../hooks/usePlannerContext';
import { COLUMN_WIDTH } from '../types';
import { HEADER_HEIGHT, ROW_HEIGHT, ROW_GAP } from '../constants';

export function MonthGrid() {
  const {
    months,
    placedRoles,
    scrollContainerRef,
    handleScroll,
    runway,
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
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {placedRoles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center px-4">
            <h2 className="text-2xl font-semibold text-(--g-12) mb-2">
              Start modeling your team
            </h2>
            <p className="text-base text-(--g-40) hidden md:block">
              Drag a role from the left onto the timeline to see how it affects runway.
            </p>
            <p className="text-base text-(--g-40) md:hidden">
              Tap a month to add a role and see how it affects runway.
            </p>
          </div>
        </div>
      )}

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

      </div>

      <BurnChartDialog />
    </div>
  );
}
