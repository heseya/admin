<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title')"
      store-key="media"
      :filters="filters"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <media-filter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: singleMedia }">
        <div class="media-list-item">
          <div class="media-list-item__thumbnail">
            <single-media-item
              :key="singleMedia.id"
              :thumbnail-object="{ type: singleMedia.type, url: singleMedia.url }"
            />
          </div>

          <div class="media-list-item__data">
            <p class="media-list-item__text">
              <span>{{ $t('url') }}: </span>

              <a :href="singleMedia.url">{{ singleMedia.url }}</a>
            </p>
            <p class="media-list-item__text">
              <span>{{ $t('alternativeText') }}: </span
              ><span class="media-list-item__text--value">{{ singleMedia.alt || 'brak' }}</span>
            </p>
            <p class="media-list-item__text">
              <span>{{ $t('relationsCount') }}: </span
              ><span class="media-list-item__text--value">{{ singleMedia.relations_count }}</span>
            </p>
          </div>

          <media-edit-form
            class="media-list-item__form"
            :media="singleMedia"
            @update="(m) => updateMedia(m, i)"
            @remove="removeMedia"
          />
        </div>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Lista mediów",
    "alternativeText": "Tekst alternatywny",
    "relationsCount": "Liczba relacji",
    "url": "URL",
    "removed": "Usunięto",
    "removeFail": "Nie udało się usunąć"
  },
  "en": {
    "title": "Media list",
    "alternativeText": "Alternative text",
    "relationsCount": "Relations count",
    "url": "URL",
    "removed": "Deleted",
    "removeFail": "Failed to delete"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { updateMedia, removeMedia } from '@/services/uploadMedia'

import PaginatedList from '@/components/PaginatedList.vue'
import SingleMediaItem from '@/components/modules/media/SingleMediaItem.vue'
import MediaEditForm from '@/components/modules/media/MediaEditForm.vue'

import { CdnMedia } from '@/interfaces/Media'
import { formatApiNotificationError } from '@/utils/errors'
import { formatFilters } from '@/utils/utils'
import { EMPTY_MEDIA_FILTERS, MediaFiltersType } from '@/components/modules/media/MediaFilter.vue'
import MediaFilter from '@/components/modules/media/MediaFilter.vue'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    SingleMediaItem,
    MediaEditForm,
    MediaFilter,
  },

  data: () => ({
    isModalActive: false,
    filters: {
      ...EMPTY_MEDIA_FILTERS,
    } as MediaFiltersType,
  }),

  methods: {
    async updateMedia(media: CdnMedia) {
      const result = await updateMedia(media)

      if (result.success) {
        this.$toast.success(this.$t('successMessage') as string)
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
    async removeMedia(id: string) {
      const result = await removeMedia(id)

      if (result) {
        this.$toast.success(this.$t('remove') as string)
      } else {
        this.$toast.error(this.$t('removeFail') as string)
      }
    },
    makeSearch(filters: MediaFiltersType) {
      this.filters = filters
      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'media',
        query: { page: undefined, ...queryFilters },
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
    background-color: #ffffff;
    overflow: hidden;
    margin-bottom: 4px;
    box-shadow: $shadow;
    width: 100px;
    height: 100px;

    .media-element {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
      transition: transform 0.3s;
    }
  }

  &__text {
    margin-bottom: 8px;
    word-break: break-all;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    &--value {
      color: $primary-color-300;
      // display: block;
    }
  }

  // &__data {
  //   word-break: break-all;
  // }

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
