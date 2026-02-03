import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-to-r from-primary-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">
            InstaFood
          </h1>
        </Link>

        {/* Auth Form Card */}
        <div className="card p-8 shadow-hard">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 InstaFood. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;