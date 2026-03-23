import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Video,
  X,
  Play,
  Pause,
  ArrowLeft,
  AlertCircle,
  FileVideo,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { reelsAPI } from '../../api/services';
import toast from 'react-hot-toast';

const UploadReel = () => {
  const navigate = useNavigate();
  const { user: partner } = useAuthStore();

  const videoInputRef = useRef(null);
  const videoRef = useRef(null);

  // Form State - matching backend fields
  const [formData, setFormData] = useState({
    foodName: '',
    caption: '',
    cuisineType: '',
    price: '',
    zomatoUrl: '',
    swiggyUrl: '',
  });

  // Video State
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cuisine Types - matching your backend
  const cuisineTypes = [
    'North Indian',
    'South Indian',
    'Indian',
    'Chinese',
    'Italian',
    'Fast Food',
    'Desserts',
    'Beverages',
    'Street Food',
    'Continental',
    'Mexican',
    'Thai',
    'Japanese',
    'Other',
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle video file selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Validate file size (max 50MB - matching backend)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('Video file size should not exceed 50MB');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, video: '' }));
  };

  // Remove video
  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Toggle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    }
    if (!formData.cuisineType) {
      newErrors.cuisineType = 'Cuisine type is required';
    }
    if (!videoFile) {
      newErrors.video = 'Video is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      toast.loading('Initializing upload...', { id: 'upload' });

      // 1. Get partner's restaurant ID
      const { restaurantsAPI } = await import('../../api/services');
      const myRestaurantsRes = await restaurantsAPI.getMy();
      const restaurantId = myRestaurantsRes.restaurants?.[0]?._id;

      if (!restaurantId) {
        throw new Error('No restaurant found for your account. Please set up your restaurant first.');
      }

      // 2. Get secure upload signature from our backend
      const sigData = await reelsAPI.getUploadSignature(restaurantId);
      const { timestamp, signature, cloudName, apiKey, folder, allowedFormats } = sigData;

      // 3. Upload video directly to Cloudinary (bypasses our Node.js server)
      toast.loading('Uploading video to Cloudinary...', { id: 'upload' });

      const cloudFormData = new FormData();
      cloudFormData.append('file', videoFile);
      cloudFormData.append('api_key', apiKey);
      cloudFormData.append('timestamp', timestamp);
      cloudFormData.append('signature', signature);
      cloudFormData.append('folder', folder);
      cloudFormData.append('allowed_formats', allowedFormats);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: cloudFormData,
        }
      );

      const cloudData = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) {
        throw new Error(cloudData.error?.message || 'Cloudinary upload failed');
      }

      const videoUrl = cloudData.secure_url;
      setUploadProgress(100);

      // 4. Create actual reel entry in our database
      toast.loading('Saving reel details...', { id: 'upload' });

      await reelsAPI.createReel({
        restaurantId,
        videoUrl,
        caption: `${formData.foodName} - ${formData.caption}`,
        // taggedProducts could be added here if we supported product creation flow
      });

      toast.success('Reel published successfully!', { id: 'upload' });

      // Navigate back to dashboard
      setTimeout(() => navigate('/partner/dashboard'), 500);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Failed to upload reel',
        { id: 'upload' }
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/partner/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              disabled={isUploading}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upload Reel</h1>
              <p className="text-sm text-gray-600">
                Share your delicious creations with food lovers
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Video Upload */}
            <div className="space-y-6">
              {/* Video Upload */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Video *
                </label>

                {!videoPreview ? (
                  <div
                    onClick={() => !isUploading && videoInputRef.current?.click()}
                    className={`relative border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-violet-500 hover:bg-violet-50/50 transition-all ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } group`}
                  >
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileVideo className="w-8 h-8 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Video
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, MOV, AVI up to 50MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full aspect-[9/16] object-cover rounded-2xl bg-black"
                      onEnded={() => setIsPlaying(false)}
                    />

                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={togglePlayPause}
                        disabled={isUploading}
                        className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-gray-900" />
                        ) : (
                          <Play className="w-8 h-8 text-gray-900 ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Remove Button */}
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    )}

                    {/* File Info */}
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate">
                        {videoFile?.name}
                      </span>
                      <span className="text-gray-500">
                        {(videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}

                {errors.video && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.video}
                  </p>
                )}
              </div>

              {/* Upload Tips */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-amber-600" />
                  Video Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Keep videos under 60 seconds for best engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Use good lighting to showcase your food</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Vertical format (9:16) works best</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Add background music for better appeal</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Reel Details
                </h2>

                <div className="space-y-5">
                  {/* Food Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Name *
                    </label>
                    <input
                      type="text"
                      name="foodName"
                      value={formData.foodName}
                      onChange={handleChange}
                      placeholder="e.g., Butter Chicken"
                      disabled={isUploading}
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.foodName ? 'border-red-300' : 'border-gray-200'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.foodName && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.foodName}
                      </p>
                    )}
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caption
                    </label>
                    <textarea
                      name="caption"
                      value={formData.caption}
                      onChange={handleChange}
                      placeholder="Describe your dish, cooking style, or what makes it special..."
                      rows={4}
                      disabled={isUploading}
                      className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  </div>

                  {/* Cuisine Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type *
                    </label>
                    <select
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleChange}
                      disabled={isUploading}
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.cuisineType ? 'border-red-300' : 'border-gray-200'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select cuisine type</option>
                      {cuisineTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.cuisineType && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.cuisineType}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-gray-500 text-xs">Optional</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="299"
                      min="0"
                      step="0.01"
                      disabled={isUploading}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Order Links Section */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Order Links
                </h2>
                <p className="text-sm text-gray-600 mb-5">
                  Add links to your restaurant on delivery platforms
                </p>

                <div className="space-y-4">
                  {/* Zomato URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zomato URL
                    </label>
                    <input
                      type="url"
                      name="zomatoUrl"
                      value={formData.zomatoUrl}
                      onChange={handleChange}
                      placeholder="https://www.zomato.com/..."
                      disabled={isUploading}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Swiggy URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Swiggy URL
                    </label>
                    <input
                      type="url"
                      name="swiggyUrl"
                      value={formData.swiggyUrl}
                      onChange={handleChange}
                      placeholder="https://www.swiggy.com/..."
                      disabled={isUploading}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading... {uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Reel</span>
                    </>
                  )}
                </button>

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Please wait while your reel is being uploaded...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UploadReel;