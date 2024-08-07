<template>
  <div class="tags">
    <app-select
      :value="tagsValue"
      :label="$t('tags').toString()"
      class="tags__select"
      mode="tags"
      option-filter-prop="label"
      :token-separators="[',']"
      :disabled="disabled"
      allow-clear
      label-in-value
      @search="onSearch"
      @select="addTag"
      @deselect="removeTag"
    >
      <a-select-option v-for="tag in options" :key="tag.id" :value="tag.id" :label="tag.name">
        <div class="tags__option">
          <div class="tags__color" :style="{ backgroundColor: `#${tag.color}` }"></div>
          {{ tag.name }}
        </div>
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "tags": "Tagi"
  },
  "en": {
    "tags": "Tags"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { debounce, uniqBy } from 'lodash'
import { Tag } from '@heseya/store-core'

type AntSelectOption = { key: string; label: string }

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<Tag[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editedLang: { type: String, required: true },
  },
  computed: {
    tags: {
      get(): Tag[] {
        return this.value || []
      },
      set(v: Tag[]) {
        this.$emit('input', v)
      },
    },
    tagsValue(): AntSelectOption[] {
      return this.tags.map((tag) => ({ key: tag.id, label: tag.name }))
    },
    options(): Tag[] {
      return uniqBy([...this.tags, ...this.$accessor.tags.data], 'id')
    },
  },

  created() {
    this.$accessor.tags.fetch()
  },

  methods: {
    onSearch: debounce(function (this: any, search: string) {
      if (!search) return this.$accessor.tags.clearData()
      this.$accessor.tags.fetch({ search })
    }, 200),

    removeTag(tag: AntSelectOption) {
      this.tags = this.tags.filter(({ id }) => id !== tag.key)
    },

    async addTag(rawTag: AntSelectOption) {
      const tag = this.options.find((tag) => tag.id === rawTag.key)
      if (tag) {
        // Add existing tag
        this.tags = [...this.tags, tag]
        return
      }

      // Create new tag
      const newTag = await this.$accessor.tags.add({
        translations: {
          [this.editedLang]: { name: rawTag.label },
        },
        published: [this.editedLang],
      })
      if (newTag) this.tags = [...this.tags, newTag]
    },
  },
})
</script>

<style lang="scss" scoped>
.tags {
  width: 100%;

  &__select {
    width: 100%;
    z-index: 1;
  }

  &__option {
    display: flex;
    align-items: center;
  }

  &__color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background-color: var(--black-color);
    margin-right: 4px;
  }
}
</style>
