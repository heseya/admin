<template>
  <div class="cms-list">
    <span class="cms-list__header">
      <slot name="title">{{ title }}</slot>
    </span>

    <ul class="cms-list__list">
      <li v-for="(singleValue, i) in items" :key="String(singleValue) + i">
        <copyable-tag :text="singleValue" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import CopyableTag from '../CopyableTag.vue'

export default Vue.extend({
  components: {
    CopyableTag,
  },

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    } as PropOptions<string[]>,
  },
})
</script>

<style scoped lang="scss">
.cms-list {
  &__header {
    display: block;
    font-size: 13px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>
