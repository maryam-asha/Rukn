<!-- <script setup>
import avatar1 from '@/assets/images/avatars/1.jpg'
import avatar2 from '@/assets/images/avatars/2.jpg'
import avatar3 from '@/assets/images/avatars/3.jpg'
import avatar4 from '@/assets/images/avatars/4.jpg'
import avatar5 from '@/assets/images/avatars/5.jpg'
import avatar6 from '@/assets/images/avatars/6.jpg'

const tableExample = [
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'Yiorgos Avraamu',
      new: true,
      registered: 'Jan 1, 2023',
    },
    country: { name: 'USA', flag: 'cif-us' },
    usage: {
      value: 50,
      period: 'Jun 11, 2023 - Jul 10, 2023',
      color: 'success',
    },
    payment: { name: 'Mastercard', icon: 'cib-cc-mastercard' },
    activity: '10 sec ago',
  },
  {
    avatar: { src: avatar2, status: 'danger' },
    user: {
      name: 'Avram Tarasios',
      new: false,
      registered: 'Jan 1, 2023',
    },
    country: { name: 'Brazil', flag: 'cif-br' },
    usage: {
      value: 22,
      period: 'Jun 11, 2023 - Jul 10, 2023',
      color: 'info',
    },
    payment: { name: 'Visa', icon: 'cib-cc-visa' },
    activity: '5 minutes ago',
  },
  {
    avatar: { src: avatar3, status: 'warning' },
    user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
    country: { name: 'India', flag: 'cif-in' },
    usage: {
      value: 74,
      period: 'Jun 11, 2023 - Jul 10, 2023',
      color: 'warning',
    },
    payment: { name: 'Stripe', icon: 'cib-cc-stripe' },
    activity: '1 hour ago',
  },
  {
    avatar: { src: avatar4, status: 'secondary' },
    user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
    country: { name: 'France', flag: 'cif-fr' },
    usage: {
      value: 98,
      period: 'Jun 11, 2023 - Jul 10, 2023',
      color: 'danger',
    },
    payment: { name: 'PayPal', icon: 'cib-cc-paypal' },
    activity: 'Last month',
  },
  {
    avatar: { src: avatar5, status: 'success' },
    user: {
      name: 'Agapetus Tadeáš',
      new: true,
      registered: 'Jan 1, 2023',
    },
    country: { name: 'Spain', flag: 'cif-es' },
    usage: {
      value: 22,
      period: 'Jun 11, 2023 - Jul 10, 2023',
      color: 'primary',
    },
    payment: { name: 'Google Wallet', icon: 'cib-cc-apple-pay' },
    activity: 'Last week',
  },
  {
    avatar: { src: avatar6, status: 'danger' },
    user: {
      name: 'Friderik Dávid',
      new: true,
      registered: 'Jan 1, 2023',
    },
    country: { name: 'Poland', flag: 'cif-pl' },
    usage: {
      value: 43,
      period: 'Jun 11, 2023 - Jul 10, 2023',
      color: 'success',
    },
    payment: { name: 'Amex', icon: 'cib-cc-amex' },
    activity: 'Last week',
  },
]
</script>

<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader class=""> {{ $t('users_table') }} </CCardHeader>
          <CCardBody>
            <CTable align="middle" class="mb-0 border" hover responsive>
              <CTableHead class="text-nowrap">
                <CTableRow>
                  <CTableHeaderCell class="bg_primary_blue text-white text-center">
                    <CIcon name="cil-people" />
                  </CTableHeaderCell>
                  <CTableHeaderCell class="bg_primary_blue text-white"> User </CTableHeaderCell>
                  <CTableHeaderCell class="bg_primary_blue text-white text-center">
                    Country
                  </CTableHeaderCell>
                  <CTableHeaderCell class="bg_primary_blue text-white"> Usage </CTableHeaderCell>
                  <CTableHeaderCell class="bg_primary_blue text-white text-center">
                    Payment Method
                  </CTableHeaderCell>
                  <CTableHeaderCell class="bg_primary_blue text-white"> Activity </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in tableExample" :key="item.name">
                  <CTableDataCell class="text-center">
                    <CAvatar size="md" :src="item.avatar.src" :status="item.avatar.status" />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{{ item.user.name }}</div>
                    <div class="small text-body-secondary text-nowrap">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CIcon size="xl" :name="item.country.flag" :title="item.country.name" />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <div class="fw-semibold">{{ item.usage.value }}%</div>
                      <div class="text-nowrap text-body-secondary small ms-3">
                        {{ item.usage.period }}
                      </div>
                    </div>
                    <CProgress thin :color="item.usage.color" :value="item.usage.value" />
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CIcon size="xl" :name="item.payment.icon" />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div class="small text-body-secondary">Last login</div>
                    <div class="fw-semibold text-nowrap">
                      {{ item.activity }}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template> -->


<template>
  <div>
    <h4 class="mb-3">{{ $t('users') }}</h4>

    <table class="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th @click="sort('name')" role="button">
            {{ $t('name') }}
            <span v-if="sortBy === 'name'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('registered')" role="button">
            {{ $t('registered') }}
            <span v-if="sortBy === 'registered'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('role')" role="button">
            {{ $t('role') }}
            <span v-if="sortBy === 'role'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('status')" role="button">
            {{ $t('status') }}
            <span v-if="sortBy === 'status'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in paginatedItems" :key="i">
          <td>{{ item.name }}</td>
          <td>{{ item.registered }}</td>
          <td>{{ item.role }}</td>
          <td>
            <span
              :class="{
                'badge bg-success': item.status === 'Active',
                'badge bg-danger': item.status === 'Banned',
                'badge bg-secondary': item.status === 'Inactive'
              }"
            >
              {{ item.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <label class="me-2">{{ $t('items_per_page') }}:</label>
        <CFormSelect
          v-model="perPage"
          :options="perPageOptions.map(o => ({ label: o, value: o }))"
          class="w-auto"
        />
      </div>

      <CPagination
        :active-page="currentPage"
        :pages="Math.ceil(items.length / perPage)"
        @update:active-page="val => currentPage = val"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CPagination, CFormSelect } from '@coreui/vue'

const items = ref([
  { name: 'Leopold Gáspár', registered: '2010-02-01', role: 'Staff', status: 'Active' },
  { name: 'Estavan Lykos', registered: '2018-02-07', role: 'Staff', status: 'Banned' },
  { name: 'Estavan Lykos', registered: '2018-02-07', role: 'Staff', status: 'Banned' },
  { name: 'Estavan Lykos', registered: '2018-02-07', role: 'Staff', status: 'Banned' },
  { name: 'Avram Tarasiيبos', registered: '2016-02-12', role: 'Staff', status: 'Banned' },
  { name: 'Avram Tarasioرsي', registered: '2016-02-12', role: 'Staff', status: 'Banned' },
  { name: 'Nehemiah Tatiؤus', registered: '2013-01-05', role: 'Staff', status: 'Banned' },
  { name: 'Nehemiah Tatيius', registered: '2013-01-05', role: 'Staff', status: 'Banned' },
  { name: 'Chetan Mohameرd', registered: '2020-01-15', role: 'Admin', status: 'Inactive' },
  { name: 'Chetan Mohamلed', registered: '2020-01-15', role: 'Admin', status: 'Inactive' },
  { name: 'Chetan Mohamرed', registered: '2020-01-15', role: 'Admin', status: 'Inactive' },
  { name: 'Chetan Mohaيmed', registered: '2020-01-15', role: 'Admin', status: 'Inactive' },
  { name: 'Chetan Mohamبed', registered: '2020-01-15', role: 'Admin', status: 'Inactive' },
  // ➕ أضف بيانات أخرى هنا
])

// إعدادات الباجينيشن
const perPageOptions = [5, 10, 25, 50]
const perPage = ref(5)
const currentPage = ref(1)

// فرز
const sortBy = ref(null)
const sortDir = ref('asc')

function sort(column) {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDir.value = 'asc'
  }

  items.value.sort((a, b) => {
    if (a[column] < b[column]) return sortDir.value === 'asc' ? -1 : 1
    if (a[column] > b[column]) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
}

// عرض البيانات حسب الصفحة وعدد الصفوف
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return items.value.slice(start, start + perPage.value)
})
</script>




//////////////////////*** */
الشكل الكامل بيشبه الديكيومينت
<script setup>
import { ref, computed } from 'vue'
import {
  CAvatar,
  CBadge,
  CButton,
  CCollapse,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
} from '@coreui/vue'

// بيانات تجريبية
const items = ref([
  { id: 1, avatar: '1.jpg', name: 'Yiorgos Avraamu', registered: '2025-01-01', role: 'Member', status: 'Active' },
  { id: 2, avatar: '2.jpg', name: 'Avram Tarasios', registered: '2025-02-15', role: 'Staff', status: 'Inactive' },
  { id: 3, avatar: '3.jpg', name: 'Quintin Ed', registered: '2025-03-20', role: 'Admin', status: 'Pending' },
  { id: 4, avatar: '4.jpg', name: 'Enéas Kwadwo', registered: '2025-04-11', role: 'Member', status: 'Banned' },
  { id: 5, avatar: '5.jpg', name: 'Agapetus Tadeáš', registered: '2025-05-08', role: 'Staff', status: 'Active' },
  { id: 6, avatar: '6.jpg', name: 'Friderik Dávid', registered: '2025-06-01', role: 'Member', status: 'Inactive' },
  { id: 7, avatar: '7.jpg', name: 'Carwyn Fachtna', registered: '2025-06-15', role: 'Staff', status: 'Pending' },
  { id: 8, avatar: '8.jpg', name: 'Leopold Gáspár', registered: '2025-06-20', role: 'Admin', status: 'Active' },
])

// البحث
const search = ref('')

// الترتيب
const sortKey = ref('id')
const sortAsc = ref(true)

// الصفحات
const currentPage = ref(1)
const perPage = ref(5) // القيمة الابتدائية
const perPageOptions = [5, 10, 25, 50] // القيم المسموح بها

// التفاصيل
const details = ref([])

const toggleDetails = (id) => {
  if (details.value.includes(id)) {
    details.value = details.value.filter((d) => d !== id)
  } else {
    details.value.push(id)
  }
}

// التاريخ
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// اللون
const getBadge = (status) => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

// فلترة + ترتيب
const filteredAndSortedItems = computed(() => {
  let data = [...items.value]

  if (search.value) {
    data = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.value.toLowerCase())
      )
    )
  }

  data.sort((a, b) => {
    let result = 0
    if (a[sortKey.value] < b[sortKey.value]) result = -1
    if (a[sortKey.value] > b[sortKey.value]) result = 1
    return sortAsc.value ? result : -result
  })

  return data
})

// البيانات حسب الصفحة
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredAndSortedItems.value.slice(start, end)
})

// عدد الصفحات
const pageCount = computed(() =>
  Math.ceil(filteredAndSortedItems.value.length / perPage.value)
)

const changeSort = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <CFormInput v-model="search" placeholder="ابحث..." style="max-width: 250px" />
    <div class="d-flex align-items-center">
      <label class="me-2">Rows per page:</label>
      <CFormSelect v-model="perPage" :options="perPageOptions.map(v => ({ value: v, label: v }))" style="width: 100px" />
    </div>
  </div>

  <CTable bordered hover responsive>
    <CTableHead color="light">
      <CTableRow>
        <CTableHeaderCell @click="changeSort('id')" style="cursor: pointer">#</CTableHeaderCell>
        <CTableHeaderCell>Avatar</CTableHeaderCell>
        <CTableHeaderCell @click="changeSort('name')" style="cursor: pointer">Name</CTableHeaderCell>
        <CTableHeaderCell @click="changeSort('registered')" style="cursor: pointer">Registered</CTableHeaderCell>
        <CTableHeaderCell @click="changeSort('role')" style="cursor: pointer">Role</CTableHeaderCell>
        <CTableHeaderCell @click="changeSort('status')" style="cursor: pointer">Status</CTableHeaderCell>
        <CTableHeaderCell>Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow v-for="item in paginatedItems" :key="item.id">
        <CTableDataCell>{{ item.id }}</CTableDataCell>
        <CTableDataCell>
          <CAvatar :src="`/images/avatars/${item.avatar}`" />
        </CTableDataCell>
        <CTableDataCell>{{ item.name }}</CTableDataCell>
        <CTableDataCell>{{ formatDate(item.registered) }}</CTableDataCell>
        <CTableDataCell>{{ item.role }}</CTableDataCell>
        <CTableDataCell>
          <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
        </CTableDataCell>
        <CTableDataCell>
          <CButton size="sm" color="primary" variant="outline" @click="toggleDetails(item.id)">
            {{ details.includes(item.id) ? 'Hide' : 'Show' }}
          </CButton>
        </CTableDataCell>
      </CTableRow>

      <!-- تفاصيل -->
      <CTableRow v-for="item in paginatedItems" :key="`details-${item.id}`">
        <CTableDataCell colspan="7" class="p-0 border-0">
          <CCollapse :visible="details.includes(item.id)">
            <div class="p-3">
              <h5>{{ item.name }}</h5>
              <p class="text-body-secondary">User since: {{ formatDate(item.registered) }}</p>
              <CButton size="sm" color="info">User Settings</CButton>
              <CButton size="sm" color="danger" class="ms-1">Delete</CButton>
            </div>
          </CCollapse>
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>

  <div class="d-flex justify-content-center mt-3">
    <CPagination aria-label="Page navigation">
      <CPaginationItem
        v-for="page in pageCount"
        :key="page"
        :active="page === currentPage"
        @click="currentPage = page"
      >
        {{ page }}
      </CPaginationItem>
    </CPagination>
  </div>
</template>



