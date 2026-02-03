import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Heart,
  User,
  MapPin,
  TrendingUp,
  Bookmark,
} from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';

const Sidebar = () => {
  const { user } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Heart, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id}` },
  ];

  return (
    <div className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}

      {/* Quick Links */}
      <div className="pt-6 mt-6 border-t border-gray-200">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Links
        </h3>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <MapPin className="w-6 h-6" />
          <span>Nearby Restaurants</span>
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <TrendingUp className="w-6 h-6" />
          <span>Trending Now</span>
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <Bookmark className="w-6 h-6" />
          <span>Collections</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;