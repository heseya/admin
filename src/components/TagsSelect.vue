<template>
  <div class="tags-select">
    <div class="tags-select__list"></div>
    <a-select
      :value="selectValue"
      mode="multiple"
      labelInValue
      placeholder="Wybierz tagi"
      notFoundContent=""
      @search="onSearch"
      @select="onSelect"
      @deselect="onDeselect"
    >
      <a-select-option v-for="tag in searchedTags" :key="tag.id" :value="tag.id">
        {{ tag.name }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import { Tag } from '@/interfaces/Tag'

export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<Tag[]>,
  },
  computed: {
    selectValue(): { label: string; key: string }[] {
      return this.tags.map(({ name, id }) => ({ label: name, key: id }))
    },
    tags: {
      get(): Tag[] {
        return this.value || []
      },
      set(v: Tag[]) {
        this.$emit('input', v)
      },
    },
    searchedTags(): Tag[] {
      return this.$accessor.tags.data
    },
  },
  methods: {
    onSearch: debounce(function (this: any, search: string) {
      if (!search) return this.$accessor.tags.clearData()
      this.$accessor.tags.fetch({ search })
    }, 0),
    async onSelect(tag: { label: string; key: string }) {
      const existingTag = this.searchedTags.find((t) => t.id === tag.key)
      if (existingTag) return (this.tags = [...this.tags, existingTag])

      const newTag = await this.$accessor.tags.add({ name: tag.label })
      this.tags = [...this.tags, newTag]
    },
    onDeselect(tag: { label: string; key: string }) {
      this.tags = this.tags.filter(({ id }) => tag.key !== id)
    },
  },
})
</script>

<style lang="scss" scoped>
.tags-select {
}
</style>
