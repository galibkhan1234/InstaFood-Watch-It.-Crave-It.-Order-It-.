import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { postsAPI } from '../../api/services';
import { useFeedStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const CreatePost = ({ isOpen, onClose }) => {
  const { addPost } = useFeedStore();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);
      
      const data = await postsAPI.createPost(formData);
      addPost(data.post);
      toast.success('Post created successfully!');
      
      // Reset form
      setImage(null);
      setPreview(null);
      setCaption('');
      onClose();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Post">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Image Upload */}
        <div className="mb-4">
          {preview ? (
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-600">Click to upload image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Caption */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Share Post
        </Button>
      </form>
    </Modal>
  );
};

export default CreatePost;