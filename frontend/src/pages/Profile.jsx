import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-12 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          User Profile
        </h1>
        <p className="text-gray-600">
          User ID: {userId}
        </p>
        <p className="text-gray-500 mt-4">
          Profile page coming soon...
        </p>
      </div>
    </div>
  );
};

export default Profile;