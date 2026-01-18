import { PlannerLayout } from "./components/PlannerLayout";
import { PlannerProvider } from "./context/PlannerContext";
import { ScenarioProvider } from "./context/ScenarioContext";
import { useScenarioContext } from "./hooks/useScenarioContext";

function PlannerWithScenario() {
  const { activeScenario, activeIndex, updateActiveScenario } = useScenarioContext();

  return (
    <PlannerProvider
      key={activeIndex}
      initialScenario={activeScenario}
      onScenarioChange={updateActiveScenario}
    >
      <PlannerLayout />
    </PlannerProvider>
  );
}

export function HeadcountPlanner() {
  return (
    <ScenarioProvider>
      <PlannerWithScenario />
    </ScenarioProvider>
  );
}
