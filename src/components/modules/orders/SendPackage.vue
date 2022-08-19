<template>
  <div class="flex-column send-package">
    <span class="order-title send-package__title">{{ $t('sendPackage.title') }}</span>
    <div v-if="!shippingNumber" class="send-package__content">
      <div class="send-package__selects">
        <app-select
          v-model="packageTemplateId"
          :label="$t('sendPackage.template')"
          :placeholder="$t('sendPackage.templatePlaceholder')"
          option-filter-prop="label"
        >
          <a-select-option
            v-for="template in packageTemplates"
            :key="template.id"
            :label="template.name"
          >
            {{ template.name }}
          </a-select-option>
        </app-select>
        <app-select
          v-if="isLegacyPackageCreation"
          v-model="providerKey"
          :label="$t('sendPackage.provider')"
          option-filter-prop="label"
        >
          <a-select-option
            v-for="provider in PROVIDERS"
            :key="provider.key"
            :label="provider.label"
          >
            {{ provider.label }}
          </a-select-option>
        </app-select>
      </div>
      <app-button type="primary" size="small" class="send-package__btn" @click="createPackage">
        {{ $t('sendPackage.create') }}
      </app-button>
    </div>
    <small v-else>
      <i class="bx bxs-check-circle"></i>
      {{ $t('sendPackage.existing', { number: shippingNumber }) }}
    </small>
    <span class="order-title send-package__title send-package__title--shipping">{{
      $t('setShippingNumber.title')
    }}</span>
    <div class="send-package__content">
      <app-input
        v-model="packageShippingNumber"
        class="send-package__input"
        :placeholder="$t('setShippingNumber.templatePlaceholder')"
      />
      <app-button
        type="primary"
        size="small"
        class="send-package__btn send-package__btn--shipping"
        @click="setShippingNumber"
      >
        {{ $t('setShippingNumber.save') }}
      </app-button>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "sendPackage": {
      "title": "Nadaj przesyłkę",
      "template": "Szablon przesyłki",
      "templatePlaceholder": "-- Wybierz szablon --",
      "provider": "Operator dostawy",
      "create": "Kontynuuj",
      "created": "Przesyłka została utworzona",
      "existing": "Przesyłka została już zamówiona (Numer śledzenia: {number})"
    },
    "setShippingNumber": {
      "title": "Numer przesyłki",
      "templatePlaceholder": "-- Wpisz numer przesyłki --",
      "save": "Zapisz",
      "sameAsBefore": "Podany numer przesyłki nie różni się od obecnego",
      "changed": "Numer przesyłki został zmieniony",
      "cantChange": "Nie można zmienić numeru przesyłki"
    }
  },
  "en": {
    "sendPackage": {
      "title": "Send package",
      "template": "Package template",
      "templatePlaceholder": "-- Select template --",
      "provider": "Shipping provider",
      "create": "Continue",
      "created": "Package was created",
      "existing": "Package was already ordered (Tracking number: {number})"
    },
    "setShippingNumber": {
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
import Vue from 'vue'
import { PackagesTemplate } from '@heseya/store-core'
import { createStandardPackage } from '@/services/createStandardPackage'
import { createFurgonetkaPackage } from '@/services/createFurgonetkaPackage'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  props: {
    shippingNumber: {
      type: String,
      default: null,
    },
    shippingMethod: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    packageTemplateId: undefined as string | undefined,
    packageShippingNumber: undefined as string | undefined,
    providerKey: 'dpd',
  }),
  computed: {
    packageTemplates(): PackagesTemplate[] {
      return this.$accessor.packageTemplates.getData
    },
    PROVIDERS(): { key: string; label: string }[] {
      return [
        { key: 'dpd', label: 'Kurier DPD' },
        { key: 'ups', label: 'Kurier UPS' },
        { key: 'gls', label: 'Kurier GLS' },
        { key: 'inpostkurier', label: 'Kurier InPost' },
        { key: 'dhl', label: 'Kurier DHL Parcel' },
        { key: 'dhlinternational', label: 'Kurier DHL Express' },
      ]
    },
    isLegacyPackageCreation(): boolean {
      return this.$accessor.env.show_legacy_furgonetka === '1'
    },
  },

  watch: {
    shippingNumber() {
      this.packageShippingNumber = this.shippingNumber || ''
    },
  },

  created() {
    this.$accessor.packageTemplates.fetch()
    this.providerKey =
      this.PROVIDERS.find(({ key }) => this.shippingMethod.toLowerCase().includes(key))?.key ||
      'dpd'
  },

  mounted() {
    this.packageShippingNumber = this.shippingNumber || ''
  },

  methods: {
    async setShippingNumber() {
      if (typeof this.packageShippingNumber === 'undefined') return
      if (!this.packageShippingNumber.trim().length) return
      if (this.packageShippingNumber.trim() === this.shippingNumber) {
        this.$toast.warning(this.$t('setShippingNumber.sameAsBefore') as string)
        return
      }
      this.$accessor.startLoading()
      const res = this.$accessor.orders.update({
        id: this.orderId,
        item: { shipping_number: this.packageShippingNumber },
      })

      if (Boolean(res)) {
        this.$toast.success(this.$t('setShippingNumber.changed') as string)
      } else {
        this.$toast.error(this.$t('setShippingNumber.cantChange') as string)
      }

      this.$accessor.stopLoading()
    },

    async createPackage() {
      if (!this.packageTemplateId) return
      this.$accessor.startLoading()
      const res = this.isLegacyPackageCreation
        ? await createFurgonetkaPackage(this.orderId, this.packageTemplateId, this.providerKey)
        : await createStandardPackage(this.orderId, this.packageTemplateId)

      if (res.success) {
        this.$emit('created', res.shippingNumber)
        this.$toast.success(this.$t('sendPackage.created') as string)
      } else {
        this.$toast.error(formatApiNotificationError(res.error))
      }

      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.send-package {
  &__title {
    margin-bottom: 8px;

    &--shipping {
      margin-top: 8px;
    }
  }

  &__selects {
    width: 100%;
  }

  &__btn {
    margin-bottom: 8px;

    &--shipping {
      margin: 8px 0 0;

      @media ($viewport-10) {
        margin-top: 0;
      }
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

    &--shipping {
      margin-top: 8px;
    }
  }

  &__input {
    margin-bottom: 0;
  }
}
</style>
