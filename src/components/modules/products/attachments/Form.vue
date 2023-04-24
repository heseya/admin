<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="attachment-form" @submit.prevent="handleSubmit(onSubmit)">
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
        <a-upload-dragger
          name="file"
          accept=".pdf,application/pdf"
          :file-list="uploadedMedia ? [uploadedMedia] : []"
          :before-upload="onBeforeUpload"
          :remove="onRemove"
          :multiple="false"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">{{ $t('dropOrChooseFile') }}</p>
        </a-upload-dragger>

        <validation-block :message="$t('noFileError')" :block="!uploadedMedia" />
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
    "dropOrChooseFile": "Drop file here or click to choose"
  },
  "pl": {
    "noFileError": "Plik jest wymagany",
    "dropOrChooseFile": "Upuść plik tutaj lub kliknij aby wybrać"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import {
  CdnMediaAttachmentType,
  CdnMediaAttachmentVisiblity,
  ProductAttachmentCreateDto,
  ProductAttachmentUpdateDto,
} from '@heseya/store-core'
import ValidationBlock from '@/components/form/ValidationBlock.vue'
import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'

type Form = ProductAttachmentCreateDto | (ProductAttachmentUpdateDto & { id: string })

const isCreateForm = (form: Form): form is ProductAttachmentCreateDto => {
  return !('id' in form)
}

export default Vue.extend({
  components: { ValidationObserver, ValidationBlock },
  props: {
    productId: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Form>,
  },

  data: () => ({
    uploadedMedia: null as File | null,
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
  },

  methods: {
    async onSubmit() {
      if (this.isNew) {
        await this.createAttachment()
      } else {
        await this.updateAttachment()
      }
    },

    async createAttachment() {
      try {
        // Validation should prevent this
        if (!this.uploadedMedia) throw new Error('No file to upload')

        const media = await sdk.Media.create({
          file: this.uploadedMedia,
        })

        const attachment = await sdk.Products.Attachments.create(this.productId, {
          name: this.form.name,
          description: this.form.description,
          media_id: media.id,
          visibility: CdnMediaAttachmentVisiblity.Public,
          type: CdnMediaAttachmentType.Other,
        })

        this.$emit('created', attachment)
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
      this.uploadedMedia = media
      return false
    },
    onRemove() {
      this.uploadedMedia = null
    },
  },
})
</script>

<style lang="scss" scoped>
.attachment-form {
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
