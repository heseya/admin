<template>
  <div class="autocomplete">
    <div class="autocomplete__input">
      <div class="autocomplete__label">
        {{ label }}
        <button class="icon-btn" @click="isModalActive = true"><i class="bx bx-plus"></i></button>
      </div>
      <div class="autocomplete__items">
        <div
          class="autocomplete__item"
          v-for="item in value"
          :key="item.id"
          :label="item.name"
          :value="item"
          disabled
        >
          {{ item.name }}
          <button class="icon-btn" @click.stop="deleteItem(item.id)">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>
    </div>
    <vs-dialog width="800px" not-center v-model="isModalActive">
      <template #header>
        <h4>Wybierz przedmiot z magazynu</h4>
      </template>
      <modal-form>
        <selector typeName="produkt" type="items" :existing="value" @select="addItem" />
      </modal-form>
    </vs-dialog>
  </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import ModalForm from '@/components/ModalForm.vue'

export default {
  name: 'Autocomplete',
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
    },
  },
  data: () => ({
    isModalActive: false,
  }),
  computed: {
    compValue: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    addItem(item) {
      this.compValue.push(item)
    },
    deleteItem(itemId) {
      this.compValue = this.compValue.filter((item) => item.id !== itemId)
    },
  },
  components: { Selector, ModalForm },
}
</script>

<style lang="scss" scoped>
.autocomplete {
  margin-top: 8px;

  &__label {
    font-size: 0.8em;
    padding-left: 8px;
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    background-color: #f4f7f8;
    border-radius: 12px;
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

    &:hover {
      background-color: #eee;
    }
  }
}
</style>
