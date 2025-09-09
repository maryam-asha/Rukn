# مرجع API - API Reference

## نظرة عامة

هذا المرجع يحتوي على جميع خدمات API المتاحة في النظام مع أمثلة على الاستخدام.

## Base URL
```
http://localhost:8000
```

## Headers المطلوبة
```javascript
{
  "Accept": "application/json",
  "Content-Type": "application/json" // أو "multipart/form-data" للطلبات التي تحتوي على ملفات
}
```

## Authentication
جميع الطلبات المحمية تتطلب Bearer Token:
```javascript
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

---

## خدمات المصادقة (Authentication Services)

### 1. تسجيل دخول المدير
```http
POST /api/admin/login
Content-Type: multipart/form-data

user_name: admin
password: password
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "user_name": "admin"
  }
}
```

### 2. تسجيل خروج المدير
```http
POST /api/admin/logout
Authorization: Bearer YOUR_TOKEN
```

### 3. تسجيل مستخدم جديد
```http
POST /api/user/register_request
Content-Type: multipart/form-data

name: John Doe
user_name: johndoe
email: john@example.com
phone: +1234567890
password: password123
password_confirmation: password123
```

### 4. تسجيل دخول المستخدم
```http
POST /api/user/login
Content-Type: multipart/form-data

user_name: johndoe
password: password123
```

### 5. تسجيل خروج المستخدم
```http
POST /api/user/logout
Authorization: Bearer YOUR_TOKEN
```

---

## خدمات إدارة المستخدمين (User Management Services)

### 1. الحصول على المستخدمين
```http
GET /api/admin/get_users?status=pending&perPage=12&from_date=2025-01-01&to_date=2025-01-31
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `status` (optional): `pending`, `accepted`, `rejected`
- `perPage` (optional): عدد العناصر في الصفحة (default: 12)
- `from_date` (optional): تاريخ البداية (YYYY-MM-DD)
- `to_date` (optional): تاريخ النهاية (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "user_name": "johndoe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "pending",
      "is_blocked": false,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "current_page": 1,
  "last_page": 5,
  "per_page": 12,
  "total": 50
}
```

### 2. تغيير حالة الحساب
```http
POST /api/admin/change_account_status
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

user_id: 1
status: accepted
reason: Account approved by admin
```

**Status Values:**
- `accepted`: قبول الحساب
- `rejected`: رفض الحساب (يتطلب reason)

### 3. حظر/إلغاء حظر مستخدم
```http
POST /api/admin/toggle_block_user
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

user_id: 1
```

### 4. حذف مستخدم
```http
DELETE /api/admin/delete_user/1
Authorization: Bearer YOUR_TOKEN
```

---

## خدمات إدارة كلمة المرور (Password Management Services)

### 1. الحصول على طلبات إعادة تعيين كلمة المرور
```http
GET /api/admin/get_password_resets?status=pending&perPage=12&from_date=2025-01-01&to_date=2025-01-31
Authorization: Bearer YOUR_TOKEN
```

### 2. تغيير حالة طلب إعادة تعيين كلمة المرور
```http
POST /api/admin/change_password_reset_status
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

password_reset_id: 1
status: accepted
reason: Password reset approved
```

### 3. طلب إعادة تعيين كلمة المرور (للمستخدم)
```http
POST /api/user/add_password_reset
Content-Type: multipart/form-data

user_name: johndoe
new_password: newpassword123
new_password_confirmation: newpassword123
```

---

## خدمات إدارة الشركات (Company Management Services)

### 1. إضافة شركة
```http
POST /api/user/add_company
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

name: My Company
description: Company description
type: transportation
```

**Type Values:**
- `transportation`: شركة نقل
- `other`: أخرى

### 2. الحصول على شركات المستخدم
```http
GET /api/user/get_user_companies
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "companies": [
    {
      "id": 1,
      "name": "My Company",
      "description": "Company description",
      "type": "transportation",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 3. تحديث شركة
```http
POST /api/user/update_company/1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

name: Updated Company Name
description: Updated description
type: other
```

### 4. حذف شركة
```http
DELETE /api/user/delete_company/1
Authorization: Bearer YOUR_TOKEN
```

---

## خدمات إدارة المعاملات (Transaction Management Services)

### 1. إضافة معاملة
```http
POST /api/user/add_transaction
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

company_id: 1
transaction_type: in
amount: 1000.00
customer_name: Customer Name
transaction_date: 2025-01-15
transaction_description: Transaction description
attachment: [FILE] // optional
```

**Transaction Type Values:**
- `in`: دخل
- `out`: خرج

### 2. تحديث معاملة
```http
POST /api/user/update_transaction/1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

amount: 1500.00
customer_name: Updated Customer Name
transaction_date: 2025-01-16
transaction_description: Updated description
attachment: [FILE] // optional
```

### 3. حذف معاملة
```http
DELETE /api/user/delete_transaction/1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

company_id: 1
transaction_type: in
amount: 1000.00
customer_name: Customer Name
transaction_date: 2025-01-15
transaction_description: Transaction description
attachment: [FILE] // optional
```

### 4. الحصول على معاملات الشركة
```http
GET /api/user/get_company_transactions/1?fields=id,transaction_type,attachment&type=in&transactionId=14&customer_name=car&from_date=2025-01-01&to_date=2025-01-31&perPage=15
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `fields` (required): الحقول المطلوبة (مفصولة بفاصلة)
- `type` (optional): `in`, `out`
- `transactionId` (optional): معرف المعاملة
- `customer_name` (optional): اسم العميل
- `from_date` (optional): تاريخ البداية
- `to_date` (optional): تاريخ النهاية
- `perPage` (optional): عدد العناصر في الصفحة

---

## خدمات إدارة الغرامات (Fine Management Services)

### 1. إضافة غرامة
```http
POST /api/user/add_fine
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

company_id: 1
driver_name: Driver Name
car_number: 12345
amount: 500.00
fine_date: 2025-01-15
side: left
```

**Side Values:**
- `left`: يسار
- `right`: يمين

### 2. تحديث غرامة
```http
POST /api/user/update_fine/1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

driver_name: Updated Driver Name
car_number: 54321
amount: 750.00
fine_date: 2025-01-16
side: right
```

### 3. حذف غرامة
```http
DELETE /api/user/delete_fine/1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

company_id: 1
driver_name: Driver Name
car_number: 12345
amount: 500.00
fine_date: 2025-01-15
side: left
```

### 4. الحصول على غرامات الشركة
```http
GET /api/user/get_company_fines/1?driver=sa&car=45&from_date=2025-01-01&to_date=2025-01-31&perPage=15
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `driver` (optional): اسم السائق
- `car` (optional): رقم السيارة
- `from_date` (optional): تاريخ البداية
- `to_date` (optional): تاريخ النهاية
- `perPage` (optional): عدد العناصر في الصفحة

---

## خدمات التقارير (Report Services)

### 1. ملخص الشركة
```http
GET /api/user/get_company_summary/1
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_transactions": 50,
    "total_income": 10000.00,
    "total_expense": 7500.00,
    "net_amount": 2500.00,
    "total_fines": 5,
    "total_fines_amount": 2500.00
  }
}
```

---

## رموز الحالة (Status Codes)

| Code | Description |
|------|-------------|
| 200 | OK - الطلب نجح |
| 201 | Created - تم إنشاء العنصر بنجاح |
| 400 | Bad Request - بيانات الطلب غير صحيحة |
| 401 | Unauthorized - غير مصرح بالوصول |
| 403 | Forbidden - ممنوع الوصول |
| 404 | Not Found - العنصر غير موجود |
| 422 | Unprocessable Entity - خطأ في التحقق من البيانات |
| 500 | Internal Server Error - خطأ في الخادم |

---

## أمثلة على الاستخدام

### استخدام Axios
```javascript
import axios from 'axios'

// تسجيل الدخول
const login = async (credentials) => {
  const formData = new FormData()
  formData.append('user_name', credentials.user_name)
  formData.append('password', credentials.password)
  
  try {
    const response = await axios.post('/api/user/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

// طلب محمي
const getUsers = async (token) => {
  try {
    const response = await axios.get('/api/admin/get_users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}
```

### استخدام Fetch
```javascript
// تسجيل الدخول
const login = async (credentials) => {
  const formData = new FormData()
  formData.append('user_name', credentials.user_name)
  formData.append('password', credentials.password)
  
  const response = await fetch('/api/user/login', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Login failed')
  }
  
  return await response.json()
}

// طلب محمي
const getUsers = async (token) => {
  const response = await fetch('/api/admin/get_users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  
  return await response.json()
}
```

---

## ملاحظات مهمة

1. **Content-Type**: استخدم `multipart/form-data` للطلبات التي تحتوي على ملفات أو بيانات form
2. **Authentication**: جميع الطلبات المحمية تتطلب Bearer Token في header
3. **Error Handling**: تحقق من `success` field في response للتحقق من نجاح العملية
4. **Pagination**: استخدم `perPage` parameter للتحكم في عدد العناصر المعروضة
5. **Date Format**: استخدم تنسيق `YYYY-MM-DD` للتواريخ
6. **File Upload**: استخدم `FormData` لرفع الملفات

---

## اختبار API

يمكنك استخدام Postman أو أي أداة أخرى لاختبار هذه الخدمات. تأكد من:
1. تعيين Base URL الصحيح
2. إضافة Headers المطلوبة
3. استخدام الصيغة الصحيحة للبيانات
4. التحقق من رموز الحالة والاستجابات