import { createContext, useContext } from 'react';
import type { ScenarioData } from '../types/scenario';

export type ScenarioContextValue = {
  scenarios: ScenarioData[];
  activeIndex: number;
  activeScenario: ScenarioData;
  scenarioCount: number;
  canAddScenario: boolean;
  addScenario: () => void;
  switchScenario: (index: number) => void;
  deleteScenario: (index: number) => void;
  updateActiveScenario: (updates: Partial<ScenarioData>) => void;
  renameScenario: (index: number, name: string) => void;
};

export const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function useScenarioContext() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarioContext must be used within a ScenarioProvider');
  }
  return context;
}
