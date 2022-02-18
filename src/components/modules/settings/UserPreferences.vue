<template>
  <div class="user-preferences">
    <lang-switch />

    <hr />

    <div class="center">
      <app-button type="primary" @click="$emit('close')"> {{ $t('common.close') }} </app-button>
    </div>
  </div>
</template>

<script lang="ts">
import LangSwitch from '@/components/LangSwitch.vue'
import Vue from 'vue'
export default Vue.extend({
  components: { LangSwitch },
})
</script>

<style lang="scss" scoped></style>
