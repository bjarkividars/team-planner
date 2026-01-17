import { SlidersHorizontal, Check, Share2 } from "lucide-react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
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
import { showSuccessToast } from "../../../lib/toast";
import { AssumptionsContent } from "./AssumptionsContent";

function AssumptionsSummary() {
  const {
    financials: { fundingAmount },
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
      runwayText = " · Unviable";
    } else if (runway.runOutLabel) {
      runwayText = ` · Runs out ${runway.runOutLabel}`;
    } else if (runway.isProfitable) {
      runwayText = " · Profitable";
    }
  }

  return (
    <span className="btn-secondary btn-sm">
      {formatCurrency(fundingAmount)} funding{runwayText}
    </span>
  );
}

export function PlannerHeader() {
  const {
    defaults,
    actions: { handleDefaultChange },
  } = usePlannerContext();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showSuccessToast("Link copied to clipboard");
  };

  return (
    <header className="sticky top-0 z-50 bg-(--color-bg) px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl md:text-3xl font-semibold text-(--g-12)">
          <span className="hidden md:inline">Team Planner</span>
          <span className="md:hidden">Planner</span>
        </h1>
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
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger className="btn-ghost btn-icon">
            <Share2 size={20} className="text-(--g-20)" />
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleCopyLink}>Copy link</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </header>
  );
}
