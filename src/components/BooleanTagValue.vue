<template>
  <tag v-if="value" type="success">
    <i :class="trueIcon"></i> {{ trueText || $t('common.yes') }}
  </tag>
  <tag v-else type="error"> <i :class="falseIcon"></i> {{ falseText || $t('common.no') }} </tag>
</template>

<script lang="ts">
import Vue from 'vue'
import Tag from './Tag.vue'

export default Vue.extend({
  components: { Tag },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    trueText: {
      type: String,
      default: '',
    },
    falseText: {
      type: String,
      default: '',
    },
    trueIcon: {
      type: String,
      default: 'bx bx-check',
    },
    falseIcon: {
      type: String,
      default: 'bx bx-x',
    },
  },
})
</script>
