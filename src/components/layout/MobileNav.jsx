import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';

const MobileNav = () => {
  const { user } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: PlusSquare, label: 'Create', path: '/create', isCreate: true },
    { icon: Heart, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id}` },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCreate) {
            return (
              <button
                key={item.path}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Icon className="w-7 h-7" />
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors',
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')}
                  />
                  <span className="text-xs">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;