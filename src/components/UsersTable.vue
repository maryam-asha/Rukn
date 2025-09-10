<template>
  <v-card flat>
    <v-card-title
      class="d-flex justify-space-between flex-column flex-sm-row align-center pe-2 header_table text_primary_green"
    >
      <div class="mb-4 mb-sm-0">{{ $t('users_table') }}</div>

      <div class="d-flex flex-column align-end ga-2">
        <v-text-field
          v-model="search"
          density="compact"
          :label="$t('search')"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          @update:model-value="() => loadUsers(1)"
        />

        <div>
          <v-btn 
            class="mx-1 bg_secondary text-white" 
            prepend-icon="mdi-check-circle"
            @click="filterByStatus('accepted')"
            :variant="filters.status === 'accepted' ? 'flat' : 'outlined'"
          >
            {{ $t('accepted') }} ({{ userStore.statistics.accepted }})
          </v-btn>
          <v-btn 
            class="mx-1 bg_secondary text-white" 
            prepend-icon="mdi-information"
            @click="filterByStatus('pending')"
            :variant="filters.status === 'pending' ? 'flat' : 'outlined'"
          >
            {{ $t('pending') }} ({{ userStore.statistics.pending }})
          </v-btn>
          <v-btn 
            class="mx-1 bg_secondary text-white" 
            prepend-icon="mdi-cancel"
            @click="filterByStatus('rejected')"
            :variant="filters.status === 'rejected' ? 'flat' : 'outlined'"
          >
            {{ $t('rejected') }} ({{ userStore.statistics.rejected }})
          </v-btn>
          <v-btn 
            class="mx-1 bg_secondary text-white" 
            prepend-icon="mdi-account-off"
            @click="filterByStatus('blocked')"
            :variant="filters.status === 'blocked' ? 'flat' : 'outlined'"
          >
            {{ $t('blocked') }} ({{ userStore.statistics.blocked }})
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Statistics Cards -->
    <v-row class="pa-4">
      <v-col cols="12" md="3">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ userStore.statistics.total }}</div>
                <div class="text-subtitle-1">{{ $t('total_users') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-account-group</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-success text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ userStore.statistics.accepted }}</div>
                <div class="text-subtitle-1">{{ $t('accepted_users') }}</div>
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
                <div class="text-h4 font-weight-bold">{{ userStore.statistics.pending }}</div>
                <div class="text-subtitle-1">{{ $t('pending_users') }}</div>
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
                <div class="text-h4 font-weight-bold">{{ userStore.statistics.rejected }}</div>
                <div class="text-subtitle-1">{{ $t('rejected_users') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-close-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert
      v-if="userStore.error"
      type="error"
      class="ma-4"
      closable
      @click:close="userStore.clearError"
    >
      {{ userStore.error }}
    </v-alert>

    <v-data-table
      class="data_table text-center"
      :items="userStore.users"
      :headers="headers"
      :loading="userStore.loading"
      :items-per-page="userStore.pagination.per_page"
      :page="userStore.pagination.current_page"
      hide-default-footer
      :no-data-text="$t('no_data_available')"
      :loading-text="$t('loading')"
    >
      <template v-slot:item.account_status="{ item }">
        <v-chip
          :color="getStatusColor(item.account_status)"
          size="small"
          label
        >
          {{ $t(item.account_status) }}
        </v-chip>
      </template>

      <template v-slot:item.open="{ item }">
        <v-icon
          v-if="item.open === 1"
          color="green"
          icon="mdi-check-circle"
          @click="toggleUserStatus(item)"
        />
        <v-icon
          v-else
          color="red"
          icon="mdi-cancel"
          @click="toggleUserStatus(item)"
        />
      </template>

      <template v-slot:item.created_at="{ item }">
        <div class="text-center">
          <div>{{ formatDate(item.created_at) }}</div>
          <small class="text-medium-emphasis">{{ formatTime(item.created_at) }}</small>
        </div>
      </template>

      <template v-slot:item.phone="{ item }">
        <div class="text-center dir_ltr">
          <div>{{ item.phone }}</div>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2">
          <v-icon
            color="primary"
            icon="mdi-pencil"
            size="small"
            @click="edit(item)"
          />
          <v-icon
            color="red"
            icon="mdi-delete"
            size="small"
            @click="confirmDelete(item)"
          />
        </div>
      </template>
    </v-data-table>

    <!-- Pagination Controls -->
    <v-row class="pa-4" v-if="userStore.pagination.last_page > 1">
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <span class="text-body-2 me-4">
            {{ $t('showing') }} {{ ((userStore.pagination.current_page - 1) * userStore.pagination.per_page) + 1 }} 
            {{ $t('to') }} {{ Math.min(userStore.pagination.current_page * userStore.pagination.per_page, userStore.pagination.total) }} 
            {{ $t('of') }} {{ userStore.pagination.total }} {{ $t('results') }}
          </span>
          <v-select
            :model-value="userStore.pagination.per_page"
            :items="[12, 25, 50, 100]"
            @update:model-value="changePerPage"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 80px;"
          ></v-select>
          <span class="text-body-2 ms-2">{{ $t('per_page') }}</span>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="d-flex justify-end align-center">
          <v-btn
            :disabled="userStore.pagination.current_page <= 1"
            @click="prevPage"
            variant="outlined"
            size="small"
            class="me-2"
          >
            <v-icon>mdi-chevron-left</v-icon>
            {{ $t('previous') }}
          </v-btn>
          
          <v-pagination
            :model-value="userStore.pagination.current_page"
            :length="userStore.pagination.last_page"
            @update:model-value="goToPage"
            :total-visible="5"
            size="small"
            class="mx-2"
          ></v-pagination>
          
          <v-btn
            :disabled="userStore.pagination.current_page >= userStore.pagination.last_page"
            @click="nextPage"
            variant="outlined"
            size="small"
            class="ms-2"
          >
            {{ $t('next') }}
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Edit User Modal -->
    <v-dialog v-model="showEditModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-pencil</v-icon>
          {{ $t('edit_user') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.name"
                  :label="$t('name')"
                  :rules="[v => !!v || $t('required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.user_name"
                  :label="$t('user_name')"
                  :rules="[v => !!v || $t('required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.email"
                  :label="$t('email')"
                  type="email"
                  :rules="[v => !!v || $t('required'), v => /.+@.+\..+/.test(v) || $t('email_must_be_valid')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.phone"
                  :label="$t('phone')"
                  :rules="[v => !!v || $t('required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.status"
                  :label="$t('account_status')"
                  :items="statusOptions"
                  :rules="[v => !!v || $t('required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editForm.reason"
                  :label="$t('reason')"
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
            @click="closeEditModal"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="userStore.loading"
            :disabled="!valid"
            @click="updateUser"
          >
            {{ $t('update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="bg_secondary text-white text-center">
          {{ $t('confirm') }}
        </v-card-title>
        <v-card-text class="dir_rtl">
          {{ $t('are_you_sure_delete') }}
          <b>{{ itemToDelete?.name }}</b>؟
        </v-card-text>
        <v-card-actions class="d-flex justify-start">
          <v-btn color="red" variant="flat" @click="deleteItem">
            {{ $t('delete') }}
          </v-btn>
          <v-btn variant="text" @click="showDeleteDialog = false">
            {{ $t('cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()

const search = ref('')
const showDeleteDialog = ref(false)
const itemToDelete = ref(null)
const showEditModal = ref(false)
const editingUser = ref(null)
const valid = ref(false)

const filters = ref({
  status: '',
  search: '',
  page: 1,
  per_page: 12
})

const editForm = ref({
  name: '',
  user_name: '',
  email: '',
  phone: '',
  status: 'accepted',
  reason: ''
})

const statusOptions = [
  { title: t('accepted'), value: 'accepted' },
  { title: t('pending'), value: 'pending' },
  { title: t('rejected'), value: 'rejected' }
]

const headers = [
  { title: '#', key: 'id' },
  { title: t('name'), key: 'name', sortable: true },
  { title: t('user_name'), key: 'user_name', sortable: true },
  { title: t('email'), key: 'email', sortable: false },
  { title: t('phone'), key: 'phone', sortable: false },
  { title: t('account_status'), key: 'account_status', sortable: false },
  { title: t('active'), key: 'open', sortable: false },
  { title: t('created_at'), key: 'created_at', sortable: false },
  { title: t('actions'), key: 'actions', sortable: false }
]

// Load users
const loadUsers = async (page = 1) => {
  try {
    // Reset to page 1 when filters change
    if (page === 1) {
      filters.value.page = 1
    }
    
    const params = {
      status: filters.value.status || undefined,
      search: search.value || undefined,
      page: page,
      per_page: filters.value.per_page
    }

    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key]
      }
    })

    const result = await userStore.getUsers(params)
    if (result.success) {
      console.log('Users loaded successfully')
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

// Filter by status
const filterByStatus = (status) => {
  if (filters.value.status === status) {
    filters.value.status = '' // Clear filter if same status clicked
  } else {
    filters.value.status = status
  }
  loadUsers(1)
}

// Pagination functions
const goToPage = (page) => {
  loadUsers(page)
}

const nextPage = () => {
  if (userStore.pagination.current_page < userStore.pagination.last_page) {
    goToPage(userStore.pagination.current_page + 1)
  }
}

const prevPage = () => {
  if (userStore.pagination.current_page > 1) {
    goToPage(userStore.pagination.current_page - 1)
  }
}

const changePerPage = (newPerPage) => {
  filters.value.per_page = newPerPage
  filters.value.page = 1
  loadUsers(1)
}

// Edit user
const edit = (item) => {
  editingUser.value = item
  editForm.value = {
    name: item.name,
    user_name: item.user_name,
    email: item.email,
    phone: item.phone,
    status: item.account_status,
    reason: ''
  }
  showEditModal.value = true
}

const updateUser = async () => {
  if (!editingUser.value) return
  try {
    const result = await userStore.changeAccountStatus(
      editingUser.value.id,
      editForm.value.status,
      editForm.value.reason
    )
    if (result.success) {
      // Reload current page to get updated data
      await loadUsers(filters.value.page)
      closeEditModal()
    }
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = null
  editForm.value = {
    name: '',
    user_name: '',
    email: '',
    phone: '',
    status: 'accepted',
    reason: ''
  }
}

// Toggle user status
const toggleUserStatus = async (user) => {
  // Optimistically update the UI
  const originalOpen = user.open
  user.open = user.open === 1 ? 0 : 1

  try {
    const result = await userStore.toggleBlockUser(user.id)
    if (result.success) {
      // Reload current page to get updated data
      await loadUsers(filters.value.page)
    } else {
      // Revert on failure
      user.open = originalOpen
      console.error('Failed to toggle user status:', result.message)
    }
  } catch (error) {
    // Revert on error
    user.open = originalOpen
    console.error('Error toggling user status:', error)
  }
}

// Delete user
const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

const deleteItem = async () => {
  if (!itemToDelete.value) return
  try {
    const result = await userStore.deleteUser(itemToDelete.value.id)
    if (result.success) {
      // Reload current page to get updated data
      await loadUsers(filters.value.page)
      showDeleteDialog.value = false
      itemToDelete.value = null
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

// Utility functions
const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
    case 'active':
      return 'green'
    case 'pending':
      return 'orange'
    case 'rejected':
    case 'blocked':
      return 'red'
    default:
      return 'grey'
  }
}

const formatDate = (dateTime) => {
  const date = new Date(dateTime)
  return date.toLocaleDateString('ar-SY')
}

const formatTime = (dateTime) => {
  const date = new Date(dateTime)
  return date.toTimeString().split(' ')[0]
}

// Load data on mount
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

.data_table {
  border-radius: 8px;
}

.header_table {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>