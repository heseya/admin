<template>
  <div :key="$route.params.id" class="product-page-wrapper">
    <Loading :active="isLoading" />
    <AbsoluteContentLangSwitch :value="editedLang" @input="setEditedLang" />

    <TopNav>
      <template #title>
        <template v-if="!isNew">
          <div>
            <span class="gray-text">{{ $t('title') }}&nbsp;</span>{{ product?.name }}
          </div>
        </template>
        <template v-else>
          {{ $t('titleNew') }}
        </template>
      </template>

      <icon-button
        v-if="highlightedAttributeSlug && product?.attributes"
        @click="copyHighlightedAttribute"
      >
        <template #icon>
          <i class="bx bx-copy"></i>
        </template>
        {{ highlightedAttributeSlug.toUpperCase() }}: {{ highlightedAttributeValue }}
      </icon-button>

      <icon-button v-if="storefrontProductUrl" target="_blank" :to="storefrontProductUrl">
        <template #icon>
          <i class="bx bx-link-external"></i>
        </template>
        {{ $t('nav.goTo') }}
      </icon-button>

      <PopConfirm
        v-if="!isNew"
        v-can="$p.Products.Remove"
        :title="$t('deleteConfirm')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="deleteProduct"
      >
        <icon-button type="danger" data-cy="delete-btn">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </PopConfirm>
    </TopNav>

    <ValidationObserver ref="form">
      <form class="product-page" @submit.stop.prevent="handleSubmit(saveProduct)">
        <Card class="product-page__main">
          <h2 class="product-page__subtitle">{{ $t('baseFormTitle') }}</h2>
          <ProductBasicDetails
            v-model="form"
            :product="product"
            :disabled="!canModify"
            :is-new="isNew"
            :loading="isLoading"
            :edited-lang="editedLang"
          />

          <hr />

          <PublishedLangsForm v-model="form.published" />

          <hr />

          <ProductPrices
            v-if="!isNew"
            v-model="pricesForm"
            :product="product"
            :disabled="!canModify"
          />
          <DescriptionAccordion
            v-model="formDescriptionHtml"
            :disabled="!canModify"
            :loading="isLoading"
          />
          <ProductAdditionalDescriptions
            v-model="form.descriptions"
            :edited-lang="editedLang"
            :product="product"
            :disabled="!canModify"
          />
          <ProductAdvancedDetails v-model="form" :product="product" :disabled="!canModify" />
          <ProductRelatedSets
            v-model="form.related_sets"
            :product="product"
            :disabled="!canModify"
          />
          <ProductAttachments v-if="!isNew" :product="product" :disabled="!canModify" />
          <ProductBannerForm
            ref="banner"
            v-model="form.banner"
            :disabled="!canModify"
            :edited-lang="editedLang"
          />

          <hr />

          <AttributesConfigurator
            v-model="form.attributes"
            :edited-lang="editedLang"
            :disabled="!canModify"
          />
          <hr />
          <SchemaConfigurator v-model="form.schemas" :disabled="!canModify" />
          <hr />
          <WarehouseItemsConfigurator v-model="form.items" :disabled="!canModify" />

          <hr />

          <SeoForm
            v-model="form.seo"
            class="product-page__seo-form"
            :disabled="!canModify"
            :current="!isNew ? { id, model: 'Product' } : undefined"
          />
          <template v-if="!isNew">
            <MetadataForm
              ref="publicMeta"
              :value="product.metadata"
              :disabled="!canModify"
              model="products"
            />
            <MetadataForm
              v-if="product.metadata_private"
              ref="privateMeta"
              :value="product.metadata_private"
              :disabled="!canModify"
              type="private"
              model="products"
            />
          </template>
          <hr />
          <div class="flex">
            <app-button
              v-if="canModify"
              data-cy="submit-btn"
              html-type="submit"
              style="margin-right: 12px"
            >
              {{ $t('common.save') }}
            </app-button>

            <app-button
              v-if="canModify && isNew"
              data-cy="submit-and-next-btn"
              @click.prevent="handleSubmit(submitAndGoNext)"
            >
              {{ $t('saveAndNext') }}
            </app-button>
          </div>
        </Card>

        <Card class="product-page__visibility">
          <ProductAsideDetails v-model="form" :product="product" :disabled="!canModify" />
        </Card>

        <Card class="product-page__gallery">
          <h2 class="product-page__subtitle">{{ $t('galleryTitle') }}</h2>
          <Gallery ref="gallery" v-model="form.gallery" :disabled="!canModify" />
        </Card>
      </form>
    </ValidationObserver>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Konfiguracja produktu",
    "titleNew": "Nowy produkt",
    "baseFormTitle": "Informacje podstawowe",
    "galleryTitle": "Zdjęcia i wideo produktu",
    "deleteConfirm": "Czy na pewno chcesz usunąć ten produkt?",
    "nav": {
      "goTo": "Przejdź do produktu"
    },
    "messages": {
      "removed": "Produkt został usunięty.",
      "created": "Produkt został utworzony.",
      "updated": "Produkt został zaktualizowany.",
      "validationError": "Formularz zawiera błędy. Uzupełnij brakujące pola.",
      "error": "Wystąpił błąd podczas zapisywania produktu.",
      "highlightedAttributeCopySuccess": "Wartość atrybutu została skopiowana!"
    },
    "saveAndNext": "Zapisz i dodaj następny"
  },
  "en": {
    "title": "Product configuration",
    "titleNew": "New product",
    "baseFormTitle": "Basic information",
    "galleryTitle": "Product gallery",
    "deleteConfirm": "Are you sure you want to delete this product?",
    "nav": {
      "goTo": "Go to product"
    },
    "messages": {
      "removed": "Product has been removed.",
      "created": "Product has been created.",
      "updated": "Product has been updated.",
      "validationError": "The form contains errors. Fill in the missing fields.",
      "error": "An error occurred while saving the product.",
      "highlightedAttributeCopySuccess": "Highlighted attribute value has been copied!"
    },
    "saveAndNext": "Save and add next"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import { Product, ProductCreateDto, PriceMapProductPrice } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Gallery from '@/components/modules/products/Gallery.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SchemaConfigurator from '@/components/modules/schemas/Configurator.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import AttributesConfigurator from '@/components/modules/attributes/configurator/Configurator.vue'
import WarehouseItemsConfigurator from '@/components/modules/products/WarehouseItemsConfigurator.vue'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'

import ProductBasicDetails from '@/components/modules/products/view/ProductBasicDetails.vue'
import ProductPrices from '@/components/modules/products/view/ProductPrices.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'
import ProductAdvancedDetails from '@/components/modules/products/view/ProductAdvancedDetails.vue'
import ProductAsideDetails from '@/components/modules/products/view/ProductAsideDetails.vue'
import ProductAdditionalDescriptions from '@/components/modules/products/descriptions/List.vue'
import ProductAttachments from '@/components/modules/products/attachments/List.vue'
import ProductRelatedSets from '@/components/modules/products/related/List.vue'
import DescriptionAccordion from '@/components/DescriptionAccordion.vue'
import ProductBannerForm from '@/components/modules/products/BannerForm.vue'
import Loading from '@/components/layout/Loading.vue'

// import preventLeavingPage from '@/mixins/preventLeavingPage'

import { formatApiNotificationError } from '@/utils/errors'
import { updateProductAttributeOptions } from '@/services/updateProductAttributeOptions'
import { sdk } from '@/api'

import { UUID } from '@/interfaces/UUID'
import { ProductComponentForm } from '@/interfaces/Product'
import { TranslationsFromDto } from '@/interfaces/Translations'
import { SETTINGS_KEYS } from '@/consts/featureFlags'

const EMPTY_PRODUCT_TRANSLATIONS: TranslationsFromDto<ProductCreateDto> = {
  name: '',
  description_html: '',
  description_short: '',
}

const EMPTY_FORM: ProductComponentForm = {
  slug: '',
  name: '',
  description_html: '',
  description_short: '',
  google_product_category: null,
  shipping_digital: '0',
  purchase_limit_per_user: 0,
  public: true,
  sets: [],
  quantity_step: 1,
  order: null,
  schemas: [],
  gallery: [],
  tags: [],
  seo: undefined,
  attributes: [],
  items: [],
  descriptions: [],
  attachments: [],
  related_sets: [],
  published: [],
  translations: {},
  banner: null,
}

export default defineComponent({
  components: {
    Loading,
    TopNav,
    Gallery,
    Card,
    PopConfirm,
    ValidationObserver,
    SchemaConfigurator,
    SeoForm,
    MetadataForm,
    AttributesConfigurator,
    WarehouseItemsConfigurator,
    ProductBasicDetails,
    ProductPrices,
    ProductAdvancedDetails,
    DescriptionAccordion,
    ProductAsideDetails,
    ProductAdditionalDescriptions,
    ProductAttachments,
    ProductBannerForm,
    ProductRelatedSets,
    PublishedLangsForm,
    AbsoluteContentLangSwitch,
  },

  // mixins: [preventLeavingPage],

  metaInfo(this: any): any {
    return {
      title: (!this.isNew && this.product?.name) || (this.$t('titleNew') as string),
    }
  },
  data: () => ({
    isLoading: false,
    editedLang: '',
    form: cloneDeep(EMPTY_FORM),
    pricesForm: [] as PriceMapProductPrice[],
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    product(): Product {
      return this.$accessor.products.getSelected ?? {}
    },
    error(): any {
      return this.$accessor.products.getError
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Products.Add : this.$p.Products.Edit)
    },

    storefrontProductUrl(): string | null {
      const base = this.$accessor.config.env[SETTINGS_KEYS.StorefrontProductUrl]
      if (!base || !this.product?.slug) return null

      return new URL(`/product/${this.product.slug}`, base).toString()
    },

    highlightedAttributeSlug(): string | undefined {
      return this.$accessor.config.env[SETTINGS_KEYS.HighlightedProductAttribute]
    },
    highlightedAttributeValue(): string {
      return (
        this.product?.attributes?.find(
          (attribute) => attribute.slug === this.highlightedAttributeSlug,
        )?.selected_options[0]?.name || this.$i18n.t('common.none').toString()
      )
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
    product(product: Product) {
      if (!this.isNew) {
        this.form = {
          ...product,
          sets: product.sets?.map(({ id }) => id) || [],
          shipping_digital: (+product.shipping_digital).toString() as '0' | '1',
          purchase_limit_per_user: product.purchase_limit_per_user || 0,
          seo: product.seo || {},
          translations: product.translations || {},
        }
        this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
      }
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
    async '$route.params.id'() {
      await this.fetch()
    },
  },
  async created() {
    await this.fetch()
    this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
  },
  methods: {
    handleSubmit(callback: Function) {
      ;(this.$refs.form as any).validate().then((success: boolean) => {
        if (!success) {
          this.$toast.error(this.$t('messages.validationError') as string)
          return
        }
        callback()
      })
    },

    setEditedLang(langId: string) {
      this.editedLang = langId

      if (!this.form?.translations) this.$set(this.form, 'translations', {})
      this.$set(this.form.translations!, langId, {
        ...EMPTY_PRODUCT_TRANSLATIONS,
        ...this.form?.translations?.[langId],
      })
    },
    async fetch() {
      this.form = cloneDeep(EMPTY_FORM)
      if (this.isNew) return
      this.isLoading = true
      await this.$accessor.products.get(this.$route.params.id)
      await this.fetchPrices()

      // isFormPrefilled should be set to true after form was prefilled
      // this.isFormPrefilled = true

      this.isLoading = false
    },

    async fetchPrices() {
      try {
        const prices = await sdk.Products.getPrices(this.$route.params.id)

        // TODO: remove this fix, API returns price with currency
        // TODO: check it!
        const fixedPrices = prices.map((p) => ({ ...p, price: p.price.split(' ').at(-1)! }))

        this.pricesForm = fixedPrices
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    async deleteProduct() {
      this.isLoading = true
      const success = await this.$accessor.products.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('messages.removed') as string)
        this.$router.push('/products')
      }
      this.isLoading = false
    },

    async saveProduct() {
      this.isLoading = true
      try {
        const attributes = await updateProductAttributeOptions(
          this.form.attributes.filter((v) => v.selected_options),
        )

        const apiPayload: ProductCreateDto = {
          ...this.form,
          order: this.form.order || 0,
          media: this.form.gallery.map(({ id }) => id),
          tags: this.form.tags.map(({ id }) => id),
          schemas: this.form.schemas.map(({ id }) => id),
          related_sets: this.form.related_sets.map(({ id }) => id),
          shipping_digital: Boolean(+this.form.shipping_digital),
          purchase_limit_per_user: this.form.purchase_limit_per_user || null,
          banner: this.form.banner
            ? {
                ...this.form.banner,
                translations: this.form.banner.translations || {},
                media: this.form.banner.media.map((media) => ({
                  ...media,
                  media: media.media.id,
                })),
              }
            : null,
          attributes: attributes.reduce(
            (acc, { id, selected_options: option }) => ({
              ...acc,
              [id]: option.map((v) => v.id) || undefined,
            }),
            {},
          ),
          descriptions: this.form.descriptions.map(({ id }) => id),
        }

        const successMessage = this.isNew
          ? (this.$t('messages.created') as string)
          : (this.$t('messages.updated') as string)

        // Metadata can be saved only after product is created
        if (!this.isNew) await this.saveMetadata(this.id)

        // Prices can be saved only after product is created
        if (!this.isNew) await this.savePrices()

        const item = this.isNew
          ? await this.$accessor.products.add(apiPayload)
          : await this.$accessor.products.update({ id: this.id, item: apiPayload })

        ;(this.$refs.gallery as any).clearMediaToDelete()
        ;(this.$refs.banner as any)?.clearMediaToDelete?.()

        if (!item) throw new Error('Product was not saved')

        this.$toast.success(successMessage)

        // After form submitting isDirty should be reset
        // this.isDirty = false

        if (item.id !== this.product?.id) {
          this.$router.push(`/products/${item.id}`)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ file: View.vue:321 ~ saveProduct ~ error:', error)
        this.$toast.error(this.$t('messages.error') as string)
      }

      this.isLoading = false
    },

    async savePrices() {
      try {
        const form = this.pricesForm.map((p) => ({ ...p, price: p.price.toString() }))
        const prices = await sdk.Products.updatePrices(this.$route.params.id, form)

        // TODO: remove this fix, API returns price with currency
        const fixedPrices = prices.map((p) => ({ ...p, price: p.price.split(' ').at(-1)! }))

        this.pricesForm = fixedPrices
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },

    async submitAndGoNext() {
      await this.saveProduct()
      this.$router.push('/products/create')
    },

    async copyHighlightedAttribute() {
      await navigator.clipboard.writeText(this.highlightedAttributeValue)
      this.$toast.info(this.$t('messages.highlightedAttributeCopySuccess') as string)
    },
  },
})
</script>

<style lang="scss">
.product-page-wrapper {
  position: relative;
  margin-right: 24px;
}

.product-page {
  display: grid;
  grid-template-rows: auto;
  grid-gap: 14px;
  align-items: start;
  grid-template-columns: 1fr;
  grid-template-areas: 'visibility' 'gallery' 'main';

  @media ($viewport-7) {
    grid-template-columns: 2.6fr 1fr;
    grid-template-areas: 'main visibility' 'main gallery' 'main .';
  }

  &__main {
    grid-area: main;
  }
  &__visibility {
    grid-area: visibility;
  }
  &__gallery {
    grid-area: gallery;
  }

  &__subtitle {
    font-size: 1em;
    margin: 0;
    font-weight: 600;

    @media ($viewport-10) {
      font-size: 1.1em;
    }
  }

  &__seo-form .seo-form {
    @media ($viewport-14) {
      width: 75%;
    }
  }

  .card {
    margin-bottom: 0;
  }
}
</style>
