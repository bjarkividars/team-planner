import type { LocationKey } from './salaries';
import type { ScenariosState, ScenarioData } from '../features/headcount-planner/types/scenario';
import type { PlacedRole } from '../features/headcount-planner/types';
import { AVAILABLE_ROLES } from '../features/headcount-planner/types';

export type RateTier = 'min' | 'default' | 'max';

type StorablePlacedRole = Omit<PlacedRole, 'roleIcon' | 'roleName' | 'roleColor'>;
type StorableScenario = Omit<ScenarioData, 'placedRoles'> & { placedRoles: StorablePlacedRole[] };
type StorableScenariosState = { activeIndex: number; scenarios: StorableScenario[] };

export interface SetupConfig {
  setupComplete: boolean;
  fundingAmount: number;
  mrr: number;
  mrrGrowthRate: number;
  otherCosts: number;
  otherCostsGrowthRate: number;
  defaultLocation: LocationKey;
  defaultRateTier: RateTier;
  createdAt: string;
}

const STORAGE_KEY = 'headcount_planner_config';
const SCENARIOS_KEY = 'headcount_planner_scenarios';

export function getSetupConfig(): SetupConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveSetupConfig(config: Omit<SetupConfig, 'setupComplete' | 'createdAt'>): void {
  try {
    const fullConfig: SetupConfig = {
      ...config,
      setupComplete: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConfig));
  } catch (error) {
    console.error('Failed to save setup config:', error);
  }
}

export function getScenariosState(): ScenariosState | null {
  try {
    const stored = localStorage.getItem(SCENARIOS_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as StorableScenariosState;

    const scenarios: ScenarioData[] = parsed.scenarios.map((scenario) => ({
      ...scenario,
      placedRoles: scenario.placedRoles.map((role): PlacedRole => {
        const roleInfo = AVAILABLE_ROLES.find((r) => r.id === role.roleKey)!;
        return {
          ...role,
          roleName: roleInfo.name,
          roleColor: roleInfo.color,
          roleIcon: roleInfo.icon,
        };
      }),
    }));

    return { activeIndex: parsed.activeIndex, scenarios };
  } catch {
    return null;
  }
}

export function saveScenariosState(state: ScenariosState): void {
  try {
    const storable: StorableScenariosState = {
      activeIndex: state.activeIndex,
      scenarios: state.scenarios.map((scenario) => ({
        ...scenario,
        placedRoles: scenario.placedRoles.map(({ ...rest }) => rest),
      })),
    };
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(storable));
  } catch (error) {
    console.error('Failed to save scenarios:', error);
  }
}
