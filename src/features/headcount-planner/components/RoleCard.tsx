import type { Role, LocationKey } from '../types';
import { getSalaryBand, formatSalary } from '../types';
import { LOCATIONS } from '../../../lib/salaries';

interface RoleCardProps {
  role: Role;
  location?: LocationKey;
  className?: string;
}

export function RoleCard({ role, location = 'NYC', className = '' }: RoleCardProps) {
  const salaryBand = getSalaryBand(role.id, location);

  return (
    <div
      className={`
        p-2.5 bg-white border border-[var(--g-88)] rounded-lg
        ${className}
      `}
    >
      <div className="flex items-start gap-2">
        <role.icon size={14} className="text-[var(--g-20)] shrink-0 mt-1" strokeWidth={2} />
        <div className="min-w-0">
          <div className="text-sm font-medium text-[var(--g-12)] truncate">
            {role.name}
          </div>
          <div className="text-xs text-[var(--g-20)]/70">
            {formatSalary(salaryBand.default)} • {LOCATIONS[location].label}
          </div>
        </div>
      </div>
    </div>
  );
}
