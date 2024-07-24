<template>
  <card class="org-sales-channels">
    <top-nav
      tag="h2"
      :title="`${$t('title')}: ${organization.sales_channel.name}`"
      class="org-sales-channels__nav"
    >
      <icon-button size="small" type="primary" @click="$emit('edit')">
        <template #icon> <i class="bx bx-edit"></i> </template>
        {{ $t('action') }}
      </icon-button>
    </top-nav>

    {{ organization.sales_channel }}
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Kanał sprzedaży",
    "action": "Zmień"
  },
  "en": {
    "title": "Sales channel",
    "action": "Change"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Organization } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'

export default defineComponent({
  components: { TopNav, Card, IconButton },
  props: {
    organization: {
      type: Object as PropType<Organization>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.org-sales-channels {
  position: relative;

  &__nav {
    margin-bottom: 8px;
  }
}
</style>
