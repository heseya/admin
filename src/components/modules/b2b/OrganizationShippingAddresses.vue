<template>
  <card class="org-shipping-addresses">
    <top-nav tag="h2" :title="$t('title').toString()" class="org-shipping-addresses__nav">
    </top-nav>

    {{ 'TODO: Implement me!' }}
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Adresy dostawy"
  },
  "en": {
    "title": "Shipping Addresses"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Organization } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import TopNav from '@/components/layout/TopNav.vue'

export default defineComponent({
  components: { TopNav, Card },
  props: {
    organization: {
      type: Object as PropType<Organization>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.org-shipping-addresses {
  position: relative;

  &__nav {
    margin-bottom: 8px;
  }
}
</style>
