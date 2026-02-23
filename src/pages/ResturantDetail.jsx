import { useParams } from 'react-router-dom';
import { Store } from 'lucide-react';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-12 text-center">
        <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Restaurant Details
        </h1>
        <p className="text-gray-600">
          Restaurant ID: {restaurantId}
        </p>
        <p className="text-gray-500 mt-4">
          Restaurant detail page coming soon...
        </p>
      </div>
    </div>
  );
};

export default RestaurantDetail;
