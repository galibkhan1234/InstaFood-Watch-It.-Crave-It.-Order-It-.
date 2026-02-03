import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/services';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Set user
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.login(credentials);
          localStorage.setItem('token', data.token);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.register(userData);
          localStorage.setItem('token', data.token);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      // Fetch current user
      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const data = await authAPI.getCurrentUser();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Feed Store
export const useFeedStore = create((set, get) => ({
  posts: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  error: null,

  // Add post to feed
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  // Update post
  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId ? { ...post, ...updates } : post
      ),
    })),

  // Remove post
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    })),

  // Toggle like
  toggleLike: (postId, userId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post._id === postId) {
          const isLiked = post.likes?.includes(userId);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== userId)
              : [...(post.likes || []), userId],
            likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
          };
        }
        return post;
      }),
    })),

  // Toggle save
  toggleSave: (postId, userId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post._id === postId) {
          const isSaved = post.saves?.includes(userId);
          return {
            ...post,
            saves: isSaved
              ? post.saves.filter((id) => id !== userId)
              : [...(post.saves || []), userId],
            savesCount: isSaved ? post.savesCount - 1 : post.savesCount + 1,
          };
        }
        return post;
      }),
    })),

  // Increment share count
  incrementShareCount: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, sharesCount: (post.sharesCount || 0) + 1 }
          : post
      ),
    })),

  // Set posts
  setPosts: (posts) => set({ posts }),

  // Reset feed
  reset: () => set({ posts: [], currentPage: 1, hasMore: true }),
}));

// UI Store
export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,
  selectedPost: null,

  // Toggle mobile menu
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Close mobile menu
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Toggle search
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Open modal
  openModal: (modalName, data = null) =>
    set({ activeModal: modalName, selectedPost: data }),

  // Close modal
  closeModal: () => set({ activeModal: null, selectedPost: null }),
}));

// Location Store
export const useLocationStore = create(
  persist(
    (set) => ({
      userLocation: null,
      isLocationAllowed: false,

      // Set location
      setLocation: (location) =>
        set({ userLocation: location, isLocationAllowed: true }),

      // Clear location
      clearLocation: () =>
        set({ userLocation: null, isLocationAllowed: false }),
    }),
    {
      name: 'location-storage',
    }
  )
);