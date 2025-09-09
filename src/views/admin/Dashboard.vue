<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.admin_dashboard') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('admin.welcome_message', { name: authStore.userName }) }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="stat in statistics" :key="stat.title">
        <v-card 
          :class="stat.colorClass" 
          class="text-white pa-4"
          elevation="4"
        >
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
                <div class="text-subtitle-1">{{ stat.title }}</div>
              </div>
              <v-icon size="48" class="opacity-75">{{ stat.icon }}</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-lightning-bolt</v-icon>
            {{ $t('admin.quick_actions') }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3" v-for="action in quickActions" :key="action.title">
                <v-btn
                  :color="action.color"
                  variant="elevated"
                  size="large"
                  block
                  class="mb-2"
                  @click="action.action"
                >
                  <v-icon class="me-2">{{ action.icon }}</v-icon>
                  {{ action.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-history</v-icon>
            {{ $t('admin.recent_activity') }}
          </v-card-title>
          <v-card-text>
            <v-list v-if="recentActivity.length > 0">
              <v-list-item
                v-for="(activity, index) in recentActivity"
                :key="index"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-avatar :color="activity.color" size="40">
                    <v-icon color="white">{{ activity.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ activity.description }}</v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-caption text_secondary">
                    {{ formatDate(activity.date) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center py-8">
              <v-icon size="64" class="text_secondary mb-4">mdi-information-outline</v-icon>
              <div class="text-h6 text_secondary">{{ $t('admin.no_activity') }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- System Status -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-cog</v-icon>
            {{ $t('admin.system_status') }}
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.api_status') }}</v-list-item-title>
                <template v-slot:append>
                  <v-chip color="success" size="small">{{ $t('admin.online') }}</v-chip>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-database</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.database_status') }}</v-list-item-title>
                <template v-slot:append>
                  <v-chip color="success" size="small">{{ $t('admin.online') }}</v-chip>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="info">mdi-account-multiple</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.active_users') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ activeUsers }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="warning">mdi-clock</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.system_uptime') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ systemUptime }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useAdminStore } from '@/stores/admin'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const adminStore = useAdminStore()

    const loading = ref(false)
    const recentActivity = ref([])
    const activeUsers = ref(0)
    const systemUptime = ref('24h 30m')

    // Statistics
    const statistics = computed(() => [
      {
        title: t('admin.total_users'),
        value: userStore.users.length,
        icon: 'mdi-account-multiple',
        colorClass: 'bg_primary_green'
      },
      {
        title: t('admin.active_users'),
        value: activeUsers.value,
        icon: 'mdi-account-check',
        colorClass: 'bg_primary_blue'
      },
      {
        title: t('admin.pending_requests'),
        value: adminStore.pendingRequests.length,
        icon: 'mdi-clock-outline',
        colorClass: 'bg-secondary'
      },
      {
        title: t('admin.system_health'),
        value: '98%',
        icon: 'mdi-heart-pulse',
        colorClass: 'bg_light_secondary'
      }
    ])

    // Quick Actions
    const quickActions = computed(() => [
      {
        title: t('admin.manage_users'),
        icon: 'mdi-account-multiple',
        color: 'primary',
        action: () => router.push('/admin/users')
      },
      {
        title: t('admin.password_resets'),
        icon: 'mdi-key',
        color: 'warning',
        action: () => router.push('/admin/password-resets')
      },
      {
        title: t('admin.system_settings'),
        icon: 'mdi-cog',
        color: 'info',
        action: () => router.push('/admin/settings')
      },
      {
        title: t('admin.view_logs'),
        icon: 'mdi-file-document',
        color: 'secondary',
        action: () => console.log('View logs')
      }
    ])

    // Load data
    const loadData = async () => {
      loading.value = true
      try {
        // Load users
        const usersResult = await userStore.getUsers()
        if (usersResult.success) {
          activeUsers.value = userStore.users.filter(user => user.status === 'active').length
        }

        // Load recent activity (mock data)
        recentActivity.value = [
          {
            title: t('admin.new_user_registered'),
            description: 'john.doe@example.com',
            date: new Date().toISOString(),
            icon: 'mdi-account-plus',
            color: 'success'
          },
          {
            title: t('admin.password_reset_requested'),
            description: 'jane.smith@example.com',
            date: new Date(Date.now() - 3600000).toISOString(),
            icon: 'mdi-key',
            color: 'warning'
          },
          {
            title: t('admin.user_account_activated'),
            description: 'bob.wilson@example.com',
            date: new Date(Date.now() - 7200000).toISOString(),
            icon: 'mdi-account-check',
            color: 'info'
          }
        ]
      } catch (error) {
        console.error('Error loading admin dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Load data on mount
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      recentActivity,
      activeUsers,
      systemUptime,
      statistics,
      quickActions,
      authStore,
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

.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>