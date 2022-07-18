<template>
  <div class="autocomplete">
    <div class="autocomplete__input">
      <div class="autocomplete__label">
        {{ label }}
        <button :disabled="disabled" class="icon-btn" @click="isModalActive = true">
          <i class="bx bx-plus"></i>
        </button>
      </div>
      <div class="autocomplete__items">
        <div
          v-for="item in value"
          :key="item.id"
          class="autocomplete__item"
          :label="item.name"
          :value="item"
          disabled
        >
          {{ item.name }}
          <button class="icon-btn" :disabled="disabled" @click.stop="deleteItem(item.id)">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>
    </div>
    <a-modal v-model="isModalActive" width="800px" :title="$t('chooseItem')" :footer="null">
      <modal-form>
        <selector :type-name="$t('product')" type="items" :existing="value" @select="addItem" />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "chooseItem": "Wybierz przedmiot z magazynu",
    "product": "produkt"
  },
  "en": {
    "chooseItem": "Choose item from warehouse",
    "product": "product"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Selector from '@/components/Selector.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import { UUID } from '@/interfaces/UUID'

interface AutocompleteItem {
  id: UUID
  name: string
}

export default Vue.extend({
  name: 'Autocomplete',
  components: { Selector, ModalForm },
  props: {
    type: {
      type: String,
      default: 'products',
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: null,
    } as Vue.PropOptions<AutocompleteItem[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isModalActive: false,
  }),
  computed: {
    compValue: {
      get(): AutocompleteItem[] {
        return this.value
      },
      set(v: AutocompleteItem[]) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    addItem(item: AutocompleteItem) {
      this.compValue.push(item)
    },
    deleteItem(itemId: UUID) {
      this.compValue = this.compValue.filter((item) => item.id !== itemId)
    },
  },
})
</script>

<style lang="scss" scoped>
.autocomplete {
  &__label {
    font-size: 0.8em;
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px;
    box-sizing: border-box;
    min-height: 33px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    font-size: 0.6em;
    border: solid 1px #ccc;
    border-radius: 6px;
    padding: 2px;
    margin: 1px;
  }

  .icon-btn {
    all: unset;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 1px;
    cursor: pointer;
    border-radius: 3px;

    &[disabled] {
      opacity: 0.7;
      pointer-events: none;
    }

    &:hover {
      background-color: #eeeeee;
    }
  }
}
</style>
