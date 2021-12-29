<template>
  <div class="media-edit-modal">
    <a-popover
      v-model="isOpen"
      title="Edycja zdjęcia/video"
      trigger="click"
      placement="bottomRight"
    >
      <template #content>
        <form class="media-edit-modal__form" @submit.prevent="onSubmit">
          <validated-input
            v-model="form.alt"
            label="Tekst alternatywny zdjęcia"
            :disabled="isLoading"
          />
          <validated-input v-model="form.slug" label="Nazwa pliku zdjęcia" :disabled="isLoading" />
          <small>
            Aktualny link: <b>{{ media.url }}</b>
          </small>

          <br />
          <app-button type="primary" html-type="submit" size="small" :loading="isLoading">
            Zapisz
          </app-button>
        </form>
      </template>

      <icon-button v-if="!disabled" type="default">
        <template #icon>
          <i class="bx bxs-pencil"></i>
        </template>
      </icon-button>
    </a-popover>
  </div>
</template>

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
        this.$toast.success('Metadane zdjęcia zostały zaktualizowane')
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
