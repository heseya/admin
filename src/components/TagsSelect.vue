<template>
  <div class="tags">
    <small class="label">Tagi</small>
    <multiselect
      v-model="tags"
      tag-placeholder="Dodaj jako nowy tag"
      select-label="Naciśnij enter by wybrać"
      selected-label="Wybrany"
      placeholder="Wyszukaj lub dodaj tagi"
      deselect-label="Usuń tag"
      label="name"
      track-by="id"
      :options="options"
      :multiple="true"
      :taggable="true"
      :close-on-select="false"
      class="tags__select"
      @tag="addTag"
      @search-change="onSearch"
    >
      <template #noOptions> Lista jest pusta </template>
      <template #tag="{ option, remove }">
        <span class="multiselect__tag" :style="{ backgroundColor: `#${option.color}` }">
          <span>{{ option.name }}</span>
          <i aria-hidden="true" class="multiselect__tag-icon" @click="remove"></i>
        </span>
      </template>
    </multiselect>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import { debounce } from 'lodash'
import { Tag } from '@/interfaces/Tag'

import 'vue-multiselect/dist/vue-multiselect.min.css'

export default Vue.extend({
  components: {
    Multiselect,
  },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<Tag[]>,
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
    options(): Tag[] {
      return this.$accessor.tags.data
    },
  },
  methods: {
    onSearch: debounce(function (this: any, search: string) {
      if (!search) return this.$accessor.tags.clearData()
      this.$accessor.tags.fetch({ search })
    }, 200),
    async addTag(tagName: string) {
      const newTag = await this.$accessor.tags.add({ name: tagName })
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
}
</style>
