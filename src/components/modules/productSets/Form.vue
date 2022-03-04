<template>
  <validation-observer v-slot="{ handleSubmit }" class="product-set-form">
    <a-modal
      :title="form.id ? $t('editTitle') : $t('newTitle')"
      :visible="isOpen"
      :width="900"
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

<i18n>
{
  "pl": {
    "newTitle": "Nowa kolekcja",
    "editTitle": "Edycja kolekcji",
    "deleteText": "Czy na pewno chcesz usunąć tę kolekcję? Wraz z nią usuniesz wszystkie jej subkolekcje!",
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

import { ProductSetDTO } from '@/interfaces/ProductSet'
import MediaUploadInput from '@/components/modules/media/MediaUploadInput.vue'
import { CdnMedia } from '@/interfaces/Media'
import { generateSlug } from '@/utils/generateSlug'

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
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSetDTO>,
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
    form: cloneDeep(CLEAR_PRODUCT_SET_FORM) as ProductSetDTO,
    isEditorActive: false,
  }),
  watch: {
    value(value: ProductSetDTO) {
      this.form = { ...cloneDeep(CLEAR_PRODUCT_SET_FORM), ...cloneDeep(value) }
      this.fetchProductSet()
    },
    isOpen(isOpen: boolean) {
      this.$nextTick(() => {
        // ? Workaround for a bugged ArticleEditor, which doesn't render correctly in the first time
        this.isEditorActive = isOpen
      })
    },
  },
  methods: {
    async fetchProductSet() {
      if (!this.value?.id) return

      this.$accessor.startLoading()
      const success = await this.$accessor.productSets.get(this.value.id)
      if (success) {
        const fetched = this.$accessor.productSets.getSelected
        this.form = {
          ...cloneDeep(CLEAR_PRODUCT_SET_FORM),
          ...cloneDeep(fetched),
          cover_id: fetched.cover?.id,
          parent_id: fetched.parent?.id || null,
          children_ids: fetched.children?.map((child) => child.id) || [],
          attributes: fetched.attributes?.map((attr) => attr.id) || [],
          seo: fetched.seo || {},
        }
      } else {
        this.$emit('close')
      }
      this.$accessor.stopLoading()
    },
    editSlug() {
      if (!this.form.id) {
        this.form.slug_suffix = generateSlug(this.form.name)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.form.id) {
        await this.$accessor.productSets.update({
          id: this.form.id,
          item: this.form,
        })
      } else {
        await this.$accessor.productSets.add(this.form)
      }
      this.$accessor.stopLoading()
      this.$emit('close')
    },
    async deleteItem() {
      if (!this.form.id) return
      this.$accessor.startLoading()
      await this.$accessor.productSets.remove(this.form.id)
      this.$accessor.stopLoading()
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
