import api from './axios';

// ============================================
// AUTH API (User Authentication)
// ============================================

export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user (you'll need to add this route to backend)
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ============================================
// PARTNER AUTH API (Restaurant Partner)
// ============================================

export const partnerAuthAPI = {
  // Register food partner
  register: async (partnerData) => {
    const response = await api.post('/partner/register', partnerData);
    return response.data;
  },

  // Login food partner
  login: async (credentials) => {
    const response = await api.post('/partner/login', credentials);
    return response.data;
  },

  // Logout partner
  logout: async () => {
    const response = await api.post('/partner/logout');
    return response.data;
  },

  // Get partner profile
  getProfile: async () => {
    const response = await api.get('/partner/profile');
    return response.data;
  },

  // Update partner profile
  updateProfile: async (profileData) => {
    const response = await api.put('/partner/update', profileData);
    return response.data;
  },
};

// ============================================
// REELS API (Food Reels/Posts)
// ============================================

export const reelsAPI = {
  // Get feed reels (this is your main feed)
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/reels?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Upload reel (partner only)
  uploadReel: async (reelData) => {
    const response = await api.post('/partner/reels', reelData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Like/unlike reel
  likeReel: async (reelId) => {
    const response = await api.post(`/reels/${reelId}/like`);
    return response.data;
  },

  // Unlike reel (same endpoint toggles)
  unlikeReel: async (reelId) => {
    const response = await api.post(`/reels/${reelId}/like`);
    return response.data;
  },

  // Increment view count
  incrementView: async (reelId) => {
    const response = await api.post(`/reels/${reelId}/view`);
    return response.data;
  },

  // Add comment
  addComment: async (reelId, commentData) => {
    const response = await api.post(`/reels/${reelId}/comments`, commentData);
    return response.data;
  },

  // Get comments
  getComments: async (reelId) => {
    const response = await api.get(`/reels/${reelId}/comments`);
    return response.data;
  },

  // Place order from reel
  placeOrder: async (reelId, orderData) => {
    const response = await api.post(`/reels/${reelId}/order`, orderData);
    return response.data;
  },

  // Redirect to platform (Zomato/Swiggy)
  redirectToPlatform: async (reelId, platform) => {
    const response = await api.get(`/reels/${reelId}/order/${platform}`);
    return response.data;
  },
};

// ============================================
// RESTAURANT API
// ============================================

export const restaurantsAPI = {
  // Follow/unfollow restaurant
  toggleFollow: async (restaurantId) => {
    const response = await api.post(`/restaurants/${restaurantId}/follow`);
    return response.data;
  },

  // Get nearby restaurants (you'll need to add this route)
  getNearby: async (latitude, longitude, maxDistance = 5000) => {
    const response = await api.get(
      `/restaurants/nearby?lat=${latitude}&lng=${longitude}&maxDistance=${maxDistance}`
    );
    return response.data;
  },

  // Search restaurants (you'll need to add this route)
  search: async (query) => {
    const response = await api.get(`/restaurants/search?q=${query}`);
    return response.data;
  },

  // Get restaurant details (you'll need to add this route)
  getRestaurant: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}`);
    return response.data;
  },

  // Get restaurant reels (you'll need to add this route)
  getRestaurantReels: async (restaurantId, page = 1, limit = 10) => {
    const response = await api.get(
      `/restaurants/${restaurantId}/reels?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  // Get user profile (you'll need to add this route)
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update profile (you'll need to add this route)
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Get saved reels (you'll need to add this route)
  getSavedReels: async (page = 1, limit = 10) => {
    const response = await api.get(`/users/saved?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Follow user (you'll need to add this route)
  followUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  // Unfollow user (you'll need to add this route)
  unfollowUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  },
};

// ============================================
// ALIAS: posts = reels (for compatibility)
// ============================================

export const postsAPI = {
  getFeed: reelsAPI.getFeed,
  createPost: reelsAPI.uploadReel,
  likePost: reelsAPI.likeReel,
  unlikePost: reelsAPI.unlikeReel,
  savePost: async (postId) => {
    // You'll need to add save functionality to backend
    console.log('Save post not implemented yet');
    return { success: true };
  },
  unsavePost: async (postId) => {
    // You'll need to add unsave functionality to backend
    console.log('Unsave post not implemented yet');
    return { success: true };
  },
  sharePost: async (postId) => {
    // Share functionality (just increment count on frontend for now)
    return { success: true };
  },
  addComment: reelsAPI.addComment,
  getComments: reelsAPI.getComments,
};

// Export default api instance
export default api;