<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.users') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('admin.manage_users') }}
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
                  :label="$t('admin.user_status')"
                  :items="statusOptions"
                  @update:model-value="loadUsers"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.from_date"
                  :label="$t('admin.from_date')"
                  type="date"
                  @update:model-value="loadUsers"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.to_date"
                  :label="$t('admin.to_date')"
                  type="date"
                  @update:model-value="loadUsers"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  :label="$t('common.search')"
                  prepend-inner-icon="mdi-magnify"
                  @update:model-value="loadUsers"
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
                <div class="text-h4 font-weight-bold">{{ totalUsers }}</div>
                <div class="text-subtitle-1">{{ $t('admin.total_users') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-account-multiple</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-success text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ activeUsers }}</div>
                <div class="text-subtitle-1">{{ $t('admin.active_users') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-account-check</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-warning text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ pendingUsers }}</div>
                <div class="text-subtitle-1">{{ $t('admin.pending_users') }}</div>
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
                <div class="text-h4 font-weight-bold">{{ blockedUsers }}</div>
                <div class="text-subtitle-1">{{ $t('admin.blocked_users') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-account-cancel</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-account-multiple</v-icon>
            {{ $t('admin.users_list') }}
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users"
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
                  color="primary"
                  variant="text"
                  size="small"
                  @click="editUser(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  :color="item.status === 'active' ? 'warning' : 'success'"
                  variant="text"
                  size="small"
                  @click="toggleUserStatus(item)"
                >
                  <v-icon>{{ item.status === 'active' ? 'mdi-block' : 'mdi-check' }}</v-icon>
                </v-btn>
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  @click="deleteUser(item.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit User Modal -->
    <v-dialog v-model="showEditModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-pencil</v-icon>
          {{ $t('admin.edit_user') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.name"
                  :label="$t('common.name')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.user_name"
                  :label="$t('login.username')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.email"
                  :label="$t('common.email')"
                  type="email"
                  :rules="[v => !!v || $t('validation.required'), v => /.+@.+\..+/.test(v) || $t('validation.email')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.phone"
                  :label="$t('common.phone')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.status"
                  :label="$t('admin.user_status')"
                  :items="statusOptions"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.user_type"
                  :label="$t('admin.user_type')"
                  :items="userTypes"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editForm.reason"
                  :label="$t('admin.reason')"
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
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="updateUser"
          >
            {{ $t('common.save') }}
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
import { useUserStore } from '@/stores/user'

export default {
  name: 'AdminUsers',
  setup() {
    const { t } = useI18n()
    const userStore = useUserStore()

    const loading = ref(false)
    const users = ref([])
    const showEditModal = ref(false)
    const editingUser = ref(null)
    const valid = ref(false)

    const filters = reactive({
      status: '',
      from_date: '',
      to_date: '',
      search: ''
    })

    const editForm = reactive({
      name: '',
      user_name: '',
      email: '',
      phone: '',
      status: 'active',
      user_type: 'user',
      reason: ''
    })

    const statusOptions = [
      { title: t('admin.all_statuses'), value: '' },
      { title: t('admin.active'), value: 'active' },
      { title: t('admin.pending'), value: 'pending' },
      { title: t('admin.blocked'), value: 'blocked' }
    ]

    const userTypes = [
      { title: t('admin.user'), value: 'user' },
      { title: t('admin.admin'), value: 'admin' }
    ]

    const headers = [
      { title: t('common.name'), key: 'name' },
      { title: t('login.username'), key: 'user_name' },
      { title: t('common.email'), key: 'email' },
      { title: t('common.phone'), key: 'phone' },
      { title: t('admin.user_type'), key: 'user_type' },
      { title: t('admin.user_status'), key: 'status' },
      { title: t('common.created_at'), key: 'created_at' },
      { title: t('common.actions'), key: 'actions', sortable: false }
    ]

    // Statistics
    const totalUsers = computed(() => users.value.length)
    const activeUsers = computed(() => users.value.filter(user => user.status === 'active').length)
    const pendingUsers = computed(() => users.value.filter(user => user.status === 'pending').length)
    const blockedUsers = computed(() => users.value.filter(user => user.status === 'blocked').length)

    // Load users
    const loadUsers = async () => {
      loading.value = true
      try {
        const params = {
          ...filters,
          perPage: 50
        }
        const result = await userStore.getUsers(params)
        if (result.success) {
          users.value = userStore.users
        }
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        loading.value = false
      }
    }

    // Edit user
    const editUser = (user) => {
      editingUser.value = user
      editForm.name = user.name
      editForm.user_name = user.user_name
      editForm.email = user.email
      editForm.phone = user.phone
      editForm.status = user.status
      editForm.user_type = user.user_type
      editForm.reason = ''
      showEditModal.value = true
    }

    // Update user
    const updateUser = async () => {
      loading.value = true
      try {
        const result = await userStore.changeAccountStatus(
          editingUser.value.id,
          editForm.status,
          editForm.reason
        )
        if (result.success) {
          users.value = userStore.users
          closeEditModal()
        }
      } catch (error) {
        console.error('Error updating user:', error)
      } finally {
        loading.value = false
      }
    }

    // Toggle user status
    const toggleUserStatus = async (user) => {
      const newStatus = user.status === 'active' ? 'blocked' : 'active'
      const reason = newStatus === 'blocked' ? t('admin.user_blocked') : t('admin.user_unblocked')
      
      loading.value = true
      try {
        const result = await userStore.toggleBlockUser(user.id)
        if (result.success) {
          users.value = userStore.users
        }
      } catch (error) {
        console.error('Error toggling user status:', error)
      } finally {
        loading.value = false
      }
    }

    // Delete user
    const deleteUser = async (userId) => {
      if (confirm(t('admin.confirm_delete_user'))) {
        loading.value = true
        try {
          const result = await userStore.deleteUser(userId)
          if (result.success) {
            users.value = userStore.users
          }
        } catch (error) {
          console.error('Error deleting user:', error)
        } finally {
          loading.value = false
        }
      }
    }

    // Close edit modal
    const closeEditModal = () => {
      showEditModal.value = false
      editingUser.value = null
      editForm.name = ''
      editForm.user_name = ''
      editForm.email = ''
      editForm.phone = ''
      editForm.status = 'active'
      editForm.user_type = 'user'
      editForm.reason = ''
    }

    // Get status color
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'success'
        case 'pending': return 'warning'
        case 'blocked': return 'error'
        default: return 'grey'
      }
    }

    // Get status text
    const getStatusText = (status) => {
      switch (status) {
        case 'active': return t('admin.active')
        case 'pending': return t('admin.pending')
        case 'blocked': return t('admin.blocked')
        default: return status
      }
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Load data on mount
    onMounted(() => {
      loadUsers()
    })

    return {
      loading,
      users,
      showEditModal,
      editingUser,
      valid,
      filters,
      editForm,
      statusOptions,
      userTypes,
      headers,
      totalUsers,
      activeUsers,
      pendingUsers,
      blockedUsers,
      loadUsers,
      editUser,
      updateUser,
      toggleUserStatus,
      deleteUser,
      closeEditModal,
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