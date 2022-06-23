<template>
  <a-modal width="500px" class="set-products" :visible="isOpen" @cancel="$emit('close')">
    <template #title>
      <div class="set-products__header">
        <h4>{{ $t('title') }} {{ set.name }}</h4>
      </div>
    </template>
    <div>
      <autocomplete-input
        v-model="selectedParent"
        :label="$t('title')"
        mode="default"
        model-url="product-sets"
        :banned-set-ids="bannedSetIds"
      />
    </div>

    <template #footer>
      <app-button type="success" @click="save">{{ $t('common.save') }}</app-button>
    </template>
  </a-modal>
</template>

<i18n>
{
  "pl": {
    "title": "Zmień nadrzędną kolekcję",
    "successMessage": "Zmieniono nadrzędną kolekcję"
  },
  "en": {
    "title": "Change parent collection",
    "successMessage": "Parent collection has been changed"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import AutocompleteInput from '../../AutocompleteInput.vue'

import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { AutocompleteInput },
  props: {
    set: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSetDTO>,
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    selectedParent: {} as ProductSet,
  }),
  computed: {
    bannedSetIds(): string[] {
      return this.set.id
        ? [...this.set.children_ids, this.set.id, this.set.parent_id as string]
        : []
    },
  },

  methods: {
    async save() {
      if (!this.selectedParent.id) return
      this.$accessor.startLoading()

      try {
        await this.$accessor.productSets.update({
          id: this.set.id as string,
          item: {
            ...this.set,
            parent_id: this.selectedParent.id,
          },
        })

        //Refresh product sets to properly update changes in the tree
        await this.refreshProductSets()

        this.$toast.success(this.$t('successMessage') as string)
        this.$emit('close')
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },
    async refreshProductSets() {
      this.$accessor.productSets.clearData()
      await this.$accessor.productSets.fetch()
    },
  },
})
</script>

<style lang="scss" scoped>
.set-products {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 24px;

    h4 {
      margin-bottom: 0;
    }
  }
}
</style>