import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, User, PlusSquare } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';

const Sidebar = () => {
  const { user } = useAuthStore();
  if (!user) return null;

  const role = user.userType;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    role === 'partner' && {
      icon: PlusSquare,
      label: 'Create Reel',
      path: '/partner/reels/create',
    },
    role === 'user' && {
      icon: Heart,
      label: 'Saved',
      path: '/saved',
    },
    {
      icon: User,
      label: 'Profile',
      path: role === 'partner' ? '/partner/profile' : `/profile/${user._id}`,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-2">
      {navItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={label}
          to={path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-4 px-4 py-3 rounded-lg',
              isActive
                ? 'bg-primary-50 text-primary-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
        >
          <Icon className="w-6 h-6" />
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
