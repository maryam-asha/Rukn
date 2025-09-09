<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.dashboard') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('dashboard.welcome_message', { name: authStore.userName }) }}
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
            {{ $t('dashboard.quick_actions') }}
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
import { useCompanyStore } from '@/stores/company'
import { useTransactionStore } from '@/stores/transaction'
import { useFineStore } from '@/stores/fine'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const companyStore = useCompanyStore()
    const transactionStore = useTransactionStore()
    const fineStore = useFineStore()

    const loading = ref(false)
    const companies = ref([])

    // Statistics
    const statistics = computed(() => [
      {
        title: t('dashboard.total_companies'),
        value: companies.value.length,
        icon: 'mdi-domain',
        colorClass: 'bg_primary_green'
      },
      {
        title: t('dashboard.total_transactions'),
        value: transactionStore.transactions.length,
        icon: 'mdi-swap-horizontal',
        colorClass: 'bg_primary_blue'
      },
      {
        title: t('dashboard.total_fines'),
        value: fineStore.fines.length,
        icon: 'mdi-alert-circle',
        colorClass: 'bg-secondary'
      },
      {
        title: t('dashboard.net_amount'),
        value: formatCurrency(transactionStore.netAmount),
        icon: 'mdi-currency-usd',
        colorClass: 'bg_light_secondary'
      }
    ])

    // Quick Actions
    const quickActions = computed(() => [
      {
        title: t('dashboard.add_company'),
        icon: 'mdi-domain-plus',
        color: 'primary',
        action: () => router.push('/companies')
      },
      {
        title: t('dashboard.add_transaction'),
        icon: 'mdi-plus-circle',
        color: 'success',
        action: () => router.push('/transactions')
      },
      {
        title: t('dashboard.add_fine'),
        icon: 'mdi-alert-plus',
        color: 'warning',
        action: () => router.push('/fines')
      },
      {
        title: t('dashboard.view_reports'),
        icon: 'mdi-chart-line',
        color: 'info',
        action: () => router.push('/reports')
      }
    ])

    // Load data
    const loadData = async () => {
      loading.value = true
      try {
        const companiesResult = await companyStore.getUserCompanies()
        if (companiesResult.success) {
          companies.value = companyStore.companies
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP'
      }).format(amount)
    }

    // Load data on mount
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      companies,
      statistics,
      quickActions,
      authStore,
      formatCurrency
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