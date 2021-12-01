<template>
  <list-item :url="url" @click="$emit('click')">
    <template #avatar>
      <avatar>
        <i :class="icon"></i>
      </avatar>
    </template>
    {{ name }}
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import ListItem from '@/components/layout/ListItem.vue'
import Avatar from '@/components/layout/Avatar.vue'

export default Vue.extend({
  components: { ListItem, Avatar },
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
