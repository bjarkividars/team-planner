import { useState, useEffect } from 'react';
import { getSetupConfig, type SetupConfig } from '../lib/localStorage';
import { decodeState } from '../lib/urlStateCodec';

export function useSetupConfig(pathname?: string) {
  const [config, setConfig] = useState<SetupConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('s');

    if (encoded) {
      const decodedState = decodeState(encoded);
      if (decodedState) {
        setConfig({
          setupComplete: true,
          fundingAmount: decodedState.fundingAmount,
          mrr: decodedState.mrr,
          mrrGrowthRate: decodedState.mrrGrowthRate,
          otherCosts: decodedState.otherCosts,
          otherCostsGrowthRate: decodedState.otherCostsGrowthRate,
          defaultLocation: decodedState.defaultLocation,
          defaultRateTier: decodedState.defaultRateTier,
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
