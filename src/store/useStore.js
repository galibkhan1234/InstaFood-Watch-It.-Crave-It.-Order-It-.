import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, partnerAuthAPI } from '../api/services';

//   AUTH STORE (User + Partner)

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({ user, isAuthenticated: Boolean(user) }),

      /* ---------- USER REGISTER ---------- */
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authAPI.register(data);
          localStorage.setItem('token', res.token);

          set({
            user: { ...res.user, userType: 'user' },
            isAuthenticated: true,
            isLoading: false,
          });

          return res;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      /* ---------- USER LOGIN ---------- */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.login(credentials);
          localStorage.setItem('token', data.token);

          set({
            user: { ...data.user, userType: 'user' },
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      /* ---------- PARTNER REGISTER ---------- */
      partnerRegister: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await partnerAuthAPI.register(data);
          localStorage.setItem('token', res.token);

          set({
            user: {
              ...res.partner,
              _id: res.partner._id || res.partner.id,
              userType: 'partner',
            },
            isAuthenticated: true,
            isLoading: false,
          });

          return res;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Partner registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      /* ---------- PARTNER LOGIN ---------- */
      partnerLogin: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await partnerAuthAPI.login(credentials);
          localStorage.setItem('token', data.token);

          set({
            user: {
              ...data.partner,
              _id: data.partner._id || data.partner.id,
              userType: 'partner',
            },
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Partner login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      /* ---------- LOGOUT ---------- */
      logout: async () => {
        try {
          const user = get().user;
          if (user?.userType === 'partner') {
            await partnerAuthAPI.logout();
          } else {
            await authAPI.logout();
          }
        } catch (_) {
          // ignore
        } finally {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        }
      },

      /* ---------- AUTO FETCH USER ---------- */
      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const data = await authAPI.me();
          set({
            user: { ...data.user, userType: 'user' },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          try {
            const pdata = await partnerAuthAPI.profile();
            set({
              user: {
                ...pdata.partner,
                _id: pdata.partner._id || pdata.partner.id,
                userType: 'partner',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

//   FEED STORE (REELS)

export const useFeedStore = create((set) => ({
  reels: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  error: null,

  /* ---------- SETTERS ---------- */
  setReels: (reels = []) => set({ reels }),
  appendReels: (reels = []) =>
    set((s) => ({ reels: [...s.reels, ...reels] })),

  setPage: (page) => set({ currentPage: page }),
  setHasMore: (val) => set({ hasMore: val }),
  setLoading: (val) => set({ isLoading: val }),

  /* ---------- CRUD ---------- */
  addReel: (reel) =>
    set((s) => ({ reels: [reel, ...s.reels] })),

  updateReel: (id, updates) =>
    set((s) => ({
      reels: s.reels.map((r) =>
        r._id === id ? { ...r, ...updates } : r
      ),
    })),

  removeReel: (id) =>
    set((s) => ({
      reels: s.reels.filter((r) => r._id !== id),
    })),

  /* ---------- OPTIMISTIC LIKE ---------- */
  toggleLike: (reelId, userId) =>
    set((state) => ({
      reels: state.reels.map((reel) => {
        if (reel._id !== reelId) return reel;

        const likedBy = reel.likedBy || [];
        const isLiked = likedBy.includes(userId);

        return {
          ...reel,
          likedBy: isLiked
            ? likedBy.filter((id) => id !== userId)
            : [...likedBy, userId],
          likesCount: isLiked
            ? Math.max((reel.likesCount || 1) - 1, 0)
            : (reel.likesCount || 0) + 1,
        };
      }),
    })),

  /* ---------- OPTIMISTIC SAVE ---------- */
  toggleSave: (reelId, userId) =>
    set((state) => ({
      reels: state.reels.map((reel) => {
        if (reel._id !== reelId) return reel;

        const savedBy = reel.savedBy || [];
        const isSaved = savedBy.includes(userId);

        return {
          ...reel,
          savedBy: isSaved
            ? savedBy.filter((id) => id !== userId)
            : [...savedBy, userId],
        };
      }),
    })),

  /* ---------- SHARE COUNT ---------- */
  incrementShareCount: (reelId) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel._id === reelId
          ? { ...reel, sharesCount: (reel.sharesCount || 0) + 1 }
          : reel
      ),
    })),

  /* ---------- COMMENTS ---------- */
  addCommentToReel: (reelId, comment) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              comments: [...(reel.comments || []), comment],
              commentsCount: (reel.commentsCount || 0) + 1,
            }
          : reel
      ),
    })),

  /* ---------- VIEWS ---------- */
  incrementView: (reelId) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              viewsCount: (reel.viewsCount || 0) + 1,
            }
          : reel
      ),
    })),

  /* ---------- RESET ---------- */
  resetFeed: () =>
    set({
      reels: [],
      currentPage: 1,
      hasMore: true,
      isLoading: false,
      error: null,
    }),
}));

//   UI STORE

export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,
  selectedPost: null,

  toggleMobileMenu: () =>
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),

  toggleSearch: () =>
    set((s) => ({ isSearchOpen: !s.isSearchOpen })),

  openModal: (name, data = null) =>
    set({ activeModal: name, selectedPost: data }),

  closeModal: () =>
    set({ activeModal: null, selectedPost: null }),
}));

// LOCATION STORE

export const useLocationStore = create(
  persist(
    (set) => ({
      userLocation: null,
      isLocationAllowed: false,

      setLocation: (loc) =>
        set({ userLocation: loc, isLocationAllowed: true }),

      clearLocation: () =>
        set({ userLocation: null, isLocationAllowed: false }),
    }),
    { name: 'location-storage' }
  )
);
