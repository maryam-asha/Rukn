<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.fines') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('fines.manage_your_fines') }}
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
                  :label="$t('fines.company')"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  @update:model-value="loadFines"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.driver"
                  :label="$t('fines.driver_name')"
                  @update:model-value="loadFines"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.car"
                  :label="$t('fines.car_number')"
                  @update:model-value="loadFines"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.side"
                  :label="$t('fines.side')"
                  :items="sideOptions"
                  @update:model-value="loadFines"
                ></v-select>
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
                <div class="text-h4 font-weight-bold">{{ fines.length }}</div>
                <div class="text-subtitle-1">{{ $t('fines.total_fines') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-alert-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg_primary_blue text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ formatCurrency(fineStore.totalFinesAmount) }}</div>
                <div class="text-subtitle-1">{{ $t('fines.total_amount') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-currency-usd</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg-secondary text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ fineStore.leftSideFines.length }}</div>
                <div class="text-subtitle-1">{{ $t('fines.left_side') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-arrow-left</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="bg_light_secondary text-white pa-4">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ fineStore.rightSideFines.length }}</div>
                <div class="text-subtitle-1">{{ $t('fines.right_side') }}</div>
              </div>
              <v-icon size="48" class="opacity-75">mdi-arrow-right</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Fine Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="showAddModal = true"
        >
          {{ $t('fines.add_fine') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Fines Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-alert-circle</v-icon>
            {{ $t('fines.fines_list') }}
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="fines"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.side="{ item }">
                <v-chip :color="item.side === 'left' ? 'primary' : 'secondary'" size="small">
                  {{ item.side === 'left' ? $t('fines.left') : $t('fines.right') }}
                </v-chip>
              </template>
              <template v-slot:item.amount="{ item }">
                <span class="font-weight-bold text-error">{{ formatCurrency(item.amount) }}</span>
              </template>
              <template v-slot:item.fine_date="{ item }">
                {{ formatDate(item.fine_date) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  @click="editFine(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  @click="deleteFine(item.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Fine Modal -->
    <v-dialog v-model="showAddModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-alert-plus</v-icon>
          {{ editingFine ? $t('fines.edit_fine') : $t('fines.add_fine') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.company_id"
                  :label="$t('fines.company')"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.driver_name"
                  :label="$t('fines.driver_name')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.car_number"
                  :label="$t('fines.car_number')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
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
                  v-model="form.fine_date"
                  :label="$t('fines.fine_date')"
                  type="date"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.side"
                  :label="$t('fines.side')"
                  :items="sideOptions"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
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
            {{ editingFine ? $t('common.save') : $t('common.add') }}
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
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '@/stores/company'
import { useFineStore } from '@/stores/fine'

export default {
  name: 'Fines',
  setup() {
    const { t } = useI18n()
    const companyStore = useCompanyStore()
    const fineStore = useFineStore()

    const loading = ref(false)
    const companies = ref([])
    const fines = ref([])
    const showAddModal = ref(false)
    const editingFine = ref(null)
    const valid = ref(false)

    const filters = reactive({
      company_id: '',
      driver: '',
      car: '',
      side: ''
    })

    const form = reactive({
      company_id: '',
      driver_name: '',
      car_number: '',
      amount: '',
      fine_date: '',
      side: 'left'
    })

    const sideOptions = [
      { title: t('fines.left'), value: 'left' },
      { title: t('fines.right'), value: 'right' }
    ]

    const headers = [
      { title: t('fines.driver_name'), key: 'driver_name' },
      { title: t('fines.car_number'), key: 'car_number' },
      { title: t('common.amount'), key: 'amount' },
      { title: t('fines.fine_date'), key: 'fine_date' },
      { title: t('fines.side'), key: 'side' },
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

    // Load fines
    const loadFines = async () => {
      if (!filters.company_id) return
      
      loading.value = true
      try {
        const params = {
          ...filters,
          perPage: 50
        }
        const result = await fineStore.getCompanyFines(filters.company_id, params)
        if (result.success) {
          fines.value = fineStore.fines
        }
      } catch (error) {
        console.error('Error loading fines:', error)
      } finally {
        loading.value = false
      }
    }

    // Add fine
    const addFine = async () => {
      loading.value = true
      try {
        const result = await fineStore.addFine(form)
        if (result.success) {
          fines.value = fineStore.fines
          closeModal()
        }
      } catch (error) {
        console.error('Error adding fine:', error)
      } finally {
        loading.value = false
      }
    }

    // Edit fine
    const editFine = (fine) => {
      editingFine.value = fine
      form.company_id = fine.company_id
      form.driver_name = fine.driver_name
      form.car_number = fine.car_number
      form.amount = fine.amount
      form.fine_date = fine.fine_date
      form.side = fine.side
      showAddModal.value = true
    }

    const updateFine = async () => {
      loading.value = true
      try {
        const result = await fineStore.updateFine(editingFine.value.id, form)
        if (result.success) {
          fines.value = fineStore.fines
          closeModal()
        }
      } catch (error) {
        console.error('Error updating fine:', error)
      } finally {
        loading.value = false
      }
    }

    // Delete fine
    const deleteFine = async (fineId) => {
      if (confirm(t('fines.confirm_delete'))) {
        loading.value = true
        try {
          const result = await fineStore.deleteFine(fineId, form)
          if (result.success) {
            fines.value = fineStore.fines
          }
        } catch (error) {
          console.error('Error deleting fine:', error)
        } finally {
          loading.value = false
        }
      }
    }

    // Submit form
    const submitForm = () => {
      if (editingFine.value) {
        updateFine()
      } else {
        addFine()
      }
    }

    // Close modal
    const closeModal = () => {
      showAddModal.value = false
      editingFine.value = null
      form.company_id = companies.value.length > 0 ? companies.value[0].id : ''
      form.driver_name = ''
      form.car_number = ''
      form.amount = ''
      form.fine_date = ''
      form.side = 'left'
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
        await loadFines()
      }
    })

    return {
      loading,
      companies,
      fines,
      showAddModal,
      editingFine,
      valid,
      filters,
      form,
      sideOptions,
      headers,
      fineStore,
      loadCompanies,
      loadFines,
      editFine,
      deleteFine,
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