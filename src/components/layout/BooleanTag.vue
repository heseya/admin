<template>
  <tag v-if="value" :type="trueType" :small="small">
    <i :class="trueIcon"></i> {{ trueText || $t('common.yes') }}
  </tag>
  <tag v-else :type="falseType">
    <i :class="falseIcon"></i> {{ falseText || $t('common.no') }}
  </tag>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    small: {
      type: Boolean,
      default: false,
    },

    trueText: {
      type: String,
      default: null,
    },
    falseText: {
      type: String,
      default: null,
    },

    trueIcon: {
      type: String,
      default: 'bx bx-check',
    },
    falseIcon: {
      type: String,
      default: 'bx bx-x',
    },

    trueType: {
      type: String,
      default: 'success',
    },
    falseType: {
      type: String,
      default: 'error',
    },
  },
})
</script>
