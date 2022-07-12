<template>
  <a-popover
    v-model="isOpen"
    class="media-edit-modal"
    :title="$t('title')"
    trigger="click"
    :placement="placement"
  >
    <template #content>
      <form class="media-edit-modal__form" @submit.prevent="onSubmit">
        <validated-input v-model="form.alt" :label="$t('form.alt')" :disabled="isLoading" />

        <validated-input v-model="form.slug" :label="$t('form.slug')" :disabled="isLoading" />
        <small>
          {{ $t('currentSlug') }}: <b>{{ media.url }}</b>
        </small>

        <br />
        <app-button type="primary" html-type="submit" size="small" :loading="isLoading">
          {{ $t('common.save') }}
        </app-button>
      </form>
    </template>

    <icon-button v-if="!disabled" type="default">
      <template #icon>
        <i class="bx bxs-pencil"></i>
      </template>
    </icon-button>
  </a-popover>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Edycja zdjęcia/video",
    "form": {
      "alt": "Tekst alternatywny zdjęcia",
      "slug": "Nazwa pliku zdjęcia"
    },
    "currentSlug": "Aktualny link",
    "successMessage": "Metadane zdjęcia zostały zaktualizowane"
  },
  "en": {
    "title": "Edit image/video",
    "form": {
      "alt": "Image alternative text",
      "slug": "Image file name"
    },
    "currentSlug": "Current link",
    "successMessage": "Image metadata updated"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { CdnMedia } from '@/interfaces/Media'
import { updateMedia } from '@/services/uploadMedia'
import { formatApiNotificationError } from '@/utils/errors'

const EMPTY_FORM = {
  alt: '',
  slug: '',
}

export default Vue.extend({
  props: {
    disabled: { type: Boolean, default: false },
    placement: { type: String, default: 'bottomRight' },
    media: { type: Object, required: true } as Vue.PropOptions<CdnMedia>,
  },
  data: () => ({
    isOpen: false,
    isLoading: false,
    form: { ...EMPTY_FORM },
  }),
  watch: {
    isOpen(isOpen) {
      if (isOpen) {
        this.form = { alt: this.media.alt || '', slug: this.media.slug || '' }
      } else {
        this.form = { ...EMPTY_FORM }
      }
    },
  },

  methods: {
    async onSubmit() {
      if (this.isLoading) return
      this.isLoading = true

      const result = await updateMedia({ ...this.media, ...this.form })

      if (result.success) {
        this.$toast.success(this.$t('successMessage') as string)
        this.$emit('update', result.file)
        this.isOpen = false
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }

      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.media-edit-modal {
  z-index: 100;

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > span {
      width: 100%;
    }
  }
}
</style>
