// import { useEffect, useState, useCallback } from 'react';
// import { useInView } from 'react-intersection-observer';
// import PostCard from '../components/feed/PostCard';
// import { Spinner } from '../components/ui/Spinner';
// import { postsAPI } from '../api/services';
// import { useFeedStore } from '../store/useStore';
// import toast from 'react-hot-toast';
// import { RefreshCw } from 'lucide-react';

// const Home = () => {
//   const { posts, setPosts } = useFeedStore();
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Intersection Observer for infinite scroll
//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   const fetchPosts = useCallback(async (pageNum, refresh = false) => {
//     if (isLoading) return;
    
//     setIsLoading(true);

//     try {
//       const data = await postsAPI.getFeed(pageNum, 10);
      
//       if (refresh) {
//         setPosts(data.posts || []);
//       } else {
//         setPosts([...posts, ...(data.posts || [])]);
//       }

//       setHasMore(data.hasMore || false);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       toast.error('Failed to load posts');
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [posts, setPosts, isLoading]);

//   // Initial load
//   useEffect(() => {
//     fetchPosts(1, true);
//   }, []);

//   // Load more when scrolling to bottom
//   useEffect(() => {
//     if (inView && hasMore && !isLoading) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchPosts(nextPage);
//     }
//   }, [inView, hasMore, isLoading, page]);

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setPage(1);
//     fetchPosts(1, true);
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
//         <button
//           onClick={handleRefresh}
//           disabled={isRefreshing}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <RefreshCw
//             className={`w-5 h-5 text-gray-600 ${
//               isRefreshing ? 'animate-spin' : ''
//             }`}
//           />
//         </button>
//       </div>

//       {/* Posts Feed */}
//       {posts.length === 0 && !isLoading ? (
//         <div className="card p-12 text-center">
//           <div className="text-6xl mb-4">🍽️</div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             No posts yet
//           </h3>
//           <p className="text-gray-600">
//             Follow some restaurants to see their delicious posts!
//           </p>
//         </div>
//       ) : (
//         <>
//           {posts.filter(post => post && post._id).map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}

//           {/* Loading indicator */}
//           {hasMore && (
//             <div ref={ref} className="flex justify-center py-8">
//               {isLoading && <Spinner size="lg" />}
//             </div>
//           )}

//           {/* End of feed message */}
//           {!hasMore && posts.length > 0 && (
//             <div className="text-center py-8 text-gray-500">
//               <p>You're all caught up! 🎉</p>
//             </div>
//           )}
//         </>
//       )}

//       {/* Initial loading */}
//       {isLoading && posts.length === 0 && (
//         <div className="space-y-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="card p-4 animate-pulse">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-gray-200 rounded-full" />
//                 <div className="flex-1">
//                   <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
//                   <div className="h-3 bg-gray-200 rounded w-24" />
//                 </div>
//               </div>
//               <div className="aspect-square bg-gray-200 rounded-lg" />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from '../components/feed/PostCard';
import { Spinner } from '../components/ui/Spinner';
import { postsAPI } from '../api/services';
import { useFeedStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

// 🎯 MOCK DATA FOR TESTING
const MOCK_POSTS = [
  {
    _id: '1',
    restaurant: {
      _id: 'r1',
      name: 'Burger Palace',
      image: 'https://via.placeholder.com/150',
      location: { city: 'Mumbai' }
    },
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    caption: 'Amazing double cheese burger! 🍔',
    cuisine: 'Fast Food',
    likes: ['user1', 'user2'],
    saves: [],
    likesCount: 24,
    commentsCount: 5,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '2',
    restaurant: {
      _id: 'r2',
      name: 'Pizza Corner',
      image: 'https://via.placeholder.com/150',
      location: { city: 'Delhi' }
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
    caption: 'Margherita perfection! 🍕',
    cuisine: 'Italian',
    likes: ['user3'],
    saves: ['user1'],
    likesCount: 42,
    commentsCount: 12,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: '3',
    restaurant: {
      _id: 'r3',
      name: 'Sushi House',
      image: 'https://via.placeholder.com/150',
      location: { city: 'Bangalore' }
    },
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600',
    caption: 'Fresh sushi platter 🍣',
    cuisine: 'Japanese',
    likes: [],
    saves: [],
    likesCount: 18,
    commentsCount: 3,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

const Home = () => {
  const { posts, setPosts } = useFeedStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true); // 🎯 Toggle for mock data

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchPosts = useCallback(async (pageNum, refresh = false) => {
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      // 🎯 TRY REAL API FIRST, FALLBACK TO MOCK
      let data;
      
      if (!useMockData) {
        try {
          data = await postsAPI.getFeed(pageNum, 10);
          toast.success('Connected to backend!');
          setUseMockData(false);
        } catch (error) {
          console.warn('Backend not available, using mock data');
          data = { posts: MOCK_POSTS, hasMore: false };
          setUseMockData(true);
        }
      } else {
        // Use mock data
        data = { posts: MOCK_POSTS, hasMore: false };
      }
      
      if (refresh) {
        setPosts(data.posts || []);
      } else {
        setPosts([...posts, ...(data.posts || [])]);
      }

      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Don't show error toast if using mock data
      if (!useMockData) {
        toast.error('Using demo data - backend not connected');
      }
      // Load mock data as fallback
      setPosts(MOCK_POSTS);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [posts, setPosts, isLoading, useMockData]);

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  }, [inView, hasMore, isLoading, page]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    fetchPosts(1, true);
  };

  const toggleMockData = () => {
    setUseMockData(!useMockData);
    setPage(1);
    fetchPosts(1, true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
          {useMockData && (
            <span className="text-xs text-orange-600 font-medium">
              📍 Demo Mode - Using Mock Data
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {/* Toggle Mock Data Button */}
          <button
            onClick={toggleMockData}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {useMockData ? '🔌 Try Backend' : '📦 Use Demo'}
          </button>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.length === 0 && !isLoading ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600">
            Follow some restaurants to see their delicious posts!
          </p>
        </div>
      ) : (
        <>
          {posts.filter(post => post && post._id).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {hasMore && (
            <div ref={ref} className="flex justify-center py-8">
              {isLoading && <Spinner size="lg" />}
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>You're all caught up! 🎉</p>
            </div>
          )}
        </>
      )}

      {isLoading && posts.length === 0 && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;