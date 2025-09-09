import { defineStore } from 'pinia'
import { companyService, reportService } from '@/services/api'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [],
    currentCompany: null,
    companySummary: null,
    loading: false,
    error: null
  }),

  getters: {
    transportationCompanies: (state) => state.companies.filter(company => company.type === 'transportation'),
    otherCompanies: (state) => state.companies.filter(company => company.type === 'other'),
    companyById: (state) => (id) => state.companies.find(company => company.id === id)
  },

  actions: {
    // Add Company (User)
    async addCompany(companyData) {
      this.loading = true
      this.error = null

      try {
        const response = await companyService.addCompany(companyData)
        const { data } = response

        if (data.success) {
          // Add new company to local state
          if (data.company) {
            this.companies.push(data.company)
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to add company'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add company'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get User Companies (User)
    async getUserCompanies() {
      this.loading = true
      this.error = null

      try {
        const response = await companyService.getUserCompanies()
        const { data } = response

        if (data.success) {
          this.companies = data.companies || []
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch companies'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch companies'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Update Company (User)
    async updateCompany(companyId, companyData) {
      this.loading = true
      this.error = null

      try {
        const response = await companyService.updateCompany(companyId, companyData)
        const { data } = response

        if (data.success) {
          // Update company in local state
          const companyIndex = this.companies.findIndex(company => company.id === companyId)
          if (companyIndex !== -1) {
            this.companies[companyIndex] = { ...this.companies[companyIndex], ...companyData }
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to update company'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update company'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete Company (User)
    async deleteCompany(companyId) {
      this.loading = true
      this.error = null

      try {
        const response = await companyService.deleteCompany(companyId)
        const { data } = response

        if (data.success) {
          // Remove company from local state
          this.companies = this.companies.filter(company => company.id !== companyId)
          // Clear current company if it was deleted
          if (this.currentCompany && this.currentCompany.id === companyId) {
            this.currentCompany = null
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to delete company'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete company'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get Company Summary (User)
    async getCompanySummary(companyId) {
      this.loading = true
      this.error = null

      try {
        const response = await reportService.getCompanySummary(companyId)
        const { data } = response

        if (data.success) {
          this.companySummary = data.summary
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch company summary'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch company summary'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Set Current Company
    setCurrentCompany(company) {
      this.currentCompany = company
    },

    // Clear Current Company
    clearCurrentCompany() {
      this.currentCompany = null
    },

    // Set error
    setError(error) {
      this.error = error
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Clear companies data
    clearCompanies() {
      this.companies = []
      this.currentCompany = null
      this.companySummary = null
    }
  }
})