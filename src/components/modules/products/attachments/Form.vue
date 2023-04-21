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
import { ProductAttachmentCreateDto, ProductAttachmentUpdateDto } from '@heseya/store-core'
import ValidationBlock from '@/components/form/ValidationBlock.vue'

type Form = ProductAttachmentCreateDto | ProductAttachmentUpdateDto

export default Vue.extend({
  components: { ValidationObserver, ValidationBlock },
  props: {
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
  },

  methods: {
    onSubmit() {
      console.log('onSubmit', this.form)
    },

    onBeforeUpload(media: File) {
      this.uploadedMedia = media
      return false
    },
    onRemove() {
      this.uploadedMedia = null
      // this.form.media_id = media.id
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
