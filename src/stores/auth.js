import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const passwordReset = async (formData) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Sending password reset request with data:', formData)
      
      const response = await api.post('/password-reset', formData)
      
      console.log('📡 Password reset response:', response.data)
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Password reset request sent successfully'
        }
      } else {
        error.value = response.data.message || 'Password reset failed'
        return {
          success: false,
          error: error.value
        }
      }
    } catch (err) {
      console.error('❌ Password reset error:', err)
      
      // Handle different types of errors
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors
        const firstError = Object.values(errors)[0]
        error.value = Array.isArray(firstError) ? firstError[0] : firstError
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/login', credentials)
      
      if (response.data.success) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('auth_token', token.value)
        
        return {
          success: true,
          user: user.value,
          token: token.value
        }
      } else {
        error.value = response.data.message || 'Login failed'
        return {
          success: false,
          error: error.value
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else {
        error.value = 'Login failed'
      }
      
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const checkAuth = () => {
    return !!token.value
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Actions
    passwordReset,
    login,
    logout,
    checkAuth
  }
})