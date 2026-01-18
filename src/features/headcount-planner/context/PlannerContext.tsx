import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SetupConfig } from "../../../lib/localStorage";
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
import { PlannerContext, type PlannerContextValue } from "../hooks/usePlannerContext";
import type { ScenarioData } from "../types/scenario";

interface PlannerProviderProps {
  children: ReactNode;
  initialScenario: ScenarioData;
  onScenarioChange: (updates: Partial<ScenarioData>) => void;
}

export function PlannerProvider({ children, initialScenario, onScenarioChange }: PlannerProviderProps) {
  const [setupConfig] = useState<SetupConfig>(() => ({
    setupComplete: true,
    fundingAmount: initialScenario.fundingAmount,
    mrr: initialScenario.mrr,
    mrrGrowthRate: initialScenario.mrrGrowthRate,
    otherCosts: initialScenario.otherCosts,
    otherCostsGrowthRate: initialScenario.otherCostsGrowthRate,
    defaultLocation: initialScenario.defaultLocation,
    defaultRateTier: initialScenario.defaultRateTier,
    createdAt: new Date().toISOString(),
  }));

  const { months, scrollContainerRef, handleScroll } = useMonthRange();
  const [placedRoles, setPlacedRoles] = useState<PlacedRole[]>(initialScenario.placedRoles);

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

  const handleClearAllRoles = useCallback(() => {
    setPlacedRoles([]);
  }, []);

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
      handleClearAllRoles,
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
    onScenarioChange({
      fundingAmount,
      mrr,
      mrrGrowthRate,
      otherCosts,
      otherCostsGrowthRate,
      defaultLocation: defaults.location,
      defaultRateTier: defaults.rateTier,
      placedRoles,
    });
  }, [placedRoles, fundingAmount, mrr, mrrGrowthRate, otherCosts, otherCostsGrowthRate, defaults, onScenarioChange]);

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}
