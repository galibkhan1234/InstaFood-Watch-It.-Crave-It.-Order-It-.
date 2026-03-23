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
  refreshToken: (refreshToken) => unwrap(api.post('/api/auth/refresh', { refreshToken })),
};

/* ================================
   PARTNER API
================================ */
export const partnerAuthAPI = {
  // Partner application (user applies to become partner)
  apply: (data) => unwrap(api.post('/api/partner/apply', data)),

  // These share the same auth system — partners use the same /api/auth endpoints
  register: (data) => unwrap(api.post('/api/auth/register', data)),
  login: (data) => unwrap(api.post('/api/auth/login', data)),
  logout: () => unwrap(api.post('/api/auth/logout')),
};

/* ================================
   REELS API
================================ */
export const reelsAPI = {
  // Feed — uses /api/feed endpoint
  getFeed: (page = 1) =>
    unwrap(api.get(`/api/feed?page=${page}`)),

  getSavedReels: () =>
    unwrap(api.get('/api/reels/saved')),

  // Upload reel — get signature then upload to Cloudinary
  getUploadSignature: (restaurantId) =>
    unwrap(api.post('/api/reels/signature', { restaurantId })),

  createReel: (data) =>
    unwrap(api.post('/api/reels', data)),


  /* ===== Engagement ===== */

  // Like / Unlike (backend toggle)
  toggleLike: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/like`)),

  // Save / Unsave (backend toggle)
  saveReel: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/save`)),

  // Share
  shareReel: (reelId, platform) =>
    unwrap(api.post(`/api/reels/${reelId}/share`, { platform })),

  // View increment
  incrementView: (reelId, watchTime = 0) =>
    unwrap(api.post(`/api/reels/${reelId}/view`, { watchTime })),

  // Product click tracking
  trackProductClick: (reelId) =>
    unwrap(api.post(`/api/reels/${reelId}/click-product`)),

  /* ===== Comments ===== */

  addComment: (reelId, data) =>
    unwrap(api.post(`/api/reels/${reelId}/comment`, data)),

  deleteComment: (reelId, commentId) =>
    unwrap(api.delete(`/api/reels/${reelId}/${commentId}`)),
};

/* ================================
   RESTAURANTS
================================ */
export const restaurantsAPI = {
  getAll: (params) =>
    unwrap(api.get('/api/restaurants', { params })),
  getById: (id) =>
    unwrap(api.get(`/api/restaurants/${id}`)),
  getNearby: (lat, lng, radius) =>
    unwrap(api.get(`/api/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius || 5}`)),
  create: (data) =>
    unwrap(api.post('/api/restaurants/create', data)),
  update: (id, data) =>
    unwrap(api.put(`/api/restaurants/${id}`, data)),
  delete: (id) =>
    unwrap(api.delete(`/api/restaurants/${id}`)),
  getMy: () =>
    unwrap(api.get('/api/restaurants/my')),
};

/* ================================
   ORDERS
================================ */
export const ordersAPI = {
  place: (data) =>
    unwrap(api.post('/api/orders', data)),
  getMyOrders: () =>
    unwrap(api.get('/api/orders/my')),
  getRestaurantOrders: (restaurantId) =>
    unwrap(api.get(`/api/orders/restaurant/${restaurantId}`)),
  updateStatus: (orderId, status) =>
    unwrap(api.patch(`/api/orders/${orderId}/status`, { status })),
  cancel: (orderId) =>
    unwrap(api.patch(`/api/orders/${orderId}/cancel`)),
};

/* ================================
   FOLLOW
================================ */
export const followAPI = {
  toggleFollow: (userId) =>
    unwrap(api.post(`/api/follow/${userId}/toggle`)),
  getFollowers: (userId) =>
    unwrap(api.get(`/api/follow/${userId}/followers`)),
  getFollowing: (userId) =>
    unwrap(api.get(`/api/follow/${userId}/following`)),
  checkStatus: (userId) =>
    unwrap(api.get(`/api/follow/${userId}/status`)),
};

export default api;
