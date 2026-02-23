import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ReelCard from "../components/feed/ReelCard";
import { Spinner } from "../components/ui/Spinner";
import { reelsAPI } from "../api/services";
import { useFeedStore } from "../store/useStore";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

const Home = () => {
  const { reels, setReels, appendReels } = useFeedStore();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  // 🔥 FETCH FEED
  const fetchFeed = async (pageNum, refresh = false) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = await reelsAPI.getFeed(pageNum);

      const newReels = data?.reels || [];

      if (refresh) {
        setReels(newReels);
      } else {
        appendReels(newReels);
      }

      setHasMore(data?.hasMore ?? false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load feed");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchFeed(1, true);
  }, []);

  // ✅ INFINITE SCROLL (fixed dependency issue)
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeed(nextPage);
    }
  }, [inView, hasMore, isLoading]);

  // ✅ REFRESH
  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchFeed(1, true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">InstaFood</h1>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw
            className={`w-5 h-5 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {/* Empty State */}
      {reels.length === 0 && !isLoading ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">
            No reels yet
          </h3>
          <p className="text-gray-500">
            Follow restaurants to see food videos here.
          </p>
        </div>
      ) : (
        <>
          {reels.map(
            (reel) =>
              reel?._id && (
                <ReelCard key={reel._id} reel={reel} />
              )
          )}

          {/* Infinite Scroll Loader */}
          {hasMore && (
            <div ref={ref} className="flex justify-center py-8">
              {isLoading && <Spinner size="lg" />}
            </div>
          )}

          {/* End State */}
          {!hasMore && reels.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              You're all caught up! 🎉
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
