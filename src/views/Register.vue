<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h3 class="card-title">{{ $t('register.title') }}</h3>
                <p class="text-muted">{{ $t('register.subtitle') }}</p>
              </div>

              <!-- Registration Form -->
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">{{ $t('register.name') }} *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="form.name"
                      :placeholder="$t('register.name_placeholder')"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="userName" class="form-label">{{ $t('register.username') }} *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="userName"
                      v-model="form.user_name"
                      :placeholder="$t('register.username_placeholder')"
                      required
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">{{ $t('register.email') }} *</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="form.email"
                      :placeholder="$t('register.email_placeholder')"
                      required
                    />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">{{ $t('register.phone') }} *</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      v-model="form.phone"
                      :placeholder="$t('register.phone_placeholder')"
                      required
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">{{ $t('register.password') }} *</label>
                    <div class="input-group">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        id="password"
                        v-model="form.password"
                        :placeholder="$t('register.password_placeholder')"
                        required
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showPassword = !showPassword"
                      >
                        <i :class="showPassword ? 'cil-eye-slash' : 'cil-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="passwordConfirmation" class="form-label">{{ $t('register.password_confirmation') }} *</label>
                    <div class="input-group">
                      <input
                        :type="showPasswordConfirmation ? 'text' : 'password'"
                        class="form-control"
                        id="passwordConfirmation"
                        v-model="form.password_confirmation"
                        :placeholder="$t('register.password_confirmation_placeholder')"
                        required
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showPasswordConfirmation = !showPasswordConfirmation"
                      >
                        <i :class="showPasswordConfirmation ? 'cil-eye-slash' : 'cil-eye'"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Password Validation -->
                <div v-if="form.password" class="mb-3">
                  <small class="text-muted">{{ $t('register.password_requirements') }}:</small>
                  <ul class="list-unstyled small">
                    <li :class="passwordValidation.length ? 'text-success' : 'text-danger'">
                      <i :class="passwordValidation.length ? 'cil-check' : 'cil-x'"></i>
                      {{ $t('register.password_length') }}
                    </li>
                    <li :class="passwordValidation.match ? 'text-success' : 'text-danger'">
                      <i :class="passwordValidation.match ? 'cil-check' : 'cil-x'"></i>
                      {{ $t('register.password_match') }}
                    </li>
                  </ul>
                </div>

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading || !isFormValid"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ $t('register.register_button') }}
                  </button>
                </div>
              </form>

              <!-- Success Message -->
              <div v-if="success" class="alert alert-success" role="alert">
                <i class="cil-check-circle me-2"></i>
                {{ $t('register.success_message') }}
              </div>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="cil-warning me-2"></i>
                {{ error }}
              </div>

              <!-- Login Link -->
              <div class="text-center">
                <p class="mb-0">
                  {{ $t('register.have_account') }}
                  <router-link to="/login" class="text-decoration-none">
                    {{ $t('register.login_link') }}
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()

    const showPassword = ref(false)
    const showPasswordConfirmation = ref(false)
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)

    const form = reactive({
      name: '',
      user_name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: ''
    })

    const passwordValidation = computed(() => ({
      length: form.password.length >= 6,
      match: form.password === form.password_confirmation && form.password_confirmation.length > 0
    }))

    const isFormValid = computed(() => {
      return form.name &&
             form.user_name &&
             form.email &&
             form.phone &&
             form.password &&
             form.password_confirmation &&
             passwordValidation.value.length &&
             passwordValidation.value.match
    })

    const handleRegister = async () => {
      loading.value = true
      error.value = ''
      success.value = false

      try {
        const result = await authStore.userRegister(form)

        if (result.success) {
          success.value = true
          // Clear form
          Object.keys(form).forEach(key => {
            form[key] = ''
          })
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          error.value = result.error || t('register.register_failed')
        }
      } catch (err) {
        error.value = t('register.register_failed')
      } finally {
        loading.value = false
      }
    }

    return {
      showPassword,
      showPasswordConfirmation,
      loading,
      error,
      success,
      form,
      passwordValidation,
      isFormValid,
      handleRegister
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.list-unstyled li {
  margin-bottom: 0.25rem;
}
</style>