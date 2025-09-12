# دليل تشخيص مشكلة تغيير كلمة المرور

## المشكلة الأصلية
كانت الصفحة تظهر "password reset failed" دون إرسال الطلب للـ API.

## الأسباب المحتملة والحلول

### 1. ملف Auth Store غير موجود ✅ **تم الحل**
**المشكلة**: كان ملف `auth.js` غير موجود في مجلد `stores`
**الحل**: تم إنشاء ملف `src/stores/auth.js` مع دالة `passwordReset`

### 2. دالة passwordReset غير مُعرّفة ✅ **تم الحل**
**المشكلة**: الدالة لم تكن موجودة في الـ store
**الحل**: تم إضافة الدالة مع معالجة شاملة للأخطاء

### 3. عدم وجود ملف API Service ✅ **تم الحل**
**المشكلة**: كان ملف `api.js` موجود لكن قد يحتاج تحسينات
**الحل**: تم التأكد من وجوده وتحسينه

### 4. مشاكل في الترجمة ✅ **تم الحل**
**المشكلة**: مفاتيح الترجمة مفقودة
**الحل**: تم إضافة جميع الترجمات المطلوبة

## الملفات المُنشأة/المُحدّثة

### 1. `src/stores/auth.js` - جديد
```javascript
export const useAuthStore = defineStore('auth', () => {
  const passwordReset = async (formData) => {
    // معالجة شاملة للطلب والأخطاء
  }
})
```

### 2. `src/views/ChangePassword.vue` - محسّن
- إضافة تحقق إضافي من البيانات
- تحسين معالجة الأخطاء
- إضافة معلومات تشخيصية
- تحسين تجربة المستخدم

### 3. `src/locales/ar.json` - محدّث
- إضافة ترجمات جديدة
- إضافة رسائل الأخطاء

### 4. `.env` - جديد
- إعداد متغيرات البيئة

## كيفية التشخيص

### 1. افتح Developer Tools
- اضغط F12 في المتصفح
- انتقل إلى تبويب Console
- انتقل إلى تبويب Network

### 2. تحقق من Console Logs
ستظهر الرسائل التالية:
```
🔧 Component mounted, checking auth store...
Auth store: [object Object]
Password reset method: function
🔍 Starting form validation...
✅ Form validation passed
🚀 Reset form submitted with data: {user_name: "...", new_password: "...", new_password_confirmation: "..."}
📡 Calling authStore.passwordReset...
📡 Password reset response: {...}
```

### 3. تحقق من Network Tab
- يجب أن تظهر طلب POST إلى `/api/password-reset`
- تحقق من Status Code (200, 400, 500, etc.)
- تحقق من Request Payload
- تحقق من Response

## اختبار الحل

### 1. تأكد من تشغيل الخادم
```bash
# تأكد من تشغيل Laravel API
php artisan serve
# أو
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. تأكد من إعدادات CORS
في ملف `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### 3. تحقق من Route في Laravel
```php
// في routes/api.php
Route::post('/password-reset', [AuthController::class, 'passwordReset']);
```

### 4. تحقق من Controller
```php
public function passwordReset(Request $request)
{
    $request->validate([
        'user_name' => 'required|string',
        'new_password' => 'required|string|min:6',
        'new_password_confirmation' => 'required|string|same:new_password'
    ]);
    
    // منطق تغيير كلمة المرور
    
    return response()->json([
        'success' => true,
        'message' => 'Password reset request sent successfully'
    ]);
}
```

## رسائل الخطأ الشائعة

### 1. "Auth store not found"
**الحل**: تأكد من استيراد الـ store بشكل صحيح

### 2. "passwordReset method not found"
**الحل**: تأكد من وجود الدالة في الـ store

### 3. "Network Error"
**الحل**: تحقق من:
- تشغيل الخادم
- صحة URL
- إعدادات CORS

### 4. "CORS Error"
**الحل**: أضف إعدادات CORS في Laravel

### 5. "Validation Error"
**الحل**: تحقق من البيانات المرسلة

## معلومات إضافية للتشخيص

### 1. Debug Mode
في وضع التطوير، ستظهر معلومات تشخيصية في أسفل الصفحة

### 2. Console Logs
جميع العمليات مسجلة في Console مع رموز تعبيرية للسهولة

### 3. Network Monitoring
راقب طلبات الشبكة في Developer Tools

## الخطوات التالية

1. **اختبر الصفحة** مع البيانات الصحيحة
2. **راقب Console** للأخطاء
3. **تحقق من Network** للطلبات
4. **اختبر مع بيانات خاطئة** للتأكد من معالجة الأخطاء
5. **اختبر مع خادم غير متاح** للتأكد من رسائل الخطأ

إذا استمرت المشكلة، تحقق من:
- إعدادات الخادم
- إعدادات قاعدة البيانات
- إعدادات الـ API
- إعدادات الشبكة