<template>
  <div class="media-filter">
    <app-select
      v-model="local.type"
      :label="$t('mediaType')"
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
      <a-select-option :value="MediaType.Pdf" :label="MediaType.Pdf">
        {{ $t('mediaTypes.pdf') }}
      </a-select-option>
    </app-select>

    <boolean-select
      v-model="local.has_relationships"
      :label="$t('hasRelationships')"
      @change="debouncedSearch"
    />
  </div>
</template>

<i18n>
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
import Vue from 'vue'
import debounce from 'lodash/debounce'

import BooleanSelect from '@/components/form/BooleanSelect.vue'
import { ALL_FILTER_VALUE } from '@/consts/filters'
import { CdnMediaType } from '@/interfaces/Media'

export type MediaFiltersType = {
  type: CdnMediaType | typeof ALL_FILTER_VALUE
  has_relationships: boolean | typeof ALL_FILTER_VALUE
}

export const EMPTY_MEDIA_FILTERS: MediaFiltersType = {
  type: ALL_FILTER_VALUE,
  has_relationships: ALL_FILTER_VALUE,
}

export default Vue.extend({
  components: {
    BooleanSelect,
  },

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
