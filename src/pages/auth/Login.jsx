import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-sm md:text-base text-gray-600">Sign in to continue your culinary journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder-gray-400" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" 
          className="text-sm font-medium text-emerald-600
           hover:text-emerald-700 transition-colors">Forgot password?</Link>
        </div>

        <button type="submit" disabled={loading} 
        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600
         hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform 
         hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
         disabled:transform-none flex items-center justify-center gap-2">{loading ? <>
         <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          </svg><span>Signing in...</span></> : <><span>Sign In</span><ArrowRight className="h-5 w-5" /></>}</button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200">
          </div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              New to InstaFood?
              </span>
              </div></div>

      <Link to="/register" className="block w-full py-3.5 text-center bg-gray-50
       hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 
       transition-colors">Create an Account</Link>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-center text-sm text-gray-600">Restaurant Partner? 
          <Link to="/partner/login" className="font-semibold text-emerald-600
           hover:text-emerald-700 transition-colors inline-flex items-center gap-1">
            Sign in here <ArrowRight className="h-3.5 w-3.5" /></Link></p></div>

      <p className="text-center text-sm text-gray-500 mt-6">
        By continuing, you agree to InstaFood's <Link to="/terms" 
        className="text-gray-700 hover:text-gray-900 underline">
          Terms of Service</Link> and <Link to="/privacy" className="text-gray-700
           hover:text-gray-900 underline">Privacy Policy</Link></p>
    </div>
  );
}