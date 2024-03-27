<template>
  <div class="narrower-page">
    <top-nav>
      <template #title>
        <template v-if="!isNew">
          <span class="gray-text">{{ $t('editTitle') }}&nbsp;</span>{{ productSet.name }}
        </template>
        <template v-else>
          {{ $t('newTitle') }}&nbsp;
          <small v-if="parent" class="gray-text">
            ({{ $t('titleSubcollection') }}
            <router-link :to="`/collections/${parent.id}`">{{ parent.name }}</router-link
            >)
          </small>
        </template>
      </template>

      <pop-confirm
        v-if="!isNew"
        v-can="$p.ProductSets.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteItem"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="collection-view">
      <AbsoluteContentLangSwitch :value="editedLang" @input="setEditedLang" />

      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(save)">
          <Card>
            <div class="collection-view__section">
              <div class="collection-view__drag-area">
                <MediaUploadInput
                  :disabled="!canModify"
                  :media="form.cover || undefined"
                  :file-name="$t('collectionCover').toString()"
                  @upload="changeMedia"
                />
              </div>

              <div class="collection-view__inputs">
                <div class="collection-view__switches">
                  <flex-input>
                    <switch-input
                      v-model="form.public"
                      :disabled="!canModify"
                      horizontal
                      :label="$t('form.public')"
                    />
                  </flex-input>
                </div>

                <validated-input
                  v-model="formName"
                  rules="required"
                  :label="$t('common.form.name')"
                  :disabled="!canModify"
                  @input="editSlug"
                />
                <div class="collection-slug">
                  <validated-input
                    v-model="form.slug_suffix"
                    :disabled="!canModify"
                    :addon-before="slugPrefix && !form.slug_override ? `${slugPrefix}-` : ''"
                    class="collection-slug__input"
                    rules="required|slug"
                    :label="$t('common.form.slug')"
                  />

                  <a-tooltip placement="bottom">
                    <switch-input
                      v-if="slugPrefix"
                      v-model="form.slug_override"
                      :disabled="!canModify"
                      class="collection-slug__switch"
                      :label="$t('form.slugOverride')"
                    />

                    <template #title>
                      {{ $t('form.slugOverrideHelp') }}
                    </template>
                  </a-tooltip>
                </div>
              </div>
            </div>

            <template v-if="!isLoading">
              <br />
              <AttributesSelect v-model="form.attributes" :disabled="!canModify" />
              <hr />
              <PublishedLangsForm v-model="form.published" />
              <br />
            </template>

            <small class="label">{{ $t('common.form.description') }}</small>
            <RichEditor v-if="!isLoading" v-model="formDescriptionHtml" :disabled="!canModify" />
            <br />

            <SeoForm
              v-model="form.seo"
              :disabled="!canModify"
              :current="form.id ? { id: form.id, model: 'ProductSet' } : undefined"
            />

            <MetadataForm
              v-if="form.metadata"
              ref="publicMeta"
              :value="form.metadata"
              :disabled="!canModify"
              model="productSets"
            />
            <MetadataForm
              v-if="form.metadata_private"
              ref="privateMeta"
              :value="form.metadata_private"
              :disabled="!canModify"
              type="private"
              model="productSets"
            />

            <hr />
            <app-button v-if="canModify" @click="handleSubmit(save)">
              {{ $t('common.save') }}
            </app-button>
          </Card>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowa kolekcja",
    "editTitle": "Konfiguracja kolekcji",
    "titleSubcollection": "podkolekcja",
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
    },
    "collectionCover": "okładkę kolekcji"
  },
  "en": {
    "newTitle": "New collection",
    "editTitle": "Edit collection",
    "titleSubcollection": "subcollection of",
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
    },
    "collectionCover": "collection cover"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import { CdnMedia, ProductSet, ProductSetCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import AttributesSelect from '@/components/modules/productSets/AttributesSelect.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import MediaUploadInput from '@/components/modules/media/MediaUploadInput.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

import { UUID } from '@/interfaces/UUID'

import { formatApiNotificationError } from '@/utils/errors'
import { generateSlug } from '@/utils/generateSlug'
import { sdk } from '@/api'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'
import { TranslationsFromDto } from '@/interfaces/Translations'

type CombinedSetDto = ProductSetCreateDto & {
  id?: UUID
  cover: CdnMedia | null
}

const EMPTY_PRODUCT_SET_TRANSLATIONS: TranslationsFromDto<CombinedSetDto> = {
  name: '',
  description_html: '',
}

export const CLEAR_PRODUCT_SET_FORM: CombinedSetDto = {
  slug_suffix: '',
  cover: null,
  cover_id: undefined,
  slug_override: false,
  public: true,
  parent_id: null,
  children_ids: [],
  seo: undefined,
  attributes: [],
  published: [],
  translations: {},
}

export default defineComponent({
  components: {
    ValidationObserver,
    TopNav,
    Card,
    PopConfirm,
    MetadataForm,
    AttributesSelect,
    FlexInput,
    SeoForm,
    RichEditor,
    MediaUploadInput,
    PublishedLangsForm,
    AbsoluteContentLangSwitch,
  },
  metaInfo(this: any): any {
    return {
      title: (!this.isNew && this.productSet?.name) || (this.$t('newTitle') as string),
    }
  },
  data: () => ({
    editedLang: '',
    form: cloneDeep(CLEAR_PRODUCT_SET_FORM) as CombinedSetDto,
    parent: null as ProductSet | null,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    productSet(): ProductSet {
      return this.$accessor.productSets.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.productSets.getError
    },
    isLoading(): boolean {
      return this.$accessor.productSets.isLoading
    },
    canModify(): boolean {
      return this.isNew ? this.$can(this.$p.ProductSets.Add) : this.$can(this.$p.ProductSets.Edit)
    },
    parentId(): string {
      if (this.$route.query.parentId) {
        return this.$route.query.parentId as string
      } else if (this.productSet.parent && !this.isNew) {
        return this.productSet.parent.id
      }
      return ''
    },
    slugPrefix(): string {
      return (this.isNew ? this.parent?.slug : this.productSet.parent?.slug) || ''
    },

    formName: {
      get(): string {
        return this.form.translations?.[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },
    formDescriptionHtml: {
      get(): string {
        return this.form.translations?.[this.editedLang]?.description_html || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description_html = value
      },
    },
  },
  watch: {
    productSet: {
      handler(productSet: ProductSet) {
        if (!this.isNew) {
          this.form = cloneDeep({
            ...CLEAR_PRODUCT_SET_FORM,
            ...productSet,
            seo: productSet.seo || undefined,
            attributes: productSet.attributes?.map((a) => a.id) || [],
            parent_id: productSet.parent?.id || null,
          })
        }

        this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
      },
      immediate: true,
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    this.$accessor.startLoading()

    // fetch parent product set
    if (this.parentId && this.isNew) {
      const parent = await sdk.ProductSets.getOne(this.parentId)
      if (parent) this.parent = parent
    }

    if (!this.isNew) {
      await this.$accessor.productSets.get(this.id)
    } else {
      this.form = { ...this.form, parent_id: this.parentId }
    }
    this.$accessor.stopLoading()
  },

  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId

      if (!this.form?.translations) this.$set(this.form, 'translations', {})
      this.$set(this.form.translations!, langId, {
        ...EMPTY_PRODUCT_SET_TRANSLATIONS,
        ...this.form?.translations?.[langId],
      })
    },

    editSlug() {
      if (!this.form.id) {
        this.form.slug_suffix = generateSlug(this.formName)
      }
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },

    async save() {
      this.$accessor.startLoading()

      if (this.form.id) {
        await this.saveMetadata(this.form.id)
        await this.$accessor.productSets.update({
          id: this.form.id,
          item: this.form,
        })
        this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        const productSet = await this.$accessor.productSets.add(this.form)
        this.$toast.success(this.$t('alerts.created') as string)
        if (productSet) {
          this.$router.push(`/collections/${productSet.id}`)
        }
      }

      this.$accessor.stopLoading()
    },

    async deleteItem() {
      if (!this.form.id) return

      this.$accessor.startLoading()
      await this.$accessor.productSets.remove(this.form.id)
      this.$accessor.stopLoading()

      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$router.push('/collections')
    },

    changeMedia(media: CdnMedia | null) {
      this.form.cover = media
      this.form.cover_id = media?.id || null
    },
  },
})
</script>

<style lang="scss" scoped>
.collection-view {
  position: relative;

  &__section {
    display: flex;
    flex-direction: column;
    width: 100%;

    @media ($viewport-7) {
      flex-direction: row;
    }
  }

  &__drag-area {
    width: 100%;
    height: 200px;
    margin: 0.5em 0;

    @media ($viewport-7) {
      width: 200px;
    }
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.5em 0;

    @media ($viewport-7) {
      width: calc(100% - 200px);
      padding: 0.5em 1.5em;
      padding-right: 0;
    }
  }

  &__switches {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-top: 12px;
    padding: 0 10px;
    gap: 8px;

    @media ($viewport-7) {
      flex-direction: row;
    }
  }
}

.collection-slug {
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
</style>
