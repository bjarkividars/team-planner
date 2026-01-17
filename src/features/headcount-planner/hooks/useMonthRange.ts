import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import {
  getCurrentMonthStart,
  generateMonthRange,
  generateMonthsBefore,
  addMonths,
} from '../utils/dateUtils';
import { INITIAL_MONTHS, COLUMN_WIDTH, MONTHS_BUFFER, MONTHS_TO_LOAD } from '../types';

export function useMonthRange() {
  const [startDate, setStartDate] = useState(() => addMonths(getCurrentMonthStart(), -1));
  const [months, setMonths] = useState(() =>
    generateMonthRange(addMonths(getCurrentMonthStart(), -1), INITIAL_MONTHS)
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialScroll = useRef(false);

  useLayoutEffect(() => {
    if (!hasInitialScroll.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 32;
      hasInitialScroll.current = true;
    }
  }, []);

  const extendRight = useCallback((count: number = MONTHS_TO_LOAD) => {
    setMonths((prev) => {
      const lastMonth = prev[prev.length - 1];
      const [year, month] = lastMonth.split('-').map(Number);
      const lastDate = new Date(year, month - 1, 1);
      const newMonths = generateMonthRange(addMonths(lastDate, 1), count);
      return [...prev, ...newMonths];
    });
  }, []);

  const extendLeft = useCallback((count: number = MONTHS_TO_LOAD) => {
    const container = scrollContainerRef.current;
    const currentScrollLeft = container?.scrollLeft ?? 0;

    setStartDate((prev) => addMonths(prev, -count));
    setMonths((prev) => {
      const newMonths = generateMonthsBefore(
        new Date(startDate.getFullYear(), startDate.getMonth(), 1),
        count
      );
      return [...newMonths, ...prev];
    });

    requestAnimationFrame(() => {
      if (container) {
        container.scrollLeft = currentScrollLeft + count * COLUMN_WIDTH;
      }
    });
  }, [startDate]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    if (scrollLeft + clientWidth > scrollWidth - COLUMN_WIDTH * MONTHS_BUFFER) {
      extendRight();
    }

    if (scrollLeft < COLUMN_WIDTH * MONTHS_BUFFER) {
      extendLeft();
    }
  }, [extendRight, extendLeft]);

  return {
    months,
    scrollContainerRef,
    handleScroll,
    extendRight,
    extendLeft,
  };
}
