<template>
  <component
    :is="component"
    :to="to"
    class="cms-table-row"
    :style="{ '--cols': `repeat(${labels.length}, 1fr)` }"
    :class="{ 'cms-table-row--no-hover': noHover }"
    @click.stop="click"
  >
    <div v-for="{ key, label, render } in labels" :key="key" class="cms-table-row__col">
      <span class="cms-table-row__col-label">{{ label }}</span>
      <span class="cms-table-row__col-value">
        <slot :name="key" v-bind="{ key, label, value: item[key] }">
          {{ render ? render(item[key]) : item[key] }}
        </slot>
      </span>
    </div>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { TableHeader } from '@/interfaces/CmsTable'

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
    hidden: {
      type: Boolean,
      default: false,
    },
    noHover: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Record<string, any>>,
    labels: {
      type: Array,
      required: true,
    } as Vue.PropOptions<TableHeader[]>,
  },
  computed: {
    component(): any {
      if (this.to) return 'router-link'
      return this.el
    },
  },
  methods: {
    click() {
      this.$emit('click')
    },
  },
})
</script>

<style lang="scss">
.cms-table-row {
  all: unset;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 16px;

  @media ($viewport-11) {
    grid-template-columns: var(--cols);
    margin-bottom: 0;
  }

  &:hover {
    background-color: #f3f9ff;
  }

  &__col {
    padding: 8px;
    display: flex;
    width: 100%;
    flex-direction: column;

    @media ($viewport-11) {
      padding: 16px;
    }
  }

  &__col-label {
    text-transform: uppercase;
    color: #7b8589;
    font-size: 0.8em;
    margin-bottom: 4px;

    @media ($viewport-11) {
      display: none;
    }
  }

  &__col-value {
    color: $font-color;
  }
}
</style>
