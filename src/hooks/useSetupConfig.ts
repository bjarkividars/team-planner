import { useState, useEffect } from 'react';
import { getSetupConfig, type SetupConfig } from '../lib/localStorage';
import { decodeScenariosState } from '../lib/urlStateCodec';

export function useSetupConfig(pathname?: string) {
  const [config, setConfig] = useState<SetupConfig | null>(null);
  const [resolvedPath, setResolvedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('s');

    let nextConfig: SetupConfig | null = null;
    if (encoded) {
      const decoded = decodeScenariosState(encoded);
      if (decoded && decoded.scenarios.length > 0) {
        const firstScenario = decoded.scenarios[0];
        nextConfig = {
          setupComplete: true,
          fundingAmount: firstScenario.fundingAmount,
          mrr: firstScenario.mrr,
          mrrGrowthRate: firstScenario.mrrGrowthRate,
          otherCosts: firstScenario.otherCosts,
          otherCostsGrowthRate: firstScenario.otherCostsGrowthRate,
          defaultLocation: firstScenario.defaultLocation,
          defaultRateTier: firstScenario.defaultRateTier,
          createdAt: new Date().toISOString(),
        };
      }
    }

    setTimeout(() => {
      setConfig(nextConfig ?? getSetupConfig());
      setResolvedPath(pathname);
    }, 0);
  }, [pathname]);

  const isLoading = resolvedPath !== pathname;

  return {
    config,
    isSetupComplete: config?.setupComplete ?? false,
    isLoading,
  };
}
