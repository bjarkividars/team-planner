import { deflateSync, inflateSync } from 'fflate';
import type { RoleKey, LocationKey, SalarySelection, PlacedRole } from '../features/headcount-planner/types';
import type { RateTier } from './localStorage';
import { AVAILABLE_ROLES, getSalaryBand } from '../features/headcount-planner/types';

interface CompactState {
  f: number;
  m: number;
  mg: number;
  oc: number;
  ocg: number;
  dl: string;
  dr: string;
  r: [number, string, number, number][];
}

export interface EncodableState {
  fundingAmount: number;
  mrr: number;
  mrrGrowthRate: number;
  otherCosts: number;
  otherCostsGrowthRate: number;
  defaultLocation: LocationKey;
  defaultRateTier: RateTier;
  placedRoles: PlacedRole[];
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

function compactifyState(state: EncodableState): CompactState {
  return {
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
}

function expandState(compact: CompactState): EncodableState {
  return {
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
        id: `${roleKey}-${month}-${index}`,
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

export function encodeState(state: EncodableState): string {
  const compact = compactifyState(state);

  const json = JSON.stringify(compact);

  const bytes = new TextEncoder().encode(json);

  const compressed = deflateSync(bytes, { level: 9 });

  const base64 = btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return base64;
}

export function decodeState(encoded: string): EncodableState | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

    const decompressed = inflateSync(bytes);

    const json = new TextDecoder().decode(decompressed);

    const compact = JSON.parse(json) as CompactState;

    return expandState(compact);
  } catch (err) {
    console.error('Failed to decode state from URL:', err);
    return null;
  }
}
