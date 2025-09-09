import { defineStore } from 'pinia'
import { fineService } from '@/services/api'

export const useFineStore = defineStore('fine', {
  state: () => ({
    fines: [],
    currentFine: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    }
  }),

  getters: {
    leftSideFines: (state) => state.fines.filter(fine => fine.side === 'left'),
    rightSideFines: (state) => state.fines.filter(fine => fine.side === 'right'),
    fineById: (state) => (id) => state.fines.find(fine => fine.id === id),
    totalFinesAmount: (state) => state.fines.reduce((sum, fine) => sum + parseFloat(fine.amount || 0), 0),
    finesByDriver: (state) => (driverName) => state.fines.filter(fine => 
      fine.driver_name.toLowerCase().includes(driverName.toLowerCase())
    ),
    finesByCar: (state) => (carNumber) => state.fines.filter(fine => 
      fine.car_number.includes(carNumber)
    ),
    finesByDateRange: (state) => (startDate, endDate) => {
      return state.fines.filter(fine => {
        const fineDate = new Date(fine.fine_date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return fineDate >= start && fineDate <= end
      })
    }
  },

  actions: {
    // Add Fine (User)
    async addFine(fineData) {
      this.loading = true
      this.error = null

      try {
        const response = await fineService.addFine(fineData)
        const { data } = response

        if (data.success) {
          // Add new fine to local state
          if (data.fine) {
            this.fines.unshift(data.fine)
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to add fine'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add fine'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Update Fine (User)
    async updateFine(fineId, fineData) {
      this.loading = true
      this.error = null

      try {
        const response = await fineService.updateFine(fineId, fineData)
        const { data } = response

        if (data.success) {
          // Update fine in local state
          const fineIndex = this.fines.findIndex(fine => fine.id === fineId)
          if (fineIndex !== -1) {
            this.fines[fineIndex] = { ...this.fines[fineIndex], ...fineData }
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to update fine'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update fine'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete Fine (User)
    async deleteFine(fineId, fineData) {
      this.loading = true
      this.error = null

      try {
        const response = await fineService.deleteFine(fineId, fineData)
        const { data } = response

        if (data.success) {
          // Remove fine from local state
          this.fines = this.fines.filter(fine => fine.id !== fineId)
          // Clear current fine if it was deleted
          if (this.currentFine && this.currentFine.id === fineId) {
            this.currentFine = null
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to delete fine'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete fine'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get Company Fines (User)
    async getCompanyFines(companyId, params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await fineService.getCompanyFines(companyId, params)
        const { data } = response

        if (data.success) {
          this.fines = data.data || []
          this.pagination = {
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
            per_page: data.per_page || 15,
            total: data.total || 0
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch fines'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch fines'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Set Current Fine
    setCurrentFine(fine) {
      this.currentFine = fine
    },

    // Clear Current Fine
    clearCurrentFine() {
      this.currentFine = null
    },

    // Filter fines by side
    filterBySide(side) {
      if (side === 'all') {
        return this.fines
      }
      return this.fines.filter(fine => fine.side === side)
    },

    // Search fines by driver name
    searchByDriver(driverName) {
      return this.fines.filter(fine => 
        fine.driver_name.toLowerCase().includes(driverName.toLowerCase())
      )
    },

    // Search fines by car number
    searchByCar(carNumber) {
      return this.fines.filter(fine => 
        fine.car_number.includes(carNumber)
      )
    },

    // Get fines statistics
    getFinesStatistics() {
      const totalFines = this.fines.length
      const totalAmount = this.totalFinesAmount
      const leftSideCount = this.leftSideFines.length
      const rightSideCount = this.rightSideFines.length
      const averageAmount = totalFines > 0 ? totalAmount / totalFines : 0

      return {
        totalFines,
        totalAmount,
        leftSideCount,
        rightSideCount,
        averageAmount
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

    // Clear fines data
    clearFines() {
      this.fines = []
      this.currentFine = null
      this.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
      }
    }
  }
})