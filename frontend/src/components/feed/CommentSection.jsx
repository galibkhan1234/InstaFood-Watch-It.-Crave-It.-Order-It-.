import { useEffect, useState } from 'react';
import { reelsAPI } from '../../api/services';
import { useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const data = await reelsAPI.addComment(postId, { text: '' });
      setComments(data.comments || []);
    } catch (err) {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);

    try {
      const data = await reelsAPI.addComment(postId, { text });

      setComments((prev) => [data, ...prev]);

      setText('');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-blue-600 font-semibold text-sm"
        >
          Post
        </button>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="text-sm">
            <span className="font-semibold mr-2">
              {comment.user?.fullName || 'User'}
            </span>
            <span>{comment.text}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
