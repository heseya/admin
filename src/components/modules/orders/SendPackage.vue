<template>
  <div class="flex-column send-package">
    <h2 class="section-title send-package__title">Wyślij przesyłkę</h2>
    <div v-if="!shippingNumber" class="send-package__content">
      <app-select
        v-model="packageTemplateId"
        label="Szablon przesyłki"
        placeholder="-- Wybierz szablon --"
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
      <app-button @click="createPackage">Utwórz&nbsp;przesyłkę</app-button>
    </div>
    <small v-else>
      <i class="bx bxs-check-circle"></i> Przesyłka została już zamówiona (Numer śledzenia:
      {{ shippingNumber }})
    </small>
  </div>
</template>

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
    orderId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    packageTemplateId: null as string | null,
  }),
  computed: {
    packageTemplates(): PackageTemplate[] {
      return this.$accessor.packageTemplates.getData
    },
  },
  created() {
    this.$accessor.packageTemplates.fetch()
  },
  methods: {
    async createPackage() {
      if (!this.packageTemplateId) return
      this.$accessor.startLoading()
      const res = await createPackage(this.orderId, this.packageTemplateId)

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

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media ($viewport-8) {
      flex-direction: row;
    }

    > *:first-child {
      margin-right: 8px;
    }
  }
}
</style>
