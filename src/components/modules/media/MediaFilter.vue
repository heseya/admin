<template>
  <div class="media-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search').toString()"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.type"
      :label="$t('mediaType').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="MediaType.Photo" :label="MediaType.Photo">
        {{ $t('mediaTypes.photo') }}
      </a-select-option>
      <a-select-option :value="MediaType.Video" :label="MediaType.Video">
        {{ $t('mediaTypes.video') }}
      </a-select-option>
      <a-select-option :value="MediaType.Document" :label="MediaType.Document">
        {{ $t('mediaTypes.document') }}
      </a-select-option>
      <a-select-option :value="MediaType.Other" :label="MediaType.Other">
        {{ $t('mediaTypes.other') }}
      </a-select-option>
    </app-select>

    <boolean-select
      v-model="local.has_relationships"
      :label="$t('hasRelationships').toString()"
      @change="debouncedSearch"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "hasRelationships": "Czy posiada relacje",
    "mediaType": "Typ mediów"
  },
  "en": {
    "hasRelationships": "Has relationships",
    "mediaType": "Media type"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'
import { CdnMediaType } from '@heseya/store-core'

import BooleanSelect from '@/components/form/BooleanSelect.vue'
import { ALL_FILTER_VALUE } from '@/consts/filters'

export type MediaFiltersType = {
  search: string
  type: CdnMediaType | typeof ALL_FILTER_VALUE
  has_relationships: string | typeof ALL_FILTER_VALUE
}

export const EMPTY_MEDIA_FILTERS: MediaFiltersType = {
  search: '',
  type: ALL_FILTER_VALUE,
  has_relationships: ALL_FILTER_VALUE,
}

export default defineComponent({
  components: {
    BooleanSelect,
  },

  props: {
    filters: {
      type: Object as PropType<MediaFiltersType>,
      default: () => ({ ...EMPTY_MEDIA_FILTERS }),
    },
  },

  data: () => ({
    local: {
      ...EMPTY_MEDIA_FILTERS,
    },
  }),

  computed: {
    MediaType(): typeof CdnMediaType {
      return CdnMediaType
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
      color: var(--gray-color-300);
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
    color: var(--font-color);
    box-shadow: $shadow;
    padding: 8px 6px;
    padding-right: 24px;
    appearance: none;
    border-radius: 4px;
    border: 1px solid var(--primary-color-100);
  }
}
</style>
