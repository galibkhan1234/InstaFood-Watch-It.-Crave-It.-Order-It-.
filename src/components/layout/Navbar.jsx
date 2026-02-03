import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  UtensilsCrossed,
  Search,
  Heart,
  PlusSquare,
  Bell,
  Menu,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import Avatar from '../ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { toggleMobileMenu } = useUIStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${searchQuery}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-6 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-pink-600 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h1 className="hidden sm:block text-2xl font-display font-bold gradient-text">
                InstaFood
              </h1>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
          </div>

          {/* Right: Icons + Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon - Mobile only */}
            <button
              onClick={() => navigate('/explore')}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-6 h-6 text-gray-700" />    
            </button>

            {/* Create Post */}
            <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg">
              <PlusSquare className="w-6 h-6 text-gray-700" />
            </button>

            {/* Saved */}
            <Link
              to="/saved"
              className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg"
            >
              <Heart className="w-6 h-6 text-gray-700" />
            </Link>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.fullName}
                  size="md"
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />

                    {/* Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-hard border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to={`/profile/${user?._id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Profile</span>
                      </Link>

                      <Link
                        to="/saved"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Heart className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Saved</span>
                      </Link>

                      <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Settings</span>
                      </button>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;