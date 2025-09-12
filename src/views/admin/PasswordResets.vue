<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.password_resets') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('admin.manage_password_resets') }}
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
                  v-model="filters.status"
                  :label="$t('admin.reset_status')"
                  :items="statusOptions"
                  clearable
                  @update:model-value="handleFilterChange"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.from_date"
                  :label="$t('admin.from_date')"
                  type="date"
                  clearable
                  @update:model-value="handleFilterChange"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.to_date"
                  :label="$t('admin.to_date')"
                  type="date"
                  clearable
                  @update:model-value="handleFilterChange"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  :label="$t('common.search')"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  @update:model-value="handleSearchChange"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-right">
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  <v-icon class="me-2">mdi-refresh</v-icon>
                  {{ $t('common.reset_filters') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ paginationData.total }}</div>
                <div class="text-subtitle-1">{{ $t('admin.total_resets') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-key</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-success text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ statistics.approved }}</div>
                <div class="text-subtitle-1">{{ $t('admin.approved_resets') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-warning text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ statistics.pending }}</div>
                <div class="text-subtitle-1">{{ $t('admin.pending_resets') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-clock-outline</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-error text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ statistics.rejected }}</div>
                <div class="text-subtitle-1">{{ $t('admin.rejected_resets') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-close-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Password Resets Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="me-2">mdi-key</v-icon>
              {{ $t('admin.password_resets_list') }}
            </div>
            <div class="text-caption text-grey">
              {{ $t('common.showing') }} {{ paginationData.from }} - {{ paginationData.to }} 
              {{ $t('common.of') }} {{ paginationData.total }}
            </div>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="passwordResets"
              :loading="loading"
              :items-per-page="paginationData.per_page"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ getStatusText(item.status) }}
                </v-chip>
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <div class="d-flex gap-2">
                  <v-btn
                    v-if="item.status === 'pending'"
                    color="success"
                    variant="text"
                    size="small"
                    @click="approveReset(item)"
                    :loading="actionLoading === `approve-${item.id}`"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="item.status === 'pending'"
                    color="error"
                    variant="text"
                    size="small"
                    @click="rejectReset(item)"
                    :loading="actionLoading === `reject-${item.id}`"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="text"
                    size="small"
                    @click="viewReset(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>

            <!-- Custom Pagination -->
            <v-row class="mt-4" v-if="paginationData.last_page > 1">
              <v-col cols="12" class="d-flex justify-center">
                <v-pagination
                  v-model="paginationData.current_page"
                  :length="paginationData.last_page"
                  :total-visible="7"
                  @update:model-value="handlePageChange"
                  color="primary"
                ></v-pagination>
              </v-col>
            </v-row>

            <!-- Items per page selector -->
            <v-row class="mt-2">
              <v-col cols="12" class="d-flex justify-end align-center">
                <span class="text-caption me-2">{{ $t('common.items_per_page') }}:</span>
                <v-select
                  v-model="itemsPerPage"
                  :items="itemsPerPageOptions"
                  density="compact"
                  variant="outlined"
                  style="max-width: 100px;"
                  @update:model-value="handleItemsPerPageChange"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- View Reset Modal -->
    <v-dialog v-model="showViewModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-eye</v-icon>
          {{ $t('admin.password_reset_details') }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="selectedReset.user_name"
                :label="$t('login.username')"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="selectedReset.status"
                :label="$t('admin.reset_status')"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="selectedReset.reason"
                :label="$t('admin.reason')"
                rows="3"
                readonly
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="selectedReset.created_at"
                :label="$t('common.created_at')"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="selectedReset.updated_at"
                :label="$t('common.updated_at')"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeViewModal"
          >
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Approve/Reject Modal -->
    <v-dialog v-model="showActionModal" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">{{ actionType === 'approve' ? 'mdi-check' : 'mdi-close' }}</v-icon>
          {{ actionType === 'approve' ? $t('admin.approve_reset') : $t('admin.reject_reset') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="actionForm" v-model="actionValid">
            <v-textarea
              v-model="actionForm.reason"
              :label="$t('admin.reason')"
              :rules="[v => !!v || $t('validation.required')]"
              required
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeActionModal"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            :color="actionType === 'approve' ? 'success' : 'error'"
            :loading="actionLoading"
            :disabled="!actionValid"
            @click="submitAction"
          >
            {{ actionType === 'approve' ? $t('admin.approve') : $t('admin.reject') }}
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '@/stores/admin'

export default {
  name: 'AdminPasswordResets',
  setup() {
    const { t } = useI18n()
    const adminStore = useAdminStore()

    // Reactive data
    const loading = ref(false)
    const actionLoading = ref('')
    const passwordResets = ref([])
    const showViewModal = ref(false)
    const showActionModal = ref(false)
    const selectedReset = ref({})
    const actionType = ref('')
    const actionValid = ref(false)
    const itemsPerPage = ref(12)

    // Pagination data
    const paginationData = reactive({
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0,
      from: 0,
      to: 0
    })

    // Statistics data
    const statistics = reactive({
      approved: 0,
      pending: 0,
      rejected: 0
    })

    // Filters
    const filters = reactive({
      status: '',
      from_date: '',
      to_date: '',
      search: ''
    })

    const actionForm = reactive({
      reason: ''
    })

    // Options
    const statusOptions = [
      { title: t('admin.all_statuses'), value: '' },
      { title: t('admin.pending'), value: 'pending' },
      { title: t('admin.approved'), value: 'approved' },
      { title: t('admin.rejected'), value: 'rejected' }
    ]

    const itemsPerPageOptions = [12, 25, 50, 100]

    const headers = [
      { title: t('login.username'), key: 'user_name', sortable: true },
      { title: t('admin.reset_status'), key: 'status', sortable: true },
      { title: t('admin.reason'), key: 'reason', sortable: false },
      { title: t('common.created_at'), key: 'created_at', sortable: true },
      { title: t('common.actions'), key: 'actions', sortable: false }
    ]

    // Computed properties
    const hasActiveFilters = computed(() => {
      return filters.status || filters.from_date || filters.to_date || filters.search
    })

    // Methods
    const buildApiParams = () => {
      const params = {
        page: paginationData.current_page,
        per_page: itemsPerPage.value
      }

      // Add filters
      if (filters.status) params.status = filters.status
      if (filters.from_date) params.from_date = filters.from_date
      if (filters.to_date) params.to_date = filters.to_date
      if (filters.search) params.search = filters.search

      return params
    }

    const loadPasswordResets = async () => {
      loading.value = true
      try {
        const params = buildApiParams()
        const result = await adminStore.getPasswordResetsWithFilters(params)
        
        if (result.success) {
          passwordResets.value = result.data || []
          
          // Update pagination data
          paginationData.current_page = result.current_page || 1
          paginationData.last_page = result.last_page || 1
          paginationData.per_page = result.per_page || 12
          paginationData.total = result.total || 0
          paginationData.from = result.from || 0
          paginationData.to = result.to || 0

          // Update statistics (you might need to call a separate endpoint for this)
          await loadStatistics()
        }
      } catch (error) {
        console.error('Error loading password resets:', error)
        // Show error message to user
      } finally {
        loading.value = false
      }
    }

    const loadStatistics = async () => {
      try {
        // Call separate endpoint for statistics or calculate from current data
        const statsResult = await adminStore.getPasswordResetStatistics()
        if (statsResult.success) {
          statistics.approved = statsResult.data.approved || 0
          statistics.pending = statsResult.data.pending || 0
          statistics.rejected = statsResult.data.rejected || 0
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
        // Calculate from current data as fallback
        statistics.approved = passwordResets.value.filter(reset => reset.status === 'approved').length
        statistics.pending = passwordResets.value.filter(reset => reset.status === 'pending').length
        statistics.rejected = passwordResets.value.filter(reset => reset.status === 'rejected').length
      }
    }

    const handleFilterChange = () => {
      paginationData.current_page = 1 // Reset to first page when filtering
      loadPasswordResets()
    }

    const handleSearchChange = () => {
      // Debounce search to avoid too many API calls
      clearTimeout(searchTimeout.value)
      searchTimeout.value = setTimeout(() => {
        paginationData.current_page = 1
        loadPasswordResets()
      }, 500)
    }

    const handlePageChange = (page) => {
      paginationData.current_page = page
      loadPasswordResets()
    }

    const handleItemsPerPageChange = (newValue) => {
      itemsPerPage.value = newValue
      paginationData.current_page = 1
      loadPasswordResets()
    }

    const resetFilters = () => {
      filters.status = ''
      filters.from_date = ''
      filters.to_date = ''
      filters.search = ''
      paginationData.current_page = 1
      loadPasswordResets()
    }

    const viewReset = (reset) => {
      selectedReset.value = { ...reset }
      showViewModal.value = true
    }

    const approveReset = (reset) => {
      selectedReset.value = reset
      actionType.value = 'approve'
      actionForm.reason = ''
      showActionModal.value = true
    }

    const rejectReset = (reset) => {
      selectedReset.value = reset
      actionType.value = 'reject'
      actionForm.reason = ''
      showActionModal.value = true
    }

    const submitAction = async () => {
      actionLoading.value = `${actionType.value}-${selectedReset.value.id}`
      try {
        const result = await adminStore.changePasswordResetStatus(
          selectedReset.value.id,
          actionType.value === 'approve' ? 'approved' : 'rejected',
          actionForm.reason
        )
        
        if (result.success) {
          // Refresh the current page data
          await loadPasswordResets()
          closeActionModal()
        }
      } catch (error) {
        console.error('Error updating password reset status:', error)
      } finally {
        actionLoading.value = ''
      }
    }

    const closeViewModal = () => {
      showViewModal.value = false
      selectedReset.value = {}
    }

    const closeActionModal = () => {
      showActionModal.value = false
      selectedReset.value = {}
      actionType.value = ''
      actionForm.reason = ''
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return 'success'
        case 'pending': return 'warning'
        case 'rejected': return 'error'
        default: return 'grey'
      }
    }

    const getStatusText = (status) => {
      switch (status) {
        case 'approved': return t('admin.approved')
        case 'pending': return t('admin.pending')
        case 'rejected': return t('admin.rejected')
        default: return status
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Search debounce
    const searchTimeout = ref(null)

    // Watch for language changes to update headers
    watch(() => t('login.username'), () => {
      headers[0].title = t('login.username')
      headers[1].title = t('admin.reset_status')
      headers[2].title = t('admin.reason')
      headers[3].title = t('common.created_at')
      headers[4].title = t('common.actions')
    })

    // Load data on mount
    onMounted(() => {
      loadPasswordResets()
    })

    return {
      loading,
      actionLoading,
      passwordResets,
      showViewModal,
      showActionModal,
      selectedReset,
      actionType,
      actionValid,
      filters,
      actionForm,
      statusOptions,
      itemsPerPageOptions,
      itemsPerPage,
      headers,
      paginationData,
      statistics,
      hasActiveFilters,
      loadPasswordResets,
      handleFilterChange,
      handleSearchChange,
      handlePageChange,
      handleItemsPerPageChange,
      resetFilters,
      viewReset,
      approveReset,
      rejectReset,
      submitAction,
      closeViewModal,
      closeActionModal,
      getStatusColor,
      getStatusText,
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

.gap-2 {
  gap: 8px;
}
</style>