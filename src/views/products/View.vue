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

      <div class="product__schemas">
        <card>
          <SchemaConfigurator v-model="form.schemas" :disabled="!canModify" />
        </card>
      </div>

      <div class="product__details">
        <card>
          <validation-observer v-slot="{ handleSubmit }">
            <form class="product__info" @submit.prevent="handleSubmit(saveProduct)">
              <div>
                <br />
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
              </div>

              <div>
                <br />
                <validation-provider v-slot="{ errors }">
                  <app-select
                    v-model="form.sets"
                    :placeholder="$t('form.setsPlaceholder')"
                    mode="multiple"
                    name="sets"
                    :label="$t('form.sets')"
                    option-filter-prop="label"
                    :disabled="!canModify"
                  >
                    <a-select-option v-for="set in productSets" :key="set.id" :label="set.name">
                      <i v-if="!set.public" class="bx bx-lock"></i>
                      {{ set.name }}&nbsp;<small>(/{{ set.slug }})</small>
                    </a-select-option>
                    <template #message-danger>{{ errors[0] }}</template>
                  </app-select>
                </validation-provider>
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
                <small class="label">{{ $t('common.form.description') }}</small>
                <rich-editor
                  v-if="!isLoading"
                  v-model="form.description_html"
                  :disabled="!canModify"
                />
                <br />
                <small class="label">{{ $t('form.shortDescription') }}</small>
                <Textarea
                  v-if="!isLoading"
                  v-model="form.description_short"
                  :disabled="!canModify"
                />
                <br />
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

<i18n>
{
  "pl": {
    "newProductTitle": "Nowy produkt",
    "deleteConfirm": "Czy na pewno chcesz usunąć ten produkt?",
    "form": {
      "public": "Widoczność produktu",
      "price": "Cena",
      "sets": "Kolekcje",
      "setsPlaceholder": "Wybierz kolekcje",
      "quantityStep": "Format ilości",
      "shortDescription": "Krótki opis"
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
      "sets": "Sets",
      "setsPlaceholder": "Select sets",
      "quantityStep": "Quantity format",
      "shortDescription": "Short description"
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
import slugify from 'slugify'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'

import TopNav from '@/components/layout/TopNav.vue'
import Gallery from '@/components/modules/products/Gallery.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import SchemaConfigurator from '@/components/modules/schemas/Configurator.vue'
import TagsSelect from '@/components/TagsSelect.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'
import Textarea from '@/components/form/Textarea.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { UUID } from '@/interfaces/UUID'
import { Product, ProductDTO, ProductComponentForm } from '@/interfaces/Product'
import { ProductSet } from '@/interfaces/ProductSet'

const EMPTY_FORM: ProductComponentForm = {
  id: '',
  name: '',
  slug: '',
  price: 0,
  description_html: '',
  description_short: '',
  digital: false,
  public: true,
  sets: [],
  quantity_step: 1,
  schemas: [],
  gallery: [],
  tags: [],
  seo: {},
}

export default Vue.extend({
  metaInfo(this: any): any {
    return { title: this.product?.name || 'Nowy produkt' }
  },
  components: {
    TopNav,
    Gallery,
    Card,
    PopConfirm,
    ValidationProvider,
    ValidationObserver,
    SchemaConfigurator,
    RichEditor,
    TagsSelect,
    SwitchInput,
    SeoForm,
    AuditsModal,
    Textarea,
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
      return this.$accessor.products.getSelected
    },
    productSets(): ProductSet[] {
      return this.$accessor.productSets.getData
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
    this.$accessor.productSets.fetch({ tree: undefined })
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
        this.form.slug = slugify(this.form.name, { lower: true, remove: /[.]/g })
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
      const apiPayload: ProductDTO = {
        ...this.form,
        media: this.form.gallery.map(({ id }) => id),
        tags: this.form.tags.map(({ id }) => id),
        schemas: this.form.schemas.map(({ id }) => id),
      }

      this.$accessor.startLoading()

      const successMessage = this.isNew
        ? (this.$t('messages.created') as string)
        : (this.$t('messages.updated') as string)

      const item = this.isNew
        ? await this.$accessor.products.add(apiPayload)
        : await this.$accessor.products.update({ id: this.id, item: apiPayload })

      ;(this.$refs.gallery as any).clearMediaToDelete()

      this.$accessor.stopLoading()

      if (item) {
        this.$toast.success(successMessage)

        if (item.id !== this.product.id) {
          this.$router.push(`/products/${item.id}`)
        }
      }
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
  &__info {
    input {
      width: 100%;
    }
  }

  &__details,
  &__schemas {
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
