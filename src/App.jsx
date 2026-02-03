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
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PartnerLogin from './pages/auth/PartnerLogin';
import PartnerRegister from './pages/auth/PartnerRegister';
import RestaurantDetail from './pages/ResturantDetail';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch user on app load if token exists
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      fetchUser();
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/partner/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <PartnerLogin />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/partner/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <PartnerRegister />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
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