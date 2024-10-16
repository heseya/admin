<template>
  <div class="micro-widgets">
    <micro-frontend v-for="widget in widgets" :key="widget.id" :host="widget.url" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MicroFrontend from './MicroFrontend.vue'

interface AppWidget {
  id: string
  name: string
  url: string
  section: string
  permissions: string[]
}

// TODO: fetch widgets from API based on section
const fetchWidgets = async (): Promise<AppWidget[]> =>
  Promise.resolve([
    // {
    //   id: '000e1dc9-72af-4d5c-9627-1624fbd1bf28',
    //   name: 'name',
    //   url: 'https://dev.reviews.app.heseya.com/dashboard/',
    //   section: 'section',
    //   permissions: [],
    // },
    {
      id: '000e1dc9-72af-4d5c-9627-sadas',
      name: 'name',
      url: 'https://microfrontend-demo.app.heseya.com/',
      section: 'section',
      permissions: [],
    },
  ])

export default Vue.extend({
  components: { MicroFrontend },
  props: {
    section: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    widgets: [] as AppWidget[],
  }),

  mounted() {
    this.fetchWidgets()
  },

  methods: {
    async fetchWidgets() {
      // TODO: fetch widgets from API based on section
      this.widgets = await fetchWidgets()

      if (this.widgets.length === 0) {
        this.$emit('empty')
      }
    },
  },
})
</script>
