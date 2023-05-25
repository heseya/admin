<template>
  <LayoutAccordion :title="$t('title')">
    <div class="related-sets">
      <icon-button
        class="related-sets__btn"
        size="small"
        :disabled="disabled"
        @click="isAddModalActive = true"
      >
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addTitle') }}
      </icon-button>

      <Empty v-if="relatedSets.length === 0" class="related-sets__empty">
        {{ $t('emptyText') }}
      </Empty>

      <div class="related-sets__content">
        <editable-list-item
          v-for="set in relatedSets"
          :key="set.id"
          :item="set"
          :disabled="disabled"
          :delete-text="$t('deleteText')"
          @edit="editCollection"
          @remove="onRemove"
        >
          {{ set.name }}
          <small>/{{ set.slug }}</small>

          <template #action>
            <icon-button size="small" :disabled="disabled" @click="selectedSet = set">
              {{ $t('seeRelatedProducts') }}
              <template #icon>
                <i class="bx bx-hive"></i>
              </template>
            </icon-button>
          </template>
        </editable-list-item>
      </div>

      <a-modal v-model="isAddModalActive" width="800px" :footer="null">
        <template #title>
          <div class="modal-header">
            {{ $t('addTitle') }}

            <icon-button size="small" :disabled="disabled" @click="onCreateNew">
              {{ $t('createText') }}
              <template #icon>
                <i class="bx bx-plus"></i>
              </template>
            </icon-button>
          </div>
        </template>

        <selector
          v-if="isAddModalActive"
          :type-name="$t('selectorTitle')"
          type="product-sets"
          :existing="relatedSets"
          @select="onAdd"
        />
      </a-modal>

      <SetProductsList :set="selectedSet" :is-open="!!selectedSet" @close="selectedSet = null" />
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Related collections",
    "selectorTitle": "related collections",
    "addTitle": "Add related collection",
    "deleteText": "Are you sure you want to delete this related collection?",
    "emptyText": "No related collections",
    "createText": "Create new collection",
    "seeRelatedProducts": "See products"
  },
  "pl": {
    "title": "Kolekcje z powiązanymi produktami",
    "selectorTitle": "kolekcję z powiązanymi produktami",
    "addTitle": "Dodaj powiazaną kolekcję",
    "deleteText": "Czy na pewno chcesz usunąć tą powiązaną kolekcje?",
    "emptyText": "Brak powiązanych kolekcji",
    "createText": "Utwórz nową kolekcję",
    "seeRelatedProducts": "Zobacz produkty"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Product, ProductSetList } from '@heseya/store-core'

import LayoutAccordion from '@/components/layout/Accordion.vue'

import Empty from '@/components/layout/Empty.vue'
import EditableListItem from '@/components/layout/EditableListItem.vue'
import Selector from '@/components/Selector.vue'
import SetProductsList from '../../productSets/SetProductsList.vue'

export default Vue.extend({
  components: { LayoutAccordion, Empty, EditableListItem, Selector, SetProductsList },

  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ProductSetList[]>,
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Product>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isAddModalActive: false,
    selectedSet: null as ProductSetList | null,
  }),

  computed: {
    relatedSets: {
      get(): ProductSetList[] {
        return this.value
      },
      set(value: ProductSetList[]) {
        this.$emit('input', value)
      },
    },
  },

  methods: {
    editCollection(page: ProductSetList) {
      window.open(`/collections/${page.id}`, '_blank')?.focus()
    },
    onCreateNew() {
      window.open(`/collections/create`, '_blank')?.focus()
    },

    onRemove(set: ProductSetList) {
      this.relatedSets = this.relatedSets.filter((item) => item.id !== set.id)
    },

    onAdd(set: ProductSetList) {
      this.relatedSets = [...this.relatedSets, set]
      this.isAddModalActive = false
    },
  },
})
</script>

<style lang="scss" scoped>
.related-sets {
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  &__btn {
    margin-left: auto;
    margin-bottom: 8px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
}
</style>
