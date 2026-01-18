import { useEffect, useState, type ReactNode } from 'react';
import { getSetupConfig, getScenariosState, saveScenariosState } from '../../../lib/localStorage';
import { decodeScenariosState, encodeScenariosState } from '../../../lib/urlStateCodec';
import { useScenarios } from '../hooks/useScenarios';
import { ScenarioContext, type ScenarioContextValue } from '../hooks/useScenarioContext';
import type { ScenarioData, ScenariosState } from '../types/scenario';

function getInitialState(): ScenariosState {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const encoded = params.get('s');

  if (encoded) {
    const decoded = decodeScenariosState(encoded);
    if (decoded) {
      return decoded;
    }
  }

  const savedScenarios = getScenariosState();
  if (savedScenarios && savedScenarios.scenarios.length > 0) {
    return savedScenarios;
  }

  const config = getSetupConfig();
  const defaultScenario: ScenarioData = {
    fundingAmount: config?.fundingAmount ?? 1000000,
    mrr: config?.mrr ?? 0,
    mrrGrowthRate: config?.mrrGrowthRate ?? 0,
    otherCosts: config?.otherCosts ?? 0,
    otherCostsGrowthRate: config?.otherCostsGrowthRate ?? 0,
    defaultLocation: config?.defaultLocation ?? 'SF',
    defaultRateTier: config?.defaultRateTier ?? 'default',
    placedRoles: [],
  };

  return {
    activeIndex: 0,
    scenarios: [defaultScenario],
  };
}

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState(getInitialState);

  const {
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
  } = useScenarios(initialState);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const state = { activeIndex, scenarios };
        saveScenariosState(state);

        const encoded = encodeScenariosState(state);
        const params = new URLSearchParams();
        params.set('s', encoded);
        const newHash = params.toString();
        if (window.location.hash.slice(1) !== newHash) {
          const nextUrl = `${window.location.pathname}${window.location.search}#${newHash}`;
          window.history.replaceState(null, '', nextUrl);
        }
      } catch (err) {
        console.error('Failed to save scenarios state:', err);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [scenarios, activeIndex]);

  const value: ScenarioContextValue = {
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
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
}
