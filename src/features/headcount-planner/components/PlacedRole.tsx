import { useDraggable } from '@dnd-kit/core';
import { Copy, Trash2 } from 'lucide-react';
import type { PlacedRole as PlacedRoleType, SalarySelection, LocationKey } from "../types";
import { COLUMN_WIDTH, getSalaryBand, formatSalary } from "../types";
import { Menu, MenuTrigger, MenuContent, MenuItem } from "../../../components/ui/Menu";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "../../../components/ui/ContextMenu";
import { LOCATIONS } from "../../../lib/salaries";
import { usePlannerContext } from "../hooks/usePlannerContext";
import { ROW_HEIGHT, ROW_GAP, HEADER_HEIGHT, TOP_PADDING } from "../constants";

interface PlacedRoleProps {
  placedRole: PlacedRoleType;
  monthIndex: number;
  totalMonths: number;
  rowIndex: number;
}

export function PlacedRole({
  placedRole,
  monthIndex,
  totalMonths,
  rowIndex,
}: PlacedRoleProps) {
  const {
    actions: {
      handleSalaryChange,
      handleLocationChange,
      handleRemoveRole,
      handleDuplicateRole,
    },
  } = usePlannerContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({
    id: `placed-${placedRole.id}`,
    data: {
      type: 'placed-role',
      placedRole,
    },
  });

  const left = monthIndex * COLUMN_WIDTH;
  const remainingMonths = totalMonths - monthIndex;
  const width = remainingMonths * COLUMN_WIDTH + 2000;

  const salaryBand = getSalaryBand(placedRole.roleKey, placedRole.location);

  const style = {
    left,
    width,
    height: ROW_HEIGHT,
    top: HEADER_HEIGHT + TOP_PADDING + rowIndex * (ROW_HEIGHT + ROW_GAP),
    backgroundColor: 'var(--color-surface)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    pointerEvents: isDragging ? 'none' as const : 'auto' as const,
  };

  const handleSalarySelect = (selection: SalarySelection) => {
    const salary = salaryBand[selection === 'custom' ? 'default' : selection];
    handleSalaryChange(placedRole.id, salary, selection);
  };

  const handleLocationSelect = (location: LocationKey) => {
    handleLocationChange(placedRole.id, location);
  };

  const locationKeys: LocationKey[] = ['SF', 'NYC', 'AUS_DEN', 'REMOTE_US', 'OFFSHORE'];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setActivatorNodeRef}
          className="absolute rounded-lg flex items-center"
          style={style}
          {...listeners}
        >
          <div
            ref={setNodeRef}
            data-draggable-id={`placed-${placedRole.id}`}
            className="sticky left-8 px-3 whitespace-nowrap rounded-l-md flex items-start gap-2"
            style={{
              backgroundColor: 'var(--color-surface)',
            }}
            {...attributes}
          >
            <placedRole.roleIcon size={16} className="text-[var(--g-20)] shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--g-12)' }}>
                {placedRole.roleName}
              </div>
              <div className="text-xs text-[var(--g-20)]/70 flex items-center gap-1">
                <Menu>
                  <MenuTrigger className="hover:text-[var(--g-12)] cursor-pointer transition-colors">
                    {formatSalary(placedRole.salary)}
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem onClick={() => handleSalarySelect('min')}>
                      Below Market ({formatSalary(salaryBand.min)})
                    </MenuItem>
                    <MenuItem onClick={() => handleSalarySelect('default')}>
                      Mid Market ({formatSalary(salaryBand.default)})
                    </MenuItem>
                    <MenuItem onClick={() => handleSalarySelect('max')}>
                      Above Market ({formatSalary(salaryBand.max)})
                    </MenuItem>
                  </MenuContent>
                </Menu>
                <span>•</span>
                <Menu>
                  <MenuTrigger className="hover:text-[var(--g-12)] cursor-pointer transition-colors">
                    {LOCATIONS[placedRole.location].label}
                  </MenuTrigger>
                  <MenuContent>
                    {locationKeys.map((loc) => (
                      <MenuItem key={loc} onClick={() => handleLocationSelect(loc)}>
                        {LOCATIONS[loc].label}
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleDuplicateRole(placedRole.id)}>
          <span className="flex items-center gap-2">
            <Copy size={14} />
            Duplicate
          </span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="danger" onClick={() => handleRemoveRole(placedRole.id)}>
          <span className="flex items-center gap-2">
            <Trash2 size={14} />
            Remove
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
