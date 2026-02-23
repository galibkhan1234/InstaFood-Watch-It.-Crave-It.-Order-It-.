import api from './axios';

// Helper to unwrap axios response -> response.data
const unwrap = (promise) => promise.then((res) => res.data);

/* ================================
   USER AUTH API
================================ */
export const authAPI = {
  register: (data) => unwrap(api.post('/api/auth/register', data)),
  login: (data) => unwrap(api.post('/api/auth/login', data)),
  logout: () => unwrap(api.post('/api/auth/logout')),
  me: () => unwrap(api.get('/api/auth/me')),
  getUserProfile: (userId) => unwrap(api.get(`/api/auth/profile/${userId}`)),
  updateProfile: (data) => unwrap(api.put('/api/auth/profile', data)),
  getSavedReels: () => unwrap(api.get('/api/reels/saved')),
};

/* ================================
   PARTNER AUTH API
================================ */
export const partnerAuthAPI = {
  register: (data) => unwrap(api.post('/api/partner/register', data)),
  login: (data) => unwrap(api.post('/api/partner/login', data)),
  logout: () => unwrap(api.post('/api/partner/logout')),
  profile: () => unwrap(api.get('/api/partner/profile')),
  update: (data) => unwrap(api.put('/api/partner/update', data)),
  getStats: () => unwrap(api.get('/api/partner/stats')),
};

/* ================================
   REELS API
================================ */
export const reelsAPI = {
  // Feed
  getFeed: (page = 1) =>
    unwrap(api.get(`/api/reels?page=${page}`)),

  // Upload reel (partner)
  uploadReel: (formData, onProgress) =>
    api
      .post('/api/partner/reels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (!onProgress) return;
          const { loaded, total } = progressEvent;
          const percent = total
            ? Math.round((loaded * 100) / total)
            : 0;
          onProgress(percent);
        },
      })
      .then((res) => res.data),

  /* ===== Engagement ===== */

  // Like / Unlike (backend toggle)
  toggleLike: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/like`)),

  // Save / Unsave (backend toggle)
  saveReel: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/save`)),

  // Share
  shareReel: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/share`)),

  // View increment
  incrementView: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/view`)),

  /* ===== Comments ===== */

  addComment: (reelId, data) =>
    unwrap(api.post(`/api/reels/${reelId}/comments`, data)),

  getComments: (reelId) =>
    unwrap(api.get(`/api/reels/${reelId}/comments`)),

  /* ===== Orders ===== */

  // Track order (POST)
  placeOrder: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/order`)),

  // Redirect to Zomato / Swiggy (DO NOT unwrap)
  redirectOrder: (reelId, platform) =>
    `/api/reels/${reelId}/order/${platform}`,
};

/* ================================
   RESTAURANTS
================================ */
export const restaurantsAPI = {
  follow: (id) =>
    unwrap(api.post(`/api/restaurants/${id}/follow`)),
  getNearby: (lat, lng) =>
    unwrap(api.get(`/api/restaurants/nearby?lat=${lat}&lng=${lng}`)),
  search: (query) =>
    unwrap(api.get(`/api/restaurants/search?q=${encodeURIComponent(query)}`)),
};

/* ================================
   POSTS ALIAS (for old components)
================================ */

export const postsAPI = {
  getFeed: reelsAPI.getFeed,
  create: reelsAPI.uploadReel,
  saveReel: reelsAPI.saveReel,
  likePost: reelsAPI.toggleLike,
  viewPost: reelsAPI.incrementView,
  addComment: reelsAPI.addComment,
  getComments: reelsAPI.getComments,
  placeOrder: reelsAPI.placeOrder,
  redirectOrder: reelsAPI.redirectOrder,
};

export default api;
