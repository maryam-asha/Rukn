<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.companies') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('companies.manage_your_companies') }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Company Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="showAddModal = true"
        >
          {{ $t('companies.add_company') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Companies Grid -->
    <v-row v-if="companies.length > 0">
      <v-col cols="12" md="6" lg="4" v-for="company in companies" :key="company.id">
        <v-card elevation="2" class="h-100">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">
              {{ company.type === 'transportation' ? 'mdi-truck' : 'mdi-office-building' }}
            </v-icon>
            {{ company.name }}
          </v-card-title>
          <v-card-subtitle>
            <v-chip :color="company.type === 'transportation' ? 'primary' : 'secondary'" size="small">
              {{ company.type }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text>
            <p class="text-body-2">{{ company.description }}</p>
            <div class="text-caption text_secondary">
              {{ $t('common.created_at') }}: {{ formatDate(company.created_at) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click="editCompany(company)"
            >
              <v-icon class="me-1">mdi-pencil</v-icon>
              {{ $t('common.edit') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              variant="text"
              @click="deleteCompany(company.id)"
            >
              <v-icon class="me-1">mdi-delete</v-icon>
              {{ $t('common.delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" class="text-center pa-8">
          <v-icon size="64" class="text_secondary mb-4">mdi-domain-plus</v-icon>
          <h3 class="text_secondary mb-4">{{ $t('companies.no_companies') }}</h3>
          <p class="text_secondary mb-6">{{ $t('companies.add_first_company_description') }}</p>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="showAddModal = true"
          >
            {{ $t('companies.add_first_company') }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Company Modal -->
    <v-dialog v-model="showAddModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-domain-plus</v-icon>
          {{ editingCompany ? $t('companies.edit_company') : $t('companies.add_company') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :label="$t('common.name')"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="form.type"
                  :label="$t('common.type')"
                  :items="companyTypes"
                  :rules="[v => !!v || $t('validation.required')]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
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
            {{ editingCompany ? $t('common.save') : $t('common.add') }}
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

export default {
  name: 'Companies',
  setup() {
    const { t } = useI18n()
    const companyStore = useCompanyStore()

    const loading = ref(false)
    const companies = ref([])
    const showAddModal = ref(false)
    const editingCompany = ref(null)
    const valid = ref(false)

    const form = reactive({
      name: '',
      type: 'transportation',
      description: ''
    })

    const companyTypes = [
      { title: t('companies.transportation'), value: 'transportation' },
      { title: t('companies.other'), value: 'other' }
    ]

    // Load companies
    const loadCompanies = async () => {
      loading.value = true
      try {
        const result = await companyStore.getUserCompanies()
        if (result.success) {
          companies.value = companyStore.companies
        }
      } catch (error) {
        console.error('Error loading companies:', error)
      } finally {
        loading.value = false
      }
    }

    // Add company
    const addCompany = async () => {
      loading.value = true
      try {
        const result = await companyStore.addCompany(form)
        if (result.success) {
          companies.value = companyStore.companies
          closeModal()
        }
      } catch (error) {
        console.error('Error adding company:', error)
      } finally {
        loading.value = false
      }
    }

    // Edit company
    const editCompany = (company) => {
      editingCompany.value = company
      form.name = company.name
      form.type = company.type
      form.description = company.description
      showAddModal.value = true
    }

    const updateCompany = async () => {
      loading.value = true
      try {
        const result = await companyStore.updateCompany(editingCompany.value.id, form)
        if (result.success) {
          companies.value = companyStore.companies
          closeModal()
        }
      } catch (error) {
        console.error('Error updating company:', error)
      } finally {
        loading.value = false
      }
    }

    // Delete company
    const deleteCompany = async (companyId) => {
      if (confirm(t('companies.confirm_delete'))) {
        loading.value = true
        try {
          const result = await companyStore.deleteCompany(companyId)
          if (result.success) {
            companies.value = companyStore.companies
          }
        } catch (error) {
          console.error('Error deleting company:', error)
        } finally {
          loading.value = false
        }
      }
    }

    // Submit form
    const submitForm = () => {
      if (editingCompany.value) {
        updateCompany()
      } else {
        addCompany()
      }
    }

    // Close modal
    const closeModal = () => {
      showAddModal.value = false
      editingCompany.value = null
      form.name = ''
      form.type = 'transportation'
      form.description = ''
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Load data on mount
    onMounted(() => {
      loadCompanies()
    })

    return {
      loading,
      companies,
      showAddModal,
      editingCompany,
      valid,
      form,
      companyTypes,
      loadCompanies,
      editCompany,
      deleteCompany,
      submitForm,
      closeModal,
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