<template>
  <div class="cms-list">
    <span v-if="'label' in value" class="cms-list__header">{{ value.label }}</span>
    <ul v-if="'items' in value" class="cms-list__list">
      <li v-for="(singleValue, i) in value.items" :key="String(singleValue) + i">
        <copiable-tag :text="singleValue" />
      </li>
    </ul>
    <ul v-else class="cms-list__list">
      <li v-for="(singleValue, i) in value" :key="String(singleValue) + i" @click.stop>
        <copiable-tag :text="singleValue" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { CmsListType } from '@/interfaces/CmsTable'
import Vue, { PropOptions } from 'vue'
import CopiableTag from '../CopiableTag.vue'

export default Vue.extend({
  components: {
    CopiableTag,
  },

  props: {
    value: {
      type: Array,
      required: true,
    } as PropOptions<string[] | CmsListType>,
  },
})
</script>

<style scoped lang="scss">
.cms-list {
  &__header {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>
