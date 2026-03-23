import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useStore';
import { LoadingScreen } from './components/ui/Spinner';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Saved = lazy(() => import('./pages/Saved'));
const Profile = lazy(() => import('./pages/Profile'));
const RestaurantDetail = lazy(() => import('./pages/ResturantDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy-loaded Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const PartnerLogin = lazy(() => import('./pages/auth/PartnerLogin'));
const PartnerRegister = lazy(() => import('./pages/auth/PartnerRegister'));

// Lazy-loaded Partner Pages
const PartnerDashboard = lazy(() => import('./pages/partner/Dashboard'));
const PartnerUpload = lazy(() => import('./pages/partner/Upload'));
const PartnerReels = lazy(() => import('./pages/partner/Reels'));

/* =========================
   Protected Routes
========================= */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.userType === 'partner') {
    return <Navigate to="/partner/dashboard" replace />;
  }

  return children;
};

const PartnerProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/partner/login" replace />;
  }

  if (user?.userType !== 'partner') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return user?.userType === 'partner'
      ? <Navigate to="/partner/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
};

/* =========================
   App
========================= */

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      fetchUser();
    }
  }, [fetchUser, isAuthenticated]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-center" />

        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <AuthLayout><Login /></AuthLayout>
              </PublicRoute>
            } />

            <Route path="/register" element={
              <PublicRoute>
                <AuthLayout><Register /></AuthLayout>
              </PublicRoute>
            } />

            <Route path="/partner/login" element={
              <PublicRoute>
                <AuthLayout variant="partner"><PartnerLogin /></AuthLayout>
              </PublicRoute>
            } />

            <Route path="/partner/register" element={
              <PublicRoute>
                <AuthLayout variant="partner"><PartnerRegister /></AuthLayout>
              </PublicRoute>
            } />

            {/* Partner */}
            <Route path="/partner/dashboard" element={
              <PartnerProtectedRoute>
                <PartnerDashboard />
              </PartnerProtectedRoute>
            } />

            <Route path="/partner/upload" element={
              <PartnerProtectedRoute>
                <PartnerUpload />
              </PartnerProtectedRoute>
            } />

            <Route path="/partner/reels" element={
              <PartnerProtectedRoute>
                <PartnerReels />
              </PartnerProtectedRoute>
            } />

            {/* User */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="saved" element={<Saved />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="restaurant/:restaurantId" element={<RestaurantDetail />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
