# أمثلة عملية - Practical Examples

## مثال 1: إنشاء صفحة إدارة الشركات

```vue
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>{{ $t('navigation.companies') }}</h4>
            <button class="btn btn-primary" @click="showAddModal = true">
              <i class="cil-plus"></i> {{ $t('common.add') }}
            </button>
          </div>
          <div class="card-body">
            <!-- جدول الشركات -->
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">{{ $t('common.loading') }}</span>
              </div>
            </div>
            
            <div v-else-if="companies.length === 0" class="text-center text-muted">
              <p>{{ $t('companies.no_companies') }}</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>{{ $t('common.name') }}</th>
                    <th>{{ $t('common.type') }}</th>
                    <th>{{ $t('common.description') }}</th>
                    <th>{{ $t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="company in companies" :key="company.id">
                    <td>{{ company.name }}</td>
                    <td>
                      <span class="badge" :class="company.type === 'transportation' ? 'bg-primary' : 'bg-secondary'">
                        {{ company.type }}
                      </span>
                    </td>
                    <td>{{ company.description }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="editCompany(company)">
                        <i class="cil-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteCompany(company.id)">
                        <i class="cil-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal إضافة/تعديل شركة -->
    <div class="modal fade" :class="{ show: showAddModal || showEditModal }" :style="{ display: (showAddModal || showEditModal) ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showAddModal ? $t('companies.add_company') : $t('companies.edit_company') }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">{{ $t('common.name') }} *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="form.name" 
                  required
                />
              </div>
              
              <div class="mb-3">
                <label class="form-label">{{ $t('common.type') }} *</label>
                <select class="form-select" v-model="form.type" required>
                  <option value="transportation">{{ $t('companies.transportation') }}</option>
                  <option value="other">{{ $t('companies.other') }}</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label class="form-label">{{ $t('common.description') }}</label>
                <textarea 
                  class="form-control" 
                  v-model="form.description" 
                  rows="3"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              {{ $t('common.cancel') }}
            </button>
            <button type="button" class="btn btn-primary" @click="submitForm" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ showAddModal ? $t('common.add') : $t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Companies',
  setup() {
    const { t } = useI18n()
    const companyStore = useCompanyStore()
    
    const companies = ref([])
    const loading = ref(false)
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingCompany = ref(null)
    
    const form = reactive({
      name: '',
      type: 'transportation',
      description: ''
    })

    // تحميل الشركات
    const loadCompanies = async () => {
      loading.value = true
      const result = await companyStore.getUserCompanies()
      if (result.success) {
        companies.value = companyStore.companies
      }
      loading.value = false
    }

    // إضافة شركة
    const addCompany = async () => {
      const result = await companyStore.addCompany(form)
      if (result.success) {
        companies.value = companyStore.companies
        closeModal()
        resetForm()
      }
    }

    // تعديل شركة
    const editCompany = (company) => {
      editingCompany.value = company
      form.name = company.name
      form.type = company.type
      form.description = company.description
      showEditModal.value = true
    }

    const updateCompany = async () => {
      const result = await companyStore.updateCompany(editingCompany.value.id, form)
      if (result.success) {
        companies.value = companyStore.companies
        closeModal()
        resetForm()
      }
    }

    // حذف شركة
    const deleteCompany = async (companyId) => {
      if (confirm(t('companies.confirm_delete'))) {
        const result = await companyStore.deleteCompany(companyId)
        if (result.success) {
          companies.value = companyStore.companies
        }
      }
    }

    // إرسال النموذج
    const submitForm = () => {
      if (showAddModal.value) {
        addCompany()
      } else {
        updateCompany()
      }
    }

    // إغلاق Modal
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      resetForm()
    }

    // إعادة تعيين النموذج
    const resetForm = () => {
      form.name = ''
      form.type = 'transportation'
      form.description = ''
      editingCompany.value = null
    }

    // تحميل البيانات عند إنشاء المكون
    onMounted(() => {
      loadCompanies()
    })

    return {
      companies,
      loading,
      showAddModal,
      showEditModal,
      form,
      loadCompanies,
      editCompany,
      deleteCompany,
      submitForm,
      closeModal
    }
  }
}
</script>
```

## مثال 2: إنشاء صفحة إدارة المعاملات

```vue
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4>{{ $t('navigation.transactions') }}</h4>
            <div class="d-flex gap-2">
              <!-- فلاتر -->
              <select class="form-select" v-model="filters.type" @change="loadTransactions">
                <option value="">{{ $t('transactions.all_types') }}</option>
                <option value="in">{{ $t('transactions.income') }}</option>
                <option value="out">{{ $t('transactions.expense') }}</option>
              </select>
              
              <input 
                type="date" 
                class="form-control" 
                v-model="filters.from_date"
                @change="loadTransactions"
              />
              
              <input 
                type="date" 
                class="form-control" 
                v-model="filters.to_date"
                @change="loadTransactions"
              />
              
              <button class="btn btn-primary" @click="showAddModal = true">
                <i class="cil-plus"></i> {{ $t('common.add') }}
              </button>
            </div>
          </div>
          <div class="card-body">
            <!-- إحصائيات سريعة -->
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card bg-success text-white">
                  <div class="card-body">
                    <h5>{{ $t('transactions.total_income') }}</h5>
                    <h3>{{ formatCurrency(transactionStore.totalIncome) }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-danger text-white">
                  <div class="card-body">
                    <h5>{{ $t('transactions.total_expense') }}</h5>
                    <h3>{{ formatCurrency(transactionStore.totalOutcome) }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-info text-white">
                  <div class="card-body">
                    <h5>{{ $t('transactions.net_amount') }}</h5>
                    <h3>{{ formatCurrency(transactionStore.netAmount) }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-warning text-white">
                  <div class="card-body">
                    <h5>{{ $t('transactions.total_transactions') }}</h5>
                    <h3>{{ transactions.length }}</h3>
                  </div>
                </div>
              </div>
            </div>

            <!-- جدول المعاملات -->
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">{{ $t('common.loading') }}</span>
              </div>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>{{ $t('common.date') }}</th>
                    <th>{{ $t('transactions.customer_name') }}</th>
                    <th>{{ $t('transactions.type') }}</th>
                    <th>{{ $t('common.amount') }}</th>
                    <th>{{ $t('common.description') }}</th>
                    <th>{{ $t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transaction in transactions" :key="transaction.id">
                    <td>{{ formatDate(transaction.transaction_date) }}</td>
                    <td>{{ transaction.customer_name }}</td>
                    <td>
                      <span class="badge" :class="transaction.transaction_type === 'in' ? 'bg-success' : 'bg-danger'">
                        {{ transaction.transaction_type === 'in' ? $t('transactions.income') : $t('transactions.expense') }}
                      </span>
                    </td>
                    <td>{{ formatCurrency(transaction.amount) }}</td>
                    <td>{{ transaction.transaction_description }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="editTransaction(transaction)">
                        <i class="cil-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteTransaction(transaction.id)">
                        <i class="cil-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal إضافة/تعديل معاملة -->
    <div class="modal fade" :class="{ show: showAddModal || showEditModal }" :style="{ display: (showAddModal || showEditModal) ? 'block' : 'none' }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showAddModal ? $t('transactions.add_transaction') : $t('transactions.edit_transaction') }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('transactions.company') }} *</label>
                  <select class="form-select" v-model="form.company_id" required>
                    <option value="">{{ $t('transactions.select_company') }}</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">
                      {{ company.name }}
                    </option>
                  </select>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('transactions.type') }} *</label>
                  <select class="form-select" v-model="form.transaction_type" required>
                    <option value="in">{{ $t('transactions.income') }}</option>
                    <option value="out">{{ $t('transactions.expense') }}</option>
                  </select>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('common.amount') }} *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="form.amount" 
                    step="0.01"
                    required
                  />
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('transactions.customer_name') }} *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.customer_name" 
                    required
                  />
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('common.date') }} *</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="form.transaction_date" 
                    required
                  />
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">{{ $t('transactions.attachment') }}</label>
                  <input 
                    type="file" 
                    class="form-control" 
                    @change="handleFileUpload"
                    accept="image/*,.pdf"
                  />
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">{{ $t('common.description') }}</label>
                <textarea 
                  class="form-control" 
                  v-model="form.transaction_description" 
                  rows="3"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              {{ $t('common.cancel') }}
            </button>
            <button type="button" class="btn btn-primary" @click="submitForm" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ showAddModal ? $t('common.add') : $t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useCompanyStore } from '@/stores/company'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Transactions',
  setup() {
    const { t } = useI18n()
    const transactionStore = useTransactionStore()
    const companyStore = useCompanyStore()
    
    const transactions = ref([])
    const companies = ref([])
    const loading = ref(false)
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingTransaction = ref(null)
    
    const filters = reactive({
      type: '',
      from_date: '',
      to_date: ''
    })
    
    const form = reactive({
      company_id: '',
      transaction_type: 'in',
      amount: '',
      customer_name: '',
      transaction_date: '',
      transaction_description: '',
      attachment: null
    })

    // تحميل المعاملات
    const loadTransactions = async () => {
      if (!form.company_id) return
      
      loading.value = true
      const params = {
        ...filters,
        perPage: 50
      }
      
      const result = await transactionStore.getCompanyTransactions(form.company_id, params)
      if (result.success) {
        transactions.value = transactionStore.transactions
      }
      loading.value = false
    }

    // تحميل الشركات
    const loadCompanies = async () => {
      const result = await companyStore.getUserCompanies()
      if (result.success) {
        companies.value = companyStore.companies
        if (companies.value.length > 0) {
          form.company_id = companies.value[0].id
          loadTransactions()
        }
      }
    }

    // إضافة معاملة
    const addTransaction = async () => {
      const result = await transactionStore.addTransaction(form)
      if (result.success) {
        transactions.value = transactionStore.transactions
        closeModal()
        resetForm()
      }
    }

    // تعديل معاملة
    const editTransaction = (transaction) => {
      editingTransaction.value = transaction
      form.company_id = transaction.company_id
      form.transaction_type = transaction.transaction_type
      form.amount = transaction.amount
      form.customer_name = transaction.customer_name
      form.transaction_date = transaction.transaction_date
      form.transaction_description = transaction.transaction_description
      showEditModal.value = true
    }

    const updateTransaction = async () => {
      const result = await transactionStore.updateTransaction(editingTransaction.value.id, form)
      if (result.success) {
        transactions.value = transactionStore.transactions
        closeModal()
        resetForm()
      }
    }

    // حذف معاملة
    const deleteTransaction = async (transactionId) => {
      if (confirm(t('transactions.confirm_delete'))) {
        const result = await transactionStore.deleteTransaction(transactionId, form)
        if (result.success) {
          transactions.value = transactionStore.transactions
        }
      }
    }

    // رفع ملف
    const handleFileUpload = (event) => {
      form.attachment = event.target.files[0]
    }

    // إرسال النموذج
    const submitForm = () => {
      if (showAddModal.value) {
        addTransaction()
      } else {
        updateTransaction()
      }
    }

    // إغلاق Modal
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      resetForm()
    }

    // إعادة تعيين النموذج
    const resetForm = () => {
      form.company_id = companies.value.length > 0 ? companies.value[0].id : ''
      form.transaction_type = 'in'
      form.amount = ''
      form.customer_name = ''
      form.transaction_date = ''
      form.transaction_description = ''
      form.attachment = null
      editingTransaction.value = null
    }

    // تنسيق العملة
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP'
      }).format(amount)
    }

    // تنسيق التاريخ
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // تحميل البيانات عند إنشاء المكون
    onMounted(() => {
      loadCompanies()
    })

    return {
      transactions,
      companies,
      loading,
      showAddModal,
      showEditModal,
      filters,
      form,
      transactionStore,
      loadTransactions,
      editTransaction,
      deleteTransaction,
      handleFileUpload,
      submitForm,
      closeModal,
      formatCurrency,
      formatDate
    }
  }
}
</script>
```

## مثال 3: إنشاء صفحة لوحة تحكم المدير

```vue
<template>
  <div class="container-fluid">
    <div class="row">
      <!-- إحصائيات عامة -->
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ dashboard.totalUsers }}</h4>
                <p class="mb-0">{{ $t('admin.total_users') }}</p>
              </div>
              <div class="align-self-center">
                <i class="cil-user fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ dashboard.pendingUsers }}</h4>
                <p class="mb-0">{{ $t('admin.pending_users') }}</p>
              </div>
              <div class="align-self-center">
                <i class="cil-clock fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ dashboard.acceptedUsers }}</h4>
                <p class="mb-0">{{ $t('admin.accepted_users') }}</p>
              </div>
              <div class="align-self-center">
                <i class="cil-check-circle fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ dashboard.blockedUsers }}</h4>
                <p class="mb-0">{{ $t('admin.blocked_users') }}</p>
              </div>
              <div class="align-self-center">
                <i class="cil-ban fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- المستخدمون المعلقون -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5>{{ $t('admin.pending_users') }}</h5>
          </div>
          <div class="card-body">
            <div v-if="pendingUsersLoading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">{{ $t('common.loading') }}</span>
              </div>
            </div>
            
            <div v-else-if="pendingUsers.length === 0" class="text-center text-muted">
              <p>{{ $t('admin.no_pending_users') }}</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>{{ $t('common.name') }}</th>
                    <th>{{ $t('common.email') }}</th>
                    <th>{{ $t('common.phone') }}</th>
                    <th>{{ $t('common.date') }}</th>
                    <th>{{ $t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in pendingUsers" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ formatDate(user.created_at) }}</td>
                    <td>
                      <button class="btn btn-sm btn-success me-2" @click="approveUser(user.id)">
                        <i class="cil-check"></i> {{ $t('admin.approve') }}
                      </button>
                      <button class="btn btn-sm btn-danger" @click="rejectUser(user.id)">
                        <i class="cil-x"></i> {{ $t('admin.reject') }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- إحصائيات إضافية -->
      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5>{{ $t('admin.user_statistics') }}</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="d-flex justify-content-between">
                <span>{{ $t('admin.acceptance_rate') }}</span>
                <span>{{ Math.round(adminStore.userAcceptanceRate) }}%</span>
              </div>
              <div class="progress">
                <div class="progress-bar" :style="{ width: adminStore.userAcceptanceRate + '%' }"></div>
              </div>
            </div>
            
            <div class="mb-3">
              <div class="d-flex justify-content-between">
                <span>{{ $t('admin.password_reset_rate') }}</span>
                <span>{{ Math.round(adminStore.passwordResetAcceptanceRate) }}%</span>
              </div>
              <div class="progress">
                <div class="progress-bar bg-warning" :style="{ width: adminStore.passwordResetAcceptanceRate + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'

export default {
  name: 'AdminDashboard',
  setup() {
    const { t } = useI18n()
    const adminStore = useAdminStore()
    const userStore = useUserStore()
    
    const dashboard = ref({})
    const pendingUsers = ref([])
    const pendingUsersLoading = ref(false)

    // تحميل إحصائيات لوحة التحكم
    const loadDashboardStats = async () => {
      const result = await adminStore.getDashboardStats()
      if (result.success) {
        dashboard.value = result.data
      }
    }

    // تحميل المستخدمين المعلقين
    const loadPendingUsers = async () => {
      pendingUsersLoading.value = true
      const result = await userStore.getUsers({ status: 'pending', perPage: 10 })
      if (result.success) {
        pendingUsers.value = userStore.pendingUsers
      }
      pendingUsersLoading.value = false
    }

    // قبول مستخدم
    const approveUser = async (userId) => {
      const result = await userStore.changeAccountStatus(userId, 'accepted', 'Approved by admin')
      if (result.success) {
        loadPendingUsers()
        loadDashboardStats()
      }
    }

    // رفض مستخدم
    const rejectUser = async (userId) => {
      const reason = prompt(t('admin.rejection_reason'))
      if (reason) {
        const result = await userStore.changeAccountStatus(userId, 'rejected', reason)
        if (result.success) {
          loadPendingUsers()
          loadDashboardStats()
        }
      }
    }

    // تنسيق التاريخ
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // تحميل البيانات عند إنشاء المكون
    onMounted(() => {
      loadDashboardStats()
      loadPendingUsers()
    })

    return {
      dashboard,
      pendingUsers,
      pendingUsersLoading,
      adminStore,
      loadDashboardStats,
      loadPendingUsers,
      approveUser,
      rejectUser,
      formatDate
    }
  }
}
</script>
```

## مثال 4: استخدام الترجمة في المكونات

```vue
<template>
  <div>
    <!-- استخدام الترجمة في النصوص -->
    <h1>{{ $t('dashboard.title') }}</h1>
    <p>{{ $t('dashboard.welcome_message', { name: user.name }) }}</p>
    
    <!-- استخدام الترجمة في الخصائص -->
    <input 
      :placeholder="$t('common.search')"
      :title="$t('common.search_tooltip')"
    />
    
    <!-- استخدام الترجمة مع الشروط -->
    <div v-if="loading">
      {{ $t('common.loading') }}
    </div>
    
    <!-- استخدام الترجمة مع التنسيق -->
    <div>
      {{ $t('transactions.total_amount', { amount: formatCurrency(totalAmount) }) }}
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()
    
    // تغيير اللغة برمجياً
    const changeLanguage = (lang) => {
      locale.value = lang
    }
    
    // استخدام الترجمة في JavaScript
    const showMessage = () => {
      alert(t('common.success_message'))
    }
    
    return {
      changeLanguage,
      showMessage
    }
  }
}
</script>
```

## مثال 5: معالجة الأخطاء

```vue
<template>
  <div>
    <!-- عرض رسائل الخطأ -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="cil-warning me-2"></i>
      {{ error }}
    </div>
    
    <!-- عرض رسائل النجاح -->
    <div v-if="success" class="alert alert-success" role="alert">
      <i class="cil-check-circle me-2"></i>
      {{ success }}
    </div>
    
    <!-- نموذج مع معالجة الأخطاء -->
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">{{ $t('common.name') }}</label>
        <input 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.name }"
          v-model="form.name"
        />
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name }}
        </div>
      </div>
      
      <button type="submit" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ $t('common.submit') }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useSomeStore } from '@/stores/someStore'

export default {
  setup() {
    const someStore = useSomeStore()
    
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const errors = reactive({})
    
    const form = reactive({
      name: ''
    })

    // إرسال النموذج مع معالجة الأخطاء
    const submitForm = async () => {
      // مسح الأخطاء السابقة
      error.value = ''
      success.value = ''
      Object.keys(errors).forEach(key => delete errors[key])
      
      // التحقق من صحة البيانات
      if (!form.name.trim()) {
        errors.name = 'Name is required'
        return
      }
      
      loading.value = true
      
      try {
        const result = await someStore.someAction(form)
        
        if (result.success) {
          success.value = 'Operation completed successfully'
          // إعادة تعيين النموذج
          form.name = ''
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'An unexpected error occurred'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      error,
      success,
      errors,
      form,
      submitForm
    }
  }
}
</script>
```

هذه الأمثلة توضح كيفية استخدام النظام بشكل عملي. يمكنك نسخ هذه الكودات وتعديلها حسب احتياجاتك الخاصة.