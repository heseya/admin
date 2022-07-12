<template>
  <validation-observer v-slot="{ handleSubmit }" class="product-set-form">
    <a-modal
      :title="form.id ? $t('editTitle') : $t('newTitle')"
      :visible="isOpen"
      :width="900"
      :mask-closable="false"
      @cancel="$emit('close')"
    >
      <modal-form :key="form.id || 'new'" class="product-set-form">
        <validated-input
          v-model="form.name"
          :disabled="disabled"
          rules="required"
          :label="$t('common.form.name')"
          @input="editSlug"
        />

        <div class="slug-input">
          <validated-input
            v-model="form.slug_suffix"
            :disabled="disabled"
            :addon-before="slugPrefix && !form.slug_override ? `${slugPrefix}-` : ''"
            class="slug-input__input"
            rules="required|slug"
            :label="$t('common.form.slug')"
          />

          <a-tooltip placement="bottom">
            <switch-input
              v-if="slugPrefix"
              v-model="form.slug_override"
              :disabled="disabled"
              class="slug-input__switch"
              :label="$t('form.slugOverride')"
            />

            <template #title>
              {{ $t('form.slugOverrideHelp') }}
            </template>
          </a-tooltip>
        </div>

        <div class="switches">
          <flex-input>
            <switch-input
              v-model="form.hide_on_index"
              :disabled="disabled"
              horizontal
              :label="$t('form.hideOnIndex')"
            />
          </flex-input>
          <flex-input>
            <switch-input
              v-model="form.public"
              :disabled="disabled"
              horizontal
              :label="$t('form.public')"
            />
          </flex-input>
        </div>

        <br />
        <attributes-select v-model="form.attributes" :disabled="disabled" />
        <br />

        <SeoForm
          v-model="form.seo"
          :disabled="disabled"
          :current="form.id ? { id: form.id, model: 'ProductSet' } : null"
        />

        <br />
        <media-upload-input
          :label="$t('form.cover')"
          :disabled="disabled"
          :image="form.cover"
          @upload="changeMedia"
        />

        <br />
        <small class="label">{{ $t('common.form.description') }}</small>
        <rich-editor v-if="isEditorActive" v-model="form.description_html" :disabled="disabled" />
        <br />

        <MetadataForm
          v-if="form.metadata"
          ref="publicMeta"
          :value="form.metadata"
          :disabled="disabled"
          model="productSets"
        />
        <MetadataForm
          v-if="form.metadata_private"
          ref="privateMeta"
          :value="form.metadata_private"
          :disabled="disabled"
          is-private
          model="productSets"
        />
      </modal-form>
      <template #footer>
        <div class="row">
          <app-button v-if="!disabled" @click="handleSubmit(saveModal)">
            {{ $t('common.save') }}
          </app-button>
          <pop-confirm
            v-if="deletable"
            :title="$t('deleteText')"
            :ok-text="$t('common.delete')"
            :cancel-text="$t('common.cancel')"
            @confirm="deleteItem"
          >
            <app-button v-if="form.id" type="danger">{{ $t('common.delete') }}</app-button>
          </pop-confirm>
        </div>
      </template>
    </a-modal>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowa kolekcja",
    "editTitle": "Edycja kolekcji",
    "deleteText": "Czy na pewno chcesz usunąć tę kolekcję? Wraz z nią usuniesz wszystkie jej subkolekcje!",
    "alerts": {
      "updated": "Kolekcja została zaktualizowana",
      "created": "Kolekcja została utworzona",
      "deleted": "Kolekcja została usunięta"
    },
    "form": {
      "slugOverride": "Nadpisz link",
      "slugOverrideHelp": "Domyślnie, początek linku wynika z linku kolekcji-rodzica. Nadpisując link, sprawiamy, że link będzie dokładnie taki jaki zostanie wpisany.",
      "hideOnIndex": "Ukryj produkty na stronie głównej",
      "public": "Widoczność kolekcji",
      "cover": "Okładka kolekcji"
    }
  },
  "en": {
    "newTitle": "New collection",
    "editTitle": "Edit collection",
    "deleteText": "Are you sure you want to delete this collection? All subcollections will be deleted as well!",
    "alerts": {
      "updated": "Collection has been updated",
      "created": "Collection has been created",
      "deleted": "Collection has been deleted"
    },
    "form": {
      "slugOverride": "Override link",
      "slugOverrideHelp": "By default, the beginning of the link is derived from the parent collection's link. Overriding the link, you make sure that the link is exactly what you enter.",
      "hideOnIndex": "Hide products on home page",
      "public": "Visibility",
      "cover": "Collection cover"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import AttributesSelect from './AttributesSelect.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { ProductSetDTO } from '@/interfaces/ProductSet'
import MediaUploadInput from '@/components/modules/media/MediaUploadInput.vue'
import { CdnMedia } from '@/interfaces/Media'
import { generateSlug } from '@/utils/generateSlug'
import { Metadata } from '@/interfaces/Metadata'

export const CLEAR_PRODUCT_SET_FORM: ProductSetDTO = {
  id: '',
  name: '',
  slug_suffix: '',
  description_html: '',
  cover: undefined,
  cover_id: undefined,
  slug_override: false,
  public: true,
  hide_on_index: false,
  parent_id: null,
  children_ids: [],
  seo: {},
  attributes: [],
}

// eslint-disable-next-line camelcase
type CombinedSetDto = ProductSetDTO & { metadata?: Metadata; metadata_private?: Metadata }

export default Vue.extend({
  components: {
    ModalForm,
    PopConfirm,
    FlexInput,
    ValidationObserver,
    SwitchInput,
    SeoForm,
    RichEditor,
    MediaUploadInput,
    AttributesSelect,
    MetadataForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CombinedSetDto>,
    slugPrefix: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    deletable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: cloneDeep(CLEAR_PRODUCT_SET_FORM) as CombinedSetDto,
    isEditorActive: false,
  }),
  watch: {
    value(value: CombinedSetDto) {
      this.form = { ...cloneDeep(CLEAR_PRODUCT_SET_FORM), ...cloneDeep(value) }
    },
    isOpen(isOpen: boolean) {
      this.activateEditor(isOpen)
    },
  },
  async created() {
    this.form = { ...cloneDeep(CLEAR_PRODUCT_SET_FORM), ...cloneDeep(this.value) }
    if (this.isOpen) this.activateEditor()

    const data = await this.$accessor.productSets.get(this.form.id as string)
    if (data) {
      this.form.description_html = data.description_html
      this.form.seo = data.seo
    }
  },
  methods: {
    activateEditor(active = true) {
      // ? Workaround for a bugged ArticleEditor, which doesn't render correctly in the first time
      this.$nextTick(() => (this.isEditorActive = active))
    },

    editSlug() {
      if (!this.form.id) {
        this.form.slug_suffix = generateSlug(this.form.name)
      }
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },

    async saveModal() {
      this.$accessor.startLoading()
      if (this.form.id) {
        await this.saveMetadata(this.form.id)
        const success = await this.$accessor.productSets.update({
          id: this.form.id,
          item: this.form,
        })
        this.$emit('edit-success', success)
        this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        const success = await this.$accessor.productSets.add(this.form)
        this.$emit('create-success', success)
        this.$toast.success(this.$t('alerts.created') as string)
      }
      this.$accessor.stopLoading()
      this.$emit('close')
    },
    async deleteItem() {
      if (!this.form.id) return
      this.$accessor.startLoading()
      await this.$accessor.productSets.remove(this.form.id)
      this.$emit('delete-success', this.form.id)
      this.$accessor.stopLoading()
      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$emit('close')
    },

    changeMedia(media: CdnMedia | undefined) {
      this.form.cover = media
      this.form.cover_id = media?.id
    },
  },
})
</script>

<style lang="scss">
.product-set-form {
  .switches {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    padding: 0 10px;
    gap: 8px;
  }

  .slug-input {
    display: flex;
    align-items: center;

    &__input {
      width: 100%;

      > * {
        margin-bottom: 0 !important;
      }
    }

    &__switch {
      width: 130px;
      margin-left: 10px;
      text-align: center;
    }
  }
}
</style>
