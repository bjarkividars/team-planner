import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  PointerSensor,
  getClientRect,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core";
import type { LocationKey, PlacedRole, Role } from "../types";
import { getSalaryBand } from "../types";
import type { RateTier } from "../../../lib/localStorage";

export type DragItem =
  | { type: "palette-role"; role: Role }
  | { type: "placed-role"; placedRole: PlacedRole };

type Defaults = {
  location: LocationKey;
  rateTier: RateTier;
};

type SetPlacedRoles = Dispatch<SetStateAction<PlacedRole[]>>;

const getEventClientX = (event: Event | null): number | null => {
  if (!event) return null;
  if (event instanceof PointerEvent || event instanceof MouseEvent) {
    return event.clientX;
  }
  if (event instanceof TouchEvent) {
    return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? null;
  }
  return null;
};

export const createPlacedRole = (
  role: Role,
  monthKey: string,
  location: LocationKey,
  rateTier: RateTier
): PlacedRole => {
  const salaryBand = getSalaryBand(role.id, location);
  return {
    id: `${role.id}-${monthKey}-${Date.now()}`,
    roleKey: role.id,
    roleName: role.name,
    roleColor: role.color,
    roleIcon: role.icon,
    startMonth: monthKey,
    location,
    salary: salaryBand[rateTier],
    salarySelection: rateTier,
  };
};

export function usePlannerDrag(defaults: Defaults, setPlacedRoles: SetPlacedRoles) {
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);
  const defaultLocation = defaults.location;
  const defaultRateTier = defaults.rateTier;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    if (data?.type === "palette-role" && data.role) {
      setActiveDragItem({ type: "palette-role", role: data.role as Role });
    } else if (data?.type === "placed-role" && data.placedRole) {
      setActiveDragItem({
        type: "placed-role",
        placedRole: data.placedRole as PlacedRole,
      });
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const data = active.data.current;

      if (over) {
        const overData = over.data.current;

        if (overData?.type === "palette" && data?.type === "placed-role") {
          const placedRole = data.placedRole as PlacedRole;
          setPlacedRoles((prev) => prev.filter((r) => r.id !== placedRole.id));
        } else {
          const monthKey = over.id as string;

          if (data?.type === "palette-role" && data.role) {
            const role = data.role as Role;
            const newPlacedRole = createPlacedRole(role, monthKey, defaultLocation, defaultRateTier);
            setPlacedRoles((prev) => [...prev, newPlacedRole]);
          } else if (data?.type === "placed-role" && data.placedRole) {
            const placedRole = data.placedRole as PlacedRole;
            setPlacedRoles((prev) =>
              prev.map((r) =>
                r.id === placedRole.id ? { ...r, startMonth: monthKey } : r
              )
            );
          }
        }
      }

      setActiveDragItem(null);
    },
    [defaultLocation, defaultRateTier, setPlacedRoles]
  );

  const dragAlignmentModifiers = useMemo<Modifier[]>(
    () => [
      ({ active, activatorEvent, activeNodeRect, overlayNodeRect, transform }) => {
        if (active?.data?.current?.type !== "placed-role") {
          return transform;
        }
        if (!activeNodeRect) {
          return transform;
        }
        const clientX = getEventClientX(activatorEvent);
        if (clientX === null) {
          return transform;
        }
        const overlayWidth = overlayNodeRect?.width ?? activeNodeRect.width;
        const dragOffsetX = clientX - activeNodeRect.left;
        return {
          ...transform,
          x: transform.x + dragOffsetX - overlayWidth / 2,
        };
      },
    ],
    []
  );

  const dragOverlayMeasure = useCallback(
    (element: Element) => getClientRect(element, { ignoreTransform: true }),
    []
  );

  const collisionDetection = useCallback<CollisionDetection>((args) => {
    if (args.active?.data?.current?.type === "placed-role") {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }
    }
    return rectIntersection(args);
  }, []);

  const dndContextProps = useMemo(
    () => ({
      sensors,
      modifiers: dragAlignmentModifiers,
      measuring: {
        dragOverlay: {
          measure: dragOverlayMeasure,
        },
      },
      collisionDetection,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    }),
    [
      sensors,
      dragAlignmentModifiers,
      dragOverlayMeasure,
      collisionDetection,
      handleDragStart,
      handleDragEnd,
    ]
  );

  return {
    activeDragItem,
    dndContextProps,
  };
}
