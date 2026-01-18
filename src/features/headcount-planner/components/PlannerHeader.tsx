import { useState } from "react";
import { SlidersHorizontal, Check, Share2, Trash2 } from "lucide-react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Submenu,
  SubmenuTrigger,
  SubmenuContent,
} from "../../../components/ui/Menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/Dialog";
import { LOCATIONS } from "../../../lib/salaries";
import type { RateTier } from "../../../lib/localStorage";
import { LOCATION_KEYS, RATE_TIER_LABELS } from "../constants";
import { usePlannerContext } from "../hooks/usePlannerContext";
import { useScenarioContext } from "../hooks/useScenarioContext";
import { showSuccessToast } from "../../../lib/toast";
import { encodeScenariosState } from "../../../lib/urlStateCodec";
import { AssumptionsContent } from "./AssumptionsContent";

function AssumptionsSummary() {
  const {
    financials: { fundingAmount, mrr },
    placedRoles,
    runway,
  } = usePlannerContext();

  const placedRoleCount = placedRoles.length;
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const isUnviable =
    runway.runOutMonth && runway.runOutMonth <= currentMonthKey;

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  let runwayText = "";
  if (placedRoleCount > 0) {
    if (isUnviable) {
      runwayText = "Unviable";
    } else if (runway.runOutLabel) {
      runwayText = `Runs out ${runway.runOutLabel}`;
    } else if (runway.isProfitable) {
      runwayText = "Profitable";
    }
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="btn-secondary btn-sm">
        {formatCurrency(fundingAmount)} · {formatCurrency(mrr)}/mo
      </span>
      {runwayText && (
        <span className="text-xs text-(--g-40) pl-1 pt-1">{runwayText}</span>
      )}
    </div>
  );
}

export function PlannerHeader() {
  const {
    defaults,
    placedRoles,
    actions: { handleDefaultChange, handleClearAllRoles },
  } = usePlannerContext();
  const { activeIndex, activeScenario, scenarioCount } = useScenarioContext();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const activeScenarioName = activeScenario.name || `Scenario ${activeIndex + 1}`;

  const handleCopyAllScenarios = () => {
    navigator.clipboard.writeText(window.location.href);
    showSuccessToast("Link copied to clipboard");
  };

  const handleCopyActiveScenario = () => {
    const singleScenarioState = {
      activeIndex: 0,
      scenarios: [activeScenario],
    };
    const encoded = encodeScenariosState(singleScenarioState);
    const url = `${window.location.origin}${window.location.pathname}#s=${encoded}`;
    navigator.clipboard.writeText(url);
    showSuccessToast("Link copied to clipboard");
  };

  const handleClearConfirm = () => {
    handleClearAllRoles();
    setShowClearConfirm(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-(--color-bg) px-4 md:px-6 mb-2  flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <AssumptionsContent layout="horizontal" />
        </div>
        <Dialog>
          <DialogTrigger className="md:hidden">
            <AssumptionsSummary />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Assumptions</DialogTitle>
            <AssumptionsContent layout="vertical" />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-2">
        <Menu>
          <MenuTrigger className="btn-ghost btn-icon">
            <SlidersHorizontal size={20} className="text-(--g-20)" />
          </MenuTrigger>
          <MenuContent>
            <div className="px-3 py-1.5 text-xs text-(--g-20)/70">
              Default location
            </div>
            {LOCATION_KEYS.map((loc) => (
              <MenuItem
                key={loc}
                onClick={() => handleDefaultChange("location", loc)}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{LOCATIONS[loc].label}</span>
                  {defaults.location === loc && (
                    <Check size={14} className="text-(--g-12)" />
                  )}
                </span>
              </MenuItem>
            ))}
            <div className="my-1 border-t border-(--g-88)" />
            <div className="px-3 py-1.5 text-xs text-(--g-20)/70">
              Default rate
            </div>
            {(["min", "default", "max"] as RateTier[]).map((tier) => (
              <MenuItem
                key={tier}
                onClick={() => handleDefaultChange("rateTier", tier)}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{RATE_TIER_LABELS[tier]}</span>
                  {defaults.rateTier === tier && (
                    <Check size={14} className="text-(--g-12)" />
                  )}
                </span>
              </MenuItem>
            ))}
            {placedRoles.length > 0 && (
              <>
                <div className="my-1 border-t border-(--g-88)" />
                <MenuItem onClick={() => setShowClearConfirm(true)}>
                  <span className="flex items-center gap-2 text-red-500 hover:text-red-600">
                    <Trash2 size={14} />
                    <span>Clear all roles</span>
                  </span>
                </MenuItem>
              </>
            )}
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger className="btn-ghost btn-icon">
            <Share2 size={20} className="text-(--g-20)" />
          </MenuTrigger>
          <MenuContent>
            {scenarioCount > 1 ? (
              <Submenu>
                <SubmenuTrigger>Copy link</SubmenuTrigger>
                <SubmenuContent>
                  <MenuItem onClick={handleCopyAllScenarios}>
                    All scenarios
                  </MenuItem>
                  <MenuItem onClick={handleCopyActiveScenario}>
                    Only "{activeScenarioName}"
                  </MenuItem>
                </SubmenuContent>
              </Submenu>
            ) : (
              <MenuItem onClick={handleCopyAllScenarios}>Copy link</MenuItem>
            )}
          </MenuContent>
        </Menu>
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogTitle>Clear all roles?</DialogTitle>
          <p className="text-sm text-(--g-40) mb-4">
            This will remove all {placedRoles.length} role{placedRoles.length !== 1 ? 's' : ''} from your timeline. This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="btn-ghost btn-sm"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={handleClearConfirm}
            >
              Clear all roles
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
