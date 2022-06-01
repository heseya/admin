<template>
  <list-item :url="url" @click="$emit('click')">
    <template #avatar>
      <avatar>
        <InlineSvg
          v-if="predefinedIcon"
          class="nav-link-img"
          :src="require(`@/assets/images/${predefinedIcon}`)"
        />
        <i v-else :class="icon"></i>
      </avatar>
    </template>
    {{ name }}
    <template #action>
      <slot name="action" />
    </template>
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import InlineSvg from 'vue-inline-svg'
import ListItem from '@/components/layout/ListItem.vue'
import Avatar from '@/components/layout/Avatar.vue'

export default Vue.extend({
  components: { ListItem, Avatar, InlineSvg },
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
    predefinedIcon: {
      type: String,
      default: '',
    },
  },
})
</script>
