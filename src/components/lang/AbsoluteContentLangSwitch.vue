<template>
  <div class="absolute-content-lang-switch">
    <ContentLangSwitch
      :value="value"
      class="absolute-content-lang-switch__switch"
      vertical
      @input="update"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ContentLangSwitch from './ContentLangSwitch.vue'

export default defineComponent({
  components: { ContentLangSwitch },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['input'],
  methods: {
    update(lang: string) {
      this.$emit('input', lang)
    },
  },
})
</script>

<style lang="scss">
.absolute-content-lang-switch {
  position: absolute;
  left: 100%;
  top: 0;
  height: 100%;

  &__switch {
    position: sticky;
  }
}
</style>
