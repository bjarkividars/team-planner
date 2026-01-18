import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SetupPage } from './features/setup/SetupPage';
import { HeadcountPlanner } from './features/headcount-planner/HeadcountPlanner';
import { useSetupConfig } from './hooks/useSetupConfig';
import { Providers } from './components/Providers';

function AppRoutes() {
  const location = useLocation();
  const { isSetupComplete, isLoading } = useSetupConfig(location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <p className="text-[var(--g-20)]">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route
        path="/"
        element={isSetupComplete ? <HeadcountPlanner /> : <Navigate to="/setup" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Providers>
  );
}

export default App;
