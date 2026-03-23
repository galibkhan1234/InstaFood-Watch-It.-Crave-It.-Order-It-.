import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Store, Phone, ArrowRight, Check, Utensils, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const PartnerRegister = () => {
  const navigate = useNavigate();
  const { partnerRegister } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    restaurantName: '',
    cuisineTypes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedData = {
        ...formData,
        cuisineTypes: formData.cuisineTypes
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      };

      await partnerRegister(formattedData);

      toast.success('Restaurant registered successfully!');
      navigate('/partner/dashboard');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Register Your Restaurant</h2>
        <p className="text-sm md:text-base text-gray-600">Partner with InstaFood & reach more customers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            </div>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Store className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            </div>
            <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} placeholder="Your restaurant name" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Utensils className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            </div>
            <input type="text" name="cuisineTypes" value={formData.cuisineTypes} onChange={handleChange} placeholder="e.g. North Indian, Chinese, Italian" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">Separate multiple cuisines with commas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="restaurant@example.com" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            </div>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit phone number" maxLength={10} required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
            </div>
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a secure password" required className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">Must be at least 8 characters</p>
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">{isLoading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/></svg><span>Registering...</span></> : <><span>Register as Partner</span><ArrowRight className="h-5 w-5" /></>}</button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-5">By registering, you agree to our <Link to="/partner/terms" className="text-pink-600 hover:text-pink-700 underline">Partner Terms</Link> and <Link to="/privacy" className="text-pink-600 hover:text-pink-700 underline">Privacy Policy</Link></p>

      <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Already a partner?</span></div></div>

      <Link to="/partner/login" className="block w-full py-3.5 text-center bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-colors">Sign In</Link>
    </div>
  );
};

export default PartnerRegister;