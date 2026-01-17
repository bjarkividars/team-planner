import { useDroppable } from "@dnd-kit/core";
import { Accordion } from "@base-ui/react/accordion";
import { ChevronRight } from "lucide-react";
import { DraggableRoleItem } from "./DraggableRoleItem";
import { ROLES_BY_FUNCTION } from "../types";
import { usePlannerContext } from "../hooks/usePlannerContext";

const FUNCTION_ORDER = [
  "Engineering",
  "Sales",
  "Design",
  "Operations",
] as const;

export function RolePalette() {
  const {
    defaults: { location },
  } = usePlannerContext();
  const { isOver, setNodeRef } = useDroppable({
    id: "role-palette",
    data: {
      type: "palette",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-68 bg-[var(--color-surface)] rounded-xl p-4 h-full overflow-y-auto transition-colors ${
        isOver ? "ring-2 ring-red-400 ring-inset" : ""
      }`}
    >
      <h2 className="text-sm font-semibold text-[var(--g-12)] mb-1">Roles</h2>
      <p className="text-xs text-[var(--g-20)]/60 mb-4">Drag onto timeline</p>
      <Accordion.Root
        multiple
        defaultValue={[...FUNCTION_ORDER]}
        className="space-y-0.5"
      >
        {FUNCTION_ORDER.map((func) => (
          <Accordion.Item key={func} value={func} className="relative">
            <div className="sticky -top-4 z-10 -mx-4 px-4 after:content-[''] after:absolute -after:bottom-4 after:left-0 after:right-0 after:h-4 after:bg-gradient-to-b after:from-[var(--color-surface)] after:to-transparent after:pointer-events-none">
              <div className="bg-[var(--color-surface)] pt-4">
                <Accordion.Header>
                  <Accordion.Trigger className="flex items-center gap-1 pb-1 w-full text-left text-xs font-medium text-[var(--g-20)]/80 cursor-pointer group">
                    {func}
                    <ChevronRight
                      size={14}
                      className="text-[var(--g-20)]/50 transition-all duration-200 group-data-panel-open:rotate-90 group-data-panel-open:opacity-0 group-hover:!opacity-100"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
              </div>
            </div>
            <Accordion.Panel className="space-y-1.5 pt-2 h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 data-ending-style:opacity-0 data-starting-style:opacity-0">
              {ROLES_BY_FUNCTION[func]?.map((role) => (
                <DraggableRoleItem
                  key={role.id}
                  role={role}
                  location={location}
                />
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
