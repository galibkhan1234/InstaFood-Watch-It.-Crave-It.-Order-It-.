import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatTimeAgo } from '../../utils/helpers';
import { postsAPI } from '../../api/services';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const data = await postsAPI.getComments(postId);
      setComments(data.comments);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const data = await postsAPI.addComment(postId, { text: newComment });
      setComments([data.comment, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Avatar src={user?.avatar} name={user?.fullName} size="sm" />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Avatar
                src={comment.user?.avatar}
                name={comment.user?.fullName}
                size="sm"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <p className="font-semibold text-sm">{comment.user?.fullName}</p>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {formatTimeAgo(comment.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;