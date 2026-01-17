import { RoleCard } from "./RoleCard";
import { AVAILABLE_ROLES } from "../types";
import { usePlannerContext } from "../hooks/usePlannerContext";

export function PlannerDragOverlay() {
  const {
    activeDragItem,
    defaults: { location: defaultLocation },
  } = usePlannerContext();
  if (!activeDragItem) {
    return null;
  }

  if (activeDragItem.type === "palette-role") {
    return (
      <div className="w-fit">
        <RoleCard
          role={activeDragItem.role}
          location={defaultLocation}
          className="shadow-lg"
        />
      </div>
    );
  }

  const role = AVAILABLE_ROLES.find(
    (candidate) => candidate.id === activeDragItem.placedRole.roleKey
  );

  return (
    <div className="w-fit">
      <RoleCard
        role={role!}
        location={activeDragItem.placedRole.location}
        className="shadow-lg"
      />
    </div>
  );
}
