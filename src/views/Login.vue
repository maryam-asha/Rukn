<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h3 class="card-title">{{ $t('login.title') }}</h3>
                <p class="text-muted">{{ $t('login.subtitle') }}</p>
              </div>

              <!-- User Type Selection -->
              <div class="mb-4">
                <div class="btn-group w-100" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    name="userType"
                    id="user"
                    value="user"
                    v-model="userType"
                  />
                  <label class="btn btn-outline-primary" for="user">
                    {{ $t('login.user') }}
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    name="userType"
                    id="admin"
                    value="admin"
                    v-model="userType"
                  />
                  <label class="btn btn-outline-primary" for="admin">
                    {{ $t('login.admin') }}
                  </label>
                </div>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="userName" class="form-label">{{ $t('login.username') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    id="userName"
                    v-model="form.user_name"
                    :placeholder="$t('login.username_placeholder')"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">{{ $t('login.password') }}</label>
                  <div class="input-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      v-model="form.password"
                      :placeholder="$t('login.password_placeholder')"
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

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ $t('login.login_button') }}
                  </button>
                </div>
              </form>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <!-- Register Link -->
              <div class="text-center">
                <p class="mb-0">
                  {{ $t('login.no_account') }}
                  <router-link to="/register" class="text-decoration-none">
                    {{ $t('login.register_link') }}
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()

    const userType = ref('user')
    const showPassword = ref(false)
    const loading = ref(false)
    const error = ref('')

    const form = reactive({
      user_name: '',
      password: ''
    })

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        let result
        if (userType.value === 'admin') {
          result = await authStore.adminLogin(form)
        } else {
          result = await authStore.userLogin(form)
        }

        if (result.success) {
          // Redirect based on user type
          if (userType.value === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        } else {
          error.value = result.error || t('login.login_failed')
        }
      } catch (err) {
        error.value = t('login.login_failed')
      } finally {
        loading.value = false
      }
    }

    return {
      userType,
      showPassword,
      loading,
      error,
      form,
      handleLogin
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.btn-check:checked + .btn-outline-primary {
  background-color: var(--cui-primary);
  border-color: var(--cui-primary);
  color: white;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>