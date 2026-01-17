import { useCallback, useState } from "react";
import {
  updateFundingAmount,
  updateMrr,
  updateMrrGrowthRate,
  updateOtherCosts,
  updateOtherCostsGrowthRate,
  type SetupConfig,
} from "../../../lib/localStorage";

export function usePlannerFinancials(setupConfig: SetupConfig | null) {
  const [fundingAmount, setFundingAmount] = useState(setupConfig?.fundingAmount ?? 0);
  const [mrr, setMrr] = useState(setupConfig?.mrr ?? 0);
  const [mrrGrowthRate, setMrrGrowthRate] = useState(setupConfig?.mrrGrowthRate ?? 0);
  const [otherCosts, setOtherCosts] = useState(setupConfig?.otherCosts ?? 0);
  const [otherCostsGrowthRate, setOtherCostsGrowthRate] = useState(setupConfig?.otherCostsGrowthRate ?? 0);

  const handleFundingChange = useCallback((amount: number) => {
    setFundingAmount(amount);
    updateFundingAmount(amount);
  }, []);

  const handleMrrChange = useCallback((amount: number) => {
    setMrr(amount);
    updateMrr(amount);
  }, []);

  const handleGrowthRateChange = useCallback((rate: number) => {
    setMrrGrowthRate(rate);
    updateMrrGrowthRate(rate);
  }, []);

  const handleOtherCostsChange = useCallback((amount: number) => {
    setOtherCosts(amount);
    updateOtherCosts(amount);
  }, []);

  const handleOtherCostsGrowthRateChange = useCallback((rate: number) => {
    setOtherCostsGrowthRate(rate);
    updateOtherCostsGrowthRate(rate);
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
