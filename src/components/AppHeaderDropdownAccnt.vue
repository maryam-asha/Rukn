<script setup>
import avatar from '@/assets/images/avatars/user.jpg'

</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu >
      <CDropdownItem> <CIcon icon="cil-lock-locked" /> {{ $t('logout') }} </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
