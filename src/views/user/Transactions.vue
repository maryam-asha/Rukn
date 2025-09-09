<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.transactions') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('transactions.manage_your_transactions') }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.company_id"
                  :label="$t('transactions.company')"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  @update:model-value="loadTransactions"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.type"
                  :label="$t('transactions.type')"
                  :items="transactionTypes"
                  @update:model-value="loadTransactions"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.from_date"
                  :label="$t('transactions.from_date')"
                  type="date"
                  @update:model-value="loadTransactions"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.to_date"
                  :label="$t('transactions.to_date')"
                  type="date"
                  @update:model-value="loadTransactions"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="bg-success text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ formatCurrency(transactionStore.totalIncome) }}</div>
                <div class="text-subtitle-1">{{ $t('transactions.total_income') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-trending-up</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-error text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ formatCurrency(transactionStore.totalOutcome) }}</div>
                <div class="text-subtitle-1">{{ $t('transactions.total_expense') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-trending-down</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-info text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ formatCurrency(transactionStore.netAmount) }}</div>
                <div class="text-subtitle-1">{{ $t('transactions.net_amount') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-currency-usd</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg_primary_blue text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ transactions.length }}</div>
                <div class="text-subtitle-1">{{ $t('transactions.total_transactions') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-swap-horizontal</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Transaction Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="showAddModal = true"
        >
          {{ $t('transactions.add_transaction') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Transactions Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-swap-horizontal</v-icon>
            {{ $t('transactions.transactions_list') }}
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="transactions"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.transaction_type="{ item }">
                <v-chip :color="item.transaction_type === 'in' ? 'success' : 'error'" size="small">
                  {{ item.transaction_type === 'in' ? $t('transactions.income') : $t('transactions.expense') }}
                </v-chip>
              </template>
              <template v-slot:item.amount="{ item }">
                <span class="font-weight-bold">{{ formatCurrency(item.amount) }}</span>
              </template>
              <template v-slot:item.transaction_date="{ item }">
                {{ formatDate(item.transaction_date) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  @click="editTransaction(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  @click="deleteTransaction(item.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Transaction Modal -->
    <v-dialog v-model="showAddModal" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-plus-circle</v-icon>
          {{ editingTransaction ? $t('transactions.edit_transaction') : $t('transactions.add_transaction') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.company_id"
                  :label="$t('transactions.company')"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.transaction_type"
                  :label="$t('transactions.type')"
                  :items="transactionTypes"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.amount"
                  :label="$t('common.amount')"
                  type="number"
                  step="0.01"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.customer_name"
                  :label="$t('transactions.customer_name')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.transaction_date"
                  :label="$t('common.date')"
                  type="date"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.attachment"
                  :label="$t('transactions.attachment')"
                  accept="image/*,.pdf"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.transaction_description"
                  :label="$t('common.description')"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeModal"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="submitForm"
          >
            {{ editingTransaction ? $t('common.save') : $t('common.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '@/stores/company'
import { useTransactionStore } from '@/stores/transaction'

export default {
  name: 'Transactions',
  setup() {
    const { t } = useI18n()
    const companyStore = useCompanyStore()
    const transactionStore = useTransactionStore()

    const loading = ref(false)
    const companies = ref([])
    const transactions = ref([])
    const showAddModal = ref(false)
    const editingTransaction = ref(null)
    const valid = ref(false)

    const filters = reactive({
      company_id: '',
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

    const transactionTypes = [
      { title: t('transactions.income'), value: 'in' },
      { title: t('transactions.expense'), value: 'out' }
    ]

    const headers = [
      { title: t('transactions.customer_name'), key: 'customer_name' },
      { title: t('transactions.type'), key: 'transaction_type' },
      { title: t('common.amount'), key: 'amount' },
      { title: t('common.date'), key: 'transaction_date' },
      { title: t('common.description'), key: 'transaction_description' },
      { title: t('common.actions'), key: 'actions', sortable: false }
    ]

    // Load companies
    const loadCompanies = async () => {
      try {
        const result = await companyStore.getUserCompanies()
        if (result.success) {
          companies.value = companyStore.companies
          if (companies.value.length > 0) {
            filters.company_id = companies.value[0].id
            form.company_id = companies.value[0].id
          }
        }
      } catch (error) {
        console.error('Error loading companies:', error)
      }
    }

    // Load transactions
    const loadTransactions = async () => {
      if (!filters.company_id) return
      
      loading.value = true
      try {
        const params = {
          ...filters,
          perPage: 50
        }
        const result = await transactionStore.getCompanyTransactions(filters.company_id, params)
        if (result.success) {
          transactions.value = transactionStore.transactions
        }
      } catch (error) {
        console.error('Error loading transactions:', error)
      } finally {
        loading.value = false
      }
    }

    // Add transaction
    const addTransaction = async () => {
      loading.value = true
      try {
        const result = await transactionStore.addTransaction(form)
        if (result.success) {
          transactions.value = transactionStore.transactions
          closeModal()
        }
      } catch (error) {
        console.error('Error adding transaction:', error)
      } finally {
        loading.value = false
      }
    }

    // Edit transaction
    const editTransaction = (transaction) => {
      editingTransaction.value = transaction
      form.company_id = transaction.company_id
      form.transaction_type = transaction.transaction_type
      form.amount = transaction.amount
      form.customer_name = transaction.customer_name
      form.transaction_date = transaction.transaction_date
      form.transaction_description = transaction.transaction_description
      showAddModal.value = true
    }

    const updateTransaction = async () => {
      loading.value = true
      try {
        const result = await transactionStore.updateTransaction(editingTransaction.value.id, form)
        if (result.success) {
          transactions.value = transactionStore.transactions
          closeModal()
        }
      } catch (error) {
        console.error('Error updating transaction:', error)
      } finally {
        loading.value = false
      }
    }

    // Delete transaction
    const deleteTransaction = async (transactionId) => {
      if (confirm(t('transactions.confirm_delete'))) {
        loading.value = true
        try {
          const result = await transactionStore.deleteTransaction(transactionId, form)
          if (result.success) {
            transactions.value = transactionStore.transactions
          }
        } catch (error) {
          console.error('Error deleting transaction:', error)
        } finally {
          loading.value = false
        }
      }
    }

    // Submit form
    const submitForm = () => {
      if (editingTransaction.value) {
        updateTransaction()
      } else {
        addTransaction()
      }
    }

    // Close modal
    const closeModal = () => {
      showAddModal.value = false
      editingTransaction.value = null
      form.company_id = companies.value.length > 0 ? companies.value[0].id : ''
      form.transaction_type = 'in'
      form.amount = ''
      form.customer_name = ''
      form.transaction_date = ''
      form.transaction_description = ''
      form.attachment = null
    }

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP'
      }).format(amount)
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Load data on mount
    onMounted(async () => {
      await loadCompanies()
      if (companies.value.length > 0) {
        await loadTransactions()
      }
    })

    return {
      loading,
      companies,
      transactions,
      showAddModal,
      editingTransaction,
      valid,
      filters,
      form,
      transactionTypes,
      headers,
      transactionStore,
      loadCompanies,
      loadTransactions,
      editTransaction,
      deleteTransaction,
      submitForm,
      closeModal,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}
</style>