import { defineStore } from 'pinia'
import { userService, passwordService } from '@/services/api'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    dashboard: {
      totalUsers: 0,
      pendingUsers: 0,
      acceptedUsers: 0,
      rejectedUsers: 0,
      blockedUsers: 0,
      totalPasswordResets: 0,
      pendingPasswordResets: 0,
      acceptedPasswordResets: 0,
      rejectedPasswordResets: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    userAcceptanceRate: (state) => {
      const total = state.dashboard.acceptedUsers + state.dashboard.rejectedUsers
      return total > 0 ? (state.dashboard.acceptedUsers / total) * 100 : 0
    },
    passwordResetAcceptanceRate: (state) => {
      const total = state.dashboard.acceptedPasswordResets + state.dashboard.rejectedPasswordResets
      return total > 0 ? (state.dashboard.acceptedPasswordResets / total) * 100 : 0
    }
  },

  actions: {
    // Get Dashboard Statistics
    async getDashboardStats() {
      this.loading = true
      this.error = null

      try {
        // Get users statistics
        const usersResponse = await userService.getUsers({ perPage: 1 })
        const passwordResetsResponse = await passwordService.getPasswordResets({ perPage: 1 })

        if (usersResponse.data.success && passwordResetsResponse.data.success) {
          const usersData = usersResponse.data
          const passwordResetsData = passwordResetsResponse.data

          // Calculate user statistics
          const totalUsers = usersData.total || 0
          const pendingUsers = usersData.pending_count || 0
          const acceptedUsers = usersData.accepted_count || 0
          const rejectedUsers = usersData.rejected_count || 0
          const blockedUsers = usersData.blocked_count || 0

          // Calculate password reset statistics
          const totalPasswordResets = passwordResetsData.total || 0
          const pendingPasswordResets = passwordResetsData.pending_count || 0
          const acceptedPasswordResets = passwordResetsData.accepted_count || 0
          const rejectedPasswordResets = passwordResetsData.rejected_count || 0

          this.dashboard = {
            totalUsers,
            pendingUsers,
            acceptedUsers,
            rejectedUsers,
            blockedUsers,
            totalPasswordResets,
            pendingPasswordResets,
            acceptedPasswordResets,
            rejectedPasswordResets
          }

          return { success: true, data: this.dashboard }
        } else {
          this.error = 'Failed to fetch dashboard statistics'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch dashboard statistics'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get Users with Filters
    async getUsersWithFilters(filters = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await userService.getUsers(filters)
        const { data } = response

        if (data.success) {
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch users'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get Password Resets with Filters
    async getPasswordResetsWithFilters(filters = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await passwordService.getPasswordResets(filters)
        const { data } = response

        if (data.success) {
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch password resets'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch password resets'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Bulk Actions
    async bulkChangeUserStatus(userIds, status, reason = '') {
      this.loading = true
      this.error = null

      try {
        const promises = userIds.map(userId => 
          userService.changeAccountStatus({
            user_id: userId,
            status: status,
            reason: reason
          })
        )

        const results = await Promise.allSettled(promises)
        const successful = results.filter(result => result.status === 'fulfilled' && result.value.data.success)
        const failed = results.filter(result => result.status === 'rejected' || !result.value.data.success)

        return {
          success: true,
          data: {
            successful: successful.length,
            failed: failed.length,
            total: userIds.length
          }
        }
      } catch (error) {
        this.error = error.message || 'Failed to perform bulk action'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async bulkChangePasswordResetStatus(passwordResetIds, status, reason = '') {
      this.loading = true
      this.error = null

      try {
        const promises = passwordResetIds.map(passwordResetId => 
          passwordService.changePasswordResetStatus({
            password_reset_id: passwordResetId,
            status: status,
            reason: reason
          })
        )

        const results = await Promise.allSettled(promises)
        const successful = results.filter(result => result.status === 'fulfilled' && result.value.data.success)
        const failed = results.filter(result => result.status === 'rejected' || !result.value.data.success)

        return {
          success: true,
          data: {
            successful: successful.length,
            failed: failed.length,
            total: passwordResetIds.length
          }
        }
      } catch (error) {
        this.error = error.message || 'Failed to perform bulk action'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Export Data
    async exportUsers(filters = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await userService.getUsers({ ...filters, export: true })
        const { data } = response

        if (data.success) {
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to export users'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to export users'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async exportPasswordResets(filters = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await passwordService.getPasswordResets({ ...filters, export: true })
        const { data } = response

        if (data.success) {
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to export password resets'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to export password resets'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Set error
    setError(error) {
      this.error = error
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Clear dashboard data
    clearDashboard() {
      this.dashboard = {
        totalUsers: 0,
        pendingUsers: 0,
        acceptedUsers: 0,
        rejectedUsers: 0,
        blockedUsers: 0,
        totalPasswordResets: 0,
        pendingPasswordResets: 0,
        acceptedPasswordResets: 0,
        rejectedPasswordResets: 0
      }
    }
  }
})