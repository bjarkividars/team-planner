import { useState, useEffect } from 'react';
import { getSetupConfig, type SetupConfig } from '../lib/localStorage';
import { decodeScenariosState } from '../lib/urlStateCodec';

export function useSetupConfig(pathname?: string) {
  const [config, setConfig] = useState<SetupConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('s');

    if (encoded) {
      const decoded = decodeScenariosState(encoded);
      if (decoded && decoded.scenarios.length > 0) {
        const firstScenario = decoded.scenarios[0];
        setConfig({
          setupComplete: true,
          fundingAmount: firstScenario.fundingAmount,
          mrr: firstScenario.mrr,
          mrrGrowthRate: firstScenario.mrrGrowthRate,
          otherCosts: firstScenario.otherCosts,
          otherCostsGrowthRate: firstScenario.otherCostsGrowthRate,
          defaultLocation: firstScenario.defaultLocation,
          defaultRateTier: firstScenario.defaultRateTier,
          createdAt: new Date().toISOString(),
        });
        setIsLoading(false);
        return;
      }
    }

    const loadedConfig = getSetupConfig();
    setConfig(loadedConfig);
    setIsLoading(false);
  }, [pathname]);

  return {
    config,
    isSetupComplete: config?.setupComplete ?? false,
    isLoading,
  };
}
