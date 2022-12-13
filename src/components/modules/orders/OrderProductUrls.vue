<template>
  <div class="order-product-urls">
    <h2 class="order-product-urls__header">
      {{ $t('title') }} <span class="gray-text">{{ product.product.name }}</span>
    </h2>

    <cms-table class="order-product-urls__table" :value="product.urls" :config="tableConfig">
      <template #item="{ item: url }">
        <cms-table-row :key="url.id" :item="url" no-hover :headers="tableConfig.headers">
          <template #url>
            <a :href="url.url" target="_blank">{{ url.url }}</a>
          </template>
        </cms-table-row>
      </template>
    </cms-table>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Linki do produktu"
  },
  "en": {
    "title": "Product links of"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { OrderProduct, OrderProductUrl } from '@heseya/store-core'

import { TableConfig } from '@/interfaces/CmsTable'

import CmsTable from '@/components/cms/CmsTable.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default Vue.extend({
  components: { CmsTable, CmsTableRow },
  props: {
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<OrderProduct>,
  },

  computed: {
    tableConfig(): TableConfig<OrderProductUrl> {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
          },
          {
            key: 'url',
            label: this.$t('common.form.slug') as string,
          },
        ],
      }
    },
  },
})
</script>
