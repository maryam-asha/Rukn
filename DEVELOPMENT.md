# دليل التطوير - Development Guide

## نظرة عامة على النظام

تم إنشاء نظام محاسبة شامل باستخدام Vue.js 3 مع ربط كامل مع API الخلفي. النظام يدعم نوعين من المستخدمين:
- **المستخدمون العاديون**: يمكنهم إدارة شركاتهم ومعاملاتهم وغراماتهم
- **المديرون**: يمكنهم إدارة جميع المستخدمين ومراجعة طلبات التسجيل

## هيكل الملفات

### خدمات API (`src/services/api.js`)
يحتوي على جميع خدمات API منظمة حسب الوظيفة:
- `authService` - خدمات المصادقة
- `userService` - إدارة المستخدمين
- `companyService` - إدارة الشركات
- `transactionService` - إدارة المعاملات
- `fineService` - إدارة الغرامات
- `reportService` - التقارير

### إدارة الحالة (Stores)
كل store مسؤول عن جزء معين من البيانات:

#### Auth Store (`src/stores/auth.js`)
```javascript
// تسجيل دخول المستخدم
const authStore = useAuthStore()
const result = await authStore.userLogin({
  user_name: 'username',
  password: 'password'
})

// تسجيل دخول المدير
const result = await authStore.adminLogin({
  user_name: 'admin',
  password: 'password'
})

// تسجيل الخروج
await authStore.logout()

// التحقق من حالة المصادقة
if (authStore.isAuthenticated) {
  console.log('User is logged in')
}
```

#### User Store (`src/stores/user.js`)
```javascript
const userStore = useUserStore()

// الحصول على المستخدمين
await userStore.getUsers({ status: 'pending' })

// تغيير حالة الحساب
await userStore.changeAccountStatus(userId, 'accepted', 'reason')

// حظر/إلغاء حظر مستخدم
await userStore.toggleBlockUser(userId)
```

#### Company Store (`src/stores/company.js`)
```javascript
const companyStore = useCompanyStore()

// الحصول على شركات المستخدم
await companyStore.getUserCompanies()

// إضافة شركة جديدة
await companyStore.addCompany({
  name: 'Company Name',
  description: 'Description',
  type: 'transportation' // or 'other'
})

// تحديث شركة
await companyStore.updateCompany(companyId, updateData)
```

#### Transaction Store (`src/stores/transaction.js`)
```javascript
const transactionStore = useTransactionStore()

// الحصول على معاملات الشركة
await transactionStore.getCompanyTransactions(companyId, {
  type: 'in', // or 'out'
  from_date: '2025-01-01',
  to_date: '2025-01-31'
})

// إضافة معاملة جديدة
await transactionStore.addTransaction({
  company_id: 1,
  transaction_type: 'in', // or 'out'
  amount: 1000,
  customer_name: 'Customer Name',
  transaction_date: '2025-01-15',
  transaction_description: 'Description',
  attachment: file // optional
})
```

#### Fine Store (`src/stores/fine.js`)
```javascript
const fineStore = useFineStore()

// الحصول على غرامات الشركة
await fineStore.getCompanyFines(companyId, {
  driver: 'driver_name',
  car: 'car_number',
  from_date: '2025-01-01',
  to_date: '2025-01-31'
})

// إضافة غرامة جديدة
await fineStore.addFine({
  company_id: 1,
  driver_name: 'Driver Name',
  car_number: '12345',
  amount: 500,
  fine_date: '2025-01-15',
  side: 'left' // or 'right'
})
```

## استخدام المكونات

### صفحة تسجيل الدخول
```vue
<template>
  <Login />
</template>

<script>
import Login from '@/views/Login.vue'
</script>
```

### صفحة التسجيل
```vue
<template>
  <Register />
</template>

<script>
import Register from '@/views/Register.vue'
</script>
```

## التوجيه والحماية

### إضافة مسار جديد
```javascript
// في src/router/index.js
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPage.vue'),
  meta: { 
    requiresAuth: true, 
    userType: 'user' // or 'admin'
  }
}
```

### التحقق من الصلاحيات في المكون
```vue
<script>
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    
    // التحقق من نوع المستخدم
    if (authStore.isAdmin) {
      // كود خاص بالمدير
    }
    
    if (authStore.isUser) {
      // كود خاص بالمستخدم العادي
    }
  }
}
</script>
```

## الترجمة

### إضافة ترجمة جديدة
```javascript
// في src/locales/ar.json
{
  "new_section": {
    "title": "العنوان الجديد",
    "description": "الوصف الجديد"
  }
}

// في src/locales/en.json
{
  "new_section": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

### استخدام الترجمة في المكون
```vue
<template>
  <h1>{{ $t('new_section.title') }}</h1>
  <p>{{ $t('new_section.description') }}</p>
</template>
```

## معالجة الأخطاء

### في Store
```javascript
try {
  const result = await apiService.someMethod()
  if (result.success) {
    // نجح العمل
    return { success: true, data: result.data }
  } else {
    // فشل العمل
    this.error = result.message
    return { success: false, error: result.message }
  }
} catch (error) {
  // خطأ في الشبكة أو الخادم
  this.error = error.response?.data?.message || 'حدث خطأ غير متوقع'
  return { success: false, error: this.error }
}
```

### في المكون
```vue
<template>
  <div v-if="error" class="alert alert-danger">
    {{ error }}
  </div>
</template>

<script>
export default {
  setup() {
    const store = useSomeStore()
    
    const handleAction = async () => {
      const result = await store.someAction()
      if (!result.success) {
        // عرض رسالة الخطأ
        console.error(result.error)
      }
    }
    
    return { error: store.error, handleAction }
  }
}
</script>
```

## إضافة خدمة API جديدة

### 1. إضافة الدالة في `src/services/api.js`
```javascript
export const newService = {
  // إضافة عنصر جديد
  addItem: (data) => {
    const formData = createFormData(data)
    return api.post('/api/new-endpoint', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // الحصول على العناصر
  getItems: (params = {}) => {
    return api.get('/api/new-endpoint', { params })
  },

  // تحديث عنصر
  updateItem: (id, data) => {
    const formData = createFormData(data)
    return api.post(`/api/new-endpoint/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // حذف عنصر
  deleteItem: (id) => {
    return api.delete(`/api/new-endpoint/${id}`)
  }
}
```

### 2. إنشاء Store جديد
```javascript
// src/stores/newItem.js
import { defineStore } from 'pinia'
import { newService } from '@/services/api'

export const useNewItemStore = defineStore('newItem', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async getItems(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await newService.getItems(params)
        const { data } = response

        if (data.success) {
          this.items = data.data || []
          return { success: true, data: data }
        } else {
          this.error = data.message || 'Failed to fetch items'
          return { success: false, error: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch items'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async addItem(itemData) {
      // تنفيذ إضافة العنصر
    },

    async updateItem(id, itemData) {
      // تنفيذ تحديث العنصر
    },

    async deleteItem(id) {
      // تنفيذ حذف العنصر
    }
  }
})
```

### 3. استخدام Store في المكون
```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="item in items" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { useNewItemStore } from '@/stores/newItem'

export default {
  setup() {
    const newItemStore = useNewItemStore()

    // تحميل البيانات عند إنشاء المكون
    onMounted(() => {
      newItemStore.getItems()
    })

    return {
      items: newItemStore.items,
      loading: newItemStore.loading,
      error: newItemStore.error
    }
  }
}
</script>
```

## نصائح للتطوير

1. **استخدم TypeScript** إذا أمكن لتحسين جودة الكود
2. **اختبر المكونات** قبل إضافتها للمشروع الرئيسي
3. **اتبع معايير الترميز** المستخدمة في المشروع
4. **وثق الكود** بالتعليقات الواضحة
5. **استخدم ESLint** للتحقق من جودة الكود
6. **اختبر على متصفحات مختلفة** للتأكد من التوافق

## استكشاف الأخطاء

### مشاكل شائعة وحلولها

1. **خطأ 401 (Unauthorized)**
   - تحقق من صحة token المصادقة
   - تأكد من انتهاء صلاحية الجلسة

2. **خطأ 404 (Not Found)**
   - تحقق من صحة URL
   - تأكد من وجود الخدمة في الخادم

3. **خطأ 500 (Internal Server Error)**
   - تحقق من البيانات المرسلة
   - راجع سجلات الخادم

4. **مشاكل الترجمة**
   - تأكد من وجود المفتاح في ملفات الترجمة
   - تحقق من صحة بناء الجملة

5. **مشاكل التوجيه**
   - تأكد من صحة المسار
   - تحقق من meta properties