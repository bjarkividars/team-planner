import { Dialog, DialogContent, DialogTitle, DialogClose } from "../../../components/ui/Dialog";
import { LOCATIONS } from "../../../lib/salaries";
import type { LocationKey } from "../types";
import type { RateTier } from "../../../lib/localStorage";
import { RATE_TIER_LABELS } from "../constants";
import { usePlannerContext } from "../hooks/usePlannerContext";

export function DefaultsConfirmationDialog() {
  const {
    pendingChange,
    actions: { clearPendingChange, handleKeepExisting, handleUpdateAll },
  } = usePlannerContext();
  return (
    <Dialog
      open={pendingChange !== null}
      onOpenChange={(open) => !open && clearPendingChange()}
    >
      <DialogContent>
        <DialogTitle>Apply to existing roles?</DialogTitle>
        <p className="text-sm text-[var(--g-20)] mb-6">
          {pendingChange?.type === "location"
            ? `Default location will change to ${LOCATIONS[pendingChange.value as LocationKey].label}. Should already placed roles also update?`
            : `Default rate will change to ${RATE_TIER_LABELS[pendingChange?.value as RateTier]}. Should already placed roles also update?`}
        </p>
        <div className="flex gap-3 justify-end">
          <DialogClose forceShow>
            <button
              onClick={handleKeepExisting}
              className="px-4 py-2 text-sm font-medium text-[var(--g-20)] hover:bg-[var(--g-88)] rounded-lg transition-colors"
            >
              Keep as-is
            </button>
          </DialogClose>
          <DialogClose forceShow>
            <button
              onClick={handleUpdateAll}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--g-12)] hover:bg-[var(--g-20)] rounded-lg transition-colors"
            >
              Yes, update
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
