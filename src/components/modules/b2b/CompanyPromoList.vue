<template>
  <card class="company-promos">
    <top-nav tag="h2" :title="$t('title')">
      <icon-button size="small" type="primary" :to="`/sales/create?company=${company.id}`">
        <template #icon> <i class="bx bx-plus"></i> </template>
        {{ $t('add') }}
      </icon-button>
    </top-nav>

    <loading :active="isLoading" />

    <!-- {{ sales }} -->
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Promocje dodane dla tego klienta",
    "add": "Dodaj promocje"
  },
  "en": {
    "title": "Promotions added for this company",
    "add": "Add promotion"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Role, Sale } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'
import Loading from '@/components/layout/Loading.vue'

export default Vue.extend({
  components: { TopNav, Card, IconButton, Loading },
  props: {
    company: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Role>,
  },

  data: () => ({
    isLoading: false,
  }),

  computed: {
    sales(): Sale[] {
      return this.$accessor.sales.getData
    },
  },

  async created() {
    this.isLoading = true
    await this.$accessor.sales.fetch({ for_role: this.company.id })
    this.isLoading = false
  },
})
</script>

<style lang="scss" scoped>
.company-promos {
  position: relative;
}
</style>
