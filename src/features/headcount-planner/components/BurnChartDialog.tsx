import React, { useState, useRef, useMemo, useCallback } from 'react';
import { AreaChart } from 'lucide-react';
import { Tooltip } from '@base-ui/react/tooltip';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '../../../components/ui/Dialog';
import { getMaxTextWidth } from '../../../lib/measureText';
import { calculateCashBalanceTimeline, type MonthlyBalance } from '../utils/cashBalanceCalculator';
import { usePlannerContext } from '../hooks/usePlannerContext';
import { useScenarioContext } from '../hooks/useScenarioContext';
import { formatSalary } from '../types';

const CHART_HEIGHT = 320;
const CHART_PADDING = { top: 20, bottom: 40 };

const SCENARIO_COLORS = ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8'];

function formatCompact(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

interface ScenarioBalances {
  scenarioIndex: number;
  name: string;
  color: string;
  balances: MonthlyBalance[];
  filteredBalances: MonthlyBalance[];
}

export function BurnChartDialog() {
  const [open, setOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { months } = usePlannerContext();
  const { scenarios, activeIndex, scenarioCount } = useScenarioContext();

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() => new Set([activeIndex]));

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const allScenarioBalances = useMemo(() => {
    return scenarios.map((scenario, index): ScenarioBalances => {
      const balances = calculateCashBalanceTimeline(
        scenario.placedRoles,
        scenario.fundingAmount,
        scenario.mrr,
        scenario.mrrGrowthRate,
        scenario.otherCosts,
        scenario.otherCostsGrowthRate,
        months
      );

      const filteredBalances: MonthlyBalance[] = [];
      let started = false;
      for (const b of balances) {
        if (b.month >= currentMonth) started = true;
        if (!started) continue;
        filteredBalances.push(b);
        if (b.balance <= 0) break;
      }

      return {
        scenarioIndex: index,
        name: scenario.name || `Scenario ${index + 1}`,
        color: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
        balances,
        filteredBalances,
      };
    });
  }, [scenarios, months, currentMonth]);

  const selectedScenarios = useMemo(() => {
    return allScenarioBalances.filter((s) => selectedIndices.has(s.scenarioIndex));
  }, [allScenarioBalances, selectedIndices]);

  const unifiedMonths = useMemo(() => {
    if (selectedScenarios.length === 0) return [];

    const allMonths = new Set<string>();
    for (const s of selectedScenarios) {
      for (const b of s.filteredBalances) {
        allMonths.add(b.month);
      }
    }

    return Array.from(allMonths).sort();
  }, [selectedScenarios]);

  const maxBalance = useMemo(() => {
    let max = 0;
    for (const s of selectedScenarios) {
      const scenarioMax = Math.max(
        scenarios[s.scenarioIndex].fundingAmount,
        ...s.filteredBalances.map((b) => b.balance)
      );
      if (scenarioMax > max) max = scenarioMax;
    }
    return max || 1;
  }, [selectedScenarios, scenarios]);

  const chartWidth = Math.max(500, unifiedMonths.length * 40);
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const columnWidth = unifiedMonths.length > 0 ? chartWidth / unifiedMonths.length : chartWidth;

  const yScale = useCallback(
    (value: number) => {
      const clampedValue = Math.max(0, value);
      const ratio = (maxBalance - clampedValue) / maxBalance;
      return CHART_PADDING.top + ratio * plotHeight;
    },
    [maxBalance, plotHeight]
  );

  const zeroY = yScale(0);

  const scenarioLines = useMemo(() => {
    return selectedScenarios.map((s) => {
      const balanceMap = new Map(s.filteredBalances.map((b) => [b.month, b]));

      const points = unifiedMonths.map((month, i) => {
        const balance = balanceMap.get(month);
        const x =
          unifiedMonths.length > 1 ? (i / (unifiedMonths.length - 1)) * chartWidth : 0;
        const y = balance ? yScale(balance.balance) : yScale(0);
        return {
          x,
          y,
          month,
          balance: balance?.balance ?? 0,
          burn: balance?.burn ?? 0,
          hasData: !!balance,
        };
      });

      const validPoints = points.filter((p) => p.hasData);
      const linePathD =
        validPoints.length > 0
          ? `M ${validPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`
          : '';

      let areaPathD = '';
      if (validPoints.length > 0) {
        const firstPoint = validPoints[0];
        const lastPoint = validPoints[validPoints.length - 1];
        areaPathD = `M ${firstPoint.x},${zeroY} L ${validPoints.map((p) => `${p.x},${p.y}`).join(' L ')} L ${lastPoint.x},${zeroY} Z`;
      }

      return {
        ...s,
        points,
        linePathD,
        areaPathD,
      };
    });
  }, [selectedScenarios, unifiedMonths, chartWidth, yScale, zeroY]);

  const yAxisValues = useMemo(() => [maxBalance, maxBalance * 0.5, 0], [maxBalance]);
  const yAxisLabels = useMemo(() => yAxisValues.map(formatCompact), [yAxisValues]);
  const yAxisWidth = useMemo(() => {
    return Math.ceil(getMaxTextWidth(yAxisLabels, '10px system-ui')) + 8;
  }, [yAxisLabels]);

  const toggleScenario = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        if (next.size > 1) {
          next.delete(index);
        }
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (unifiedMonths.length === 0 || allScenarioBalances.every((s) => s.balances.length === 0)) {
    return null;
  }

  const isMultiScenarioMode = selectedIndices.size > 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-18 md:bottom-4 right-4 z-50 p-3 rounded-full bg-(--g-12) text-white shadow-lg hover:bg-(--g-20) transition-colors"
      >
        <AreaChart size={20} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:w-[90vw] md:max-w-4xl">
          <DialogTitle>Cash Balance Over Time</DialogTitle>
          {scenarioCount > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {allScenarioBalances.map((s) => {
                const isSelected = selectedIndices.has(s.scenarioIndex);
                return (
                  <button
                    key={s.scenarioIndex}
                    type="button"
                    onClick={() => toggleScenario(s.scenarioIndex)}
                    className={`chip ${isSelected ? 'chip-active' : ''}`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${isSelected ? '' : 'opacity-50'}`}
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex">
            {/* Y-axis labels - fixed */}
            <div className="shrink-0" style={{ width: yAxisWidth, height: CHART_HEIGHT }}>
              <svg style={{ width: yAxisWidth, height: CHART_HEIGHT }}>
                {yAxisValues.map((value, i) => (
                  <text
                    key={value}
                    x={yAxisWidth - 4}
                    y={yScale(value)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-[10px] fill-(--g-50)"
                  >
                    {yAxisLabels[i]}
                  </text>
                ))}
              </svg>
            </div>

            {/* Chart area - scrollable */}
            <div className="overflow-x-auto flex-1">
              <div
                ref={chartRef}
                className="relative"
                style={{ width: chartWidth, height: CHART_HEIGHT }}
              >
                <svg
                  className="absolute inset-0"
                  style={{ width: chartWidth, height: CHART_HEIGHT }}
                >
                  {/* Horizontal grid lines */}
                  {yAxisValues.map((value) => (
                    <line
                      key={value}
                      x1={0}
                      y1={yScale(value)}
                      x2={chartWidth}
                      y2={yScale(value)}
                      stroke="var(--g-88)"
                      strokeWidth={1}
                      strokeDasharray={value === 0 ? undefined : '4 4'}
                    />
                  ))}

                  {/* Vertical month grid lines */}
                  {unifiedMonths.map((_, i) => (
                    <line
                      key={i}
                      x1={i * columnWidth}
                      y1={CHART_PADDING.top}
                      x2={i * columnWidth}
                      y2={zeroY}
                      stroke="var(--g-88)"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Month labels (every 3rd month) */}
                  {unifiedMonths.map(
                    (month, i) =>
                      i % 3 === 0 && (
                        <text
                          key={month}
                          x={(i + 0.5) * columnWidth}
                          y={CHART_HEIGHT - 12}
                          textAnchor="middle"
                          className="text-[10px] fill-(--g-50)"
                        >
                          {formatMonth(month)}
                        </text>
                      )
                  )}

                  {/* Area fill - only for first selected scenario */}
                  {scenarioLines.length > 0 && scenarioLines[0].areaPathD && (
                    <path d={scenarioLines[0].areaPathD} fill="var(--g-92)" opacity={0.3} />
                  )}

                  {/* Lines for each scenario */}
                  {scenarioLines.map((scenarioLine) => (
                    <path
                      key={scenarioLine.scenarioIndex}
                      d={scenarioLine.linePathD}
                      fill="none"
                      stroke={scenarioLine.color}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>

                <Tooltip.Provider>
                  {unifiedMonths.map((month, i) => {
                    const handle = Tooltip.createHandle();

                    const scenarioData = scenarioLines.map((s) => {
                      const point = s.points.find((p) => p.month === month);
                      return {
                        name: s.name,
                        color: s.color,
                        balance: point?.balance ?? 0,
                        burn: point?.burn ?? 0,
                        hasData: point?.hasData ?? false,
                      };
                    });

                    const firstWithData = scenarioData.find((s) => s.hasData);
                    const anchorY = firstWithData
                      ? yScale(firstWithData.balance)
                      : CHART_PADDING.top;

                    const hires =
                      !isMultiScenarioMode && selectedScenarios.length === 1
                        ? scenarios[selectedScenarios[0].scenarioIndex].placedRoles.filter(
                          (r) => r.startMonth === month
                        )
                        : [];

                    return (
                      <React.Fragment key={month}>
                        <Tooltip.Trigger
                          handle={handle}
                          render={
                            <div
                              className="absolute cursor-default"
                              style={{
                                left: i * columnWidth,
                                width: columnWidth,
                                top: CHART_PADDING.top,
                                bottom: CHART_PADDING.bottom,
                              }}
                            />
                          }
                        />
                        <Tooltip.Root handle={handle}>
                          <Tooltip.Portal>
                            <Tooltip.Positioner
                              side="top"
                              sideOffset={8}
                              className="z-200"
                              anchor={() => {
                                const rect = chartRef.current?.getBoundingClientRect();
                                const x =
                                  (rect?.left ?? 0) +
                                  (unifiedMonths.length > 1
                                    ? (i / (unifiedMonths.length - 1)) * chartWidth
                                    : 0);
                                const y = (rect?.top ?? 0) + anchorY;
                                return {
                                  getBoundingClientRect: () => ({
                                    x,
                                    y,
                                    width: 0,
                                    height: 0,
                                    top: y,
                                    left: x,
                                    right: x,
                                    bottom: y,
                                    toJSON: () => { },
                                  }),
                                };
                              }}
                            >
                              <Tooltip.Popup className="rounded-lg bg-(--g-12) px-3 py-2 text-xs text-white shadow-lg max-w-[240px]">
                                <div className="font-medium mb-1">{formatMonth(month)}</div>
                                {isMultiScenarioMode ? (
                                  <div className="space-y-2">
                                    {scenarioData
                                      .filter((s) => s.hasData)
                                      .map((s) => (
                                        <div key={s.name} className="space-y-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <span
                                              className="w-2 h-2 rounded-full shrink-0"
                                              style={{ backgroundColor: s.color }}
                                            />
                                            <span className="font-medium text-(--g-80)">
                                              {s.name}
                                            </span>
                                          </div>
                                          <div className="text-(--g-60) pl-3.5">
                                            <div>Balance: {formatSalary(Math.round(s.balance))}</div>
                                            <div>Burn: {formatSalary(Math.round(s.burn))}/mo</div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className="space-y-0.5 text-(--g-80)">
                                    <div>
                                      Balance:{' '}
                                      {formatSalary(Math.round(firstWithData?.balance ?? 0))}
                                    </div>
                                    <div>
                                      Burn: {formatSalary(Math.round(firstWithData?.burn ?? 0))}/mo
                                    </div>
                                    {hires.length > 0 && (
                                      <div className="pt-1 border-t border-(--g-30) mt-1">
                                        Added: {hires.map((h) => h.roleName).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Tooltip.Popup>
                            </Tooltip.Positioner>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </React.Fragment>
                    );
                  })}
                </Tooltip.Provider>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <DialogClose className="px-4 py-2 text-sm font-medium text-(--g-20) hover:bg-(--g-88) rounded-lg transition-colors">
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
