<template>
  <div class="single-select-input">
    <app-select
      v-model="selectedOptionId"
      class="single-select-input__select"
      option-filter-prop="label"
      :disabled="disabled"
      show-search
      allow-clear
    >
      <a-select-option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :label="option.name"
      >
        {{ option.name }}
      </a-select-option>
    </app-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AttributeOption, ProductAttribute } from '@/interfaces/Attribute'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  props: {
    value: {
      type: Object,
      default: () => undefined,
    } as Vue.PropOptions<AttributeOption | undefined>,
    attribute: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductAttribute>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    options: [] as AttributeOption[],
  }),
  computed: {
    selectedOptionId: {
      get(): UUID {
        return this.value?.id || undefined
      },
      set(v: UUID | null) {
        const option = this.options.find((o) => o.id === v) || null
        this.$emit('input', option)
      },
    },
  },
  watch: {
    attribute() {
      this.fetchAttribute()
    },
  },
  methods: {
    async fetchAttribute() {
      const attribute = await this.$accessor.attributes.get(this.attribute.id)
      if (attribute) this.options = attribute.options as AttributeOption[]
      // TODO: remove
      // this.options = [
      //   { id: 'xd', name: 'xddd' },
      //   { id: 'xd2', name: 'xddd2' },
      //   { id: 'xd3', name: 'xddd3' },
      //   { id: 'xd4', name: 'xddd4' },
      // ]
    },
  },
})
</script>

<style lang="scss" scoped>
.single-select-input {
  &__select {
    min-width: 300px;
  }
}
</style>
