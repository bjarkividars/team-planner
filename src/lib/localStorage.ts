import type { LocationKey } from './salaries';

export type RateTier = 'min' | 'default' | 'max';

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

export function updateFundingAmount(amount: number): void {
  const config = getSetupConfig();
  if (config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...config,
      fundingAmount: amount,
    }));
  }
}

export function updateMrr(mrr: number): void {
  const config = getSetupConfig();
  if (config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...config,
      mrr,
    }));
  }
}

export function updateMrrGrowthRate(rate: number): void {
  const config = getSetupConfig();
  if (config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...config,
      mrrGrowthRate: rate,
    }));
  }
}

export function updateOtherCosts(amount: number): void {
  const config = getSetupConfig();
  if (config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...config,
      otherCosts: amount,
    }));
  }
}

export function updateOtherCostsGrowthRate(rate: number): void {
  const config = getSetupConfig();
  if (config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...config,
      otherCostsGrowthRate: rate,
    }));
  }
}
