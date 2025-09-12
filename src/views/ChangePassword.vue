<template>
  <div class="min-vh-100 d-flex align-items-center bg-light change_password section_login">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6" :lg="4">
          <CCard class="shadow-lg border-0">
            <CCardBody class="p-4 text-center">
              <div class="mb-4">
                <h3 class="fw-bold text_secondary">{{ $t('change_password') }}</h3>
              </div>

              <CForm
                @submit.prevent="validateAndReset"
                class="needs-validation"
                novalidate
                :validated="validatedReset"
              >
                <CInputGroup class="mb-3">
                  <CInputGroupText class="login_icon">
                    <v-icon>mdi-account</v-icon>
                  </CInputGroupText>
                  <CFormInput
                    required
                    :feedbackInvalid="$t('errors.username_required')"
                    id="userName"
                    v-model="form.user_name"
                    :placeholder="$t('username')"
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText 
                    class="login_icon"
                    role="button"
                    @click="showPassword = !showPassword"
                  >
                    <v-icon v-if="showPassword">mdi-eye-off</v-icon>
                    <v-icon v-else>mdi-eye</v-icon>
                  </CInputGroupText>
                  <CFormInput
                    v-model="form.new_password"
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="`${$t('new_password')} *`"
                    required
                    :feedbackInvalid="$t('errors.password_required')"
                    feedbackValid=""
                    id="new_password" 
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText
                    role="button"
                    @click="showPasswordConfirmation = !showPasswordConfirmation"
                    class="login_icon"
                  >
                    <v-icon v-if="showPasswordConfirmation">mdi-eye-off</v-icon>
                    <v-icon v-else>mdi-eye</v-icon>
                  </CInputGroupText>
                  <CFormInput
                    v-model="form.new_password_confirmation"
                    :type="showPasswordConfirmation ? 'text' : 'password'"
                    :placeholder="`${$t('new_password_confirmation')} *`"
                    required
                    :feedbackInvalid="$t('errors.password_confirmation_required')"
                    feedbackValid=""
                    id="new_password_confirmation" 
                  />
                </CInputGroup>

                <!-- Password validation -->
                <div v-if="form.new_password && form.new_password_confirmation" class="mb-3">
                  <div v-if="!passwordsMatch" class="text-danger small">
                    {{ $t('errors.passwords_do_not_match') }}
                  </div>
                  <div v-else class="text-success small">
                    {{ $t('passwords_match') }}
                  </div>
                </div>

                <div class="d-grid mb-3">
                  <CButton 
                    class="bg_primary_green btn_change text-white" 
                    type="submit" 
                    :disabled="loading || !isFormValid"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? $t('sending') : $t('send_request') }}
                  </CButton>
                </div>
              </CForm>

              <router-link to="/login" class="text-decoration-none">
                <CButton class="px-0 text_secondary mt-1"> {{ $t('login') }}؟ </CButton>
              </router-link>

              <!-- Success Message -->
              <CAlert v-if="successMessage" color="success" class="text-center py-2 mt-3">
                {{ successMessage }}
              </CAlert>

              <!-- Error Message -->
              <CAlert v-if="error" color="danger" class="text-center py-2 mt-3">
                {{ error }}
              </CAlert>

              <!-- Debug Info (only in development) -->
              <div v-if="isDevelopment && debugInfo" class="mt-3 p-2 bg-light rounded small text-start">
                <strong>Debug Info:</strong><br>
                <pre>{{ debugInfo }}</pre>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// Reactive data
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const validatedReset = ref(false)
const debugInfo = ref('')

// Check if we're in development mode
const isDevelopment = ref(process.env.NODE_ENV === 'development')

const form = reactive({
  user_name: '',
  new_password: '',
  new_password_confirmation: ''
})

// Computed properties
const passwordsMatch = computed(() => {
  return form.new_password === form.new_password_confirmation && 
         form.new_password.length > 0
})

const isFormValid = computed(() => {
  return form.user_name.trim() !== '' && 
         form.new_password.length >= 6 && 
         passwordsMatch.value
})

// Methods
const validateAndReset = async (event) => {
  console.log('🔍 Starting form validation...')
  
  const formEl = event.currentTarget
  if (formEl.checkValidity() === false) {
    event.preventDefault()
    event.stopPropagation()
    validatedReset.value = true
    console.log('❌ Form validation failed')
    return
  }
  
  validatedReset.value = true
  console.log('✅ Form validation passed')
  
  // Additional custom validation
  if (!isFormValid.value) {
    error.value = t('errors.form_invalid')
    console.log('❌ Custom validation failed')
    return
  }
  
  await handleReset()
}

const handleReset = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  console.log("🚀 Reset form submitted with data:", form)
  
  // Debug info
  debugInfo.value = JSON.stringify({
    formData: form,
    apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
    timestamp: new Date().toISOString()
  }, null, 2)
  
  try {
    // Check if authStore exists and has passwordReset method
    if (!authStore) {
      throw new Error('Auth store not found')
    }
    
    if (typeof authStore.passwordReset !== 'function') {
      throw new Error('passwordReset method not found in auth store')
    }
    
    console.log('📡 Calling authStore.passwordReset...')
    const result = await authStore.passwordReset(form)
    console.log('📡 Password reset result:', result)
    
    if (result.success) {
      successMessage.value = result.message || t('password_reset_success')
      validatedReset.value = false
      
      // Clear form
      form.user_name = ''
      form.new_password = ''
      form.new_password_confirmation = ''
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      
    } else {
      error.value = result.error || t('password_reset_failed')
      console.log('❌ Password reset failed:', result.error)
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    error.value = err.message || t('password_reset_failed')
  } finally {
    loading.value = false
  }
}

// Check store availability on mount
onMounted(() => {
  console.log('🔧 Component mounted, checking auth store...')
  console.log('Auth store:', authStore)
  console.log('Password reset method:', typeof authStore?.passwordReset)
  
  if (!authStore) {
    error.value = 'Auth store not available'
  } else if (typeof authStore.passwordReset !== 'function') {
    error.value = 'Password reset method not available'
  }
})
</script>

<style scoped>
.change_password {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login_icon {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.bg_primary_green {
  background-color: #28a745 !important;
}

.btn_change:hover {
  background-color: #218838 !important;
}

.text_secondary {
  color: #6c757d !important;
}

.section_login {
  padding: 2rem 0;
}

/* Debug info styling */
pre {
  font-size: 0.75rem;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>