import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { formatTimeAgo, formatNumber } from "../../utils/helpers";
import { useFeedStore, useAuthStore } from "../../store/useStore";
import { reelsAPI } from "../../api/services";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import CommentSection from "./CommentSection";

const PostCard = ({ post }) => {
  const { user } = useAuthStore();
  const { toggleLike, toggleSave, incrementShareCount } = useFeedStore();

  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!post || !post._id) return null;

  const userId = user?._id;

  const isLiked =
    Array.isArray(post.likedBy || post.likes) && userId
      ? (post.likedBy || post.likes || []).includes(userId)
      : false;

  const isSaved =
    Array.isArray(post.savedBy || post.saves) && userId
      ? (post.savedBy || post.saves || []).includes(userId)
      : false;

  // ----------------------------
  // LIKE
  // ----------------------------
  const handleLike = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      // Optimistic update
      toggleLike(post._id, userId);

      await reelsAPI.toggleLike(post._id);
    } catch (error) {
      // rollback
      toggleLike(post._id, userId);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  // ----------------------------
  // SAVE
  // ----------------------------
  const handleSave = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    try {
      toggleSave(post._id, userId);
      await reelsAPI.saveReel(post._id);
      toast.success(isSaved ? "Removed from saved" : "Saved!");
    } catch (error) {
      toggleSave(post._id, userId); // rollback
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------
  // SHARE
  // ----------------------------
  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const shareUrl = `${window.location.origin}/post/${post._id}`;

      if (navigator.share) {
        await navigator.share({
          title: post.restaurant?.name || "Food Post",
          text: post.caption || "",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }

      incrementShareCount(post._id);
      reelsAPI.shareReel(post._id).catch(() => {});
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // ----------------------------
  // ORDER
  // ----------------------------
  const handleOrderNow = () => {
    const orderUrl =
      post.restaurant?.orderUrl ||
      "https://www.zomato.com/";

    window.open(orderUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden mb-6"
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between">
        <Link
          to={`/restaurant/${post.restaurant?._id || "#"}`}
          className="flex items-center gap-3"
        >
          <Avatar
            src={post.restaurant?.image}
            name={post.restaurant?.name || "Restaurant"}
            size="md"
          />
          <div>
            <h3 className="font-semibold">          {post.restaurant?.restaurantName || post.restaurant?.name}
        </h3>
            {post.restaurant?.address?.city && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {post.restaurant.address.city}
              </div>
            )}
          </div>
        </Link>

        <MoreVertical className="w-5 h-5 text-gray-600" />
      </div>

      {/* IMAGE */}
      <div className="aspect-square bg-gray-100">
        <img
          src={post.image}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ACTIONS */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-4">
            <button onClick={handleLike}>
              <Heart
                className={`w-7 h-7 ${
                  isLiked
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-gray-700"
                }`}
              />
            </button>

            <button onClick={() => setShowComments((p) => !p)}>
              <MessageCircle className="w-7 h-7 stroke-gray-700" />
            </button>

            <button onClick={handleShare}>
              <Share2 className="w-7 h-7 stroke-gray-700" />
            </button>
          </div>

          <button onClick={handleSave}>
            <Bookmark
              className={`w-7 h-7 ${
                isSaved
                  ? "fill-black stroke-black"
                  : "stroke-gray-700"
              }`}
            />
          </button>
        </div>

        {/* COUNTS */}
        <div className="text-sm font-semibold mb-2">
          {formatNumber(
            post.likes?.length ?? post.likesCount ?? 0
          )}{" "}
          likes
        </div>

        {/* CAPTION */}
        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-semibold mr-2">
              {post.restaurant?.restaurantName || post.restaurant?.name}
            </span>
            {post.caption}
          </p>
        )}

        {/* COMMENTS */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setShowComments((p) => !p)}
            className="text-sm text-gray-500 mb-2"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* TIME */}
        {post.createdAt && (
          <div className="text-xs text-gray-400 mb-4">
            {formatTimeAgo(post.createdAt)}
          </div>
        )}

        {/* ORDER BUTTON */}
        <button
          onClick={handleOrderNow}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          Order Now
        </button>
      </div>

      {/* COMMENT SECTION */}
      {showComments && (
        <div className="border-t">
          <CommentSection postId={post._id} />
        </div>
      )}
    </motion.article>
  );
};

export default PostCard;
