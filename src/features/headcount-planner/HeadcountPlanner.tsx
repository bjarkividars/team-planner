import { PlannerLayout } from "./components/PlannerLayout";
import { PlannerProvider } from "./context/PlannerContext";

export function HeadcountPlanner() {
  return (
    <PlannerProvider>
      <PlannerLayout />
    </PlannerProvider>
  );
}
