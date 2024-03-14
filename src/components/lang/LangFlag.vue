<template>
  <img :src="flagURL" role="presentation" @error="handleFlagError" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    lang: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '16x12',
    },
  },

  computed: {
    flagURL(): string {
      return `https://flagcdn.com/${this.size}/${this.getFlagName(this.lang)}.png`
    },
  },

  methods: {
    getFlagName(iso: string) {
      const firstIsoPart = iso.split('-')[0]
      if (firstIsoPart === 'en' || firstIsoPart === 'eng') return 'us'
      return firstIsoPart
    },

    handleFlagError(e: Event) {
      const target = e.target as HTMLImageElement
      target.src = '/img/unknown-flag.png'
    },
  },
})
</script>
