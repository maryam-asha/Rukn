<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.profile') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('profile.manage_your_profile') }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Profile Information -->
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-account</v-icon>
            {{ $t('profile.personal_information') }}
          </v-card-title>
          <v-card-text>
            <v-form ref="profileForm" v-model="profileValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.name"
                    :label="$t('common.name')"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.user_name"
                    :label="$t('login.username')"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.email"
                    :label="$t('common.email')"
                    type="email"
                    :rules="[v => !!v || $t('validation.required'), v => /.+@.+\..+/.test(v) || $t('validation.email')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.phone"
                    :label="$t('common.phone')"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="profileLoading"
              :disabled="!profileValid"
              @click="updateProfile"
            >
              {{ $t('common.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Account Actions -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="mb-4">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-cog</v-icon>
            {{ $t('profile.account_actions') }}
          </v-card-title>
          <v-card-text>
            <v-btn
              color="warning"
              variant="outlined"
              block
              class="mb-2"
              @click="showPasswordModal = true"
            >
              <v-icon class="me-2">mdi-key</v-icon>
              {{ $t('profile.change_password') }}
            </v-btn>
            <v-btn
              color="error"
              variant="outlined"
              block
              @click="logout"
            >
              <v-icon class="me-2">mdi-logout</v-icon>
              {{ $t('navigation.logout') }}
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Account Statistics -->
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-chart-line</v-icon>
            {{ $t('profile.account_statistics') }}
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-domain</v-icon>
                </template>
                <v-list-item-title>{{ $t('profile.total_companies') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ companies.length }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-swap-horizontal</v-icon>
                </template>
                <v-list-item-title>{{ $t('profile.total_transactions') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ transactionStore.transactions.length }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="error">mdi-alert-circle</v-icon>
                </template>
                <v-list-item-title>{{ $t('profile.total_fines') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ fineStore.fines.length }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="info">mdi-calendar</v-icon>
                </template>
                <v-list-item-title>{{ $t('profile.member_since') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ formatDate(authStore.user?.created_at) }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Change Password Modal -->
    <v-dialog v-model="showPasswordModal" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text_primary_green">
          <v-icon class="me-2">mdi-key</v-icon>
          {{ $t('profile.change_password') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="passwordForm" v-model="passwordValid">
            <v-text-field
              v-model="passwordForm.current_password"
              :label="$t('profile.current_password')"
              type="password"
              :rules="[v => !!v || $t('validation.required')]"
              required
            ></v-text-field>
            <v-text-field
              v-model="passwordForm.new_password"
              :label="$t('profile.new_password')"
              type="password"
              :rules="[v => !!v || $t('validation.required'), v => v.length >= 6 || $t('validation.min_length', { min: 6 })]"
              required
            ></v-text-field>
            <v-text-field
              v-model="passwordForm.confirm_password"
              :label="$t('profile.confirm_password')"
              type="password"
              :rules="[v => !!v || $t('validation.required'), v => v === passwordForm.new_password || $t('validation.password_match')]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closePasswordModal"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="passwordLoading"
            :disabled="!passwordValid"
            @click="changePassword"
          >
            {{ $t('profile.change_password') }}
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'
import { useTransactionStore } from '@/stores/transaction'
import { useFineStore } from '@/stores/fine'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const companyStore = useCompanyStore()
    const transactionStore = useTransactionStore()
    const fineStore = useFineStore()

    const loading = ref(false)
    const profileLoading = ref(false)
    const passwordLoading = ref(false)
    const companies = ref([])
    const showPasswordModal = ref(false)
    const profileValid = ref(false)
    const passwordValid = ref(false)

    const profileForm = reactive({
      name: '',
      user_name: '',
      email: '',
      phone: ''
    })

    const passwordForm = reactive({
      current_password: '',
      new_password: '',
      confirm_password: ''
    })

    // Load user data
    const loadUserData = async () => {
      loading.value = true
      try {
        // Load companies
        const companiesResult = await companyStore.getUserCompanies()
        if (companiesResult.success) {
          companies.value = companyStore.companies
        }

        // Load user profile data
        if (authStore.user) {
          profileForm.name = authStore.user.name || ''
          profileForm.user_name = authStore.user.user_name || ''
          profileForm.email = authStore.user.email || ''
          profileForm.phone = authStore.user.phone || ''
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        loading.value = false
      }
    }

    // Update profile
    const updateProfile = async () => {
      profileLoading.value = true
      try {
        // Update user data in auth store
        authStore.updateUser(profileForm)
        // Here you would typically make an API call to update the profile
        console.log('Profile updated:', profileForm)
      } catch (error) {
        console.error('Error updating profile:', error)
      } finally {
        profileLoading.value = false
      }
    }

    // Change password
    const changePassword = async () => {
      passwordLoading.value = true
      try {
        const result = await authStore.passwordReset(
          authStore.userName,
          passwordForm.new_password,
          passwordForm.confirm_password
        )
        if (result.success) {
          closePasswordModal()
        }
      } catch (error) {
        console.error('Error changing password:', error)
      } finally {
        passwordLoading.value = false
      }
    }

    // Logout
    const logout = async () => {
      if (confirm(t('profile.confirm_logout'))) {
        await authStore.logout()
        router.push('/login')
      }
    }

    // Close password modal
    const closePasswordModal = () => {
      showPasswordModal.value = false
      passwordForm.current_password = ''
      passwordForm.new_password = ''
      passwordForm.confirm_password = ''
    }

    // Format date
    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Load data on mount
    onMounted(() => {
      loadUserData()
    })

    return {
      loading,
      profileLoading,
      passwordLoading,
      companies,
      showPasswordModal,
      profileValid,
      passwordValid,
      profileForm,
      passwordForm,
      authStore,
      companyStore,
      transactionStore,
      fineStore,
      loadUserData,
      updateProfile,
      changePassword,
      logout,
      closePasswordModal,
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