import { DndContext, DragOverlay } from "@dnd-kit/core";
import { PlannerHeader } from "./PlannerHeader";
import { AssumptionsRow } from "./AssumptionsRow";
import { RolePalette } from "./RolePalette";
import { MonthGrid } from "./MonthGrid";
import { PlannerDragOverlay } from "./PlannerDragOverlay";
import { DefaultsConfirmationDialog } from "./DefaultsConfirmationDialog";
import { usePlannerContext } from "../hooks/usePlannerContext";

export function PlannerLayout() {
  const { dndContextProps } = usePlannerContext();

  return (
    <DndContext {...dndContextProps}>
      <div className="h-screen bg-[var(--color-bg)]">
        <div className="flex flex-col h-full max-w-[1200px] mx-auto pb-8 pt-12">
          <PlannerHeader />
          <AssumptionsRow />

          <div
            className="flex flex-1 min-h-0 pl-6 pt-2 relative"
            style={{
              marginRight: "min(0px, calc((1200px - 100vw) / 2))",
            }}
          >
            <div className="relative z-20 flex-shrink-0">
              <RolePalette />
            </div>

            <div
              className="absolute top-0 left-68 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, var(--color-bg) 0%, var(--color-bg) 20%, transparent 100%)",
              }}
            />

            <MonthGrid />
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        <PlannerDragOverlay />
      </DragOverlay>

      <DefaultsConfirmationDialog />
    </DndContext>
  );
}
