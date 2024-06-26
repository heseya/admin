<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title').toString()"
      store-key="media"
      :filters="filters"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <MediaFilter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: singleMedia }">
        <div class="media-list-item">
          <media-element
            fit="cover"
            :media="singleMedia"
            :size="100"
            class="media-list-item__thumbnail"
          />

          <div class="media-list-item__data">
            <p class="media-list-item__text">
              <span>{{ $t('url') }}: </span>
              <a :href="singleMedia.url" target="_blank">{{ singleMedia.url }}</a>
            </p>
            <p class="media-list-item__text">
              <span>{{ $t('alternativeText') }}: </span>
              <span class="media-list-item__text--value">{{ singleMedia.alt || '-' }}</span>
            </p>
            <p class="media-list-item__text">
              <span>{{ $t('relationsCount') }}: </span>
              <span class="media-list-item__text--value">{{ singleMedia.relations_count }}</span>
            </p>
          </div>

          <media-edit-form class="media-list-item__form" :media="singleMedia" allow-deletion />
        </div>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Lista mediów",
    "alternativeText": "Tekst alternatywny",
    "relationsCount": "Liczba relacji",
    "url": "URL"
  },
  "en": {
    "title": "Media list",
    "alternativeText": "Alternative text",
    "relationsCount": "Relations count",
    "url": "URL"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { CdnMediaType } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import MediaEditForm from '@/components/modules/media/MediaEditForm.vue'
import MediaFilter from '@/components/modules/media/MediaFilter.vue'
import MediaElement from '@/components/MediaElement.vue'

import { formatFilters } from '@/utils/utils'
import { EMPTY_MEDIA_FILTERS, MediaFiltersType } from '@/components/modules/media/MediaFilter.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    MediaEditForm,
    MediaFilter,
    MediaElement,
  },

  data: () => ({
    isModalActive: false,
    filters: {
      ...EMPTY_MEDIA_FILTERS,
    } as MediaFiltersType,
  }),

  created() {
    const { search, type, has_relationships: hasRelationships } = this.$route.query
    this.filters.search = search?.toString() || EMPTY_MEDIA_FILTERS.search
    this.filters.type = (type as CdnMediaType) || EMPTY_MEDIA_FILTERS.type
    this.filters.has_relationships = hasRelationships
      ? hasRelationships.toString()
      : EMPTY_MEDIA_FILTERS.has_relationships
  },

  methods: {
    makeSearch(filters: MediaFiltersType) {
      this.filters = filters
      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'media',
        query: { ...queryFilters, page: undefined },
      })
    },
    clearFilters(): void {
      this.makeSearch({ ...EMPTY_MEDIA_FILTERS })
    },
  },
})
</script>

<style lang="scss" scoped>
input[type='color'] {
  height: 30px !important;
}

.media-list-item {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 16px;
  margin-bottom: 12px;

  @media ($viewport-5) {
    grid-template-columns: auto 1fr auto;
  }

  &__thumbnail {
    position: relative;
    border-radius: 8px;
    background-color: var(--white-color);
    overflow: hidden;
    margin-bottom: 4px;
    box-shadow: $shadow;
    width: 100px;
    height: 100px;
  }

  &__text {
    margin-bottom: 8px;
    word-break: break-all;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    &--value {
      color: var(--gray-color-600);
    }
  }

  &__form {
    width: 50px;
    height: 50px;
    align-self: center;
    z-index: 90;

    @media ($max-viewport-5) {
      grid-column: 2/3;
      justify-self: end;
      width: fit-content;
      height: fit-content;
    }
  }
}
</style>
