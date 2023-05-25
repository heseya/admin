<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form class="order-document-form" @submit.prevent="handleSubmit(uploadFile)">
      <loading :active="isLoading" />

      <validated-input v-model="form.name" name="filename" :label="$t('fileName')" />

      <app-select v-model="form.type" name="filetype" :label="$t('fileType')">
        <a-select-option
          v-for="type in Object.values(CdnMediaAttachmentType)"
          :key="type"
          :value="type"
          :label="$t(`orderDocumentsTypes.${type}`)"
        >
          {{ $t(`orderDocumentsTypes.${type}`) }}
        </a-select-option>
      </app-select>

      <a-upload-dragger
        name="file"
        accept=".pdf,application/pdf"
        :file-list="form.file ? [form.file] : []"
        :before-upload="addFile"
        :remove="removeFile"
        :multiple="false"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">{{ $t('dropOrChooseFile') }}</p>
      </a-upload-dragger>

      <ValidationProvider v-slot="{ errors }" rules="block-if-error">
        <input :value="!form.file" name="is-duplicated-error" type="hidden" />
        <a-alert
          v-if="errors.length"
          class="order-document-form__errors"
          type="error"
          show-icon
          :message="$t('fileRequired')"
        />
      </ValidationProvider>

      <hr />

      <div class="order-document-form__footer">
        <app-button
          html-type="button"
          type="white"
          :loading="isLoading"
          :disabled="isLoading"
          @click="closeModal()"
        >
          {{ $t('common.cancel') }}
        </app-button>
        <app-button html-type="submit" type="primary" :loading="isLoading" :disabled="isLoading">
          {{ $t('common.add') }}
        </app-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<i18n lang="json">
{
  "en": {
    "fileName": "File name",
    "fileType": "File type",
    "file": "File",
    "fileRequired": "File is required",
    "uploadSuccess": "File uploaded successfully",
    "dropOrChooseFile": "Click or drag file to this area to upload"
  },
  "pl": {
    "fileName": "Nazwa pliku",
    "fileType": "Typ pliku",
    "file": "Plik",
    "fileRequired": "Plik jest wymagany",
    "uploadSuccess": "Plik został dodany pomyślnie",
    "dropOrChooseFile": "Kliknij lub przeciągnij plik do tego obszaru aby go przesłać"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { CdnMediaAttachmentType } from '@heseya/store-core'

import Loading from '@/components/layout/Loading.vue'

const EMPTY_FORM = {
  name: '',
  type: CdnMediaAttachmentType.Invoice,
  file: null as File | null,
}

export default Vue.extend({
  components: { ValidationObserver, ValidationProvider, Loading },
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isLoading: false,
    form: { ...EMPTY_FORM },
  }),
  computed: {
    CdnMediaAttachmentType(): typeof CdnMediaAttachmentType {
      return CdnMediaAttachmentType
    },
  },
  methods: {
    addFile(file: File) {
      this.form.file = file
      return false
    },

    removeFile() {
      this.form.file = null
    },

    async uploadFile() {
      if (!this.form.file) return

      this.isLoading = true

      const document = await this.$accessor.orders.createOrderDocument({
        orderId: this.orderId,
        document: {
          name: this.form.name,
          type: this.form.type,
          file: this.form.file,
        },
      })

      this.isLoading = false

      if (document) {
        this.$toast.success(this.$t('uploadSuccess') as string)
        this.closeModal()
      }
    },

    closeModal() {
      this.form = { ...EMPTY_FORM }
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scoped>
.order-document-form {
  &__footer {
    display: flex;
    justify-content: flex-end;
    position: relative;

    > * {
      margin-left: 8px;
    }
  }

  &__errors {
    margin-top: 8px;
  }
}
</style>
