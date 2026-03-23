import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Store,Eye,Heart,MessageCircle,Upload,Settings,LogOut,ChefHat,BarChart3,Users,Video,ArrowUpRight,Calendar,Clock,
} from 'lucide-react';

import { useAuthStore } from '../../store/useStore';
import { restaurantsAPI } from '../../api/services';
import toast from 'react-hot-toast';

const PartnerDashboard = () => {
  const navigate = useNavigate();

  // 🔹 partner data is stored in `user`
  const { user: partner, logout } = useAuthStore();

  const [stats, setStats] = useState({
    totalReels: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch partner's restaurants to derive basic stats
      const res = await restaurantsAPI.getMy();
      if (res.restaurants) {
        setStats(prev => ({
          ...prev,
          totalReels: res.count || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // 🔐 calls API + clears store + token
      toast.success('Logged out successfully');
      navigate('/partner/login');
    } catch (error) {
      console.warn('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Restaurant Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {partner?.restaurantName || 'Restaurant Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">{partner?.email}</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/partner/settings')}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5" />
              <span className="text-white/90">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {partner?.name || 'Partner'}! 👋
            </h2>
            <p className="text-white/90 text-lg">
              Manage your restaurant and grow your business with InstaFood
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Reels" 
            value={stats.totalReels} 
            icon={<Video className="w-6 h-6" />} 
            color="violet"
            trend="+12%"
            trendUp={true}
          />
          <StatCard 
            title="Total Views" 
            value={stats.totalViews.toLocaleString()} 
            icon={<Eye className="w-6 h-6" />} 
            color="emerald"
            trend="+24%"
            trendUp={true}
          />
          <StatCard 
            title="Total Likes" 
            value={stats.totalLikes.toLocaleString()} 
            icon={<Heart className="w-6 h-6" />} 
            color="rose"
            trend="+8%"
            trendUp={true}
          />
          <StatCard 
            title="Followers" 
            value={stats.followers} 
            icon={<Users className="w-6 h-6" />} 
            color="blue"
            trend="+5%"
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionCard
                  title="Upload Reel"
                  description="Share your delicious creations"
                  icon={<Upload className="w-6 h-6" />}
                  color="violet"
                  onClick={() => navigate('/partner/upload')}
                />
                <ActionCard
                  title="View Analytics"
                  description="Track your performance"
                  icon={<BarChart3 className="w-6 h-6" />}
                  color="emerald"
                  onClick={() => navigate('/partner/analytics')}
                />
                <ActionCard
                  title="Manage Comments"
                  description="Engage with customers"
                  icon={<MessageCircle className="w-6 h-6" />}
                  color="blue"
                  onClick={() => navigate('/partner/comments')}
                />
                <ActionCard
                  title="Settings"
                  description="Update restaurant info"
                  icon={<Settings className="w-6 h-6" />}
                  color="gray"
                  onClick={() => navigate('/partner/settings')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Reels</h2>
                <button 
                  onClick={() => navigate('/partner/reels')}
                  className="text-violet-600 hover:text-violet-700 font-semibold text-sm flex items-center gap-1"
                >
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
              {stats.totalReels === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No reels uploaded yet</p>
                  <button
                    onClick={() => navigate('/partner/upload')}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all inline-flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Your First Reel
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Placeholder for actual reels list */}
                  <ReelListItem 
                    title="Butter Chicken Special"
                    views={234}
                    likes={45}
                    time="2 hours ago"
                  />
                  <ReelListItem 
                    title="Paneer Tikka Masala"
                    views={189}
                    likes={38}
                    time="5 hours ago"
                  />
                  <ReelListItem 
                    title="Chocolate Lava Cake"
                    views={312}
                    likes={67}
                    time="1 day ago"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <PerformanceMetric 
                  label="Avg. Views per Reel"
                  value="128"
                  color="emerald"
                />
                <PerformanceMetric 
                  label="Engagement Rate"
                  value="21%"
                  color="violet"
                />
                <PerformanceMetric 
                  label="Growth Rate"
                  value="+15%"
                  color="blue"
                />
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pro Tip</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Post reels during peak hours (12 PM - 2 PM, 7 PM - 9 PM) for maximum engagement!
              </p>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Boost Your Reach</h3>
              <p className="text-white/90 text-sm mb-4">
                Upgrade to premium and reach 10x more customers
              </p>
              <button className="w-full py-3 bg-white text-violet-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Modern Stat Card */
const StatCard = ({ title, value, icon, color, trend, trendUp }) => {
  const colorClasses = {
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            <ArrowUpRight className={`w-4 h-4 ${!trendUp && 'rotate-90'}`} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

/* Action Card */
const ActionCard = ({ title, description, icon, color, onClick }) => {
  const colorClasses = {
    violet: 'from-violet-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-cyan-600',
    gray: 'from-gray-600 to-gray-700',
  };

  return (
    <button
      onClick={onClick}
      className="group text-left p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

/* Reel List Item */
const ReelListItem = ({ title, views, likes, time }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/')}
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
    >
    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex-shrink-0"></div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {likes}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {time}
        </span>
      </div>
    </div>
    </div>
  );
};

/* Performance Metric */
const PerformanceMetric = ({ label, value, color }) => {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-50',
    violet: 'text-violet-600 bg-violet-50',
    blue: 'text-blue-600 bg-blue-50',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-3 py-1 rounded-lg font-bold text-sm ${colorClasses[color]}`}>
        {value}
      </span>
    </div>
  );
};

export default PartnerDashboard;