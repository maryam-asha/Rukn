# نظام المحاسبة - Accountant System

نظام محاسبة شامل مبني باستخدام Vue.js 3 مع ربط كامل مع API الخلفي.

## ✅ ما تم إنجازه

### البنية الأساسية
- ✅ إعداد مشروع Vue.js 3 مع Vite
- ✅ تكوين Pinia لإدارة الحالة
- ✅ إعداد Vue Router مع Route Guards
- ✅ تكوين Axios للطلبات HTTP
- ✅ إعداد الترجمة (عربي/إنجليزي)

### خدمات API
- ✅ ملف API service شامل لجميع الخدمات
- ✅ HTTP Interceptors للمصادقة
- ✅ معالجة الأخطاء التلقائية

### إدارة الحالة (Stores)
- ✅ Auth Store - إدارة المصادقة
- ✅ User Store - إدارة المستخدمين
- ✅ Company Store - إدارة الشركات
- ✅ Transaction Store - إدارة المعاملات
- ✅ Fine Store - إدارة الغرامات
- ✅ Admin Store - إدارة لوحة التحكم

### الصفحات
- ✅ صفحة تسجيل الدخول (Login.vue)
- ✅ صفحة التسجيل (Register.vue)
- ✅ Route Guards للحماية

### الوثائق
- ✅ README.md - دليل المشروع
- ✅ DEVELOPMENT.md - دليل التطوير
- ✅ EXAMPLES.md - أمثلة عملية
- ✅ API_REFERENCE.md - مرجع API
- ✅ INSTALLATION.md - دليل التثبيت
- ✅ COMPONENTS_LIST.md - قائمة المكونات

## 🚀 التشغيل السريع

```bash
# 1. تثبيت المتطلبات
npm install

# 2. تشغيل المشروع
npm run dev

# 3. فتح المتصفح
# http://localhost:3000
```

## 📁 هيكل المشروع

```
src/
├── services/api.js          # ✅ خدمات API
├── stores/                  # ✅ إدارة الحالة
│   ├── auth.js             # ✅ المصادقة
│   ├── user.js             # ✅ المستخدمين
│   ├── company.js          # ✅ الشركات
│   ├── transaction.js      # ✅ المعاملات
│   ├── fine.js             # ✅ الغرامات
│   └── admin.js            # ✅ المدير
├── views/
│   ├── Login.vue           # ✅ تسجيل الدخول
│   └── Register.vue        # ✅ التسجيل
├── router/index.js         # ✅ التوجيه والحماية
├── locales/                # ✅ الترجمة
└── main.js                 # ✅ نقطة البداية
```

## 🔧 التقنيات المستخدمة

- **Vue.js 3** - إطار العمل الرئيسي
- **Pinia** - إدارة الحالة
- **Vue Router** - التوجيه
- **Axios** - طلبات HTTP
- **CoreUI** - واجهة المستخدم
- **Vue i18n** - الترجمة

## 📋 المطلوب إنجازه

### الصفحات المطلوبة
- [ ] Dashboard.vue - لوحة تحكم المستخدم
- [ ] Companies.vue - إدارة الشركات
- [ ] Transactions.vue - إدارة المعاملات
- [ ] Fines.vue - إدارة الغرامات
- [ ] Reports.vue - التقارير
- [ ] Admin/Dashboard.vue - لوحة تحكم المدير
- [ ] Admin/Users.vue - إدارة المستخدمين

### المكونات المشتركة
- [ ] LoadingSpinner.vue
- [ ] ErrorAlert.vue
- [ ] DataTable.vue
- [ ] Modal.vue
- [ ] FileUpload.vue

## 🎯 الخطوات التالية

1. **إنشاء الصفحات المطلوبة** باستخدام الـ stores الموجودة
2. **إضافة المكونات المشتركة** للواجهة
3. **اختبار النظام** مع API الخلفي
4. **تحسين التصميم** والتفاعل
5. **إضافة المزيد من الميزات** حسب الحاجة

## 📚 الوثائق المتاحة

- [دليل التطوير](DEVELOPMENT.md)
- [أمثلة عملية](EXAMPLES.md)
- [مرجع API](API_REFERENCE.md)
- [دليل التثبيت](INSTALLATION.md)
- [قائمة المكونات](COMPONENTS_LIST.md)

## 🤝 المساهمة

المشروع جاهز للتطوير! يمكنك:
1. إنشاء الصفحات المطلوبة
2. إضافة المكونات المشتركة
3. تحسين التصميم
4. إضافة ميزات جديدة

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.