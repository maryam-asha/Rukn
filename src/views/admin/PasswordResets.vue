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
                  @update:model-value="() => loadPasswordResets(1)"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.from_date"
                  :label="$t('admin.from_date')"
                  type="date"
                  @update:model-value="() => loadPasswordResets(1)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.to_date"
                  :label="$t('admin.to_date')"
                  type="date"
                  @update:model-value="() => loadPasswordResets(1)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  :label="$t('common.search')"
                  prepend-inner-icon="mdi-magnify"
                  @update:model-value="() => loadPasswordResets(1)"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="grey"
                  variant="outlined"
                  @click="resetFilters"
                  :disabled="loading"
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
                <div class="text-h4 font-weight-bold">{{ totalResets }}</div>
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
                <div class="text-h4 font-weight-bold">{{ approvedResets }}</div>
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
                <div class="text-h4 font-weight-bold">{{ pendingResets }}</div>
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
                <div class="text-h4 font-weight-bold">{{ rejectedResets }}</div>
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
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-key</v-icon>
            {{ $t('admin.password_resets_list') }}
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="passwordResets"
              :loading="loading"
              class="elevation-1"
              :items-per-page="pagination.per_page"
              :page="pagination.current_page"
              hide-default-footer
              :no-data-text="$t('common.no_data_available')"
              :loading-text="$t('common.loading')"
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
                <v-btn
                  v-if="item.status === 'pending'"
                  color="success"
                  variant="text"
                  size="small"
                  @click="approveReset(item)"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.status === 'pending'"
                  color="error"
                  variant="text"
                  size="small"
                  @click="rejectReset(item)"
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
              </template>
            </v-data-table>

            <!-- Pagination Controls -->
            <v-row class="mt-4" v-if="pagination.last_page > 1">
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <span class="text-body-2 me-4">
                    {{ $t('common.showing') }} {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} 
                    {{ $t('common.to') }} {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} 
                    {{ $t('common.of') }} {{ pagination.total }} {{ $t('common.results') }}
                  </span>
                  <v-select
                    :model-value="pagination.per_page"
                    :items="[12, 25, 50, 100]"
                    @update:model-value="changePerPage"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="max-width: 80px;"
                  ></v-select>
                  <span class="text-body-2 ms-2">{{ $t('common.per_page') }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex justify-end align-center">
                  <v-btn
                    :disabled="pagination.current_page <= 1"
                    @click="prevPage"
                    variant="outlined"
                    size="small"
                    class="me-2"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                    {{ $t('common.previous') }}
                  </v-btn>
                  
                  <v-pagination
                    :model-value="pagination.current_page"
                    :length="pagination.last_page"
                    @update:model-value="goToPage"
                    :total-visible="5"
                    size="small"
                    class="mx-2"
                  ></v-pagination>
                  
                  <v-btn
                    :disabled="pagination.current_page >= pagination.last_page"
                    @click="nextPage"
                    variant="outlined"
                    size="small"
                    class="ms-2"
                  >
                    {{ $t('common.next') }}
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
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
            :loading="loading"
            :disabled="!actionValid"
            @click="submitAction"
          >
            {{ actionType === 'approve' ? $t('admin.approve') : $t('admin.reject') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Alert -->
    <v-alert
      v-if="adminStore.error"
      type="error"
      class="mb-4"
      closable
      @click:close="adminStore.clearError"
    >
      {{ adminStore.error }}
    </v-alert>

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
import { useAdminStore } from '@/stores/admin'

export default {
  name: 'AdminPasswordResets',
  setup() {
    const { t } = useI18n()
    const adminStore = useAdminStore()

    const loading = ref(false)
    const showViewModal = ref(false)
    const showActionModal = ref(false)
    const selectedReset = ref({})
    const actionType = ref('')
    const actionValid = ref(false)

    const filters = reactive({
      status: '',
      from_date: '',
      to_date: '',
      search: '',
      page: 1,
      per_page: 12
    })

    const actionForm = reactive({
      reason: ''
    })

    const statusOptions = [
      { title: t('admin.all_statuses'), value: '' },
      { title: t('admin.pending'), value: 'pending' },
      { title: t('admin.approved'), value: 'approved' },
      { title: t('admin.rejected'), value: 'rejected' }
    ]

    const headers = [
      { title: t('login.username'), key: 'user_name' },
      { title: t('admin.reset_status'), key: 'status' },
      { title: t('admin.reason'), key: 'reason' },
      { title: t('common.created_at'), key: 'created_at' },
      { title: t('common.actions'), key: 'actions', sortable: false }
    ]

    // Statistics - using data from store
    const totalResets = computed(() => adminStore.passwordResets.statistics.total)
    const approvedResets = computed(() => adminStore.passwordResets.statistics.approved)
    const pendingResets = computed(() => adminStore.passwordResets.statistics.pending)
    const rejectedResets = computed(() => adminStore.passwordResets.statistics.rejected)

    // Pagination data from store
    const passwordResets = computed(() => adminStore.passwordResets.data)
    const pagination = computed(() => adminStore.passwordResets.pagination)

    // Load password resets
    const loadPasswordResets = async (page = 1) => {
      loading.value = true
      try {
        // Reset to page 1 when filters change
        if (page === 1) {
          filters.page = 1
        }
        
        const params = {
          status: filters.status || undefined,
          from_date: filters.from_date || undefined,
          to_date: filters.to_date || undefined,
          search: filters.search || undefined,
          page: page,
          per_page: filters.per_page
        }

        // Remove undefined values
        Object.keys(params).forEach(key => {
          if (params[key] === undefined) {
            delete params[key]
          }
        })

        const result = await adminStore.getPasswordResetsWithFilters(params)
        if (result.success) {
          // Data is automatically updated in store
          console.log('Password resets loaded successfully')
        }
      } catch (error) {
        console.error('Error loading password resets:', error)
      } finally {
        loading.value = false
      }
    }

    // View reset
    const viewReset = (reset) => {
      selectedReset.value = { ...reset }
      showViewModal.value = true
    }

    // Approve reset
    const approveReset = (reset) => {
      selectedReset.value = reset
      actionType.value = 'approve'
      actionForm.reason = ''
      showActionModal.value = true
    }

    // Reject reset
    const rejectReset = (reset) => {
      selectedReset.value = reset
      actionType.value = 'reject'
      actionForm.reason = ''
      showActionModal.value = true
    }

    // Submit action
    const submitAction = async () => {
      loading.value = true
      try {
        const result = await adminStore.changePasswordResetStatus(
          selectedReset.value.id,
          actionType.value === 'approve' ? 'approved' : 'rejected',
          actionForm.reason
        )
        if (result.success) {
          // Reload current page and statistics
          await Promise.all([
            loadPasswordResets(filters.page),
            loadStatistics()
          ])
          closeActionModal()
        }
      } catch (error) {
        console.error('Error updating password reset status:', error)
      } finally {
        loading.value = false
      }
    }

    // Close view modal
    const closeViewModal = () => {
      showViewModal.value = false
      selectedReset.value = {}
    }

    // Close action modal
    const closeActionModal = () => {
      showActionModal.value = false
      selectedReset.value = {}
      actionType.value = ''
      actionForm.reason = ''
    }

    // Get status color
    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return 'success'
        case 'pending': return 'warning'
        case 'rejected': return 'error'
        default: return 'grey'
      }
    }

    // Get status text
    const getStatusText = (status) => {
      switch (status) {
        case 'approved': return t('admin.approved')
        case 'pending': return t('admin.pending')
        case 'rejected': return t('admin.rejected')
        default: return status
      }
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Pagination functions
    const goToPage = (page) => {
      loadPasswordResets(page)
    }

    const nextPage = () => {
      if (pagination.value.current_page < pagination.value.last_page) {
        goToPage(pagination.value.current_page + 1)
      }
    }

    const prevPage = () => {
      if (pagination.value.current_page > 1) {
        goToPage(pagination.value.current_page - 1)
      }
    }

    const changePerPage = (newPerPage) => {
      filters.per_page = newPerPage
      filters.page = 1
      loadPasswordResets(1)
    }

    // Reset filters
    const resetFilters = () => {
      filters.status = ''
      filters.from_date = ''
      filters.to_date = ''
      filters.search = ''
      filters.page = 1
      loadPasswordResets(1)
    }

    // Load statistics
    const loadStatistics = async () => {
      try {
        await adminStore.getPasswordResetStatistics()
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    }

    // Load data on mount
    onMounted(() => {
      loadStatistics()
      loadPasswordResets()
    })

    return {
      adminStore,
      loading,
      passwordResets,
      pagination,
      showViewModal,
      showActionModal,
      selectedReset,
      actionType,
      actionValid,
      filters,
      actionForm,
      statusOptions,
      headers,
      totalResets,
      approvedResets,
      pendingResets,
      rejectedResets,
      loadPasswordResets,
      viewReset,
      approveReset,
      rejectReset,
      submitAction,
      closeViewModal,
      closeActionModal,
      getStatusColor,
      getStatusText,
      formatDate,
      goToPage,
      nextPage,
      prevPage,
      changePerPage,
      loadStatistics,
      resetFilters
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