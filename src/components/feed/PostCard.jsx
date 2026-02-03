import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatTimeAgo, formatNumber } from '../../utils/helpers';
import { useFeedStore, useAuthStore } from '../../store/useStore';
import { postsAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
  const { user } = useAuthStore();
  const { toggleLike, toggleSave, incrementShareCount } = useFeedStore();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ SAFETY CHECK: Return null if post is undefined/null
  if (!post) {
    console.error('PostCard: post prop is undefined or null');
    return null;
  }

  // ✅ SAFETY CHECK: Ensure arrays exist with fallback to empty arrays
  const isLiked = Array.isArray(post.likes) ? post.likes.includes(user?._id) : false;
  const isSaved = Array.isArray(post.saves) ? post.saves.includes(user?._id) : false;

  const handleLike = async () => {
    if (isLiking || !post._id) return;
    setIsLiking(true);

    try {
      if (isLiked) {
        await postsAPI.unlikePost(post._id);
      } else {
        await postsAPI.likePost(post._id);
      }
      toggleLike(post._id, user._id);
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (isSaving || !post._id) return;
    setIsSaving(true);

    try {
      if (isSaved) {
        await postsAPI.unsavePost(post._id);
        toast.success('Removed from saved');
      } else {
        await postsAPI.savePost(post._id);
        toast.success('Added to saved');
      }
      toggleSave(post._id, user._id);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${post._id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Check out this food from ${post.restaurant?.name || 'a restaurant'}`,
          text: post.caption || 'Amazing food!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
      
      if (post._id) {
        await postsAPI.sharePost(post._id);
        incrementShareCount(post._id);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        toast.error('Failed to share');
      }
    }
  };

  const handleOrderNow = () => {
    toast.success('Redirecting to delivery platform...');
    // window.open('https://www.zomato.com/', '_blank');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link
          to={`/restaurant/${post.restaurant?._id || '#'}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar
            src={post.restaurant?.image}
            name={post.restaurant?.name || 'Restaurant'}
            size="md"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.restaurant?.name || 'Restaurant Name'}
            </h3>
            {post.restaurant?.location?.city && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{post.restaurant.location.city}</span>
              </div>
            )}
          </div>
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={post.image || 'https://via.placeholder.com/600x600?text=Food+Image'}
          alt={post.caption || 'Food post'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x600?text=Food+Image';
          }}
        />
        
        {/* Cuisine Tag */}
        {post.cuisine && (
          <div className="absolute top-3 left-3">
            <span className="badge bg-white/90 backdrop-blur-sm text-gray-900 shadow-md">
              {post.cuisine}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="group relative"
            >
              <Heart
                className={`w-7 h-7 transition-all ${
                  isLiked
                    ? 'fill-red-500 stroke-red-500'
                    : 'stroke-gray-700 group-hover:scale-110'
                }`}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:scale-110 transition-transform"
            >
              <MessageCircle className="w-7 h-7 stroke-gray-700" />
            </button>
            <button
              onClick={handleShare}
              className="hover:scale-110 transition-transform"
            >
              <Share2 className="w-7 h-7 stroke-gray-700" />
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="hover:scale-110 transition-transform"
          >
            <Bookmark
              className={`w-7 h-7 ${
                isSaved
                  ? 'fill-gray-900 stroke-gray-900'
                  : 'stroke-gray-700'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mb-2">
          <button className="font-semibold text-gray-900 text-sm">
            {formatNumber(post.likesCount || 0)} likes
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <Link
              to={`/restaurant/${post.restaurant?._id || '#'}`}
              className="font-semibold text-gray-900 mr-2"
            >
              {post.restaurant?.name || 'Restaurant'}
            </Link>
            <span className="text-gray-700">{post.caption}</span>
          </div>
        )}

        {/* View Comments */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Time */}
        {post.createdAt && (
          <time className="text-xs text-gray-500 uppercase block mb-4">
            {formatTimeAgo(post.createdAt)}
          </time>
        )}

        {/* Order Now Button */}
        <button
          onClick={handleOrderNow}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          Order Now
        </button>
      </div>

      {/* Comments Section (if expanded) */}
      {showComments && (
        <div className="border-t border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Comments coming soon...</p>
        </div>
      )}
    </motion.article>
  );
};

export default PostCard;