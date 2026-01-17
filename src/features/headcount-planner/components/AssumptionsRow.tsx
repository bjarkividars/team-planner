import { InlineTextInput } from "../../../components/ui/InlineTextInput";
import { InfoTooltip } from "../../../components/ui/Tooltip";
import { usePlannerContext } from "../hooks/usePlannerContext";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

function Assumption({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-[var(--g-20)]/60 leading-tight inline-flex items-center gap-1">
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
      </span>
      <div className="text-sm font-medium text-[var(--g-12)]">{children}</div>
    </div>
  );
}

export function AssumptionsRow() {
  const {
    financials: { fundingAmount, mrr, mrrGrowthRate, otherCosts, otherCostsGrowthRate },
    placedRoles,
    runway,
    actions: {
      handleFundingChange,
      handleMrrChange,
      handleGrowthRateChange,
      handleOtherCostsChange,
      handleOtherCostsGrowthRateChange,
    },
  } = usePlannerContext();

  const placedRoleCount = placedRoles.length;
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isUnviable = runway.runOutMonth && runway.runOutMonth <= currentMonthKey;
  return (
    <div className="px-6 pb-4 flex items-end gap-6">
      <Assumption
        label="Funding"
        tooltip="Total cash available to spend. This is your starting balance used to calculate runway."
      >
        <span className="inline-flex items-center">
          $
          <InlineTextInput
            value={fundingAmount}
            onValueChange={handleFundingChange}
            className="hover:underline focus:underline"
            minWidth={10}
            maxWidth={120}
          />
        </span>
      </Assumption>

      <Assumption
        label="MRR"
        tooltip="Monthly Recurring Revenue. The percentage is your expected month-over-month growth rate."
      >
        <span className="inline-flex items-center gap-1">
          <span className="inline-flex items-center">
            $
            <InlineTextInput
              value={mrr}
              onValueChange={handleMrrChange}
              className="hover:underline focus:underline"
              minWidth={10}
              maxWidth={100}
            />
          </span>
          <span className="text-[var(--g-20)]/60 font-normal">@</span>
          <InlineTextInput
            value={Math.round(mrrGrowthRate * 100)}
            onValueChange={(v) => handleGrowthRateChange(v / 100)}
            formatDisplay={(v) => v.toString()}
            className="hover:underline focus:underline"
            minWidth={10}
            maxWidth={40}
            suffix="%"
          />
        </span>
      </Assumption>

      <Assumption
        label="Other costs"
        tooltip="Monthly non-salary expenses (tools, rent, etc). The percentage is your expected month-over-month growth rate for these costs."
      >
        <span className="inline-flex items-center gap-1">
          <span className="inline-flex items-center">
            $
            <InlineTextInput
              value={otherCosts}
              onValueChange={handleOtherCostsChange}
              className="hover:underline focus:underline"
              minWidth={10}
              maxWidth={100}
            />
          </span>
          <span className="text-[var(--g-20)]/60 font-normal">@</span>
          <InlineTextInput
            value={Math.round(otherCostsGrowthRate * 100)}
            onValueChange={(v) => handleOtherCostsGrowthRateChange(v / 100)}
            formatDisplay={(v) => v.toString()}
            className="hover:underline focus:underline"
            minWidth={10}
            maxWidth={40}
            suffix="%"
          />
        </span>
      </Assumption>

      {placedRoleCount > 0 && (
        <>
          <ArrowRight size={16} className="text-[var(--g-20)]/40 mb-1" />
          <Assumption
            label="Runway"
            tooltip="When your cash runs out based on projected costs and revenue. Shows 'Profitable' if revenue exceeds costs before funding depletes."
          >
            {isUnviable ? (
              <span className="text-red-500">Unviable</span>
            ) : runway.runOutLabel ? (
              <span className="text-red-500">Runs out {runway.runOutLabel}</span>
            ) : runway.isProfitable ? (
              <span className="text-green-600">Profitable</span>
            ) : null}
          </Assumption>
        </>
      )}
    </div>
  );
}
