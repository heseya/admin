<template>
  <div class="tags">
    <small class="label">Tagi</small>
    <a-select
      :value="tagsValue"
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
    </a-select>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { debounce, uniqBy } from 'lodash'
import { Tag } from '@/interfaces/Tag'

export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<Tag[]>,
    disabled: {
      type: Boolean,
      default: false,
    },
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
    tagsValue(): string[] {
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

    removeTag(tag: { key: string; label: string }) {
      this.tags = this.tags.filter(({ id }) => id !== tag.key)
    },

    async addTag(rawTag: { key: string; label: string }) {
      const tag = this.options.find((tag) => tag.id === rawTag.key)
      if (tag) {
        // Add existing tag
        this.tags = [...this.tags, tag]
        return
      }

      // Create new tag
      const newTag = await this.$accessor.tags.add({ name: rawTag.label })
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
    background-color: #000;
    margin-right: 4px;
  }
}
</style>
