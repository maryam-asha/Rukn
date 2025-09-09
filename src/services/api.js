import axios from 'axios'

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_TIMEOUT = 30000

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Helper function to create form data
const createFormData = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  return formData
}

// Auth Services
export const authService = {
  // Admin Login
  adminLogin: (credentials) => {
    const formData = createFormData(credentials)
    return api.post('/api/admin/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Admin Logout
  adminLogout: () => {
    return api.post('/api/admin/logout')
  },

  // User Register
  userRegister: (userData) => {
    const formData = createFormData(userData)
    return api.post('/api/user/register_request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // User Login
  userLogin: (credentials) => {
    const formData = createFormData(credentials)
    return api.post('/api/user/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // User Logout
  userLogout: () => {
    return api.post('/api/user/logout')
  }
}

// User Management Services
export const userService = {
  // Get Users (Admin)
  getUsers: (params = {}) => {
    return api.get('/api/admin/get_users', { params })
  },

  // Change Account Status (Admin)
  changeAccountStatus: (data) => {
    const formData = createFormData(data)
    return api.post('/api/admin/change_account_status', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Toggle Block User (Admin)
  toggleBlockUser: (userId) => {
    const formData = createFormData({ user_id: userId })
    return api.post('/api/admin/toggle_block_user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete User (Admin)
  deleteUser: (userId) => {
    return api.delete(`/api/admin/delete_user/${userId}`)
  }
}

// Password Management Services
export const passwordService = {
  // Get Password Resets (Admin)
  getPasswordResets: (params = {}) => {
    return api.get('/api/admin/get_password_resets', { params })
  },

  // Change Password Reset Status (Admin)
  changePasswordResetStatus: (data) => {
    const formData = createFormData(data)
    return api.post('/api/admin/change_password_reset_status', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Password Reset Request (User)
  passwordReset: (data) => {
    const formData = createFormData(data)
    return api.post('/api/user/add_password_reset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Company Management Services
export const companyService = {
  // Add Company (User)
  addCompany: (data) => {
    const formData = createFormData(data)
    return api.post('/api/user/add_company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Get User Companies (User)
  getUserCompanies: () => {
    return api.get('/api/user/get_user_companies')
  },

  // Update Company (User)
  updateCompany: (companyId, data) => {
    const formData = createFormData(data)
    return api.post(`/api/user/update_company/${companyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete Company (User)
  deleteCompany: (companyId) => {
    return api.delete(`/api/user/delete_company/${companyId}`)
  }
}

// Transaction Management Services
export const transactionService = {
  // Add Transaction (User)
  addTransaction: (data) => {
    const formData = createFormData(data)
    return api.post('/api/user/add_transaction', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update Transaction (User)
  updateTransaction: (transactionId, data) => {
    const formData = createFormData(data)
    return api.post(`/api/user/update_transaction/${transactionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete Transaction (User)
  deleteTransaction: (transactionId, data) => {
    const formData = createFormData(data)
    return api.delete(`/api/user/delete_transaction/${transactionId}`, {
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Get Company Transactions (User)
  getCompanyTransactions: (companyId, params = {}) => {
    return api.get(`/api/user/get_company_transactions/${companyId}`, { params })
  }
}

// Fine Management Services
export const fineService = {
  // Add Fine (User)
  addFine: (data) => {
    const formData = createFormData(data)
    return api.post('/api/user/add_fine', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update Fine (User)
  updateFine: (fineId, data) => {
    const formData = createFormData(data)
    return api.post(`/api/user/update_fine/${fineId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete Fine (User)
  deleteFine: (fineId, data) => {
    const formData = createFormData(data)
    return api.delete(`/api/user/delete_fine/${fineId}`, {
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Get Company Fines (User)
  getCompanyFines: (companyId, params = {}) => {
    return api.get(`/api/user/get_company_fines/${companyId}`, { params })
  }
}

// Report Services
export const reportService = {
  // Get Company Summary (User)
  getCompanySummary: (companyId) => {
    return api.get(`/api/user/get_company_summary/${companyId}`)
  }
}

export default api