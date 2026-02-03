import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const PartnerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success('Partner login coming soon!');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-linear-to-br from-primary-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Store className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Partner Login
        </h2>
        <p className="text-gray-600">
          Sign in to your restaurant account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          }
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className='bg-pink-400'
        >
          Sign In as Partner
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have a partner account?{' '}
          <Link
            to="/partner/register"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Register your restaurant
          </Link>
        </p>
        <p className="text-gray-600 mt-4">
          Are you a customer?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Customer login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerLogin;