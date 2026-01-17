import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import type { LocationKey, PlacedRole } from "../types";
import { getSalaryBand } from "../types";
import type { RateTier, SetupConfig } from "../../../lib/localStorage";

export type PendingChange = {
  type: "location" | "rateTier";
  value: LocationKey | RateTier;
};

type SetPlacedRoles = Dispatch<SetStateAction<PlacedRole[]>>;

export function usePlannerDefaults(
  setupConfig: SetupConfig | null,
  placedRoles: PlacedRole[],
  setPlacedRoles: SetPlacedRoles
) {
  const [defaults, setDefaults] = useState({
    location: (setupConfig?.defaultLocation ?? "NYC") as LocationKey,
    rateTier: (setupConfig?.defaultRateTier ?? "default") as RateTier,
  });
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);

  const placedRoleCount = placedRoles.length;

  const handleDefaultChange = useCallback(
    (type: "location" | "rateTier", value: LocationKey | RateTier) => {
      if (placedRoleCount > 0) {
        setPendingChange({ type, value });
        return;
      }
      if (type === "location") {
        setDefaults((prev) => ({ ...prev, location: value as LocationKey }));
      } else {
        setDefaults((prev) => ({ ...prev, rateTier: value as RateTier }));
      }
    },
    [placedRoleCount]
  );

  const handleKeepExisting = useCallback(() => {
    if (!pendingChange) return;
    if (pendingChange.type === "location") {
      setDefaults((prev) => ({ ...prev, location: pendingChange.value as LocationKey }));
    } else {
      setDefaults((prev) => ({ ...prev, rateTier: pendingChange.value as RateTier }));
    }
    setPendingChange(null);
  }, [pendingChange]);

  const handleUpdateAll = useCallback(() => {
    if (!pendingChange) return;

    if (pendingChange.type === "location") {
      const newLocation = pendingChange.value as LocationKey;
      setDefaults((prev) => ({ ...prev, location: newLocation }));
      setPlacedRoles((prev) =>
        prev.map((role) => {
          const salaryBand = getSalaryBand(role.roleKey, newLocation);
          const selection = role.salarySelection === "custom" ? "default" : role.salarySelection;
          return {
            ...role,
            location: newLocation,
            salary: salaryBand[selection],
          };
        })
      );
    } else {
      const newRateTier = pendingChange.value as RateTier;
      setDefaults((prev) => ({ ...prev, rateTier: newRateTier }));
      setPlacedRoles((prev) =>
        prev.map((role) => {
          const salaryBand = getSalaryBand(role.roleKey, role.location);
          return {
            ...role,
            salary: salaryBand[newRateTier],
            salarySelection: newRateTier,
          };
        })
      );
    }
    setPendingChange(null);
  }, [pendingChange, setPlacedRoles]);

  return {
    defaults,
    pendingChange,
    clearPendingChange: () => setPendingChange(null),
    handleDefaultChange,
    handleKeepExisting,
    handleUpdateAll,
  };
}
