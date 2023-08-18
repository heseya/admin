<template>
  <div class="responsive-media-form">
    <div class="responsive-media-form__header">
      <span class="responsive-media-form__title"> {{ $t('title') }} </span>

      <icon-button v-if="!disabled" @click="addGroup">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addGroup') }}
      </icon-button>
    </div>

    <div class="responsive-media-form__content">
      <Empty v-if="media.length === 0">{{ $t('emptyMedia') }}</Empty>

      <draggable v-model="media" :disabled="disabled">
        <div v-for="(item, i) in media" :key="i" class="responsive-media-form__row">
          <BannerMediaComponent
            ref="mediaForm"
            v-model="media[i]"
            :edited-lang="editedLang"
            @delete="removeGroup(i)"
          />
        </div>
      </draggable>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Media w galerii",
    "addGroup": "Dodaj kolejne zdjęcie",
    "emptyMedia": "Brak zdjęć"
  },
  "en": {
    "title": "Media in the gallery",
    "addGroup": "Add another image",
    "emptyMedia": "No images"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Draggable from 'vuedraggable'

import Empty from '@/components/layout/Empty.vue'
import BannerMediaComponent from './BannerMedia.vue'
import { BannerMediaComponentForm } from '@/interfaces/Banner'

export default defineComponent({
  components: { Draggable, Empty, BannerMediaComponent },
  props: {
    value: {
      type: Array as PropType<BannerMediaComponentForm[]>,
      required: true,
    },
    editedLang: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    media: {
      get(): BannerMediaComponentForm[] {
        return this.value
      },
      set(v: BannerMediaComponentForm[]) {
        this.$emit('input', v)
      },
    },
  },

  methods: {
    addGroup() {
      this.media.push({
        id: '',
        order: 0,
        url: '',
        media: [],
        published: [],
        translations: {
          [this.editedLang]: {
            title: '',
            subtitle: '',
          },
        },
      })
    },
    removeGroup(i: number) {
      this.media = this.media.filter((_, index) => index !== i)
    },

    clearMediaToDelete() {
      const forms: any[] = Array.isArray(this.$refs.mediaForm)
        ? this.$refs.mediaForm
        : [this.$refs.mediaForm]

      forms.map((f) => f.clearMediaToDelete())
    },
  },
})
</script>

<style lang="scss" scoped>
.responsive-media-form {
  width: 100%;
  margin-top: 16px;

  &__header {
    display: flex;
    margin-bottom: 8px;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.3em;
    font-weight: 600;
  }

  &__row {
    width: 100%;

    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
}
</style>
