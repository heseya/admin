<template>
  <app-select
    v-model="selectedAttributes"
    :label="$t('label')"
    :placeholder="$t('placeholder')"
    :disabled="disabled"
    :loading="isLoading"
    mode="multiple"
    name="selectedAttributes"
    option-filter-prop="label"
    class="attribute-select"
    @search="onSearch"
  >
    <a-select-option
      v-for="attribute in attributes"
      :key="attribute.id"
      class="attribute-select__option"
      :label="attribute.name"
    >
      <button
        v-if="!isFirst(attribute.id)"
        type="button"
        class="attribute-select__btn"
        @click.stop="move(attribute.id, -1)"
      >
        <i class="bx bx-left-arrow-alt"></i>
      </button>
      <button
        v-if="!isLast(attribute.id)"
        type="button"
        class="attribute-select__btn"
        @click.stop="move(attribute.id, 1)"
      >
        <i class="bx bx-right-arrow-alt"></i>
      </button>
      {{ attribute.name }}
    </a-select-option>
  </app-select>
</template>

<i18n lang="json">
{
  "pl": {
    "label": "Atrybuty, po których można filtrować produkty",
    "placeholder": "Wybierz atrybuty"
  },
  "en": {
    "label": "Attributes, by which you can filter products",
    "placeholder": "Select attributes"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import { Attribute } from '@heseya/store-core'
import cloneDeep from 'lodash/cloneDeep'

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<Attribute[] | string[] | undefined>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },

  data: () => ({
    isLoading: false,
    initialAttributes: [] as Attribute[],
  }),

  computed: {
    selectedAttributes: {
      get(): string[] {
        return (
          this.value?.map(
            (attribute: Attribute | string) =>
              (attribute as Attribute)?.id || (attribute as string),
          ) || []
        )
      },
      set(value: string[]) {
        this.$emit('input', value)
      },
    },

    attributes(): Attribute[] {
      return uniqBy(this.$accessor.attributes.data.concat(this.initialAttributes), 'id')
    },
  },

  async created() {
    await this.searchAttributes()
    this.initialAttributes = cloneDeep(this.$accessor.attributes.data)
    await this.loadSelectedAttributes()
  },

  methods: {
    async searchAttributes(value?: string) {
      this.isLoading = true
      await this.$accessor.attributes.fetch({ search: value, global: 0 })
      this.initialAttributes = []
      this.isLoading = false
    },

    onSearch: debounce(function (this: any, value: string) {
      this.searchAttributes(value)
    }, 200),

    async loadSelectedAttributes() {
      this.isLoading = true
      await this.$accessor.attributes.fetch({ ids: this.selectedAttributes, limit: 100 })
      this.isLoading = false
    },

    isFirst(id: string) {
      return this.selectedAttributes[0] === id
    },
    isLast(id: string) {
      return this.selectedAttributes[this.selectedAttributes.length - 1] === id
    },

    move(id: string, direction: -1 | 1) {
      const currentIndex = this.selectedAttributes.findIndex((attr) => attr === id)
      const nextIndex = currentIndex + direction
      if (nextIndex < 0 || nextIndex >= this.selectedAttributes.length) return

      const copy = [...this.selectedAttributes]
      copy.splice(currentIndex, 1)
      copy.splice(nextIndex, 0, id)
      this.selectedAttributes = copy
    },
  },
})
</script>

<style lang="scss">
.attribute-select {
  &__option {
    position: relative;
  }

  .ant-select-selection__choice {
    padding-left: 40px;
    transition: 0s;

    &:first-child,
    &:nth-last-child(2) {
      padding-left: 20px;
    }
  }

  &__btn {
    display: none;
  }

  .ant-select-selection__rendered &__btn {
    all: unset;
    background-color: $gray-color-300;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 20px;
    top: 4px;
    font-size: 16px;
    line-height: 14px;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;

    &:first-child {
      left: 3px;
    }

    &:hover {
      background-color: $gray-color-400;
    }
  }
}
</style>
