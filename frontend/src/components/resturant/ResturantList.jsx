import RestaurantCard from './RestaurantCard';
import { Spinner } from '../ui/Spinner';

const RestaurantList = ({ restaurants, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No restaurants found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default RestaurantList;