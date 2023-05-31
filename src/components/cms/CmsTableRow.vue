<template>
  <component
    :is="component"
    :to="to"
    class="cms-table-row"
    :class="{ 'cms-table-row--no-hover': noHover, 'cms-table-row--draggable': draggable }"
    @click.stop="click"
  >
    <icon-button class="cms-table-row__reorder reorder-handle" size="small" type="transparent">
      <template #icon> <i class="bx bx-menu"></i> </template>
    </icon-button>

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
          <BooleanTag v-if="typeof value === 'boolean'" small :value="value" />
          <span v-else> {{ value }} </span>
        </slot>
      </span>
    </div>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import get from 'lodash/get'
import { TableHeader, TableValue } from '@/interfaces/CmsTable'

export default defineComponent({
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
    draggable: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    } as PropOptions<Record<string, any>>,
    headers: {
      type: Array,
      required: true,
    } as PropOptions<TableHeader[]>,
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
  background-color: var(--white-color);
  display: grid;
  align-items: center;
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
    background-color: $transparent;
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
    background-color: var(--primary-color-100);
  }

  &--draggable {
    padding-left: 30px !important;
    position: relative;
  }

  &--draggable &__reorder {
    display: block;
  }

  &__reorder {
    display: none;
    position: absolute;
    top: 50%;
    left: 8px;
    cursor: move;
    transform: translateY(-55%);
    color: $gray-color-500;
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
    color: var(--gray-color-600);
    font-size: 0.8em;
    margin-bottom: 4px;

    @media ($viewport-11) {
      display: none;
    }
  }

  &__col-value {
    color: var(--font-color);

    &--break-all {
      word-break: break-all;
    }

    &--break-word {
      word-break: break-word;
    }
  }
}
</style>
