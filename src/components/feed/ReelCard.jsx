import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ExternalLink,
  Play,
} from "lucide-react";
import { useFeedStore, useAuthStore } from "../../store/useStore";
import { reelsAPI } from "../../api/services";
import { formatNumber, formatTimeAgo } from "../../utils/helpers";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";
import { motion, AnimatePresence } from "framer-motion";

const ReelCard = ({ reel }) => {
  const { user } = useAuthStore();
  const { toggleLike, toggleSave, incrementShareCount } = useFeedStore();

  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  if (!reel || !reel._id) return null;

  const userId = user?._id || user?.id;

  const isLiked =
    Array.isArray(reel.likedBy) && userId
      ? reel.likedBy.includes(userId)
      : false;

  const isSaved =
    Array.isArray(reel.savedBy) && userId
      ? reel.savedBy.includes(userId)
      : false;

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = async () => {
    if (!userId) { toast.error("Please login first"); return; }
    if (isLiking) return;
    setIsLiking(true);
    try {
      toggleLike(reel._id, userId);
      await reelsAPI.toggleLike(reel._id);
    } catch {
      toggleLike(reel._id, userId);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!userId) { toast.error("Please login first"); return; }
    if (isSaving) return;
    setIsSaving(true);
    try {
      toggleSave(reel._id, userId);
      await reelsAPI.saveReel(reel._id);
      toast.success(isSaved ? "Removed from saved" : "Saved!");
    } catch {
      toggleSave(reel._id, userId);
      toast.error("Failed to save reel");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/reel/${reel._id}`;
      if (navigator.share) {
        await navigator.share({
          title: reel.restaurant?.restaurantName || "Food Reel",
          text: reel.caption || "",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!");
      }
      incrementShareCount(reel._id);
      reelsAPI.shareReel(reel._id).catch(() => {});
    } catch (error) {
      if (error.name !== "AbortError") toast.error("Failed to share");
    } finally {
      setIsSharing(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to={`/restaurant/${reel.restaurant?._id || "#"}`}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">
                {(reel.restaurant?.restaurantName || "R")[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {reel.restaurant?.restaurantName || "Restaurant"}
            </h3>
            {reel.foodName && (
              <p className="text-xs text-gray-500 truncate">{reel.foodName}</p>
            )}
          </div>
        </Link>
        {reel.price && (
          <span className="text-sm font-bold text-emerald-600">₹{reel.price}</span>
        )}
      </div>

      {/* Video */}
      <div
        className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="absolute insect-0 w-full h-full object-cover"
          loop
          muted
          playsInline
        />

         {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* Play icon overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Play className="w-16 h-16 text-white/80 fill-white/80" />
          </div>
        )}

        {/* Double-tap heart animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Caption overlay */}
        {reel.caption && (
          <div className="absolute bottom-4 left-4 right-16 text-white">
            <p className="text-sm drop-shadow-lg line-clamp-2">{reel.caption}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="group">
              <Heart
                className={`w-7 h-7 transition-all duration-200 ${
                  isLiked
                    ? "fill-red-500 stroke-red-500 scale-110"
                    : "stroke-gray-800 group-hover:stroke-gray-600"
                }`}
              />
            </button>
            <button onClick={() => setShowComments((p) => !p)} className="group">
              <MessageCircle className="w-7 h-7 stroke-gray-800 group-hover:stroke-gray-600 transition-colors" />
            </button>
            <button onClick={handleShare} className="group">
              <Share2 className="w-7 h-7 stroke-gray-800 group-hover:stroke-gray-600 transition-colors" />
            </button>
          </div>
          <button onClick={handleSave} className="group">
            <Bookmark
              className={`w-7 h-7 transition-all duration-200 ${
                isSaved
                  ? "fill-gray-900 stroke-gray-900"
                  : "stroke-gray-800 group-hover:stroke-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-sm text-gray-900 mb-1">
          {formatNumber(reel.likesCount || reel.likedBy?.length || 0)} likes
        </p>

        {/* Cuisine tag + time */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {reel.cuisineType && (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {reel.cuisineType}
            </span>
          )}
          {reel.createdAt && <span>{formatTimeAgo(reel.createdAt)}</span>}
        </div>

        {/* Order Buttons */}
        {(reel.orderLinks?.zomato || reel.orderLinks?.swiggy) && (
          <div className="flex gap-2 mt-3">
            {reel.orderLinks?.zomato && (
              <a
                href={reel.orderLinks.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Zomato
              </a>
            )}
            {reel.orderLinks?.swiggy && (
              <a
                href={reel.orderLinks.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Swiggy
              </a>
            )}
          </div>
        )}
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <CommentSection postId={reel._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReelCard;
