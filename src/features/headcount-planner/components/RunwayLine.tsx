import { COLUMN_WIDTH } from '../types';

interface RunwayLineProps {
  runOutMonth: string | null;
  monthIndexMap: Map<string, number>;
}

export function RunwayLine({ runOutMonth, monthIndexMap }: RunwayLineProps) {
  if (!runOutMonth) return null;

  const monthIndex = monthIndexMap.get(runOutMonth);
  if (monthIndex === undefined) return null;

  const left = monthIndex * COLUMN_WIDTH;

  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
      style={{ left }}
    />
  );
}
