import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  // Public routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false, guest: true }
  },
  
  // User routes
  {
    path: '/',
    name: 'UserLayout',
    component: DefaultLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true, userType: 'user' },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true, userType: 'user' }
      },
      {
        path: '/companies',
        name: 'Companies',
        component: () => import('@/views/user/Companies.vue'),
        meta: { requiresAuth: true, userType: 'user' }
      },
      {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('@/views/user/Transactions.vue'),
        meta: { requiresAuth: true, userType: 'user' }
      },
      {
        path: '/fines',
        name: 'Fines',
        component: () => import('@/views/user/Fines.vue'),
        meta: { requiresAuth: true, userType: 'user' }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/views/user/Reports.vue'),
        meta: { requiresAuth: true, userType: 'user' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { requiresAuth: true, userType: 'user' }
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    name: 'AdminLayout',
    component: DefaultLayout,
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, userType: 'admin' },
    children: [
      {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { requiresAuth: true, userType: 'admin' }
      },
      {
        path: '/admin/users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: { requiresAuth: true, userType: 'admin' }
      },
      {
        path: '/admin/password-resets',
        name: 'AdminPasswordResets',
        component: () => import('@/views/admin/PasswordResets.vue'),
        meta: { requiresAuth: true, userType: 'admin' }
      },
      {
        path: '/admin/settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { requiresAuth: true, userType: 'admin' }
      }
    ]
  },

  // Legacy routes for backward compatibility
  {
    path: '/base',
    name: 'Base',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    redirect: '/base/breadcrumbs',
    children:[
      {
        path: '/base/tables',
        name: 'Tables',
        component: () => import('@/views/base/Tables.vue'),
      },
      {
        path: '/base/tabs',
        name: 'Tabs',
        component: () => import('@/views/base/Tabs.vue'),
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
    ],
  },

  // Catch all route - redirect to 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/pages/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Route guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if not already done
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuest = to.matched.some(record => record.meta.guest)
  const requiredUserType = to.matched.find(record => record.meta.userType)?.meta.userType

  // If route requires authentication
  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next('/login')
      return
    }

    // Check user type if specified
    if (requiredUserType && authStore.userType !== requiredUserType) {
      // Redirect to appropriate dashboard based on user type
      if (authStore.userType === 'admin') {
        next('/admin/dashboard')
      } else {
        next('/dashboard')
      }
      return
    }
  }

  // If route is for guests only (login, register)
  if (isGuest && authStore.isAuthenticated) {
    // Redirect authenticated users to appropriate dashboard
    if (authStore.userType === 'admin') {
      next('/admin/dashboard')
    } else {
      next('/dashboard')
    }
    return
  }

  next()
})

export default router
