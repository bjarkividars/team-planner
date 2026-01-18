import { useCallback, useState } from "react";
import type { SetupConfig } from "../../../lib/localStorage";

export function usePlannerFinancials(setupConfig: SetupConfig | null) {
  const [fundingAmount, setFundingAmount] = useState(setupConfig?.fundingAmount ?? 0);
  const [mrr, setMrr] = useState(setupConfig?.mrr ?? 0);
  const [mrrGrowthRate, setMrrGrowthRate] = useState(setupConfig?.mrrGrowthRate ?? 0);
  const [otherCosts, setOtherCosts] = useState(setupConfig?.otherCosts ?? 0);
  const [otherCostsGrowthRate, setOtherCostsGrowthRate] = useState(setupConfig?.otherCostsGrowthRate ?? 0);

  const handleFundingChange = useCallback((amount: number) => {
    setFundingAmount(amount);
  }, []);

  const handleMrrChange = useCallback((amount: number) => {
    setMrr(amount);
  }, []);

  const handleGrowthRateChange = useCallback((rate: number) => {
    setMrrGrowthRate(rate);
  }, []);

  const handleOtherCostsChange = useCallback((amount: number) => {
    setOtherCosts(amount);
  }, []);

  const handleOtherCostsGrowthRateChange = useCallback((rate: number) => {
    setOtherCostsGrowthRate(rate);
  }, []);

  return {
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
  };
}
