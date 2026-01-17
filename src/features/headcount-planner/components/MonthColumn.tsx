import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { formatMonthLabel, parseMonthKey } from "../utils/dateUtils";
import { COLUMN_WIDTH, ROLES_BY_FUNCTION, FUNCTION_ICONS } from "../types";
import {
  ClickMenu,
  MenuItem,
  Submenu,
  SubmenuTrigger,
  SubmenuContent,
} from "../../../components/ui/Menu";
import { usePlannerContext } from "../hooks/usePlannerContext";

interface MonthColumnProps {
  monthKey: string;
  isOver?: boolean;
  isPastRunway?: boolean;
}

const FUNCTION_ORDER = [
  "Engineering",
  "Sales",
  "Design",
  "Operations",
] as const;

export function MonthColumn({
  monthKey,
  isOver = false,
  isPastRunway = false,
}: MonthColumnProps) {
  const {
    actions: { handleAddRole },
  } = usePlannerContext();
  const { isOver: isDropOver, setNodeRef } = useDroppable({
    id: monthKey,
    data: {
      type: "month-column",
      monthKey,
    },
  });

  const date = parseMonthKey(monthKey);
  const label = formatMonthLabel(date);

  const menuContent = (
    <>
      <div className="px-3 pb-2 pt-1 text-xs text-(--g-20) border-b border-(--g-88) mb-1">
        Add role from {label} onwards
      </div>
      {FUNCTION_ORDER.map((func) => {
        const roles = ROLES_BY_FUNCTION[func];
        if (!roles || roles.length === 0) return null;

        const Icon = FUNCTION_ICONS[func];
        return (
          <Submenu key={func}>
            <SubmenuTrigger>
              <span className="flex items-center gap-2">
                <Icon size={14} />
                {func}
              </span>
            </SubmenuTrigger>
            <SubmenuContent>
              {roles.map((role) => (
                <MenuItem
                  key={role.id}
                  onClick={() => handleAddRole(role.id, monthKey)}
                >
                  {role.name}
                </MenuItem>
              ))}
            </SubmenuContent>
          </Submenu>
        );
      })}
    </>
  );

  return (
    <div
      ref={setNodeRef}
      className={`
        shrink-0 relative
        ${isOver || isDropOver ? "bg-blue-50/30" : "bg-transparent"}
        transition-colors duration-150
      `}
      style={{
        width: COLUMN_WIDTH,
        minHeight: 400,
        borderRight: "1px dashed var(--color-border)",
      }}
    >
      <div
        className={`
          sticky top-0 w-full px-3 pt-2 pb-3 text-xs font-medium z-9 bg-(--color-bg)
          before:absolute before:top-0 before:bottom-0 before:-left-px before:w-px before:bg-(--color-border)
          after:absolute after:-bottom-px after:-left-px after:-right-px after:h-px after:bg-(--color-border)
          ${isPastRunway ? "text-red-500" : "text-(--color-text-muted)"}
        `}
      >
        {label}
      </div>

      <ClickMenu
        triggerClassName="absolute inset-0 top-8 group cursor-pointer hover:bg-[var(--color-surface)]/50 transition-colors"
        trigger={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
              <Plus size={16} className="text-(--g-20)" />
            </div>
          </div>
        }
      >
        {menuContent}
      </ClickMenu>
    </div>
  );
}
