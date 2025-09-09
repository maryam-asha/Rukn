import { defineStore } from 'pinia'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    userType: null, // 'admin' or 'user'
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.userType === 'admin',
    isUser: (state) => state.userType === 'user',
    userName: (state) => state.user?.name || state.user?.user_name || '',
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.id || null
  },

  actions: {
    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      const userType = localStorage.getItem('user_type')

      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
        this.userType = userType
        this.isAuthenticated = true
      }
    },

    // Admin Login
    async adminLogin(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.adminLogin(credentials)
        const { data } = response

        if (data.success) {
          this.token = data.token
          this.user = data.user
          this.userType = 'admin'
          this.isAuthenticated = true

          // Save to localStorage
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user_data', JSON.stringify(data.user))
          localStorage.setItem('user_type', 'admin')

          return { success: true, data: data }
        } else {
          this.error = data.message || 'Login failed'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // User Login
    async userLogin(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.userLogin(credentials)
        const { data } = response

        if (data.success) {
          this.token = data.token
          this.user = data.user
          this.userType = 'user'
          this.isAuthenticated = true

          // Save to localStorage
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user_data', JSON.stringify(data.user))
          localStorage.setItem('user_type', 'user')

          return { success: true, data: data }
        } else {
          this.error = data.message || 'Login failed'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // User Register
    async userRegister(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.userRegister(userData)
        const { data } = response

        if (data.success) {
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Registration failed'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout() {
      this.loading = true
      this.error = null

      try {
        if (this.isAdmin) {
          await authService.adminLogout()
        } else {
          await authService.userLogout()
        }
      } catch (error) {
        console.error('Logout error:', error)
        // Continue with logout even if API call fails
      } finally {
        this.clearAuth()
        this.loading = false
      }
    },

    // Clear authentication data
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.userType = null
      this.error = null

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_type')
    },

    // Set error
    setError(error) {
      this.error = error
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Update user data
    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user_data', JSON.stringify(this.user))
    }
  }
})