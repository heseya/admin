<template>
  <card class="company-promos">
    <top-nav class="company-promos__nav" tag="h2" :title="$t('title')">
      <icon-button size="small" type="primary" :to="`/sales/create?company=${company.id}`">
        <template #icon> <i class="bx bx-plus"></i> </template>
        {{ $t('add') }}
      </icon-button>
    </top-nav>

    <loading :active="isLoading" />

    <empty v-if="!sales.length"> {{ $t('empty') }} </empty>

    <template v-else>
      <div class="company-promos__list">
        <div v-for="sale in sales" :key="sale.id" class="sale-item">
          <icon-button type="transparent" class="sale-item__edit-btn" :to="`/sales/${sale.id}`">
            <template #icon> <i class="bx bx-edit-alt"></i> </template>
          </icon-button>

          <field class="sale-item__name" :label="$t('field.name')">{{ sale.name }}</field>
          <field :label="$t('field.target_type')">
            {{ $t(`discountTargetTypes.${sale.target_type}`) }}
          </field>
          <field :label="$t('field.value')">
            -{{
              sale.type === DiscountType.Percentage ? `${sale.value}%` : formatCurrency(sale.value)
            }}
          </field>
          <field :label="$t('field.uses')">{{ sale.uses }} </field>
        </div>
      </div>
      <pagination
        class="company-promos__pagination"
        :value="$accessor.sales.meta.current_page"
        :length="$accessor.sales.meta.last_page"
        @input="goToPage"
      />
    </template>
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Promocje dodane dla tego klienta",
    "add": "Dodaj promocje",
    "empty": "Brak promocji dla tego klienta",
    "field": {
      "name": "Nazwa promocji",
      "target_type": "Typ celu promocji",
      "value": "Wartość rabatu",
      "uses": "Zastosowano"
    }
  },
  "en": {
    "title": "Promotions added for this company",
    "add": "Add promotion",
    "empty": "No promotions for this company",
    "field": {
      "name": "Promotion name",
      "target_type": "Promotion target type",
      "value": "Discount value",
      "uses": "Uses"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { DiscountType, Role, Sale } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'
import Loading from '@/components/layout/Loading.vue'
import Field from '@/components/Field.vue'

import { formatCurrency } from '@/utils/currency'
import Empty from '@/components/layout/Empty.vue'
import Pagination from '@/components/cms/Pagination.vue'

export default Vue.extend({
  components: { TopNav, Card, IconButton, Loading, Field, Empty, Pagination },
  props: {
    company: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Role>,
  },

  data: () => ({
    isLoading: false,
    page: 1,
  }),

  computed: {
    DiscountType(): typeof DiscountType {
      return DiscountType
    },
    sales(): Sale[] {
      return this.$accessor.sales.getData
    },
  },

  created() {
    this.fetchSales()
  },

  methods: {
    goToPage(page: number) {
      this.$router.push({ query: { page: page.toString() } })
      this.fetchSales()
    },

    async fetchSales() {
      this.isLoading = true
      const page = this.$route.query.page || 1
      await this.$accessor.sales.fetch({
        for_role: this.company.id,
        page,
        limit: 32,
      })
      this.isLoading = false
    },

    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
  },
})
</script>

<style lang="scss" scoped>
.company-promos {
  position: relative;

  &__nav {
    margin-bottom: 8px;
  }

  &__list {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr;
    margin-bottom: 12px;

    @media ($viewport-4) {
      grid-template-columns: 1fr 1fr;
    }

    @media ($viewport-7) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media ($viewport-14) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    @media ($viewport-20) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  }

  &__pagination {
    justify-content: flex-start;
  }
}

.sale-item {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid var(--background-color-700);
  transition: 0.3s;
  position: relative;

  &__name :deep(.field__label) {
    color: var(--font-color);
    font-size: 1rem;
    font-weight: 500;
  }

  &__edit-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    color: var(--gray-color-500);
    z-index: 10;
  }

  &:hover {
    box-shadow: $shadow;
  }
}
</style>
