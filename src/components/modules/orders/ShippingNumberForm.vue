<template>
  <div class="flex-column shipping-number">
    <span class="order-title shipping-number__title">{{ $t('shippingNumber.title') }}</span>
    <div class="shipping-number__content">
      <app-input
        v-model="packageShippingNumber"
        class="shipping-number__input"
        :placeholder="$t('shippingNumber.templatePlaceholder')"
      />
      <app-button
        type="primary"
        size="small"
        class="shipping-number__btn"
        @click="setShippingNumber"
      >
        {{ $t('shippingNumber.save') }}
      </app-button>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "shippingNumber": {
      "title": "Numer listu przewozowego",
      "templatePlaceholder": "-- Wpisz numer przesyłki --",
      "save": "Zapisz",
      "sameAsBefore": "Podany numer przesyłki nie różni się od obecnego",
      "changed": "Numer przesyłki został zmieniony",
      "cantChange": "Nie można zmienić numeru przesyłki"
    }
  },
  "en": {
    "shippingNumber": {
      "title": "Shipping number",
      "templatePlaceholder": "-- Enter shipping number --",
      "save": "Save",
      "sameAsBefore": "Given shipping number doesn't differ from the present one",
      "changed": "Shipping number was changed",
      "cantChange": "Can't change shipping number"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    shippingNumber: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      required: true,
    },
  },

  emits: ['set'],

  data: () => ({
    packageShippingNumber: undefined as string | undefined,
  }),

  watch: {
    shippingNumber() {
      this.packageShippingNumber = this.shippingNumber || ''
    },
  },

  mounted() {
    this.packageShippingNumber = this.shippingNumber || ''
  },

  methods: {
    async setShippingNumber() {
      if (typeof this.packageShippingNumber === 'undefined') return
      if (!this.packageShippingNumber.trim().length) return
      if (this.packageShippingNumber.trim() === this.shippingNumber) {
        this.$toast.warning(this.$t('shippingNumber.sameAsBefore') as string)
        return
      }
      this.$accessor.startLoading()
      const res = this.$accessor.orders.update({
        id: this.orderId,
        item: { shipping_number: this.packageShippingNumber },
      })
      this.$emit('set', this.packageShippingNumber)

      if (Boolean(res)) {
        this.$toast.success(this.$t('shippingNumber.changed') as string)
      } else {
        this.$toast.error(this.$t('shippingNumber.cantChange') as string)
      }

      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.shipping-number {
  &__title {
    margin-bottom: 8px;
  }

  &__btn {
    margin: 8px 0 0;

    @media ($viewport-10) {
      margin-top: 0;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @media ($viewport-8) {
      flex-direction: row;

      > *:first-child {
        margin-right: 8px;
      }
    }
  }

  &__input {
    margin-bottom: 0;
  }
}
</style>
