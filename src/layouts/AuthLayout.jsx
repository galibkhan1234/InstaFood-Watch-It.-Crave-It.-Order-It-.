import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const AuthLayout = ({ children, variant = 'user' }) => {
  // Different gradient themes for user vs partner pages
  const themes = {
    user: {
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      accentGradient: 'from-emerald-500 to-teal-600',
      iconBg: 'from-emerald-500 to-teal-600',
    },
    partner: {
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      accentGradient: 'from-violet-600 to-indigo-600',
      iconBg: 'from-violet-600 to-indigo-700',
    },
  };

  const theme = themes[variant] || themes.user;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Brand Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12 xl:px-16 text-white w-full">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-90 transition-opacity">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold whitespace-nowrap">InstaFood</h1>
          </Link>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-6">
            {variant === 'partner' ? (
              <>Grow Your<br />Restaurant Business</>
            ) : (
              <>Discover Food<br />Like Never Before</>
            )}
          </h2>
          
          <p className="text-base lg:text-lg xl:text-xl text-white/90 leading-relaxed max-w-lg">
            {variant === 'partner' 
              ? 'Join thousands of restaurants reaching more customers through engaging food content.'
              : 'Explore delicious food reels, discover new restaurants, and order your favorite meals with just a tap.'
            }
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8 hover:opacity-90 transition-opacity">
            <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">InstaFood</h1>
          </Link>

          {/* Auth Form Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-gray-500">
              © 2026 InstaFood. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <Link to="/terms" className="hover:text-gray-600 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-gray-600 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/help" className="hover:text-gray-600 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
