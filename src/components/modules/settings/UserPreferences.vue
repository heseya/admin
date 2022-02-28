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
import Vue from 'vue'

import UiLangSwitch from '@/components/UiLangSwitch.vue'

export default Vue.extend({
  components: { UiLangSwitch },
})
</script>

<style lang="scss" scoped></style>
