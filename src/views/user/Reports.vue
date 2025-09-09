<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.reports') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('reports.view_your_reports') }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Company Selection -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-domain</v-icon>
            {{ $t('reports.select_company') }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedCompany"
                  :label="$t('reports.company')"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  @update:model-value="loadCompanySummary"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  color="primary"
                  size="large"
                  prepend-icon="mdi-download"
                  @click="exportReport"
                  :disabled="!selectedCompany"
                >
                  {{ $t('reports.export_report') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Company Summary -->
    <v-row v-if="companySummary" class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-chart-line</v-icon>
            {{ $t('reports.company_summary') }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card class="bg-success text-white pa-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-h4 font-weight-bold">{{ companySummary.total_transactions }}</div>
                        <div class="text-subtitle-1">{{ $t('reports.total_transactions') }}</div>
                      </div>
                      <v-icon size="48" class="opacity-75">mdi-swap-horizontal</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card class="bg-info text-white pa-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-h4 font-weight-bold">{{ formatCurrency(companySummary.total_income) }}</div>
                        <div class="text-subtitle-1">{{ $t('reports.total_income') }}</div>
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
                        <div class="text-h4 font-weight-bold">{{ formatCurrency(companySummary.total_expense) }}</div>
                        <div class="text-subtitle-1">{{ $t('reports.total_expense') }}</div>
                      </div>
                      <v-icon size="48" class="opacity-75">mdi-trending-down</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card class="bg_primary_blue text-white pa-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-h4 font-weight-bold">{{ formatCurrency(companySummary.net_amount) }}</div>
                        <div class="text-subtitle-1">{{ $t('reports.net_amount') }}</div>
                      </div>
                      <v-icon size="48" class="opacity-75">mdi-currency-usd</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fines Summary -->
    <v-row v-if="companySummary" class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-alert-circle</v-icon>
            {{ $t('reports.fines_summary') }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="bg-secondary text-white pa-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-h4 font-weight-bold">{{ companySummary.total_fines }}</div>
                        <div class="text-subtitle-1">{{ $t('reports.total_fines') }}</div>
                      </div>
                      <v-icon size="48" class="opacity-75">mdi-alert-circle</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="bg_light_secondary text-white pa-4">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-h4 font-weight-bold">{{ formatCurrency(companySummary.total_fines_amount) }}</div>
                        <div class="text-subtitle-1">{{ $t('reports.total_fines_amount') }}</div>
                      </div>
                      <v-icon size="48" class="opacity-75">mdi-currency-usd</v-icon>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row v-if="companySummary" class="mb-6">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-chart-pie</v-icon>
            {{ $t('reports.income_vs_expense') }}
          </v-card-title>
          <v-card-text>
            <div class="text-center pa-8">
              <v-progress-circular
                :model-value="incomePercentage"
                :size="120"
                :width="15"
                color="success"
                class="mb-4"
              >
                {{ incomePercentage }}%
              </v-progress-circular>
              <div class="text-h6">{{ $t('reports.income') }}</div>
            </div>
            <div class="text-center pa-8">
              <v-progress-circular
                :model-value="expensePercentage"
                :size="120"
                :width="15"
                color="error"
                class="mb-4"
              >
                {{ expensePercentage }}%
              </v-progress-circular>
              <div class="text-h6">{{ $t('reports.expense') }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-chart-bar</v-icon>
            {{ $t('reports.fines_distribution') }}
          </v-card-title>
          <v-card-text>
            <div class="text-center pa-8">
              <v-progress-circular
                :model-value="leftSidePercentage"
                :size="120"
                :width="15"
                color="primary"
                class="mb-4"
              >
                {{ leftSidePercentage }}%
              </v-progress-circular>
              <div class="text-h6">{{ $t('reports.left_side') }}</div>
            </div>
            <div class="text-center pa-8">
              <v-progress-circular
                :model-value="rightSidePercentage"
                :size="120"
                :width="15"
                color="secondary"
                class="mb-4"
              >
                {{ rightSidePercentage }}%
              </v-progress-circular>
              <div class="text-h6">{{ $t('reports.right_side') }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detailed Reports -->
    <v-row v-if="companySummary">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-swap-horizontal</v-icon>
            {{ $t('reports.recent_transactions') }}
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              variant="text"
              block
              @click="$router.push('/transactions')"
            >
              {{ $t('reports.view_all_transactions') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-alert-circle</v-icon>
            {{ $t('reports.recent_fines') }}
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              variant="text"
              block
              @click="$router.push('/fines')"
            >
              {{ $t('reports.view_all_fines') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="!selectedCompany">
      <v-col cols="12">
        <v-card elevation="2" class="text-center pa-8">
          <v-icon size="64" class="text_secondary mb-4">mdi-chart-line</v-icon>
          <h3 class="text_secondary mb-4">{{ $t('reports.no_company_selected') }}</h3>
          <p class="text_secondary mb-6">{{ $t('reports.select_company_description') }}</p>
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
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '@/stores/company'
import { useFineStore } from '@/stores/fine'

export default {
  name: 'Reports',
  setup() {
    const { t } = useI18n()
    const companyStore = useCompanyStore()
    const fineStore = useFineStore()

    const loading = ref(false)
    const companies = ref([])
    const selectedCompany = ref(null)
    const companySummary = ref(null)

    // Load companies
    const loadCompanies = async () => {
      try {
        const result = await companyStore.getUserCompanies()
        if (result.success) {
          companies.value = companyStore.companies
          if (companies.value.length > 0) {
            selectedCompany.value = companies.value[0].id
            await loadCompanySummary()
          }
        }
      } catch (error) {
        console.error('Error loading companies:', error)
      }
    }

    // Load company summary
    const loadCompanySummary = async () => {
      if (!selectedCompany.value) return
      
      loading.value = true
      try {
        const result = await companyStore.getCompanySummary(selectedCompany.value)
        if (result.success) {
          companySummary.value = companyStore.companySummary
        }
      } catch (error) {
        console.error('Error loading company summary:', error)
      } finally {
        loading.value = false
      }
    }

    // Export report
    const exportReport = () => {
      // Implementation for exporting report
      console.log('Exporting report for company:', selectedCompany.value)
    }

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP'
      }).format(amount)
    }

    // Calculate percentages
    const incomePercentage = computed(() => {
      if (!companySummary.value) return 0
      const total = companySummary.value.total_income + companySummary.value.total_expense
      return total > 0 ? Math.round((companySummary.value.total_income / total) * 100) : 0
    })

    const expensePercentage = computed(() => {
      if (!companySummary.value) return 0
      const total = companySummary.value.total_income + companySummary.value.total_expense
      return total > 0 ? Math.round((companySummary.value.total_expense / total) * 100) : 0
    })

    const leftSidePercentage = computed(() => {
      if (!companySummary.value || companySummary.value.total_fines === 0) return 0
      // This would need to be calculated from actual fines data
      return 50 // Placeholder
    })

    const rightSidePercentage = computed(() => {
      if (!companySummary.value || companySummary.value.total_fines === 0) return 0
      // This would need to be calculated from actual fines data
      return 50 // Placeholder
    })

    // Load data on mount
    onMounted(() => {
      loadCompanies()
    })

    return {
      loading,
      companies,
      selectedCompany,
      companySummary,
      loadCompanies,
      loadCompanySummary,
      exportReport,
      formatCurrency,
      incomePercentage,
      expensePercentage,
      leftSidePercentage,
      rightSidePercentage
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