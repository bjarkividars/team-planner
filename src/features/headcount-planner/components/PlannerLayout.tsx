import { DndContext, DragOverlay } from "@dnd-kit/core";
import { PlannerHeader } from "./PlannerHeader";
import { AssumptionsContent } from "./AssumptionsContent";
import { RolePalette } from "./RolePalette";
import { MonthGrid } from "./MonthGrid";
import { PlannerDragOverlay } from "./PlannerDragOverlay";
import { DefaultsConfirmationDialog } from "./DefaultsConfirmationDialog";
import { usePlannerContext } from "../hooks/usePlannerContext";

export function PlannerLayout() {
  const { dndContextProps } = usePlannerContext();

  return (
    <DndContext {...dndContextProps}>
      <div className="h-screen bg-(--color-bg)">
        <div className="flex flex-col h-full max-w-[1200px] mx-auto pb-8 pt-4 md:pt-12">
          <PlannerHeader />
          <div className="hidden md:block px-6 pb-4">
            <AssumptionsContent layout="horizontal" />
          </div>

          <div
            className="flex flex-1 min-h-0 pl-2 md:pl-6 pt-2 relative"
            style={{
              marginRight: "min(0px, calc((1200px - 100vw) / 2))",
            }}
          >
            <div className="hidden md:block relative z-20 shrink-0">
              <RolePalette />
            </div>

            <div
              className="hidden md:block absolute top-0 left-68 bottom-0 w-20 z-15 pointer-events-none"
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
