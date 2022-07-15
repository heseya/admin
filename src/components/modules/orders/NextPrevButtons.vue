<template>
  <div class="next-prev-buttons">
    <a-tooltip>
      <template #title>
        <div v-html="$t('tooltip')" />
      </template>

      <Keypress
        key-event="keyup"
        :key-code="37"
        :modifiers="['shiftKey']"
        @success="goToPrevOrder"
      />
      <Keypress
        key-event="keyup"
        :key-code="39"
        :modifiers="['shiftKey']"
        @success="goToNextOrder"
      />

      <div class="next-prev-buttons__content">
        <icon-button
          :disabled="!prevOrder"
          :title="$t('prev')"
          :aria-label="$t('prev')"
          @click="goToPrevOrder"
        >
          <template #icon>
            <i class="bx bxs-chevron-left"></i>
          </template>
        </icon-button>
        <icon-button
          :disabled="!nextOrder"
          :title="$t('next')"
          :aria-label="$t('next')"
          @click="goToNextOrder"
        >
          <template #icon>
            <i class="bx bxs-chevron-right"></i>
          </template>
        </icon-button>
      </div>
    </a-tooltip>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "next": "Następne zamówienie",
    "prev": "Poprzednie zamówienie",
    "tooltip": "Użyj <code>Shift + &#8594;</code> aby przejść do kolejnego lub <code>Shift + &#8592;</code> do poprzedniego zamówienia."
  },
  "en": {
    "next": "Next order",
    "prev": "Previous order",
    "tooltip": "Use <code>Shift + &#8594;</code> to go to next or <code>Shift + &#8592;</code> to previous order."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@heseya/store-core'

export default Vue.extend({
  components: {
    Keypress: () => import('vue-keypress'),
  },
  computed: {
    currentOrder(): Order {
      return this.$accessor.orders.getSelected || ({} as any)
    },
    orders(): Order[] {
      return this.$accessor.orders.getData
    },
    nextOrder(): Order | null {
      const currIndex = this.orders.findIndex((order) => order.id === this.currentOrder.id)
      return this.orders[currIndex + 1]
    },
    prevOrder(): Order | null {
      const currIndex = this.orders.findIndex((order) => order.id === this.currentOrder.id)
      return this.orders[currIndex - 1]
    },
  },
  mounted() {
    this.$accessor.orders.fetch({ ...this.$accessor.orders.getQueryParams, page: 1, limit: 500 })
  },
  methods: {
    goToNextOrder() {
      if (this.nextOrder?.id)
        this.$router.push({ name: this.$route.name!, params: { id: this.nextOrder.id } })
    },
    goToPrevOrder() {
      if (this.prevOrder?.id)
        this.$router.push({ name: this.$route.name!, params: { id: this.prevOrder.id } })
    },
  },
})
</script>

<style lang="scss" scoped>
.next-prev-buttons {
  margin-left: 12px;

  &__content {
    display: flex;
  }
}
</style>
