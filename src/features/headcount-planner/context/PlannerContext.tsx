import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSetupConfig, type SetupConfig } from "../../../lib/localStorage";
import { useMonthRange } from "../hooks/useMonthRange";
import { usePlannerDefaults } from "../hooks/usePlannerDefaults";
import { usePlannerFinancials } from "../hooks/usePlannerFinancials";
import { usePlannerDrag, createPlacedRole } from "../hooks/usePlannerDrag";
import {
  AVAILABLE_ROLES,
  getSalaryBand,
  type LocationKey,
  type PlacedRole,
  type RoleKey,
  type SalarySelection,
} from "../types";
import { calculateRunway } from "../utils/runwayCalculator";
import { encodeState, decodeState } from "../../../lib/urlStateCodec";
import { PlannerContext, type PlannerContextValue } from "../hooks/usePlannerContext";

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [setupConfig] = useState(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('s');

    if (encoded) {
      const decodedState = decodeState(encoded);
      if (decodedState) {
        return {
          setupComplete: true,
          fundingAmount: decodedState.fundingAmount,
          mrr: decodedState.mrr,
          mrrGrowthRate: decodedState.mrrGrowthRate,
          otherCosts: decodedState.otherCosts,
          otherCostsGrowthRate: decodedState.otherCostsGrowthRate,
          defaultLocation: decodedState.defaultLocation,
          defaultRateTier: decodedState.defaultRateTier,
          createdAt: new Date().toISOString(),
        } as SetupConfig;
      }
    }

    return getSetupConfig();
  });

  const { months, scrollContainerRef, handleScroll } = useMonthRange();
  const [placedRoles, setPlacedRoles] = useState<PlacedRole[]>(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('s');

    if (encoded) {
      const decodedState = decodeState(encoded);
      if (decodedState) {
        return decodedState.placedRoles;
      }
    }

    return [];
  });

  const {
    defaults,
    pendingChange,
    clearPendingChange,
    handleDefaultChange,
    handleKeepExisting,
    handleUpdateAll,
  } = usePlannerDefaults(setupConfig, placedRoles, setPlacedRoles);

  const {
    fundingAmount,
    mrr,
    mrrGrowthRate,
    otherCosts,
    otherCostsGrowthRate,
    handleFundingChange,
    handleMrrChange,
    handleGrowthRateChange,
    handleOtherCostsChange,
    handleOtherCostsGrowthRateChange,
  } = usePlannerFinancials(setupConfig);

  const { activeDragItem, dndContextProps } = usePlannerDrag(defaults, setPlacedRoles);

  const runway = useMemo(
    () => calculateRunway(placedRoles, fundingAmount, mrr, mrrGrowthRate, otherCosts, otherCostsGrowthRate),
    [placedRoles, fundingAmount, mrr, mrrGrowthRate, otherCosts, otherCostsGrowthRate]
  );

  const handleSalaryChange = useCallback(
    (roleId: string, salary: number, selection: SalarySelection) => {
      setPlacedRoles((prev) =>
        prev.map((r) =>
          r.id === roleId ? { ...r, salary, salarySelection: selection } : r
        )
      );
    },
    []
  );

  const handleLocationChange = useCallback((roleId: string, location: LocationKey) => {
    setPlacedRoles((prev) =>
      prev.map((r) => {
        if (r.id === roleId) {
          const salaryBand = getSalaryBand(r.roleKey, location);
          const salary = salaryBand[r.salarySelection === "custom" ? "default" : r.salarySelection];
          return { ...r, location, salary };
        }
        return r;
      })
    );
  }, []);

  const handleRemoveRole = useCallback((roleId: string) => {
    setPlacedRoles((prev) => prev.filter((r) => r.id !== roleId));
  }, []);

  const handleDuplicateRole = useCallback((roleId: string) => {
    setPlacedRoles((prev) => {
      const roleToDuplicate = prev.find((r) => r.id === roleId);
      if (!roleToDuplicate) return prev;

      const newRole: PlacedRole = {
        ...roleToDuplicate,
        id: crypto.randomUUID(),
      };
      return [...prev, newRole];
    });
  }, []);

  const handleAddRole = useCallback(
    (roleKey: RoleKey, monthKey: string) => {
      const role = AVAILABLE_ROLES.find((r) => r.id === roleKey);
      if (!role) return;

      const newRole = createPlacedRole(role, monthKey, defaults.location, defaults.rateTier);
      setPlacedRoles((prev) => [...prev, newRole]);
    },
    [defaults]
  );

  const value: PlannerContextValue = {
    defaults,
    pendingChange,
    placedRoles,
    months,
    scrollContainerRef,
    handleScroll,
    runway,
    financials: {
      fundingAmount,
      mrr,
      mrrGrowthRate,
      otherCosts,
      otherCostsGrowthRate,
    },
    actions: {
      handleDefaultChange,
      clearPendingChange,
      handleKeepExisting,
      handleUpdateAll,
      handleSalaryChange,
      handleLocationChange,
      handleRemoveRole,
      handleDuplicateRole,
      handleAddRole,
      handleFundingChange,
      handleMrrChange,
      handleGrowthRateChange,
      handleOtherCostsChange,
      handleOtherCostsGrowthRateChange,
    },
    activeDragItem,
    dndContextProps,
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const encoded = encodeState({
          fundingAmount,
          mrr,
          mrrGrowthRate,
          otherCosts,
          otherCostsGrowthRate,
          defaultLocation: defaults.location,
          defaultRateTier: defaults.rateTier,
          placedRoles,
        });

        const params = new URLSearchParams();
        params.set('s', encoded);
        window.location.hash = params.toString();
      } catch (err) {
        console.error('Failed to encode state to URL:', err);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [placedRoles, fundingAmount, mrr, mrrGrowthRate, otherCosts, otherCostsGrowthRate, defaults]);

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}
