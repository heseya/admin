<template>
  <LayoutAccordion :title="$t('title').toString()">
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
          :delete-text="$t('deleteText').toString()"
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
          :type-name="$t('selectorTitle').toString()"
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
    "deleteText": "Are you sure you want to remove this related collection? (collection will not be deleted)",
    "emptyText": "No related collections",
    "createText": "Create new collection",
    "seeRelatedProducts": "See products"
  },
  "pl": {
    "title": "Kolekcje z powiązanymi produktami",
    "selectorTitle": "kolekcję z powiązanymi produktami",
    "addTitle": "Dodaj powiazaną kolekcję",
    "deleteText": "Czy na pewno chcesz usunąć powiązanie z tą kolekcją? (kolekcja nie zostanie usunięta)",
    "emptyText": "Brak powiązanych kolekcji",
    "createText": "Utwórz nową kolekcję",
    "seeRelatedProducts": "Zobacz produkty"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product, ProductSetListed } from '@heseya/store-core'

import LayoutAccordion from '@/components/layout/Accordion.vue'

import Empty from '@/components/layout/Empty.vue'
import EditableListItem from '@/components/layout/EditableListItem.vue'
import Selector from '@/components/Selector.vue'
import SetProductsList from '../../productSets/SetProductsList.vue'

export default defineComponent({
  components: { LayoutAccordion, Empty, EditableListItem, Selector, SetProductsList },

  props: {
    value: {
      type: Array as PropType<ProductSetListed[]>,
      required: true,
    },
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isAddModalActive: false,
    selectedSet: null as ProductSetListed | null,
  }),

  computed: {
    relatedSets: {
      get(): ProductSetListed[] {
        return this.value
      },
      set(value: ProductSetListed[]) {
        this.$emit('input', value)
      },
    },
  },

  methods: {
    editCollection(page: ProductSetListed) {
      window.open(`/collections/${page.id}`, '_blank')?.focus()
    },
    onCreateNew() {
      window.open(`/collections/create`, '_blank')?.focus()
    },

    onRemove(set: ProductSetListed) {
      this.relatedSets = this.relatedSets.filter((item) => item.id !== set.id)
    },

    onAdd(set: ProductSetListed) {
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
