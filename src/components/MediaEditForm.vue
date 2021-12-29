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
          <validated-input v-model="form.slug" label="Link do zdjęcia" :disabled="isLoading" />
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
    onSubmit() {
      if (this.isLoading) return
      this.isLoading = true

      // TODO:
      console.log('submit', this.form)

      setTimeout(() => {
        this.isLoading = false
        this.isOpen = false
      }, 1000)
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
  }
}
</style>
