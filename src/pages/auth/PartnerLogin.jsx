import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { partnerLogin } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await partnerLogin(formData);
      toast.success('Welcome back, Partner!');
      navigate('/partner/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Partner Login</h2>
        <p className="text-sm md:text-base text-gray-600">Access your restaurant dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="restaurant@example.com"
              required
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
          {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-end">
          <Link to="/partner/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">Forgot password?</Link>
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In as Partner</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">New partner?</span>
            </div>
            </div>

      <Link to="/partner/register" className="block w-full py-3.5 text-center bg-gray-50 hover:bg-gray-100 
      text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-colors">
        Register Your Restaurant
        </Link>

      <div className="mt-6 pt-6 border-t border-gray-100"><p className="text-center text-sm text-gray-600">Looking for customer login? <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors inline-flex items-center gap-1">Sign in here <ArrowRight className="h-3.5 w-3.5" /></Link></p></div>
    </div>
  );
}
