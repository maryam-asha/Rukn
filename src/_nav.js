import i18n from '@/locales'

export default [
  {
    component: 'CNavItem',
    name: i18n.global.t('dashboard'),
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
  },
  {
    component: 'CNavItem',
    name: i18n.global.t('users'),
    to: '/users',
    icon: 'cil-user',
    badge: {
      color: 'primary',
    },
  },
]
