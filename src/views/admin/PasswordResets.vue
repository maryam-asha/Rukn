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
                  @update:model-value="loadPasswordResets"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.from_date"
                  :label="$t('admin.from_date')"
                  type="date"
                  @update:model-value="loadPasswordResets"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.to_date"
                  :label="$t('admin.to_date')"
                  type="date"
                  @update:model-value="loadPasswordResets"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  :label="$t('common.search')"
                  prepend-inner-icon="mdi-magnify"
                  @update:model-value="loadPasswordResets"
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
    const passwordResets = ref([])
    const showViewModal = ref(false)
    const showActionModal = ref(false)
    const selectedReset = ref({})
    const actionType = ref('')
    const actionValid = ref(false)

    const filters = reactive({
      status: '',
      from_date: '',
      to_date: '',
      search: ''
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

    // Statistics
    const totalResets = computed(() => passwordResets.value.length)
    const approvedResets = computed(() => passwordResets.value.filter(reset => reset.status === 'approved').length)
    const pendingResets = computed(() => passwordResets.value.filter(reset => reset.status === 'pending').length)
    const rejectedResets = computed(() => passwordResets.value.filter(reset => reset.status === 'rejected').length)

    // Load password resets
    const loadPasswordResets = async () => {
      loading.value = true
      try {
        const params = {
          ...filters,
          perPage: 50
        }
        const result = await adminStore.getPasswordResets(params)
        if (result.success) {
          passwordResets.value = adminStore.passwordResets
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
          passwordResets.value = adminStore.passwordResets
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

    // Load data on mount
    onMounted(() => {
      loadPasswordResets()
    })

    return {
      loading,
      passwordResets,
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