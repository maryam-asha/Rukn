import { defineStore } from 'pinia'
import { userService, passwordService } from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    passwordResets: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0
    },
    statistics: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      blocked: 0
    }
  }),

  getters: {
    pendingUsers: (state) => state.users.filter(user => user.status === 'pending'),
    acceptedUsers: (state) => state.users.filter(user => user.status === 'accepted'),
    rejectedUsers: (state) => state.users.filter(user => user.status === 'rejected'),
    blockedUsers: (state) => state.users.filter(user => user.is_blocked === true),
    activeUsers: (state) => state.users.filter(user => user.is_blocked === false)
  },

  actions: {
    // Get Users (Admin)
    async getUsers(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await userService.getUsers(params)
        const { data } = response

        if (data.success) {
          this.users = data.data || []
          this.pagination = {
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
            per_page: data.per_page || 12,
            total: data.total || 0
          }
          
          // Update statistics
          this.statistics = {
            total: data.total || 0,
            pending: data.pending_count || 0,
            accepted: data.accepted_count || 0,
            rejected: data.rejected_count || 0,
            blocked: data.blocked_count || 0
          }
          
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

    // Change Account Status (Admin)
    async changeAccountStatus(userId, status, reason = '') {
      this.loading = true
      this.error = null

      try {
        const data = {
          user_id: userId,
          status: status,
          reason: reason
        }

        const response = await userService.changeAccountStatus(data)
        const { data: responseData } = response

        if (responseData.success) {
          // Update user status in local state
          const userIndex = this.users.findIndex(user => user.id === userId)
          if (userIndex !== -1) {
            this.users[userIndex].status = status
            if (reason) {
              this.users[userIndex].reason = reason
            }
          }
          return { success: true, data: responseData }
        } else {
          this.error = responseData.message || 'Failed to change account status'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to change account status'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Toggle Block User (Admin)
    async toggleBlockUser(userId) {
      this.loading = true
      this.error = null

      try {
        const response = await userService.toggleBlockUser(userId)
        const { data } = response

        if (data.success) {
          // Update user block status in local state
          const userIndex = this.users.findIndex(user => user.id === userId)
          if (userIndex !== -1) {
            this.users[userIndex].is_blocked = !this.users[userIndex].is_blocked
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to toggle block status'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to toggle block status'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete User (Admin)
    async deleteUser(userId) {
      this.loading = true
      this.error = null

      try {
        const response = await userService.deleteUser(userId)
        const { data } = response

        if (data.success) {
          // Remove user from local state
          this.users = this.users.filter(user => user.id !== userId)
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to delete user'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get Password Resets (Admin)
    async getPasswordResets(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await passwordService.getPasswordResets(params)
        const { data } = response

        if (data.success) {
          this.passwordResets = data.data || []
          this.pagination = {
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
            per_page: data.per_page || 12,
            total: data.total || 0
          }
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

    // Change Password Reset Status (Admin)
    async changePasswordResetStatus(passwordResetId, status, reason = '') {
      this.loading = true
      this.error = null

      try {
        const data = {
          password_reset_id: passwordResetId,
          status: status,
          reason: reason
        }

        const response = await passwordService.changePasswordResetStatus(data)
        const { data: responseData } = response

        if (responseData.success) {
          // Update password reset status in local state
          const resetIndex = this.passwordResets.findIndex(reset => reset.id === passwordResetId)
          if (resetIndex !== -1) {
            this.passwordResets[resetIndex].status = status
            if (reason) {
              this.passwordResets[resetIndex].reason = reason
            }
          }
          return { success: true, data: responseData }
        } else {
          this.error = responseData.message || 'Failed to change password reset status'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to change password reset status'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Password Reset Request (User)
    async passwordReset(userName, newPassword, newPasswordConfirmation) {
      this.loading = true
      this.error = null

      try {
        const data = {
          user_name: userName,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation
        }

        const response = await passwordService.passwordReset(data)
        const { data: responseData } = response

        if (responseData.success) {
          return { success: true, data: responseData }
        } else {
          this.error = responseData.message || 'Password reset request failed'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Password reset request failed'
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

    // Clear users data
    clearUsers() {
      this.users = []
      this.passwordResets = []
      this.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
      }
      this.statistics = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        blocked: 0
      }
    }
  }
})