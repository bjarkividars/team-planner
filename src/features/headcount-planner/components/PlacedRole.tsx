import { useDraggable } from '@dnd-kit/core';
import { Copy, Trash2, MoreVertical, ChevronDown } from 'lucide-react';
import type { PlacedRole as PlacedRoleType, SalarySelection, LocationKey } from "../types";
import { COLUMN_WIDTH, getSalaryBand, formatSalary } from "../types";
import { Menu, MenuTrigger, MenuContent, MenuItem, Submenu, SubmenuTrigger, SubmenuContent } from "../../../components/ui/Menu";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "../../../components/ui/ContextMenu";
import { useIsMobile } from "../../../hooks/useIsMobile";
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
  const isMobile = useIsMobile();

  const cardContent = (
    <div
      ref={setActivatorNodeRef}
      className="absolute rounded-lg flex items-center group"
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
        <placedRole.roleIcon size={16} className="text-(--g-20) shrink-0 mt-0.5" strokeWidth={2} />
        <div>
          <div className="text-sm font-medium" style={{ color: 'var(--g-12)' }}>
            {placedRole.roleName}
          </div>
          <div className="text-xs text-(--g-20)/70 flex items-center gap-1">
            <Menu>
              <MenuTrigger className="hover:text-(--g-12) cursor-pointer transition-colors flex items-center gap-0.5">
                {formatSalary(placedRole.salary)}
                {!isMobile && <span className="w-0 group-hover:w-3 overflow-hidden transition-all"><ChevronDown size={12} /></span>}
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
              <MenuTrigger className="hover:text-(--g-12) cursor-pointer transition-colors flex items-center gap-0.5">
                {LOCATIONS[placedRole.location].label}
                {!isMobile && <span className="w-0 group-hover:w-3 overflow-hidden transition-all"><ChevronDown size={12} /></span>}
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
        {isMobile && (
          <Menu>
            <MenuTrigger className="p-1 -ml-2 -mt-0.5 text-(--g-40) hover:text-(--g-20) transition-colors">
              <MoreVertical size={16} />
            </MenuTrigger>
            <MenuContent>
              <MenuItem onClick={() => handleDuplicateRole(placedRole.id)}>
                <span className="flex items-center gap-2">
                  <Copy size={14} />
                  Duplicate
                </span>
              </MenuItem>
              <Submenu>
                <SubmenuTrigger>Salary</SubmenuTrigger>
                <SubmenuContent>
                  <MenuItem onClick={() => handleSalarySelect('min')}>
                    Below Market ({formatSalary(salaryBand.min)})
                  </MenuItem>
                  <MenuItem onClick={() => handleSalarySelect('default')}>
                    Mid Market ({formatSalary(salaryBand.default)})
                  </MenuItem>
                  <MenuItem onClick={() => handleSalarySelect('max')}>
                    Above Market ({formatSalary(salaryBand.max)})
                  </MenuItem>
                </SubmenuContent>
              </Submenu>
              <Submenu>
                <SubmenuTrigger>Location</SubmenuTrigger>
                <SubmenuContent>
                  {locationKeys.map((loc) => (
                    <MenuItem key={loc} onClick={() => handleLocationSelect(loc)}>
                      {LOCATIONS[loc].label}
                    </MenuItem>
                  ))}
                </SubmenuContent>
              </Submenu>
              <MenuItem onClick={() => handleRemoveRole(placedRole.id)} className="text-red-600 hover:text-red-700">
                <span className="flex items-center gap-2">
                  <Trash2 size={14} />
                  Remove
                </span>
              </MenuItem>
            </MenuContent>
          </Menu>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return cardContent;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {cardContent}
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
