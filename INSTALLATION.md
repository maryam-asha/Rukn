# دليل التثبيت والتشغيل - Installation Guide

## المتطلبات الأساسية

### 1. Node.js
- الإصدار المطلوب: Node.js 16.x أو أحدث
- تحقق من الإصدار: `node --version`
- تحميل من: [nodejs.org](https://nodejs.org/)

### 2. npm أو yarn
- npm يأتي مع Node.js
- أو يمكنك استخدام yarn: `npm install -g yarn`

### 3. Git
- لاستنساخ المشروع
- تحميل من: [git-scm.com](https://git-scm.com/)

---

## خطوات التثبيت

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd accountant-system
```

### 2. تثبيت المتطلبات
```bash
# باستخدام npm
npm install

# أو باستخدام yarn
yarn install
```

### 3. إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل القيم حسب حاجتك
nano .env
```

**محتوى ملف .env:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Accountant System
VITE_APP_VERSION=1.0.0

# Development
VITE_DEBUG=true
```

### 4. تشغيل المشروع
```bash
# وضع التطوير
npm run dev

# أو باستخدام yarn
yarn dev
```

### 5. فتح المتصفح
افتح المتصفح وانتقل إلى: `http://localhost:3000`

---

## إعدادات التطوير

### 1. إعداد VS Code (اختياري)
إنشاء ملف `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "vue-html": "html"
  }
}
```

### 2. إعدادات ESLint
```bash
# تشغيل ESLint
npm run lint

# إصلاح الأخطاء تلقائياً
npm run lint -- --fix
```

### 3. إعدادات Vite
ملف `vite.config.mjs`:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

---

## إعدادات الإنتاج

### 1. بناء المشروع
```bash
npm run build
```

### 2. معاينة الإنتاج
```bash
npm run preview
```

### 3. نشر المشروع
```bash
# نسخ ملفات البناء إلى خادم الويب
cp -r dist/* /var/www/html/

# أو استخدام Docker
docker build -t accountant-system .
docker run -p 80:80 accountant-system
```

---

## إعداد Docker

### 1. إنشاء Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. إنشاء docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    image: your-backend-image
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=accountant
      - DB_USER=user
      - DB_PASSWORD=password

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=accountant
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. تشغيل Docker
```bash
docker-compose up -d
```

---

## استكشاف الأخطاء

### 1. مشاكل التثبيت
```bash
# مسح cache
npm cache clean --force

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### 2. مشاكل البناء
```bash
# التحقق من إصدار Node.js
node --version

# التحقق من إصدار npm
npm --version

# تحديث npm
npm install -g npm@latest
```

### 3. مشاكل الشبكة
```bash
# التحقق من الاتصال بالخادم
curl http://localhost:8000/api/health

# فحص متغيرات البيئة
echo $VITE_API_BASE_URL
```

### 4. مشاكل الترجمة
```bash
# التحقق من ملفات الترجمة
ls -la src/locales/

# التحقق من إعدادات i18n
grep -r "i18n" src/
```

---

## إعدادات الخادم

### 1. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Apache Configuration
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPass /api http://backend:8000/
    ProxyPassReverse /api http://backend:8000/
</VirtualHost>
```

---

## مراقبة الأداء

### 1. تحليل حجم البناء
```bash
# تحليل حجم الملفات
npm run build
npx vite-bundle-analyzer dist/

# أو استخدام webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/assets/*.js
```

### 2. مراقبة الأداء
```javascript
// في main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)

// مراقبة الأداء في التطوير
if (import.meta.env.DEV) {
  app.config.performance = true
}

app.use(createPinia())
app.mount('#app')
```

---

## الأمان

### 1. متغيرات البيئة
```bash
# لا تشارك ملف .env
echo ".env" >> .gitignore

# استخدم متغيرات البيئة في الإنتاج
export VITE_API_BASE_URL=https://api.yourdomain.com
```

### 2. HTTPS
```javascript
// في vite.config.mjs
export default defineConfig({
  server: {
    https: true,
    port: 3000
  }
})
```

### 3. Content Security Policy
```html
<!-- في index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

---

## الصيانة

### 1. تحديث التبعيات
```bash
# فحص التحديثات المتاحة
npm outdated

# تحديث التبعيات
npm update

# تحديث تبعية محددة
npm install package-name@latest
```

### 2. تنظيف النظام
```bash
# حذف الملفات المؤقتة
npm run clean

# أو يدوياً
rm -rf node_modules/.cache
rm -rf dist
```

### 3. نسخ احتياطية
```bash
# نسخ احتياطي للمشروع
tar -czf accountant-system-backup-$(date +%Y%m%d).tar.gz .

# نسخ احتياطي للبيانات
pg_dump -h localhost -U user -d accountant > backup.sql
```

---

## الدعم

### 1. سجلات الأخطاء
```bash
# سجلات التطوير
npm run dev 2>&1 | tee dev.log

# سجلات البناء
npm run build 2>&1 | tee build.log
```

### 2. معلومات النظام
```bash
# معلومات Node.js
node --version
npm --version

# معلومات النظام
uname -a
cat /etc/os-release

# معلومات الذاكرة
free -h
df -h
```

### 3. التواصل
- GitHub Issues: [رابط المشروع]
- البريد الإلكتروني: support@yourdomain.com
- الوثائق: [رابط الوثائق]

---

## ملاحظات إضافية

1. **تأكد من تحديث المتصفح** إلى إصدار حديث يدعم ES6+
2. **استخدم HTTPS** في الإنتاج لضمان الأمان
3. **راقب استخدام الذاكرة** خاصة في الخوادم الصغيرة
4. **اختبر على متصفحات مختلفة** للتأكد من التوافق
5. **احتفظ بنسخ احتياطية** من البيانات والإعدادات