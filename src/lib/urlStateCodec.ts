import { deflateSync, inflateSync } from 'fflate';
import type { RoleKey, LocationKey, SalarySelection } from '../features/headcount-planner/types';
import { AVAILABLE_ROLES, getSalaryBand } from '../features/headcount-planner/types';
import type { ScenarioData, ScenariosState } from '../features/headcount-planner/types/scenario';
import { MAX_SCENARIOS } from '../features/headcount-planner/types/scenario';

interface CompactScenario {
  n?: string;
  f: number;
  m: number;
  mg: number;
  oc: number;
  ocg: number;
  dl: string;
  dr: string;
  r: [number, string, number, number][];
}

interface CompactMultiScenarioState {
  v: 2;
  a: number;
  s: CompactScenario[];
}

const ROLE_KEY_INDEX: Record<RoleKey, number> = {
  ENG_SOFTWARE: 0,
  ENG_SENIOR: 1,
  ENG_STAFF: 2,
  ENG_MANAGER: 3,
  SALES_SDR: 4,
  SALES_AE: 5,
  SALES_MANAGER: 6,
  DESIGN_PD: 7,
  DESIGN_LEAD: 8,
  OPS_PEOPLE: 9,
  OPS_FINANCE: 10,
};

const INDEX_TO_ROLE_KEY: RoleKey[] = [
  'ENG_SOFTWARE',
  'ENG_SENIOR',
  'ENG_STAFF',
  'ENG_MANAGER',
  'SALES_SDR',
  'SALES_AE',
  'SALES_MANAGER',
  'DESIGN_PD',
  'DESIGN_LEAD',
  'OPS_PEOPLE',
  'OPS_FINANCE',
];

const LOCATION_KEY_INDEX: Record<LocationKey, number> = {
  SF: 0,
  NYC: 1,
  AUS_DEN: 2,
  REMOTE_US: 3,
  OFFSHORE: 4,
};

const INDEX_TO_LOCATION_KEY: LocationKey[] = ['SF', 'NYC', 'AUS_DEN', 'REMOTE_US', 'OFFSHORE'];

const SALARY_SELECTION_INDEX: Record<SalarySelection, number> = {
  min: 0,
  default: 1,
  max: 2,
  custom: 3,
};

const INDEX_TO_SALARY_SELECTION: SalarySelection[] = ['min', 'default', 'max', 'custom'];

function compactifyScenario(state: ScenarioData): CompactScenario {
  const compact: CompactScenario = {
    f: state.fundingAmount,
    m: state.mrr,
    mg: Math.round(state.mrrGrowthRate * 100),
    oc: state.otherCosts,
    ocg: Math.round(state.otherCostsGrowthRate * 100),
    dl: state.defaultLocation,
    dr: state.defaultRateTier === 'min' ? 'n' : state.defaultRateTier === 'max' ? 'x' : 'd',
    r: state.placedRoles.map((role) => [
      ROLE_KEY_INDEX[role.roleKey],
      role.startMonth,
      LOCATION_KEY_INDEX[role.location],
      SALARY_SELECTION_INDEX[role.salarySelection],
    ]),
  };
  if ('name' in state && state.name) {
    compact.n = state.name;
  }
  return compact;
}

function expandScenario(compact: CompactScenario, scenarioIndex: number): ScenarioData {
  return {
    name: compact.n,
    fundingAmount: compact.f,
    mrr: compact.m,
    mrrGrowthRate: compact.mg / 100,
    otherCosts: compact.oc,
    otherCostsGrowthRate: compact.ocg / 100,
    defaultLocation: compact.dl as LocationKey,
    defaultRateTier: compact.dr === 'n' ? 'min' : compact.dr === 'x' ? 'max' : 'default',
    placedRoles: compact.r.map(([roleIdx, month, locIdx, salSelIdx], index) => {
      const roleKey = INDEX_TO_ROLE_KEY[roleIdx];
      const location = INDEX_TO_LOCATION_KEY[locIdx];
      const salarySelection = INDEX_TO_SALARY_SELECTION[salSelIdx];
      const roleInfo = AVAILABLE_ROLES.find((r) => r.id === roleKey)!;
      const salaryBand = getSalaryBand(roleKey, location);

      let salary: number;
      if (salarySelection === 'custom') {
        salary = salaryBand.default;
      } else {
        salary = salaryBand[salarySelection];
      }

      return {
        id: `s${scenarioIndex}-${roleKey}-${month}-${index}`,
        roleKey,
        roleName: roleInfo.name,
        roleColor: roleInfo.color,
        roleIcon: roleInfo.icon,
        startMonth: month,
        location,
        salary,
        salarySelection,
      };
    }),
  };
}

export function encodeScenariosState(state: ScenariosState): string {
  const compact: CompactMultiScenarioState = {
    v: 2,
    a: state.activeIndex,
    s: state.scenarios.map((scenario) => compactifyScenario(scenario)),
  };

  const json = JSON.stringify(compact);
  const bytes = new TextEncoder().encode(json);
  const compressed = deflateSync(bytes, { level: 9 });

  const base64 = btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return base64;
}

export function decodeScenariosState(encoded: string): ScenariosState | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

    const decompressed = inflateSync(bytes);
    const json = new TextDecoder().decode(decompressed);
    const compact = JSON.parse(json) as CompactMultiScenarioState;

    if (compact.v !== 2) {
      return null;
    }

    const scenarios = compact.s
      .slice(0, MAX_SCENARIOS)
      .map((s, i) => expandScenario(s, i));

    const activeIndex = Math.max(0, Math.min(compact.a, scenarios.length - 1));

    return { activeIndex, scenarios };
  } catch (err) {
    console.error('Failed to decode scenarios state from URL:', err);
    return null;
  }
}
