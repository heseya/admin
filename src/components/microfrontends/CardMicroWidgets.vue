<template>
  <card v-show="!isEmpty" class="card-micro-widgets">
    <micro-widgets v-if="false" :section="section" @empty="isEmpty = true" />
    <code>{{ section }}</code>
  </card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/components/layout/Card.vue'
import MicroWidgets from './MicroWidgets.vue'

export default Vue.extend({
  components: { Card, MicroWidgets },
  props: {
    section: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isEmpty: false,
  }),
})
</script>

<style lang="scss" scoped>
.card-micro-widgets {
  background-color: $primary-color-500;
  padding: 24px;
  text-align: center;
  font-size: 1.6em;
}
</style>
