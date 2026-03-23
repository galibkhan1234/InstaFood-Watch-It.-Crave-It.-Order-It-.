import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      <div className="container-custom pt-20 pb-20 md:pb-4">
        <div className="flex gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>

          {/* Right Sidebar - Hidden on mobile and tablet */}
          <aside className="hidden xl:block w-80 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin">
            <div className="space-y-6">
              {/* Suggestions Widget */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Suggested For You</h3>
                <p className="text-sm text-gray-500">Coming soon...</p>
              </div>

              {/* Trending Restaurants Widget */}
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Trending Restaurants</h3>
                <p className="text-sm text-gray-500">Coming soon...</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;