<template>
  <div :key="$route.params.id">
    <top-nav>
      <template #title>
        <template v-if="!isNew">
          <span class="gray-text">{{ $t('title') }}&nbsp;</span>{{ product.name }}
        </template>
        <template v-else>
          {{ $t('titleNew') }}
        </template>
      </template>

      <audits-modal :id="product.id" model="products" />

      <pop-confirm
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
      </pop-confirm>
    </top-nav>

    <validation-observer v-slot="{ handleSubmit }">
      <form class="product-page" @submit.stop.prevent="handleSubmit(saveProduct)">
        <card class="product-page__main">
          <h2 class="product-page__subtitle">{{ $t('baseFormTitle') }}</h2>
          <product-basic-details
            v-model="form"
            :product="product"
            :disabled="!canModify"
            :is-new="isNew"
            :loading="isLoading"
          />

          <hr />

          <product-description
            v-model="form"
            :product="product"
            :disabled="!canModify"
            :loading="isLoading"
          />
          <product-advanced-details v-model="form" :product="product" :disabled="!canModify" />

          <hr />

          <AttributesConfigurator v-model="form.attributes" :disabled="!canModify" />
          <hr />
          <SchemaConfigurator v-model="form.schemas" :disabled="!canModify" />
          <hr />
          <WarehouseItemsConfigurator v-model="form.items" :disabled="!canModify" />

          <hr />

          <SeoForm
            v-model="form.seo"
            class="product-page__seo-form"
            :disabled="!canModify"
            :current="!isNew ? { id, model: 'Product' } : null"
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
        </card>

        <card-micro-widgets class="product-page__widgets-main" section="ProductMain" />

        <card class="product-page__visibility">
          <product-aside-details v-model="form" :product="product" :disabled="!canModify" />
        </card>

        <card class="product-page__gallery">
          <h2 class="product-page__subtitle">{{ $t('galleryTitle') }}</h2>
          <gallery ref="gallery" v-model="form.gallery" :disabled="!canModify" />
        </card>

        <card-micro-widgets class="product-page__widgets-aside" section="ProductAside" />
      </form>
    </validation-observer>
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
    "messages": {
      "removed": "Produkt został usunięty.",
      "created": "Produkt został utworzony.",
      "updated": "Produkt został zaktualizowany."
    },
    "saveAndNext": "Zapisz i dodaj następny"
  },
  "en": {
    "title": "Product configuration",
    "titleNew": "New product",
    "baseFormTitle": "Basic information",
    "galleryTitle": "Product gallery",
    "deleteConfirm": "Are you sure you want to delete this product?",
    "messages": {
      "removed": "Product has been removed.",
      "created": "Product has been created.",
      "updated": "Product has been updated."
    },
    "saveAndNext": "Save and add next"
  }
}
</i18n>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import { Product, ProductCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Gallery from '@/components/modules/products/Gallery.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SchemaConfigurator from '@/components/modules/schemas/Configurator.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'
import AttributesConfigurator from '@/components/modules/attributes/configurator/Configurator.vue'
import WarehouseItemsConfigurator from '@/components/modules/products/WarehouseItemsConfigurator.vue'

import ProductBasicDetails from '@/components/modules/products/view/ProductBasicDetails.vue'
import ProductAdvancedDetails from '@/components/modules/products/view/ProductAdvancedDetails.vue'
import ProductAsideDetails from '@/components/modules/products/view/ProductAsideDetails.vue'
import ProductDescription from '@/components/modules/products/view/ProductDescription.vue'
import CardMicroWidgets from '@/components/microfrontends/CardMicroWidgets.vue'

import preventLeavingPage from '@/mixins/preventLeavingPage'

import { formatApiNotificationError } from '@/utils/errors'
import { updateProductAttributeOptions } from '@/services/updateProductAttributeOptions'

import { UUID } from '@/interfaces/UUID'
import { ProductComponentForm } from '@/interfaces/Product'

const EMPTY_FORM: ProductComponentForm = {
  id: '',
  name: '',
  slug: '',
  price: 0,
  description_html: '',
  description_short: '',
  vat_rate: 0,
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
  seo: {},
  attributes: [],
  items: [],
}

export default mixins(preventLeavingPage).extend({
  metaInfo(this: any): any {
    return {
      title: (!this.isNew && this.product?.name) || (this.$t('titleNew') as string),
    }
  },
  components: {
    TopNav,
    Gallery,
    Card,
    PopConfirm,
    ValidationObserver,
    SchemaConfigurator,
    SeoForm,
    AuditsModal,
    MetadataForm,
    AttributesConfigurator,
    WarehouseItemsConfigurator,
    ProductBasicDetails,
    ProductAdvancedDetails,
    ProductDescription,
    ProductAsideDetails,
    CardMicroWidgets,
  },
  data: () => ({
    form: cloneDeep(EMPTY_FORM),
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isLoading(): boolean {
      return this.$accessor.products.isLoading
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    product(): Product {
      return this.$accessor.products.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.products.getError
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Products.Add : this.$p.Products.Edit)
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
        }
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
  },
  methods: {
    async fetch() {
      this.form = cloneDeep(EMPTY_FORM)
      if (this.isNew) return
      this.$accessor.startLoading()
      await this.$accessor.products.get(this.$route.params.id)

      // isFormPrefilled should be set to true after form was prefilled
      this.isFormPrefilled = true

      this.$accessor.stopLoading()
    },
    async deleteProduct() {
      this.$accessor.startLoading()
      const success = await this.$accessor.products.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('messages.removed') as string)
        this.$router.push('/products')
      }
      this.$accessor.stopLoading()
    },

    async saveProduct() {
      this.$accessor.startLoading()

      const attributes = await updateProductAttributeOptions(
        this.form.attributes.filter((v) => v.selected_options),
      )

      const apiPayload: ProductCreateDto = {
        ...this.form,
        order: this.form.order || 0,
        media: this.form.gallery.map(({ id }) => id),
        tags: this.form.tags.map(({ id }) => id),
        schemas: this.form.schemas.map(({ id }) => id),
        shipping_digital: Boolean(+this.form.shipping_digital),
        purchase_limit_per_user: this.form.purchase_limit_per_user || null,
        attributes: attributes.reduce(
          (acc, { id, selected_options: option }) => ({
            ...acc,
            [id]: option.map((v) => v.id) || undefined,
          }),
          {},
        ),
      }

      const successMessage = this.isNew
        ? (this.$t('messages.created') as string)
        : (this.$t('messages.updated') as string)

      // Metadata can be saved only after product is created
      if (!this.isNew) await this.saveMetadata(this.id)

      const item = this.isNew
        ? await this.$accessor.products.add(apiPayload)
        : await this.$accessor.products.update({ id: this.id, item: apiPayload })

      ;(this.$refs.gallery as any).clearMediaToDelete()

      this.$accessor.stopLoading()

      if (item) {
        this.$toast.success(successMessage)

        // After form submitting isDirty should be reset
        this.isDirty = false

        if (item.id !== this.product.id) {
          this.$router.push(`/products/${item.id}`)
        }
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
  },
})
</script>

<style lang="scss">
.product-page {
  display: grid;
  grid-template-rows: auto;
  grid-gap: 14px;
  align-items: start;
  grid-template-columns: 1fr;
  grid-template-areas: 'visibility' 'gallery' 'aside-widgets' 'main' 'main-widgets';

  @media ($viewport-7) {
    grid-template-columns: 2.6fr 1fr;
    grid-template-areas: 'main visibility' 'main gallery' 'main aside-widgets' 'main .' 'main-widgets .';
  }

  &__main {
    grid-area: main;
  }
  &__visibility {
    grid-area: visibility;
  }
  &__widgets-aside {
    grid-area: aside-widgets;
  }
  &__widgets-main {
    grid-area: main-widgets;
  }
  &__gallery {
    grid-area: gallery;
  }

  &__subtitle {
    font-size: 1.1em;
    margin: 0;
    font-weight: 600;
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
