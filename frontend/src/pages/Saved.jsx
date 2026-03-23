import { useEffect, useState } from 'react';
import ReelCard from '../components/feed/ReelCard';
import { Spinner } from '../components/ui/Spinner';
import { reelsAPI } from '../api/services';
import toast from 'react-hot-toast';
import { Bookmark } from 'lucide-react';

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const data = await reelsAPI.getSavedReels(); // fixed
      setPosts(data.reels || []);
    } catch (error) {
      console.error('SAVED FETCH ERROR:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load saved posts';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Bookmark className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Saved Reels
          </h1>
          <p className="text-gray-600">
            {posts.length} {posts.length === 1 ? 'reel' : 'reels'} saved
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No saved reels yet
          </h3>
          <p className="text-gray-600">
            Save reels to view them later.
          </p>
        </div>
      ) : (
        posts.map((reel) => (
          <ReelCard key={reel._id} reel={reel} />
        ))
      )}
    </div>
  );
};

export default Saved;