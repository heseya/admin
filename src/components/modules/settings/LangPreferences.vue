<template>
  <div class="user-preferences">
    <ui-lang-switch />

    <hr />

    <div class="center">
      <app-button type="primary" @click="$emit('close')"> {{ $t('common.close') }} </app-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import UiLangSwitch from '@/components/UiLangSwitch.vue'

export default defineComponent({
  components: { UiLangSwitch },
})
</script>

<style lang="scss" scoped></style>
