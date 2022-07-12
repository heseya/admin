<template>
  <div class="warehouse-items-configurator">
    <div class="warehouse-items-configurator__head">
      <div class="warehouse-items-configurator__title">
        {{ $t('title') }}
        <info-tooltip> {{ $t('titleTooltip') }} </info-tooltip>
      </div>
      <icon-button v-if="!disabled" @click="isModalActive = true">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addItem') }}
      </icon-button>
    </div>

    <empty v-if="items.length === 0">{{ $t('noItemsInProduct') }}</empty>

    <list class="warehouse-items-configurator__items">
      <list-item v-for="item in items" :key="item.id" no-hover>
        <div class="configurator-item">
          <span class="configurator-item__title">
            {{ item.name }}
          </span>

          <validated-input
            v-model="item.required_quantity"
            class="configurator-item__input"
            name="quantity"
            :label="$t('requiredQuantity')"
            type="number"
            rules="required|not-negative"
          />
        </div>

        <template #action>
          <div class="flex">
            <icon-button
              v-if="!disabled"
              type="danger"
              class="item-delete"
              @click="removeItem(item.id)"
            >
              <template #icon>
                <i class="bx bx-trash"></i>
              </template>
            </icon-button>
          </div>
        </template>
      </list-item>
    </list>

    <a-modal v-model="isModalActive" width="800px" :footer="null">
      <template #title>
        <h4>{{ $t('chooseExisting') }}</h4>
      </template>
      <modal-form>
        <Selector type="items" :type-name="$t('typeName')" :existing="value" @select="addItem" />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Warehouse items",
    "titleTooltip": "A list of stock items available for a product, if a product is purchased, as many items as listed below will be taken out of stock. The product will not be available when there are not enough items left in stock.",
    "addItem": "Add item requirement",
    "noItemsInProduct": "This product has no warehouse items yet",
    "chooseExisting": "Choose existing warehouse item",
    "typeName": "warehouse item",
    "requiredQuantity": "Required quantity"
  },
  "pl": {
    "title": "Przedmioty magazynowe",
    "titleTooltip": "Lista przedmiotów magazynowych dostępnych w danym produkcie, jeśli produkt zostanie zakupiony, to z magazynu zostanie zdjęte tyle przedmiotów, ile podane jest poniżej. Produkt nie będzie dostępny, gdy nie będzie już wystarczająco przedmiotów w magazynie.",
    "addItem": "Dodaj przedmiot magazynowy",
    "noItemsInProduct": "Ten produkt nie posiada jeszcze przedmiotów magazynowych",
    "chooseExisting": "Wybierz istniejący przedmiot magazynowy",
    "typeName": "przedmiot magazynowy",
    "requiredQuantity": "Wymagana ilość"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { WarehouseItem, ProductWarehouseItem } from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import List from '@/components/layout/List.vue'
import Selector from '@/components/Selector.vue'
import ListItem from '@/components/layout/ListItem.vue'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: { Empty, List, Selector, ListItem },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ProductWarehouseItem[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isModalActive: false,
  }),
  computed: {
    items: {
      get(): ProductWarehouseItem[] {
        return this.value
      },
      set(value: ProductWarehouseItem[]) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    addItem(item: WarehouseItem) {
      this.items.push({
        id: item.id,
        name: item.name,
        required_quantity: 1,
      })
      this.isModalActive = false
    },
    removeItem(id: UUID) {
      this.items = this.items.filter((item) => item.id !== id)
    },
  },
})
</script>

<style lang="scss" scoped>
.warehouse-items-configurator {
  &__head {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.3em;
    font-weight: 600;
  }

  &__items {
    padding: 0;
  }

  ::v-deep .list-item__content {
    width: 100%;
  }
}

.configurator-item {
  width: 100%;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto;

  &__title {
    white-space: nowrap;
  }

  &__input {
    max-width: 160px;
    margin: 0 8px;
    font-weight: 400;
  }
}
</style>
