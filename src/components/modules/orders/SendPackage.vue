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
      <app-button size="small" class="send-package__btn" @click="createPackage">
        {{ $t('sendPackage.create') }}
      </app-button>
    </div>
    <small v-else>
      <i class="bx bxs-check-circle"></i>
      {{ $t('sendPackage.existing', { number: shippingNumber }) }}
    </small>
  </div>
</template>

<i18n>
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
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { createPackage } from '@/services/createPackage'
import { formatApiNotificationError } from '@/utils/errors'
import { PackageTemplate } from '@/interfaces/PackageTemplate'

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
    providerKey: 'dpd',
  }),
  computed: {
    packageTemplates(): PackageTemplate[] {
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
  },
  created() {
    this.$accessor.packageTemplates.fetch()
    this.providerKey =
      this.PROVIDERS.find(({ key }) => this.shippingMethod.toLowerCase().includes(key))?.key ||
      'dpd'
  },
  methods: {
    async createPackage() {
      if (!this.packageTemplateId) return
      this.$accessor.startLoading()
      const res = await createPackage(this.orderId, this.packageTemplateId, this.providerKey)

      if (res.success) {
        this.$emit('created', res.shippingNumber)
        this.$toast.success('Przesyłka utworzona poprawnie')
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
  }

  &__selects {
    width: 100%;
  }

  &__btn {
    margin-bottom: 8px;
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
}
</style>
