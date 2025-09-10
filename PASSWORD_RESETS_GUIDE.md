# دليل استخدام نظام إدارة طلبات إعادة تعيين كلمة المرور

## نظرة عامة

تم إنشاء نظام شامل لإدارة طلبات إعادة تعيين كلمة المرور مع دعم كامل للفلترة والـ Pagination.

## الملفات المُنشأة

### 1. PasswordResets.vue
- **الموقع**: `/src/views/admin/PasswordResets.vue`
- **الوظيفة**: واجهة المستخدم الرئيسية لإدارة طلبات إعادة تعيين كلمة المرور

### 2. admin.js (Store)
- **الموقع**: `/src/stores/admin.js`
- **الوظيفة**: إدارة حالة البيانات والتفاعل مع الـ API

### 3. api.js (Service)
- **الموقع**: `/src/services/api.js`
- **الوظيفة**: خدمة HTTP للتعامل مع طلبات الـ API

### 4. ar.json (الترجمة)
- **الموقع**: `/src/locales/ar.json`
- **الوظيفة**: ملف الترجمة العربية

## الميزات الرئيسية

### 1. الفلترة المتقدمة
- فلترة حسب حالة الطلب (معلق، معتمد، مرفوض)
- فلترة حسب التاريخ (من - إلى)
- البحث النصي في أسماء المستخدمين
- إعادة تعيين المرشحات

### 2. الـ Pagination الذكي
- عرض عدد العناصر في الصفحة (12، 25، 50، 100)
- تنقل بين الصفحات مع عرض رقم الصفحة الحالية
- عرض معلومات الصفحة (من X إلى Y من Z)

### 3. الإحصائيات
- إجمالي الطلبات
- الطلبات المعتمدة
- الطلبات المعلقة
- الطلبات المرفوضة

### 4. إدارة الطلبات
- عرض تفاصيل الطلب
- الموافقة على الطلبات المعلقة
- رفض الطلبات المعلقة
- إضافة سبب للموافقة أو الرفض

## كيفية الاستخدام

### 1. إعداد الـ API

تأكد من أن الـ API يدعم المعاملات التالية:

```javascript
// GET /api/admin/get_password_resets
// المعاملات المدعومة:
{
  page: 1,           // رقم الصفحة
  per_page: 12,      // عدد العناصر في الصفحة
  status: 'pending', // حالة الطلب (اختياري)
  from_date: '2025-01-01', // تاريخ البداية (اختياري)
  to_date: '2025-12-31',   // تاريخ النهاية (اختياري)
  search: 'اسم المستخدم'  // البحث النصي (اختياري)
}
```

### 2. استجابة الـ API المتوقعة

```json
{
  "success": true,
  "message": "Successful operation.",
  "per_page": 12,
  "total": 1,
  "current_page": 1,
  "last_page": 1,
  "from": 1,
  "to": 1,
  "data": [
    {
      "id": 1,
      "user_id": 3,
      "status": "pending",
      "created_at": "2025-09-10T17:27:55.000000Z",
      "user_name": "samir",
      "reason": "نسيت كلمة المرور"
    }
  ]
}
```

### 3. إعداد المتغيرات البيئية

أضف المتغير التالي إلى ملف `.env`:

```env
VUE_APP_API_URL=http://localhost:8000/api
```

### 4. إعداد الـ Router

أضف المسار التالي إلى ملف الـ router:

```javascript
{
  path: '/admin/password-resets',
  name: 'PasswordResets',
  component: () => import('@/views/admin/PasswordResets.vue'),
  meta: { requiresAuth: true, role: 'admin' }
}
```

## الـ API Endpoints المطلوبة

### 1. جلب طلبات إعادة تعيين كلمة المرور
```
GET /api/admin/get_password_resets
```

### 2. تغيير حالة الطلب
```
POST /api/admin/change_password_reset_status/{id}
Body: {
  "status": "approved|rejected",
  "reason": "سبب الموافقة أو الرفض"
}
```

### 3. جلب الإحصائيات (اختياري)
```
GET /api/admin/password_reset_statistics
Response: {
  "success": true,
  "data": {
    "approved": 10,
    "pending": 5,
    "rejected": 2
  }
}
```

## الميزات التقنية

### 1. Debounced Search
- البحث مع تأخير 500ms لتجنب الطلبات المفرطة

### 2. Loading States
- مؤشر تحميل عام للصفحة
- مؤشرات تحميل فردية للأزرار

### 3. Error Handling
- معالجة شاملة للأخطاء
- عرض رسائل خطأ مناسبة للمستخدم

### 4. Responsive Design
- تصميم متجاوب يعمل على جميع الأجهزة
- استخدام Vuetify components

### 5. Internationalization
- دعم كامل للغة العربية
- إمكانية إضافة لغات أخرى

## التخصيص

### 1. تغيير عدد العناصر في الصفحة
```javascript
const itemsPerPageOptions = [12, 25, 50, 100] // في PasswordResets.vue
```

### 2. إضافة فلاتر جديدة
```javascript
const filters = reactive({
  status: '',
  from_date: '',
  to_date: '',
  search: '',
  // أضف فلاتر جديدة هنا
  department: '',
  priority: ''
})
```

### 3. تخصيص الألوان
```css
.bg_primary_green {
  background-color: #your-color !important;
}
```

## استكشاف الأخطاء

### 1. مشاكل الـ API
- تأكد من صحة URL الـ API
- تحقق من صحة الـ authentication token
- تأكد من دعم الـ CORS

### 2. مشاكل الترجمة
- تأكد من تحميل ملف الترجمة العربية
- تحقق من صحة مفاتيح الترجمة

### 3. مشاكل الـ Pagination
- تأكد من إرسال المعاملات الصحيحة للـ API
- تحقق من استجابة الـ API تحتوي على بيانات الـ pagination

## الدعم

لأي استفسارات أو مشاكل، يرجى مراجعة:
1. ملفات الـ console logs
2. Network tab في Developer Tools
3. ملفات الـ store والـ API service