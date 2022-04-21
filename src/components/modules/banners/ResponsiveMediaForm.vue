<template>
  <div class="responsive-media-form">
    <div class="responsive-media-form__header">
      <span class="responsive-media-form__title">{{ $t('title') }}</span>

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
          <ResponsiveMediaComponent v-model="media[i]" @delete="removeGroup(i)" />
        </div>
      </draggable>
    </div>
  </div>
</template>

<i18n>
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
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { ResponsiveMedia } from '@/interfaces/Banner'
import Empty from '@/components/layout/Empty.vue'
import ResponsiveMediaComponent from './ResponsiveMedia.vue'

export default Vue.extend({
  components: { Draggable, Empty, ResponsiveMediaComponent },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ResponsiveMedia[]>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    media: {
      get(): ResponsiveMedia[] {
        return this.value
      },
      set(v: ResponsiveMedia[]) {
        this.$emit('input', v)
      },
    },
  },

  methods: {
    addGroup() {
      this.media.push([])
    },
    removeGroup(i: number) {
      this.media = this.media.filter((_, index) => index !== i)
    },
  },
})
</script>

<style lang="scss" scoped>
.responsive-media-form {
  width: 100%;

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
