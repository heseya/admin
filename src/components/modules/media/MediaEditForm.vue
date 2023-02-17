<template>
  <a-popover
    v-model="isOpen"
    class="media-edit-modal"
    :title="$t('title')"
    trigger="click"
    :placement="placement"
  >
    <template #content>
      <validation-observer v-slot="{ handleSubmit }" slim>
        <form v-if="isOpen" class="media-edit-modal__form" @submit.prevent="handleSubmit(onSubmit)">
          <validated-input v-model="form.alt" :label="$t('form.alt')" :disabled="isLoading" />

          <validated-input
            v-model="form.slug"
            :label="$t('form.slug')"
            :rules="{ required: !!media.slug }"
            :disabled="isLoading"
          />
          <small>
            {{ $t('currentSlug') }}: <b>{{ media.url }}</b>
          </small>

          <br />
          <div class="media-edit-modal__form-buttons">
            <app-button
              type="primary"
              html-type="submit"
              size="small"
              :loading="isLoading"
              class="media-edit-modal__form-button"
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
      </validation-observer>
    </template>

    <icon-button v-if="!disabled" type="default" size="small">
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
    "successMessage": "Metadane zostały zaktualizowane",
    "errorMessage": "Nie udało się zaktualizować metadanych",
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
    "successMessage": "Metadata updated",
    "errorMessage": "The metadata could not be updated",
    "removed": "Deleted",
    "removeFail": "Failed to delete",
    "confirmDelete": "Confirm to delete"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { CdnMedia } from '@heseya/store-core'
import { ValidationObserver } from 'vee-validate'
import { generateSlug } from '@/utils/generateSlug'

const EMPTY_FORM = {
  alt: '',
  slug: '',
}

export default Vue.extend({
  components: { ValidationObserver },
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
      const result = await this.$accessor.media.update({ id: this.media.id, item: slugifiedForm })

      if (result) {
        this.$toast.success(this.$t('successMessage') as string)
        this.$emit('updated', result)
        this.isOpen = false
      } else {
        this.$toast.error(this.$t('errorMessage') as string)
      }

      this.isLoading = false
    },
    async handleMediaRemove(id: string) {
      const result = await this.$accessor.media.remove(id)

      if (result) {
        this.$emit('removed', id)
        this.$toast.success(this.$t('removed') as string)
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
