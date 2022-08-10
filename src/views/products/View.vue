<template>
  <div :key="$route.params.id" class="narrower-page">
    <top-nav :title="!isNew ? product.name : $t('newProductTitle')">
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

    <div class="product">
      <gallery ref="gallery" v-model="form.gallery" :disabled="!canModify" />
      {{ $t('sss') }}
      <div>
        <card>
          <switch-input
            v-model="form.public"
            horizontal
            :disabled="!canModify"
            :label="$t('form.public')"
          />
          <template v-if="!product.visible && product.public">
            <br />
            <a-alert
              :message="$t('stillVisible.title')"
              :description="$t('stillVisible.description')"
              show-icon
              type="warning"
            />
          </template>
        </card>
      </div>

      <div class="product__inner-items">
        <card>
          <WarehouseItemsConfigurator v-model="form.items" :disabled="!canModify" />
        </card>
      </div>

      <div class="product__schemas">
        <card>
          <SchemaConfigurator v-model="form.schemas" :disabled="!canModify" />
        </card>
      </div>

      <div class="product__attributes">
        <card>
          <AttributesConfigurator v-model="form.attributes" :disabled="!canModify" />
        </card>
      </div>

      <div class="product__details">
        <card>
          <validation-observer ref="observer" v-slot="{ handleSubmit }">
            <form class="product__info" @submit.prevent="handleSubmit(saveProduct)">
              <div>
                <validated-input
                  v-model="form.name"
                  rules="required"
                  :label="$t('common.form.name')"
                  name="name"
                  :disabled="!canModify"
                  @input="editSlug"
                />
                <validated-input
                  v-model="form.slug"
                  rules="required|slug"
                  :label="$t('common.form.slug')"
                  name="slug"
                  :disabled="!canModify"
                />
                <validated-input
                  v-model="form.price"
                  rules="required|not-negative"
                  type="number"
                  step="0.01"
                  :label="$t('form.price')"
                  name="price"
                  :disabled="!canModify"
                />

                <validated-input
                  v-model="form.vat_rate"
                  rules="not-negative|less-than:100"
                  type="number"
                  :label="$t('form.vatRate')"
                  name="vat_rate"
                  :disabled="!canModify"
                />
              </div>

              <div>
                <product-set-select v-model="form.sets" :product="product" />

                <validated-input
                  v-model="form.quantity_step"
                  rules="required"
                  type="number"
                  max="999999"
                  step="0.01"
                  name="quantity_step"
                  :label="$t('form.quantityStep')"
                  :disabled="!canModify"
                />

                <validated-input
                  v-model="form.order"
                  type="number"
                  name="order"
                  :disabled="!canModify"
                >
                  <template #label>
                    {{ $t('form.order') }}
                    <info-tooltip>{{ $t('form.orderTooltip') }}</info-tooltip>
                  </template>
                </validated-input>
              </div>

              <div class="wide">
                <SeoForm
                  v-model="form.seo"
                  :disabled="!canModify"
                  :current="!isNew ? { id, model: 'Product' } : null"
                />
              </div>

              <div class="wide">
                <tags-select v-model="form.tags" :disabled="!canModify" />
              </div>
              <div class="wide">
                <google-category-select
                  v-model="form.google_product_category"
                  :disabled="!canModify"
                />
              </div>

              <div class="wide">
                <small class="label">{{ $t('common.form.description') }}</small>
                <rich-editor
                  v-if="!isLoading"
                  v-model="form.description_html"
                  :disabled="!canModify"
                />
                <br />
                <small class="label">{{ $t('form.shortDescription') }}</small>
                <AppTextarea
                  v-if="!isLoading"
                  v-model="form.description_short"
                  :disabled="!canModify"
                />
                <br />
                <br />
                <template v-if="!isNew">
                  <div class="wide">
                    <MetadataForm
                      ref="publicMeta"
                      :value="product.metadata"
                      :disabled="!canModify"
                      model="products"
                    />
                  </div>
                  <div v-if="product.metadata_private" class="wide">
                    <MetadataForm
                      ref="privateMeta"
                      :value="product.metadata_private"
                      :disabled="!canModify"
                      is-private
                      model="products"
                    />
                  </div>
                </template>
                <br />
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
              </div>
            </form>
          </validation-observer>
        </card>
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newProductTitle": "Nowy produkt",
    "deleteConfirm": "Czy na pewno chcesz usunąć ten produkt?",
    "form": {
      "public": "Widoczność produktu",
      "price": "Cena",
      "vatRate": "Stawka VAT (%)",
      "quantityStep": "Format ilości",
      "shortDescription": "Krótki opis",
      "order": "Priorytet sortowania",
      "orderTooltip": "Pozwala na zmianę kolejności produktów na liście. Produkty z mniejszą liczbą wyświetlane są wyżej."
    },
    "stillVisible": {
      "title": "Produkt wciąż jest ukryty",
      "description": "Produkt jest niewidoczny ponieważ jego marka lub kategoria jest ukryta."
    },
    "messages": {
      "removed": "Produkt został usunięty.",
      "created": "Produkt został utworzony.",
      "updated": "Produkt został zaktualizowany."
    },
    "saveAndNext": "Zapisz i dodaj następny"
  },
  "en": {
    "newProductTitle": "New product",
    "deleteConfirm": "Are you sure you want to delete this product?",
    "form": {
      "public": "Product visibility",
      "price": "Price",
      "vatRate": "VAT rate (%)",
      "quantityStep": "Quantity format",
      "shortDescription": "Short description",
      "order": "Sort priority",
      "orderTooltip": "Allows you to change the order of the products in the list. Products with a lower number are displayed higher."
    },
    "stillVisible": {
      "title": "Product is still hidden",
      "description": "Product is hidden because its brand or category is hidden."
    },
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
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'
import { Product, ProductCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Gallery from '@/components/modules/products/Gallery.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import SchemaConfigurator from '@/components/modules/schemas/Configurator.vue'
import TagsSelect from '@/components/TagsSelect.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'
import AppTextarea from '@/components/form/Textarea.vue'
import AttributesConfigurator from '@/components/modules/attributes/configurator/Configurator.vue'
import WarehouseItemsConfigurator from '@/components/modules/products/WarehouseItemsConfigurator.vue'
import GoogleCategorySelect from '@/components/modules/products/GoogleCategorySelect.vue'
import ProductSetSelect from '@/components/modules/products/ProductSetSelect.vue'

import preventLeavingPage from '@/mixins/preventLeavingPage'

import { formatApiNotificationError } from '@/utils/errors'
import { generateSlug } from '@/utils/generateSlug'
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

export default Vue.extend({
  metaInfo(this: any): any {
    const fallback = this.$t('newProductTitle') as string
    return {
      title: this.isNew ? fallback : this.product?.name || fallback,
    }
  },
  components: {
    TopNav,
    Gallery,
    Card,
    PopConfirm,
    ValidationObserver,
    SchemaConfigurator,
    RichEditor,
    TagsSelect,
    SwitchInput,
    SeoForm,
    AuditsModal,
    AppTextarea,
    MetadataForm,
    AttributesConfigurator,
    WarehouseItemsConfigurator,
    GoogleCategorySelect,
    ProductSetSelect,
  },
  mixins: [preventLeavingPage],
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
      // @ts-ignore // TODO: fix extended store getters typings
      return this.$accessor.products.getError || this.$accessor.products.getDepositError
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
      this.$accessor.startLoading()
      await this.fetch()
      this.$accessor.stopLoading()
    },
  },
  async created() {
    this.$accessor.startLoading()
    await this.fetch()
    this.$accessor.stopLoading()
  },
  methods: {
    async fetch() {
      this.form = cloneDeep(EMPTY_FORM)
      if (this.isNew) return
      this.$accessor.startLoading()
      await this.$accessor.products.get(this.$route.params.id)
      this.$accessor.stopLoading()
    },
    editSlug() {
      if (this.isNew) {
        this.form.slug = generateSlug(this.form.name)
      }
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
        // Form validation needs to be reset to  update 'dirty' property
        requestAnimationFrame(() => {
          // @ts-ignore
          this.$refs.observer.reset()
        })

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
.product {
  & > * {
    &:not(:first-child) {
      @media ($max-viewport-11) {
        margin-top: 8px;
      }
    }
  }

  &__info {
    input {
      width: 100%;
    }
  }

  &__details,
  &__schemas,
  &__attributes,
  &__inner-items {
    grid-column: 1/-1;
  }

  .card {
    margin: 0;
  }
}

.content-tooltip {
  footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media ($viewport-11) {
  .product {
    display: grid;
    grid-template-columns: 4fr 2fr;
    gap: 35px;

    small {
      color: #aaaaaa;
    }

    &__info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      .wide {
        grid-column: 1/-1;
      }
    }
  }
}

.quantity-input {
  margin-top: 24px;
  width: 100%;
}
</style>
