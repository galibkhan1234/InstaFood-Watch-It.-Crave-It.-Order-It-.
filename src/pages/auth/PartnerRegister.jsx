import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Store, Phone, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const PartnerRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    city: '',
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
      toast.success('Partner registration coming soon!');
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
          Register Your Restaurant
        </h2>
        <p className="text-gray-600">Join InstaFood as a partner</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          leftIcon={<User className="w-5 h-5 text-gray-400" />}
          required
        />

        <Input
          label="Restaurant Name"
          type="text"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleChange}
          placeholder="Enter restaurant name"
          leftIcon={<Store className="w-5 h-5 text-gray-400" />}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
          required
        />

        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit phone number"
          leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
          required
          maxLength={10}
        />

        <Input
          label="City"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
          leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
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
          Register as Partner
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have a partner account?{' '}
          <Link
            to="/partner/login"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PartnerRegister;