import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { InlineTextInput } from "../../components/ui/InlineTextInput";
import { InlineSelect } from "../../components/ui/InlineSelect";
import { saveSetupConfig, type RateTier } from "../../lib/localStorage";
import { LOCATIONS, type LocationKey } from "../../lib/salaries";

const LOCATION_OPTIONS = [
  { value: "SF", label: LOCATIONS.SF.label },
  { value: "NYC", label: LOCATIONS.NYC.label },
  { value: "AUS_DEN", label: LOCATIONS.AUS_DEN.label },
  { value: "REMOTE_US", label: LOCATIONS.REMOTE_US.label },
  { value: "OFFSHORE", label: LOCATIONS.OFFSHORE.label },
];

const RATE_TIER_OPTIONS = [
  { value: "min", label: "below market" },
  { value: "default", label: "mid market" },
  { value: "max", label: "above market" },
];

export function SetupPage() {
  const navigate = useNavigate();
  const [fundingAmount, setFundingAmount] = useState<number>(0);
  const [mrr, setMrr] = useState<number>(0);
  const [mrrGrowthRate, setMrrGrowthRate] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [otherCostsGrowthRate, setOtherCostsGrowthRate] = useState<number>(0);
  const [defaultLocation, setDefaultLocation] = useState<LocationKey>("NYC");
  const [defaultRateTier, setDefaultRateTier] = useState<RateTier>("default");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    saveSetupConfig({
      fundingAmount,
      mrr,
      mrrGrowthRate: mrrGrowthRate / 100,
      otherCosts,
      otherCostsGrowthRate: otherCostsGrowthRate / 100,
      defaultLocation: defaultLocation as LocationKey,
      defaultRateTier: defaultRateTier as RateTier,
    });

    navigate("/");
  };

  const isValid = fundingAmount > 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl">
        <div className="text-2xl sm:text-3xl md:text-4xl text-[var(--g-12)] leading-relaxed space-y-3">
          <p>
            <span className="italic text-[var(--g-20)]">We have</span>{" "}
            <span className="inline-flex items-baseline">
              $
              <InlineTextInput
                value={fundingAmount}
                onValueChange={setFundingAmount}
                className="hover:underline focus:underline"
                minWidth={20}
                maxWidth={180}
                placeholder="0"
                autoFocus
              />
            </span>{" "}
            <span className="italic text-[var(--g-20)]">in funding,</span>
          </p>
          <p>
            <span className="inline-flex items-baseline">
              $
              <InlineTextInput
                value={mrr}
                onValueChange={setMrr}
                className="hover:underline focus:underline"
                minWidth={20}
                maxWidth={150}
                placeholder="0"
              />
            </span>{" "}
            <span className="italic text-[var(--g-20)]">MRR growing at</span>{" "}
            <InlineTextInput
              value={mrrGrowthRate}
              onValueChange={setMrrGrowthRate}
              className="hover:underline focus:underline"
              minWidth={30}
              maxWidth={60}
              formatDisplay={(v) => v.toString()}
              suffix="%"
            />
            <span className="italic text-[var(--g-20)]">,</span>
          </p>
          <p>
            <span className="italic text-[var(--g-20)]">and</span>{" "}
            <span className="inline-flex items-baseline">
              $
              <InlineTextInput
                value={otherCosts}
                onValueChange={setOtherCosts}
                className="hover:underline focus:underline"
                minWidth={20}
                maxWidth={150}
                placeholder="0"
              />
            </span>{" "}
            <span className="italic text-[var(--g-20)]">in other monthly costs growing at</span>{" "}
            <InlineTextInput
              value={otherCostsGrowthRate}
              onValueChange={setOtherCostsGrowthRate}
              className="hover:underline focus:underline"
              minWidth={30}
              maxWidth={60}
              formatDisplay={(v) => v.toString()}
              suffix="%"
            />
            <span className="italic text-[var(--g-20)]">.</span>
          </p>
          <p className="pt-4">
            <span className="italic text-[var(--g-20)]">Our team is based in</span>{" "}
            <InlineSelect
              value={defaultLocation}
              options={LOCATION_OPTIONS}
              onChange={(v) => setDefaultLocation(v as LocationKey)}
              placeholder="somewhere"
              iconSize={24}
            />{" "}
            <span className="italic text-[var(--g-20)]">paying</span>{" "}
            <InlineSelect
              value={defaultRateTier}
              options={RATE_TIER_OPTIONS}
              onChange={(v) => setDefaultRateTier(v as RateTier)}
              placeholder="some"
              iconSize={24}
            />{" "}
            <span className="italic text-[var(--g-20)]">rates.</span>
          </p>
        </div>

        <div className="flex justify-end mt-12">
          <button
            type="submit"
            disabled={!isValid}
            className="group flex items-center text-[var(--g-12)] disabled:text-[var(--g-20)]/40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-lg">Lets go</span>
            <span className="relative w-6 h-6 overflow-visible">
              <svg
                className="absolute inset-0 w-full h-full transition-[clip-path] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0)] group-disabled:group-hover:[clip-path:inset(0_0_0_100%)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="12" x2="21" y2="12" />
              </svg>
              <svg
                className="absolute inset-0 w-full h-full transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[20%] group-disabled:group-hover:translate-x-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
