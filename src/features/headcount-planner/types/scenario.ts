import type { LocationKey, PlacedRole } from '../types';
import type { RateTier } from '../../../lib/localStorage';

export interface ScenarioData {
  name?: string;
  fundingAmount: number;
  mrr: number;
  mrrGrowthRate: number;
  otherCosts: number;
  otherCostsGrowthRate: number;
  defaultLocation: LocationKey;
  defaultRateTier: RateTier;
  placedRoles: PlacedRole[];
}

export interface ScenariosState {
  activeIndex: number;
  scenarios: ScenarioData[];
}

export const MAX_SCENARIOS = 5;
