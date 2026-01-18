import React, { useState, useRef, useMemo } from 'react';
import { AreaChart } from 'lucide-react';
import { Tooltip } from '@base-ui/react/tooltip';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '../../../components/ui/Dialog';
import { getMaxTextWidth } from '../../../lib/measureText';
import type { MonthlyBalance } from '../utils/cashBalanceCalculator';
import type { PlacedRole } from '../types';
import { formatSalary } from '../types';

interface BurnChartDialogProps {
  monthlyBalances: MonthlyBalance[];
  placedRoles: PlacedRole[];
  fundingAmount: number;
}

const CHART_HEIGHT = 320;
const CHART_PADDING = { top: 20, bottom: 40 };

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

export function BurnChartDialog({
  monthlyBalances,
  placedRoles,
  fundingAmount,
}: BurnChartDialogProps) {
  const [open, setOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);


  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Filter: start from current month, end when balance hits 0
  const filteredBalances: typeof monthlyBalances = [];
  let started = false;
  for (const b of monthlyBalances) {
    if (b.month >= currentMonth) started = true;
    if (!started) continue;
    filteredBalances.push(b);
    if (b.balance <= 0) break;
  }

  const balances = filteredBalances.map(b => b.balance);
  const maxBalance = Math.max(fundingAmount, ...balances);
  const range = maxBalance || 1;

  const chartWidth = Math.max(500, filteredBalances.length * 40);
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  const yScale = (value: number) => {
    const clampedValue = Math.max(0, value);
    const ratio = (maxBalance - clampedValue) / range;
    return CHART_PADDING.top + ratio * plotHeight;
  };

  const zeroY = yScale(0);

  const columnWidth = chartWidth / filteredBalances.length;

  const points = filteredBalances.map((b, i) => {
    const x = filteredBalances.length > 1
      ? (i / (filteredBalances.length - 1)) * chartWidth
      : 0;
    const y = yScale(b.balance);
    return { x, y, ...b };
  });

  const yAxisValues = [maxBalance, maxBalance * 0.5, 0];
  const yAxisLabels = yAxisValues.map(formatCompact);
  const yAxisWidth = useMemo(
    () => {
      const labels = [maxBalance, maxBalance * 0.5, 0].map(formatCompact);
      return Math.ceil(getMaxTextWidth(labels, '10px system-ui')) + 8;
    },
    [maxBalance]
  );

  const linePathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPathD = `M ${firstPoint.x},${zeroY} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${lastPoint.x},${zeroY} Z`;

  const hiresByMonth = new Map<string, PlacedRole[]>();
  for (const role of placedRoles) {
    const existing = hiresByMonth.get(role.startMonth) || [];
    existing.push(role);
    hiresByMonth.set(role.startMonth, existing);
  }

  if (filteredBalances.length === 0) return null;

  if (monthlyBalances.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-(--g-12) text-white shadow-lg hover:bg-(--g-20) transition-colors"
      >
        <AreaChart size={20} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:w-[90vw] md:max-w-4xl">
          <DialogTitle>Cash Balance Over Time</DialogTitle>

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
              <div ref={chartRef} className="relative" style={{ width: chartWidth, height: CHART_HEIGHT }}>
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
                  {filteredBalances.map((_, i) => (
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
                  {filteredBalances.map((b, i) => (
                    i % 3 === 0 && (
                      <text
                        key={b.month}
                        x={(i + 0.5) * columnWidth}
                        y={CHART_HEIGHT - 12}
                        textAnchor="middle"
                        className="text-[10px] fill-(--g-50)"
                      >
                        {formatMonth(b.month)}
                      </text>
                    )
                  ))}

                  {/* Area fill */}
                  <path
                    d={areaPathD}
                    fill="var(--g-92)"
                    opacity={0.5}
                  />

                  {/* Line */}
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#e57373"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <Tooltip.Provider>
                  {points.map((point, i) => {
                    const hires = hiresByMonth.get(point.month) || [];
                    const handle = Tooltip.createHandle();

                    return (
                      <React.Fragment key={point.month}>
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
                                const x = (rect?.left ?? 0) + point.x;
                                const y = (rect?.top ?? 0) + point.y;
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
                              <Tooltip.Popup className="rounded-lg bg-(--g-12) px-3 py-2 text-xs text-white shadow-lg max-w-[200px]">
                                <div className="font-medium mb-1">{formatMonth(point.month)}</div>
                                <div className="space-y-0.5 text-(--g-80)">
                                  <div>Balance: {formatSalary(Math.round(point.balance))}</div>
                                  <div>Burn: {formatSalary(Math.round(point.burn))}/mo</div>
                                  {hires.length > 0 && (
                                    <div className="pt-1 border-t border-(--g-30) mt-1">
                                      Added: {hires.map(h => h.roleName).join(', ')}
                                    </div>
                                  )}
                                </div>
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
