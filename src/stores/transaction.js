import { defineStore } from 'pinia'
import { transactionService } from '@/services/api'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    currentTransaction: null,
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
    incomeTransactions: (state) => state.transactions.filter(transaction => transaction.transaction_type === 'in'),
    outcomeTransactions: (state) => state.transactions.filter(transaction => transaction.transaction_type === 'out'),
    transactionById: (state) => (id) => state.transactions.find(transaction => transaction.id === id),
    totalIncome: (state) => state.transactions
      .filter(transaction => transaction.transaction_type === 'in')
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0),
    totalOutcome: (state) => state.transactions
      .filter(transaction => transaction.transaction_type === 'out')
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0),
    netAmount: (state) => {
      const income = state.transactions
        .filter(transaction => transaction.transaction_type === 'in')
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      const outcome = state.transactions
        .filter(transaction => transaction.transaction_type === 'out')
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      return income - outcome
    }
  },

  actions: {
    // Add Transaction (User)
    async addTransaction(transactionData) {
      this.loading = true
      this.error = null

      try {
        const response = await transactionService.addTransaction(transactionData)
        const { data } = response

        if (data.success) {
          // Add new transaction to local state
          if (data.transaction) {
            this.transactions.unshift(data.transaction)
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to add transaction'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add transaction'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Update Transaction (User)
    async updateTransaction(transactionId, transactionData) {
      this.loading = true
      this.error = null

      try {
        const response = await transactionService.updateTransaction(transactionId, transactionData)
        const { data } = response

        if (data.success) {
          // Update transaction in local state
          const transactionIndex = this.transactions.findIndex(transaction => transaction.id === transactionId)
          if (transactionIndex !== -1) {
            this.transactions[transactionIndex] = { ...this.transactions[transactionIndex], ...transactionData }
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to update transaction'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update transaction'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete Transaction (User)
    async deleteTransaction(transactionId, transactionData) {
      this.loading = true
      this.error = null

      try {
        const response = await transactionService.deleteTransaction(transactionId, transactionData)
        const { data } = response

        if (data.success) {
          // Remove transaction from local state
          this.transactions = this.transactions.filter(transaction => transaction.id !== transactionId)
          // Clear current transaction if it was deleted
          if (this.currentTransaction && this.currentTransaction.id === transactionId) {
            this.currentTransaction = null
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to delete transaction'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete transaction'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get Company Transactions (User)
    async getCompanyTransactions(companyId, params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await transactionService.getCompanyTransactions(companyId, params)
        const { data } = response

        if (data.success) {
          this.transactions = data.data || []
          this.pagination = {
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
            per_page: data.per_page || 15,
            total: data.total || 0
          }
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch transactions'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch transactions'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Set Current Transaction
    setCurrentTransaction(transaction) {
      this.currentTransaction = transaction
    },

    // Clear Current Transaction
    clearCurrentTransaction() {
      this.currentTransaction = null
    },

    // Filter transactions by type
    filterByType(type) {
      if (type === 'all') {
        return this.transactions
      }
      return this.transactions.filter(transaction => transaction.transaction_type === type)
    },

    // Filter transactions by date range
    filterByDateRange(startDate, endDate) {
      return this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return transactionDate >= start && transactionDate <= end
      })
    },

    // Search transactions by customer name
    searchByCustomer(customerName) {
      return this.transactions.filter(transaction => 
        transaction.customer_name.toLowerCase().includes(customerName.toLowerCase())
      )
    },

    // Set error
    setError(error) {
      this.error = error
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Clear transactions data
    clearTransactions() {
      this.transactions = []
      this.currentTransaction = null
      this.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
      }
    }
  }
})