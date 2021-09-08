<template>
  <list-item :url="url" @click="$emit('click')">
    <template #avatar>
      <vs-avatar dark>
        <i :class="icon"></i>
      </vs-avatar>
    </template>
    {{ name }}
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import ListItem from '@/components/layout/ListItem.vue'

export default Vue.extend({
  components: { ListItem },
  props: {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: 'bx bx-question-mark',
    },
  },
})
</script>
