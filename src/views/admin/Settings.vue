<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="bg_primary_green text-white pa-4">
          <v-card-title class="text-h4 font-weight-bold">
            {{ $t('navigation.settings') }}
          </v-card-title>
          <v-card-subtitle class="text-white">
            {{ $t('admin.system_settings') }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- General Settings -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-4">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-cog</v-icon>
            {{ $t('admin.general_settings') }}
          </v-card-title>
          <v-card-text>
            <v-form ref="generalForm" v-model="generalValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="generalSettings.site_name"
                    :label="$t('admin.site_name')"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="generalSettings.site_description"
                    :label="$t('admin.site_description')"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="generalSettings.contact_email"
                    :label="$t('admin.contact_email')"
                    type="email"
                    :rules="[v => !!v || $t('validation.required'), v => /.+@.+\..+/.test(v) || $t('validation.email')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="generalSettings.contact_phone"
                    :label="$t('admin.contact_phone')"
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
              :loading="generalLoading"
              :disabled="!generalValid"
              @click="saveGeneralSettings"
            >
              {{ $t('common.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Security Settings -->
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-shield</v-icon>
            {{ $t('admin.security_settings') }}
          </v-card-title>
          <v-card-text>
            <v-form ref="securityForm" v-model="securityValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="securitySettings.session_timeout"
                    :label="$t('admin.session_timeout')"
                    type="number"
                    suffix="minutes"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="securitySettings.max_login_attempts"
                    :label="$t('admin.max_login_attempts')"
                    type="number"
                    :rules="[v => !!v || $t('validation.required')]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="securitySettings.require_email_verification"
                    :label="$t('admin.require_email_verification')"
                    color="primary"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="securitySettings.enable_two_factor"
                    :label="$t('admin.enable_two_factor')"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="securityLoading"
              :disabled="!securityValid"
              @click="saveSecuritySettings"
            >
              {{ $t('common.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- System Information -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-4">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-information</v-icon>
            {{ $t('admin.system_information') }}
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-server</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.server_version') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">v1.0.0</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-database</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.database_version') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">MySQL 8.0</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="info">mdi-php</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.php_version') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">PHP 8.1</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="warning">mdi-calendar</v-icon>
                </template>
                <v-list-item-title>{{ $t('admin.last_backup') }}</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-bold">{{ formatDate(lastBackup) }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- System Actions -->
        <v-card elevation="2" class="mb-4">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-tools</v-icon>
            {{ $t('admin.system_actions') }}
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              variant="outlined"
              block
              class="mb-2"
              @click="createBackup"
              :loading="backupLoading"
            >
              <v-icon class="me-2">mdi-backup-restore</v-icon>
              {{ $t('admin.create_backup') }}
            </v-btn>
            <v-btn
              color="warning"
              variant="outlined"
              block
              class="mb-2"
              @click="clearCache"
              :loading="cacheLoading"
            >
              <v-icon class="me-2">mdi-delete-sweep</v-icon>
              {{ $t('admin.clear_cache') }}
            </v-btn>
            <v-btn
              color="info"
              variant="outlined"
              block
              class="mb-2"
              @click="viewLogs"
            >
              <v-icon class="me-2">mdi-file-document</v-icon>
              {{ $t('admin.view_logs') }}
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Maintenance Mode -->
        <v-card elevation="2">
          <v-card-title class="text_primary_green">
            <v-icon class="me-2">mdi-wrench</v-icon>
            {{ $t('admin.maintenance_mode') }}
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="maintenanceMode"
              :label="$t('admin.enable_maintenance_mode')"
              color="warning"
              @update:model-value="toggleMaintenanceMode"
            ></v-switch>
            <div v-if="maintenanceMode" class="mt-4">
              <v-textarea
                v-model="maintenanceMessage"
                :label="$t('admin.maintenance_message')"
                rows="3"
                :rules="[v => !!v || $t('validation.required')]"
                required
              ></v-textarea>
            </div>
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
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '@/stores/admin'

export default {
  name: 'AdminSettings',
  setup() {
    const { t } = useI18n()
    const adminStore = useAdminStore()

    const loading = ref(false)
    const generalLoading = ref(false)
    const securityLoading = ref(false)
    const backupLoading = ref(false)
    const cacheLoading = ref(false)
    const generalValid = ref(false)
    const securityValid = ref(false)
    const maintenanceMode = ref(false)
    const maintenanceMessage = ref('')
    const lastBackup = ref(new Date().toISOString())

    const generalSettings = reactive({
      site_name: 'Accountant System',
      site_description: 'Professional Accounting Management System',
      contact_email: 'admin@accountant.com',
      contact_phone: '+963 11 123 4567'
    })

    const securitySettings = reactive({
      session_timeout: 30,
      max_login_attempts: 5,
      require_email_verification: true,
      enable_two_factor: false
    })

    // Save general settings
    const saveGeneralSettings = async () => {
      generalLoading.value = true
      try {
        // Here you would typically make an API call to save the settings
        console.log('General settings saved:', generalSettings)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Error saving general settings:', error)
      } finally {
        generalLoading.value = false
      }
    }

    // Save security settings
    const saveSecuritySettings = async () => {
      securityLoading.value = true
      try {
        // Here you would typically make an API call to save the settings
        console.log('Security settings saved:', securitySettings)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Error saving security settings:', error)
      } finally {
        securityLoading.value = false
      }
    }

    // Create backup
    const createBackup = async () => {
      backupLoading.value = true
      try {
        // Here you would typically make an API call to create a backup
        console.log('Creating backup...')
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        lastBackup.value = new Date().toISOString()
      } catch (error) {
        console.error('Error creating backup:', error)
      } finally {
        backupLoading.value = false
      }
    }

    // Clear cache
    const clearCache = async () => {
      cacheLoading.value = true
      try {
        // Here you would typically make an API call to clear cache
        console.log('Clearing cache...')
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Error clearing cache:', error)
      } finally {
        cacheLoading.value = false
      }
    }

    // View logs
    const viewLogs = () => {
      console.log('Viewing logs...')
      // Here you would typically navigate to a logs page or open a modal
    }

    // Toggle maintenance mode
    const toggleMaintenanceMode = async () => {
      if (maintenanceMode.value && !maintenanceMessage.value) {
        maintenanceMessage.value = t('admin.default_maintenance_message')
      }
      
      try {
        // Here you would typically make an API call to toggle maintenance mode
        console.log('Maintenance mode:', maintenanceMode.value)
        console.log('Maintenance message:', maintenanceMessage.value)
      } catch (error) {
        console.error('Error toggling maintenance mode:', error)
      }
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SY')
    }

    // Load data on mount
    onMounted(() => {
      // Load settings from API
      console.log('Loading settings...')
    })

    return {
      loading,
      generalLoading,
      securityLoading,
      backupLoading,
      cacheLoading,
      generalValid,
      securityValid,
      maintenanceMode,
      maintenanceMessage,
      lastBackup,
      generalSettings,
      securitySettings,
      saveGeneralSettings,
      saveSecuritySettings,
      createBackup,
      clearCache,
      viewLogs,
      toggleMaintenanceMode,
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