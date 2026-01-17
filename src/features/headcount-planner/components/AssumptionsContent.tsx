import { InlineTextInput } from "../../../components/ui/InlineTextInput";
import { InfoTooltip } from "../../../components/ui/Tooltip";
import { usePlannerContext } from "../hooks/usePlannerContext";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface AssumptionProps {
  label: string;
  tooltip?: ReactNode;
  children: ReactNode;
  layout: "horizontal" | "vertical";
}

function Assumption({ label, tooltip, children, layout }: AssumptionProps) {
  return (
    <div className={layout === "vertical" ? "flex flex-col gap-1" : "flex flex-col"}>
      <span className="text-[10px] text-(--g-20)/60 leading-tight inline-flex items-center gap-1">
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
      </span>
      <div className="text-sm font-medium text-(--g-12)">{children}</div>
    </div>
  );
}

interface AssumptionsContentProps {
  layout?: "horizontal" | "vertical";
}

export function AssumptionsContent({ layout = "horizontal" }: AssumptionsContentProps) {
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
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const isUnviable = runway.runOutMonth && runway.runOutMonth <= currentMonthKey;

  const containerClass =
    layout === "vertical" ? "flex flex-col gap-4" : "flex items-end gap-6";

  return (
    <div className={containerClass}>
      <Assumption
        label="Funding"
        tooltip="Total cash available to spend. This is your starting balance used to calculate runway."
        layout={layout}
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
        layout={layout}
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
          <span className="text-(--g-20)/60 font-normal">@</span>
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
        layout={layout}
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
          <span className="text-(--g-20)/60 font-normal">@</span>
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
          {layout === "horizontal" && (
            <ArrowRight size={16} className="text-(--g-20)/40 mb-1" />
          )}
          <Assumption
            label="Runway"
            tooltip="When your cash runs out based on projected costs and revenue. Shows 'Profitable' if revenue exceeds costs before funding depletes."
            layout={layout}
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
