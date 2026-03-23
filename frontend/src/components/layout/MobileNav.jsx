import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';

const MobileNav = () => {
  const { user } = useAuthStore();
  if (!user) return null;

  const role = user.userType;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    role === 'partner' && {
      icon: PlusSquare,
      label: 'Create',
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t z-30">
      <div className="flex justify-around h-16">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1',
                isActive ? 'text-primary-600' : 'text-gray-600'
              )
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
