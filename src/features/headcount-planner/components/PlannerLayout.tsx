import { DndContext, DragOverlay } from "@dnd-kit/core";
import { PlannerHeader } from "./PlannerHeader";
import { RolePalette } from "./RolePalette";
import { MonthGrid } from "./MonthGrid";
import { PlannerDragOverlay } from "./PlannerDragOverlay";
import { DefaultsConfirmationDialog } from "./DefaultsConfirmationDialog";
import { ScenarioTabs } from "./ScenarioTabs";
import { usePlannerContext } from "../hooks/usePlannerContext";

export function PlannerLayout() {
  const { dndContextProps } = usePlannerContext();

  return (
    <DndContext {...dndContextProps}>
      <div className="h-dvh bg-(--color-bg) flex flex-col">
        <div className="hidden md:block bg-(--g-96)">
          <div className="max-w-[1600px] mx-auto mt-2">
            <ScenarioTabs variant="desktop" />
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--color-bg) border-t border-(--g-88) pb-[env(safe-area-inset-bottom)]">
          <ScenarioTabs variant="mobile" />
        </div>
        <div className="flex flex-col flex-1 min-h-0 max-w-[1600px] mx-auto w-full pb-16 md:pb-8 pt-4 md:pt-8">
          <PlannerHeader />

          <div
            className="flex flex-1 min-h-0 pl-2 md:pl-6 pt-2 relative"
            style={{
              marginRight: "min(0px, calc((1600px - 100vw) / 2))",
            }}
          >
            <div className="hidden md:block relative z-20 shrink-0">
              <RolePalette />
            </div>

            <div
              className="hidden md:block absolute top-0 left-68 bottom-0 w-28 z-15 pointer-events-none"
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
