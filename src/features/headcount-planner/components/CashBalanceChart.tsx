import { Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip } from '@base-ui/react/tooltip';
import { COLUMN_WIDTH } from '../types';
import type { MonthlyBalance } from '../utils/cashBalanceCalculator';

const COLLAPSED_HEIGHT = 48;
const EXPANDED_HEIGHT = 160;

interface CashBalanceChartProps {
  monthlyBalances: MonthlyBalance[];
  fundingAmount: number;
  totalWidth: number;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function CashBalanceChart({
  monthlyBalances,
  fundingAmount,
  totalWidth,
  expanded,
  onToggleExpanded,
}: CashBalanceChartProps) {
  if (monthlyBalances.length === 0) return null;

  const chartHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
  const topPadding = 8;

  const balances = monthlyBalances.map(b => b.balance);
  const maxBalance = Math.max(fundingAmount, ...balances.filter(b => b > 0));

  const yScale = (balance: number) => {
    const clampedBalance = Math.max(0, balance);
    if (maxBalance <= 0) return chartHeight;
    const ratio = (maxBalance - clampedBalance) / maxBalance;
    return topPadding + ratio * (chartHeight - topPadding);
  };

  const zeroY = chartHeight;

  const points = monthlyBalances.map((b, i) => {
    const x = (i + 0.5) * COLUMN_WIDTH;
    const y = yScale(b.balance);
    return { x, y, balance: b.balance };
  });

  if (points.length < 2) return null;

  const linePathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPathD = `M ${firstPoint.x},${zeroY} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${lastPoint.x},${zeroY} Z`;

  const gridLines = monthlyBalances.map((_, i) => i * COLUMN_WIDTH);

  return (
    <div
      className={`relative bg-(--color-bg) ${!expanded ? 'cursor-pointer' : ''} transition-all duration-200`}
      style={{ width: totalWidth, height: chartHeight }}
      onClick={!expanded ? onToggleExpanded : undefined}
    >
      <svg
        className="absolute inset-0"
        style={{ width: totalWidth, height: chartHeight }}
      >
        {gridLines.map((x) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={chartHeight}
            stroke="var(--color-border)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        ))}
        <path
          d={areaPathD}
          fill="var(--g-92)"
          opacity={0.5}
        />
        <path
          d={linePathD}
          fill="none"
          stroke="#e57373"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <Tooltip.Root>
        <Tooltip.Trigger render={<div className="absolute inset-0 cursor-default" />} />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className="rounded-lg bg-(--g-12) px-3 py-2 text-xs text-white shadow-lg">
              Cash balance over time
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <button
        type="button"
        className="sticky right-2 top-2 float-right mt-2 mr-2 p-1 rounded hover:bg-(--g-92) transition-colors z-10 border border-(--g-88) border-dashed"
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpanded();
        }}
      >
        {expanded ? (
          <Minimize2 size={14} className="text-(--g-50)" />
        ) : (
          <Maximize2 size={14} className="text-(--g-50)" />
        )}
      </button>
    </div>
  );
}
