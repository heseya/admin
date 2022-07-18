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

        <validated-input
          v-if="media.slug !== null"
          v-model="form.slug"
          :label="$t('form.slug')"
          :disabled="isLoading"
          rules="required"
        />
        <a :href="media.url" target="_blank" rel="noopener noreferrer"
          ><small>
            {{ $t('currentSlug') }}: <b>{{ media.url }}</b>
          </small>
        </a>

        <br />
        <div class="media-edit-modal__form-buttons">
          <app-button
            type="primary"
            html-type="submit"
            size="small"
            :loading="isLoading"
            class="media-edit-modal__form-button"
            :disabled="shouldBeDisabled"
          >
            {{ $t('common.save') }}
          </app-button>
          <a-popconfirm
            :cancel-text="$t('common.cancel')"
            :ok-text="$t('common.delete')"
            @confirm="() => handleMediaRemove(media.id)"
          >
            <template #title> {{ $t('confirmDelete') }} </template>
            <app-button
              v-if="allowDeletion"
              type="danger"
              html-type="button"
              size="small"
              class="media-edit-modal__form-button"
            >
              {{ $t('common.delete') }}
            </app-button>
          </a-popconfirm>
        </div>
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
    "successMessage": "Metadane zdjęcia zostały zaktualizowane",
    "removed": "Usunięto",
    "removeFail": "Nie udało się usunąć",
    "confirmDelete": "Potwierdź, aby usunąć"
  },
  "en": {
    "title": "Edit image/video",
    "form": {
      "alt": "Image alternative text",
      "slug": "Image file name"
    },
    "currentSlug": "Current link",
    "successMessage": "Image metadata updated",
    "removed": "Deleted",
    "removeFail": "Failed to delete",
    "confirmDelete": "Confirm to delete"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { CdnMedia } from '@/interfaces/Media'
import { removeMedia, updateMedia } from '@/services/uploadMedia'
import { formatApiNotificationError } from '@/utils/errors'
import { generateSlug } from '@/utils/generateSlug'

const EMPTY_FORM = {
  alt: '',
  slug: '',
}

export default Vue.extend({
  props: {
    disabled: { type: Boolean, default: false },
    placement: { type: String, default: 'bottomRight' },
    media: { type: Object, required: true } as Vue.PropOptions<CdnMedia>,
    allowDeletion: { type: Boolean, required: false, default: false },
  },
  data: () => ({
    isOpen: false,
    isLoading: false,
    form: { ...EMPTY_FORM },
  }),

  computed: {
    shouldBeDisabled(): boolean {
      return this.media.slug !== null && this.form.slug?.trim() === ''
    },
  },
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

      const slugifiedForm = { ...this.form, slug: generateSlug(this.form.slug) }

      const result = await updateMedia({ ...this.media, ...slugifiedForm })

      if (result.success) {
        this.$toast.success(this.$t('successMessage') as string)
        this.$emit('update', result.file)
        this.isOpen = false
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }

      this.isLoading = false
    },
    async handleMediaRemove(id: string) {
      const result = await removeMedia(id)

      if (result) {
        this.$toast.success(this.$t('removed') as string)
        this.$emit('remove', id)
      } else {
        this.$toast.error(this.$t('removeFail') as string)
      }
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

  &__form-buttons {
    display: flex;
  }

  &__form-button {
    &:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
