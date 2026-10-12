import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';

// Phase 3 — lazy load heavy Three.js pages
const HomePage            = lazy(() => import('./pages/HomePage'));
const DestinationDetail   = lazy(() => import('./pages/DestinationDetail'));

// Phase 5 — Travel search
const SearchPage          = lazy(() => import('./pages/SearchPage'));

// Phase 6 — Trip Builder (lazy-loaded, all protected)
const LazyTripsPage       = lazy(() => import('./pages/TripsPage'));
const LazyCreateTripPage  = lazy(() => import('./pages/CreateTripPage'));
const LazyTripDetailsPage = lazy(() => import('./pages/TripDetailsPage'));
const LazyEditTripPage    = lazy(() => import('./pages/EditTripPage'));

function GlobeSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#080c14', color: '#94a3b8', gap: '0.75rem'
    }}>
      <span style={{
        width: '1.5rem', height: '1.5rem',
        border: '3px solid #1e3a5f',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }} />
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<GlobeSpinner />}>
          <Routes>
            {/* Phase 3: Globe explorer (public) */}
            <Route path="/"                   element={<HomePage />} />
            <Route path="/destinations/:slug" element={<DestinationDetail />} />

            {/* Phase 5: Travel search (public) */}
            <Route path="/search"             element={<SearchPage />} />

            {/* Phase 2: Auth pages (public) */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"          element={<DashboardPage />} />

              {/* Phase 6: Trip Builder */}
              <Route path="/trips"              element={<LazyTripsPage />} />
              <Route path="/trips/new"          element={<LazyCreateTripPage />} />
              <Route path="/trips/:tripId"      element={<LazyTripDetailsPage />} />
              <Route path="/trips/:tripId/edit" element={<LazyEditTripPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
