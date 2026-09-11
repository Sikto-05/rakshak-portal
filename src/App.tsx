import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import EntitySearch from './pages/EntitySearch';
import GraphView from './pages/GraphView';
import PathFinder from './pages/PathFinder';
import EvidenceLedger from './pages/EvidenceLedger';
import GeoMap from './pages/GeoMap';
import Analytics from './pages/Analytics';
import AuditLog from './pages/AuditLog';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entities" element={<EntitySearch />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/pathfinder" element={<PathFinder />} />
        <Route path="/evidence" element={<EvidenceLedger />} />
        <Route path="/map" element={<GeoMap />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/audit" element={<AuditLog />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

function LoginRedirect() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Login />;
}
