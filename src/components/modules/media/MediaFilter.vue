<template>
  <div class="media-filter">
    <app-select
      v-model="local.type"
      :label="'Media type:'"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="MediaType.Photo" :label="MediaType.Photo">
        {{ $t('photo') }}
      </a-select-option>
      <a-select-option :value="MediaType.Video" :label="MediaType.Video">
        {{ $t('video') }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.has_relationships"
      :label="'Has relationships:'"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" :label="true"> {{ $t('yes') }} </a-select-option>
      <a-select-option :value="'0'" :label="false"> {{ $t('no') }} </a-select-option>
    </app-select>
  </div>
</template>

<i18n>
{
  "pl": {
    "photo": "Zdjęcie",
    "video": "Video",
    "yes": "Tak",
    "no": "Nie"
  },
  "en": {
    "photo": "Photo",
    "video": "Video",
    "yes": "Yes",
    "no": "No"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import { debounce } from 'lodash'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export enum MediaType {
  Photo = 'photo',
  Video = 'video',
}

export type MediaFiltersType = {
  type: MediaType | typeof ALL_FILTER_VALUE
  has_relationships: boolean | typeof ALL_FILTER_VALUE
}

export const EMPTY_MEDIA_FILTERS: MediaFiltersType = {
  type: ALL_FILTER_VALUE,
  has_relationships: ALL_FILTER_VALUE,
}

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_MEDIA_FILTERS }),
    } as Vue.PropOptions<MediaFiltersType>,
  },
  data: () => ({
    local: {
      ...EMPTY_MEDIA_FILTERS,
    },
  }),

  computed: {
    MediaType(): typeof MediaType {
      return MediaType
    },
  },

  watch: {
    filters(filters: MediaFiltersType) {
      this.local = { ...this.local, ...filters }
    },
  },

  mounted() {
    this.local = { ...this.local, ...this.filters }
  },

  methods: {
    makeSearch() {
      this.$emit('search', {
        ...this.filters,
        ...this.local,
      })
    },

    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
  },
})
</script>

<style lang="scss" scoped>
.media-filter {
  &__filter {
    width: fit-content;
    position: relative;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    column-gap: 8px;

    &::after {
      content: '\ea4a';
      font-family: $boxiconsFont;
      font-weight: 400;
      color: #d9dbe0;
      position: absolute;
      right: 10px;
      top: 50%;
      line-height: 0.8em;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      pointer-events: none;
    }
  }

  &__select {
    color: $font-color;
    box-shadow: $shadow;
    padding: 8px 6px;
    padding-right: 24px;
    appearance: none;
    border-radius: 4px;
    border: 1px solid $primary-color-100;
  }
}
</style>
