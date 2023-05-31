<template>
  <div class="order-metadatas">
    <loading :active="isLoading" />
    <validation-observer v-slot="{ handleSubmit }">
      <MetadataForm
        ref="publicMeta"
        :value="order.metadata"
        :disabled="isDisabled"
        model="orders"
      />
      <MetadataForm
        v-if="order.metadata_private"
        ref="privateMeta"
        :value="order.metadata_private"
        :disabled="isDisabled"
        type="private"
        model="orders"
      />
      <app-button
        class="order-metadatas__btn"
        size="small"
        type="primary"
        :disabled="isLoading"
        @click="handleSubmit(saveMetadata(order.id))"
      >
        {{ $t('save') }}
      </app-button>
    </validation-observer>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "save": "Save metadata",
    "metadataSaved": "Metadata saved",
    "metadataError": "Error saving metadata"
  },
  "pl": {
    "save": "Zapisz metadane",
    "metadataSaved": "Metadane zostały zapisane",
    "metadataError": "Błąd podczas zapisywania metadanych"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Metadata, Order } from '@heseya/store-core'

import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import Loading from '@/components/layout/Loading.vue'

export default defineComponent({
  components: {
    MetadataForm,
    Loading,
    ValidationObserver,
  },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    isDisabled(): boolean {
      return !this.$can(this.$p.Orders.Edit)
    },
  },
  methods: {
    async saveMetadata(id: string) {
      this.isLoading = true
      try {
        const [updatedPrivateMetadata, updatedMetadata] = await Promise.all([
          (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
          (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
        ])
        const data: { metadata?: Metadata; metadata_private?: Metadata } = {}
        if (updatedMetadata) data['metadata'] = updatedMetadata
        if (updatedPrivateMetadata) data['metadata_private'] = updatedPrivateMetadata

        this.$accessor.orders.SET_SELECTED({ ...this.order, ...data })
        this.$toast.success(this.$t('metadataSaved') as string)
      } catch {
        this.$toast.error(this.$t('metadataError') as string)
      }
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.order-metadatas {
  position: relative;

  &__btn {
    margin-left: auto;
  }
}
</style>
