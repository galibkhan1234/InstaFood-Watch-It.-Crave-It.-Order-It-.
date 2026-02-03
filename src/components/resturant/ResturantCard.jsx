import { Link } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';
import { formatDistance } from '../../utils/helpers';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="card p-0 overflow-hidden hover:shadow-hard transition-all duration-300 group"
    >
      {/* Image */}
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <img
          src={restaurant.image || restaurant.restaurantImage || 'https://via.placeholder.com/400x300?text=Restaurant'}
          alt={restaurant.name || restaurant.restaurantName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        {restaurant.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
            <span className="font-semibold text-gray-900">
              {restaurant.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Open/Closed Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge shadow-md ${
            restaurant.isOpen 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {restaurant.name || restaurant.restaurantName}
        </h3>

        {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.cuisineTypes.slice(0, 3).map((cuisine, index) => (
              <span key={index} className="badge bg-gray-100 text-gray-700 text-xs">
                {cuisine}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.address?.city || 'Unknown'}</span>
          </div>
          {restaurant.distance && (
            <span className="text-gray-500 font-medium">
              {formatDistance(restaurant.distance)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;