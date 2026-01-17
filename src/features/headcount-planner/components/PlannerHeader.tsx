import { SlidersHorizontal, Check, Share2 } from "lucide-react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "../../../components/ui/Menu";
import { LOCATIONS } from "../../../lib/salaries";
import type { RateTier } from "../../../lib/localStorage";
import { LOCATION_KEYS, RATE_TIER_LABELS } from "../constants";
import { usePlannerContext } from "../hooks/usePlannerContext";
import { showSuccessToast } from "../../../lib/toast";

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
    <header className="sticky top-0 z-50 bg-[var(--color-bg)] px-6 py-4 flex items-center justify-between">
      <h1 className="text-3xl font-semibold text-[var(--g-12)]">
        Team Planner
      </h1>
      <div className="flex items-center gap-2">
        <Menu>
          <MenuTrigger className="btn-ghost btn-icon">
            <SlidersHorizontal size={20} className="text-[var(--g-20)]" />
          </MenuTrigger>
          <MenuContent>
            <div className="px-3 py-1.5 text-xs text-[var(--g-20)]/70">
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
                    <Check size={14} className="text-[var(--g-12)]" />
                  )}
                </span>
              </MenuItem>
            ))}
            <div className="my-1 border-t border-[var(--g-88)]" />
            <div className="px-3 py-1.5 text-xs text-[var(--g-20)]/70">
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
                    <Check size={14} className="text-[var(--g-12)]" />
                  )}
                </span>
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger className="btn-ghost btn-icon">
            <Share2 size={20} className="text-[var(--g-20)]" />
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleCopyLink}>Copy link</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </header>
  );
}
