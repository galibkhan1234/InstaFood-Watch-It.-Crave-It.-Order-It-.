import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useStore';
import { LoadingScreen } from './components/ui/Spinner';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import RestaurantDetail from './pages/ResturantDetail';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PartnerLogin from './pages/auth/PartnerLogin';
import PartnerRegister from './pages/auth/PartnerRegister';

// Partner Pages
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerUpload from './pages/partner/Upload';
import PartnerReels from './pages/partner/Reels';

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
    <BrowserRouter>
      <Toaster position="top-center" />

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
    </BrowserRouter>
  );
}

export default App;
