<template>
  <component
    :is="component"
    :to="to"
    class="cms-table-row"
    :class="{ 'cms-table-row--no-hover': noHover }"
    @click.stop="click"
  >
    <div
      v-for="{ key, label, value, rawValue, wordBreak } in values"
      :key="key"
      class="cms-table-row__col"
      :class="{ 'cms-table-row__col--break': wordBreak && wordBreak !== 'none' }"
    >
      <span class="cms-table-row__col-label">{{ label }}</span>
      <span
        class="cms-table-row__col-value"
        :class="{
          'cms-table-row__col-value--break-all': wordBreak === 'break-all',
          'cms-table-row__col-value--break-word': wordBreak === 'break-word',
        }"
      >
        <slot :name="key" v-bind="{ key, label, value, rawValue, item }">
          <BooleanTag v-if="typeof value === 'boolean'" :value="value" />
          <span v-else> {{ value }} </span>
        </slot>
      </span>
    </div>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import get from 'lodash/get'
import { TableHeader, TableValue } from '@/interfaces/CmsTable'

export default Vue.extend({
  props: {
    to: {
      type: String,
      default: null,
    },
    el: {
      type: String,
      default: 'button',
    },
    noHover: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Record<string, any>>,
    headers: {
      type: Array,
      required: true,
    } as Vue.PropOptions<TableHeader[]>,
  },
  computed: {
    component(): any {
      if (this.to) return 'router-link'
      return this.el
    },
    values(): TableValue[] {
      return this.headers.map(({ key, label, render, wordBreak }) => {
        const rawValue = get(this.item, key)
        return {
          key,
          label,
          value: render?.(rawValue, this.item) ?? rawValue,
          rawValue,
          wordBreak: wordBreak ?? 'none',
        }
      })
    },
  },
  methods: {
    click() {
      this.$emit('click')
    },
  },
})
</script>

<style lang="scss" scoped>
.cms-table-row {
  $cms: &;
  border: none;
  @extend %card;
  box-shadow: none;
  background-color: #fff;
  display: grid;
  align-items: start;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 16px;
  text-align: left;

  @media ($viewport-5) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media ($viewport-11) {
    background-color: #fff0;
    grid-template-columns: var(--table-cols);
    padding: 0 16px;
    border: none;
    border-radius: 0;
    margin-bottom: 0;

    &:not(:last-of-type) {
      border-bottom: solid 1px var(--background-color-700);
    }
  }

  &:hover {
    background-color: $primary-color-100;
  }

  &--no-hover {
    cursor: default;

    &:hover {
      background-color: $transparent;
    }
  }

  &__col {
    padding: 8px;
    display: flex;
    width: 100%;
    flex-direction: column;

    @media ($viewport-11) {
      padding: 16px;
    }

    &--break {
      overflow: hidden;
    }
  }

  &__col-label {
    text-transform: uppercase;
    color: $gray-color-600;
    font-size: 0.8em;
    margin-bottom: 4px;

    @media ($viewport-11) {
      display: none;
    }
  }

  &__col-value {
    color: $font-color;

    &--break-all {
      word-break: break-all;
    }

    &--break-word {
      word-break: break-word;
    }
  }
}
</style>
