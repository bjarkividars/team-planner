import { Cpu, Users, PenTool, Settings, type LucideIcon } from 'lucide-react';
import { ROLE_CATALOG, type RoleKey, type LocationKey } from '../../lib/salaries';

export type { RoleKey, LocationKey };

export type SalarySelection = 'min' | 'default' | 'max' | 'custom';

export interface Role {
  id: RoleKey;
  name: string;
  function: 'Engineering' | 'Sales' | 'Design' | 'Operations';
  color: string;
  icon: LucideIcon;
}

export interface PlacedRole {
  id: string;
  roleKey: RoleKey;
  roleName: string;
  roleColor: string;
  roleIcon: LucideIcon;
  startMonth: string;
  location: LocationKey;
  salary: number;
  salarySelection: SalarySelection;
}

const FUNCTION_COLORS: Record<string, string> = {
  Engineering: '#3B82F6',
  Sales: '#10B981',
  Design: '#8B5CF6',
  Operations: '#F59E0B',
};

export const FUNCTION_ICONS: Record<string, LucideIcon> = {
  Engineering: Cpu,
  Sales: Users,
  Design: PenTool,
  Operations: Settings,
};

export const AVAILABLE_ROLES: Role[] = (Object.entries(ROLE_CATALOG) as [RoleKey, typeof ROLE_CATALOG[RoleKey]][]).map(
  ([key, role]) => ({
    id: key,
    name: role.label,
    function: role.function,
    color: FUNCTION_COLORS[role.function],
    icon: FUNCTION_ICONS[role.function],
  })
);

export const ROLES_BY_FUNCTION = AVAILABLE_ROLES.reduce(
  (acc, role) => {
    if (!acc[role.function]) {
      acc[role.function] = [];
    }
    acc[role.function].push(role);
    return acc;
  },
  {} as Record<string, Role[]>
);

Object.keys(ROLES_BY_FUNCTION).forEach((func) => {
  ROLES_BY_FUNCTION[func].sort((a, b) => {
    const salaryA = ROLE_CATALOG[a.id].salary.SF.default;
    const salaryB = ROLE_CATALOG[b.id].salary.SF.default;
    return salaryA - salaryB;
  });
});

export function getSalaryBand(roleKey: RoleKey, location: LocationKey) {
  return ROLE_CATALOG[roleKey].salary[location];
}

export function formatSalary(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export const COLUMN_WIDTH = 120;
export const MONTHS_BUFFER = 12;
export const INITIAL_MONTHS = 36;
export const MONTHS_TO_LOAD = 24;
