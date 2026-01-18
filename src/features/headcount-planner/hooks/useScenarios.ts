import { useCallback, useState } from 'react';
import type { ScenarioData, ScenariosState } from '../types/scenario';
import { MAX_SCENARIOS } from '../types/scenario';

export function useScenarios(initialState: ScenariosState) {
  const [scenarios, setScenarios] = useState<ScenarioData[]>(initialState.scenarios);
  const [activeIndex, setActiveIndex] = useState(initialState.activeIndex);

  const activeScenario = scenarios[activeIndex];
  const scenarioCount = scenarios.length;
  const canAddScenario = scenarioCount < MAX_SCENARIOS;

  const addScenario = useCallback(() => {
    if (scenarios.length >= MAX_SCENARIOS) return;

    const sourceScenario = scenarios[activeIndex] ?? scenarios[0];
    const { name: _, ...rest } = sourceScenario;
    const newScenario: ScenarioData = {
      ...rest,
      placedRoles: sourceScenario.placedRoles.map((role) => ({
        ...role,
        id: crypto.randomUUID(),
      })),
    };

    setScenarios((prev) => [...prev, newScenario]);
    setActiveIndex(scenarios.length);
  }, [scenarios, activeIndex]);

  const switchScenario = useCallback(
    (index: number) => {
      if (index >= 0 && index < scenarios.length) {
        setActiveIndex(index);
      }
    },
    [scenarios.length]
  );

  const deleteScenario = useCallback(
    (index: number) => {
      if (scenarios.length <= 1) return;

      setScenarios((prev) => prev.filter((_, i) => i !== index));

      if (activeIndex >= index && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else if (activeIndex >= scenarios.length - 1) {
        setActiveIndex(scenarios.length - 2);
      }
    },
    [scenarios.length, activeIndex]
  );

  const updateActiveScenario = useCallback(
    (updates: Partial<ScenarioData>) => {
      setScenarios((prev) =>
        prev.map((s, i) => (i === activeIndex ? { ...s, ...updates } : s))
      );
    },
    [activeIndex]
  );

  const renameScenario = useCallback((index: number, name: string) => {
    setScenarios((prev) =>
      prev.map((s, i) => (i === index ? { ...s, name: name || undefined } : s))
    );
  }, []);

  return {
    scenarios,
    activeIndex,
    activeScenario,
    scenarioCount,
    canAddScenario,
    addScenario,
    switchScenario,
    deleteScenario,
    updateActiveScenario,
    renameScenario,
    setScenarios,
  };
}
