<template>
  <div class="cms-list">
    <span class="cms-list__header">
      <slot name="title">{{ title }}</slot>
    </span>

    <ul class="cms-list__list">
      <li
        v-for="(singleValue, i) in items.slice(0, visibleItemsNumber)"
        :key="String(singleValue) + i"
        class="cms-list__list-item"
      >
        <copyable-tag :text="singleValue" />
      </li>
      <li v-if="numberOfVisbibleItems < items.length" @click.stop.prevent="showAll = !showAll">
        <tag class="cms-list__show-more">
          {{
            showAll
              ? $t('showLess')
              : $t('showMore', { number: items.length - numberOfVisbibleItems })
          }}
        </tag>
      </li>
    </ul>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "showMore": "Pokaż {number} więcej",
    "showLess": "Pokaż mniej"
  },
  "en": {
    "showMore": "Show {number} more",
    "showLess": "Show less"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import CopyableTag from '../CopyableTag.vue'
import Tag from '../Tag.vue'

export default defineComponent({
  components: {
    CopyableTag,
    Tag,
  },

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    } as PropOptions<string[]>,
    numberOfVisbibleItems: {
      type: Number,
      required: false,
      default: 5,
    },
  },

  data: () => ({
    showAll: false,
  }),

  computed: {
    visibleItemsNumber(): number {
      if (this.showAll) return Infinity
      return this.numberOfVisbibleItems
    },
  },
})
</script>

<style scoped lang="scss">
.cms-list {
  &__header {
    display: block;
    font-size: 13px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
  }

  &__list-item {
    max-width: 100%;
  }

  &__show-more {
    font-size: 0.7rem;
    background-color: transparent;
    border: 1px solid var(--bg-color, var(--black-color));
    color: var(--bg-color, var(--black-color));
    padding-block: 3px;

    &:hover {
      color: var(--primary-color-500);
      border-color: var(--primary-color-500);
    }
  }
}
</style>
