<template>
  <div class="tags">
    <small class="label">Tagi</small>
    <multiselect
      v-model="tags"
      tag-placeholder="Dodaj jako nowy tag"
      selectLabel="Naciśnij enter by wybrać"
      selectedLabel="Wybrany"
      placeholder="Wyszukaj lub dodaj tagi"
      deselect-label="Usuń tag"
      label="name"
      track-by="id"
      :options="options"
      :multiple="true"
      :taggable="true"
      :close-on-select="false"
      @tag="addTag"
      @search-change="onSearch"
      class="tags__select"
    >
      <template #noOptions> Lista jest pusta </template>
      <template #tag="{ option, remove }">
        <span class="multiselect__tag" :style="{ backgroundColor: `#${option.color}` }">
          <span>{{ option.name }}</span>
          <i aria-hidden="true" @click="remove" class="multiselect__tag-icon"></i>
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

export default Vue.extend({
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
  components: {
    Multiselect,
  },
})
</script>

<style lang="scss" scoped>
.tags {
  width: 100%;

  &__select {
    width: 100%;
  }
}
</style>
