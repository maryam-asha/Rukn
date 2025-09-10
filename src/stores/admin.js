import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/services/api'

export const useAdminStore = defineStore('admin', () => {
  // State
  const passwordResets = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const getPasswordResetsWithFilters = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/admin/get_password_resets', { params })
      
      if (response.data.success) {
        passwordResets.value = response.data.data || []
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch password resets')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching password resets:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPasswordResetStatistics = async () => {
    try {
      const response = await api.get('/admin/password_reset_statistics')
      
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch statistics')
      }
    } catch (err) {
      console.error('Error fetching statistics:', err)
      throw err
    }
  }

  const changePasswordResetStatus = async (id, status, reason) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/admin/change_password_reset_status/${id}`, {
        status,
        reason
      })
      
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to update password reset status')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error updating password reset status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approvePasswordReset = async (id, reason) => {
    return await changePasswordResetStatus(id, 'approved', reason)
  }

  const rejectPasswordReset = async (id, reason) => {
    return await changePasswordResetStatus(id, 'rejected', reason)
  }

  // Getters
  const getPasswordResetById = (id) => {
    return passwordResets.value.find(reset => reset.id === id)
  }

  const getPasswordResetsByStatus = (status) => {
    return passwordResets.value.filter(reset => reset.status === status)
  }

  return {
    // State
    passwordResets,
    loading,
    error,
    
    // Actions
    getPasswordResetsWithFilters,
    getPasswordResetStatistics,
    changePasswordResetStatus,
    approvePasswordReset,
    rejectPasswordReset,
    
    // Getters
    getPasswordResetById,
    getPasswordResetsByStatus
  }
})