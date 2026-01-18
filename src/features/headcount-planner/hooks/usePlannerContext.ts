import { useContext, createContext, type RefObject } from "react";
import type { DndContextProps } from "@dnd-kit/core";
import type { RateTier } from "../../../lib/localStorage";
import type { LocationKey, PlacedRole, RoleKey, SalarySelection } from "../types";
import type { RunwayResult } from "../utils/runwayCalculator";
import type { PendingChange } from "./usePlannerDefaults";
import type { DragItem } from "./usePlannerDrag";

type PlannerDefaults = {
  location: LocationKey;
  rateTier: RateTier;
};

type PlannerFinancials = {
  fundingAmount: number;
  mrr: number;
  mrrGrowthRate: number;
  otherCosts: number;
  otherCostsGrowthRate: number;
};

type PlannerActions = {
  handleDefaultChange: (type: "location" | "rateTier", value: LocationKey | RateTier) => void;
  clearPendingChange: () => void;
  handleKeepExisting: () => void;
  handleUpdateAll: () => void;
  handleSalaryChange: (roleId: string, salary: number, selection: SalarySelection) => void;
  handleLocationChange: (roleId: string, location: LocationKey) => void;
  handleRemoveRole: (roleId: string) => void;
  handleDuplicateRole: (roleId: string) => void;
  handleAddRole: (roleKey: RoleKey, monthKey: string) => void;
  handleClearAllRoles: () => void;
  handleFundingChange: (amount: number) => void;
  handleMrrChange: (amount: number) => void;
  handleGrowthRateChange: (rate: number) => void;
  handleOtherCostsChange: (amount: number) => void;
  handleOtherCostsGrowthRateChange: (rate: number) => void;
};

export type PlannerContextValue = {
  defaults: PlannerDefaults;
  pendingChange: PendingChange | null;
  placedRoles: PlacedRole[];
  months: string[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  runway: RunwayResult;
  financials: PlannerFinancials;
  actions: PlannerActions;
  activeDragItem: DragItem | null;
  dndContextProps: DndContextProps;
};

export const PlannerContext = createContext<PlannerContextValue | null>(null);

export function usePlannerContext() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlannerContext must be used within a PlannerProvider");
  }
  return context;
}
