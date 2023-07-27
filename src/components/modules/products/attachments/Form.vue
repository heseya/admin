<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="attachment-form" @submit.prevent="handleSubmit(onSubmit)">
      <Loading :active="isLoading" />

      <validated-input
        v-model="form.name"
        name="name"
        :label="$t('common.form.name')"
        rules="required"
      />
      <validated-input
        v-model="form.description"
        name="description"
        :label="$t('common.form.description')"
      />

      <!-- TODO: Edit type and visibility -->

      <template v-if="isNew">
        <app-select
          v-model="mediaSource"
          :label="$t('mediaType.title').toString()"
          option-filter-prop="label"
        >
          <a-select-option :value="CdnMediaSource.Silverbox" :label="CdnMediaSource.Silverbox">
            {{ $t('mediaType.silverbox') }}
          </a-select-option>
          <a-select-option :value="CdnMediaSource.External" :label="CdnMediaSource.External">
            {{ $t('mediaType.external') }}
          </a-select-option>
        </app-select>

        <validated-input
          v-if="mediaSource === CdnMediaSource.External"
          v-model="mediaExternalUrl"
          name="url"
          :label="$t('common.form.slug')"
          rules="required|url"
        />
        <template v-if="mediaSource === CdnMediaSource.Silverbox">
          <a-upload-dragger
            name="file"
            accept=".pdf,application/pdf"
            :file-list="fileToUpload ? [fileToUpload] : []"
            :before-upload="onBeforeUpload"
            :remove="onRemove"
            :multiple="false"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">{{ $t('dropOrChooseFile') }}</p>
          </a-upload-dragger>

          <validation-block :message="$t('noFileError').toString()" :block="!fileToUpload" />
        </template>
      </template>

      <app-button class="attachment-form__btn" html-type="submit" type="primary">
        {{ $t('common.save') }}
      </app-button>
    </form>
  </validation-observer>
</template>

<i18n lang="json">
{
  "en": {
    "noFileError": "File is required",
    "dropOrChooseFile": "Drop file here or click to choose",
    "mediaType": {
      "title": "Attachment type",
      "silverbox": "Upload file",
      "external": "External link"
    }
  },
  "pl": {
    "noFileError": "Plik jest wymagany",
    "dropOrChooseFile": "Upuść plik tutaj lub kliknij aby wybrać",
    "mediaType": {
      "title": "Typ załącznika",
      "silverbox": "Przesłanie pliku",
      "external": "Zewnętrzny link"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import {
  CdnMediaSource,
  CdnMediaAttachmentType,
  CdnMediaAttachmentVisiblity,
  ProductAttachmentCreateDto,
  ProductAttachmentUpdateDto,
  CdnMediaType,
} from '@heseya/store-core'

import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'

import Loading from '@/components/layout/Loading.vue'
import ValidationBlock from '@/components/form/ValidationBlock.vue'

type Form = ProductAttachmentCreateDto | (ProductAttachmentUpdateDto & { id: string })

const isCreateForm = (form: Form): form is ProductAttachmentCreateDto => {
  return !('id' in form)
}

export default defineComponent({
  components: { ValidationObserver, ValidationBlock, Loading },
  props: {
    productId: {
      type: String,
      required: true,
    },
    value: {
      type: Object as PropType<Form>,
      required: true,
    },
  },

  data: () => ({
    mediaSource: CdnMediaSource.Silverbox,
    mediaExternalUrl: '',
    fileToUpload: null as File | null,
    isLoading: false,
  }),

  computed: {
    form: {
      get(): Form {
        return this.value
      },
      set(val: Form) {
        this.$emit('input', val)
      },
    },

    isNew(): boolean {
      return isCreateForm(this.form)
    },

    CdnMediaSource(): typeof CdnMediaSource {
      return CdnMediaSource
    },
  },

  methods: {
    async onSubmit() {
      if (this.isLoading) return
      this.isLoading = true

      if (this.isNew) {
        await this.createAttachment()
      } else {
        await this.updateAttachment()
      }

      this.isLoading = false
    },

    async createAttachment() {
      try {
        // Validation should prevent this
        if (!this.fileToUpload && !this.mediaExternalUrl) throw new Error('No file to upload')

        const media = await sdk.Media.create(
          this.mediaSource === CdnMediaSource.Silverbox
            ? {
                file: this.fileToUpload!,
              }
            : {
                source: CdnMediaSource.External,
                type: CdnMediaType.Other,
                url: this.mediaExternalUrl,
              },
        )

        const attachment = await sdk.Products.Attachments.create(this.productId, {
          name: this.form.name,
          description: this.form.description,
          media_id: media.id,
          visibility: CdnMediaAttachmentVisiblity.Public,
          type: CdnMediaAttachmentType.Other,
        })

        this.$emit('created', attachment)

        // Reset form
        this.mediaExternalUrl = ''
        this.fileToUpload = null
        this.mediaSource = CdnMediaSource.Silverbox
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    async updateAttachment() {
      try {
        if (isCreateForm(this.form)) return

        const attachment = await sdk.Products.Attachments.update(this.productId, this.form.id, {
          name: this.form.name,
          description: this.form.description,
          visibility: CdnMediaAttachmentVisiblity.Public,
          type: CdnMediaAttachmentType.Other,
        })

        this.$emit('updated', attachment)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    onBeforeUpload(media: File) {
      this.fileToUpload = media
      return false
    },
    onRemove() {
      this.fileToUpload = null
    },
  },
})
</script>

<style lang="scss" scoped>
.attachment-form {
  position: relative;

  &__btn {
    margin: 0 auto;
    margin-top: 16px;
  }

  &__upload {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
