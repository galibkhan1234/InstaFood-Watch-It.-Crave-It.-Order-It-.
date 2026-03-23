import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, TrendingUp } from 'lucide-react';
import Input from '../components/ui/Input';
import { restaurantsAPI } from '../api/services';
import { useLocationStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { getCurrentLocation, debounce } from '../utils/helpers';
import { Spinner } from '../components/ui/Spinner';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userLocation, setLocation } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const cuisineFilters = [
    { id: 'all', label: 'All', icon: '🍽️' },
    { id: 'italian', label: 'Italian', icon: '🍝' },
    { id: 'chinese', label: 'Chinese', icon: '🥡' },
    { id: 'indian', label: 'Indian', icon: '🍛' },
    { id: 'mexican', label: 'Mexican', icon: '🌮' },
    { id: 'thai', label: 'Thai', icon: '🍜' },
    { id: 'japanese', label: 'Japanese', icon: '🍣' },
    { id: 'fast-food', label: 'Fast Food', icon: '🍔' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
  ];

  const handleLocationRequest = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setLocation(location);
      toast.success('Location access granted');
      fetchNearbyRestaurants(location.latitude, location.longitude);
    } catch (error) {
      toast.error('Please enable location access');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const fetchNearbyRestaurants = async (lat, lng) => {
    setIsLoading(true);
    try {
      const data = await restaurantsAPI.getNearby(lat, lng);
      setRestaurants(data.restaurants);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const searchRestaurants = async (query) => {
    if (!query.trim()) {
      setRestaurants([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await restaurantsAPI.search(query);
      setRestaurants(data.restaurants);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchRestaurants, 500);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery]);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyRestaurants(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Restaurants
        </h1>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, cuisines..."
              leftIcon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>
          {!userLocation && (
            <button
              onClick={handleLocationRequest}
              disabled={isGettingLocation}
              className="btn-primary whitespace-nowrap"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {isGettingLocation ? 'Getting...' : 'Near Me'}
            </button>
          )}
        </div>
      </div>

      {/* Cuisine Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Cuisines</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {cuisineFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
              }`}
            >
              <span className="text-lg">{filter.icon}</span>
              <span className="font-medium">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="card p-0 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={restaurant.image || 'https://via.placeholder.com/400x300?text=Restaurant'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {restaurant.rating > 0 && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-gray-900">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {restaurant.name}
                </h3>
                {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.cuisineTypes.slice(0, 3).map((cuisine) => (
                      <span
                        key={cuisine}
                        className="badge bg-gray-100 text-gray-700"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.address?.city || 'Unknown'}</span>
                  </div>
                  {restaurant.distance && (
                    <span className="text-sm text-gray-500">
                      {restaurant.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600">
            Try searching for something else
          </p>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Discover Amazing Restaurants
          </h3>
          <p className="text-gray-600 mb-6">
            Search for restaurants or enable location to find nearby options
          </p>
        </div>
      )}

      {/* Trending Section */}
      {!searchQuery && !isLoading && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Trending Now
            </h2>
          </div>
          <p className="text-gray-500">Coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Explore;