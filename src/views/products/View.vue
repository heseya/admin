<template>
  <div :key="$route.params.id">
    <top-nav :title="!isNew ? product.name : 'Nowy produkt'">
      <pop-confirm
        v-if="!isNew"
        v-slot="{ open }"
        v-can="$p.Products.Remove"
        title="Czy na pewno chcesz usunąć ten produkt?"
        ok-text="Usuń"
        cancel-text="Anuluj"
        @confirm="deleteProduct"
      >
        <icon-button type="danger" @click="open">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          Usuń
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="product">
      <gallery ref="gallery" v-model="form.gallery" :disabled="!canModify" />

      <div>
        <card>
          <flex-input>
            <label class="title">Widoczność produktu</label>
            <vs-switch v-model="form.public" success :disabled="!canModify">
              <template #off>
                <i class="bx bx-x"></i>
              </template>
              <template #on>
                <i class="bx bx-check"></i>
              </template>
            </vs-switch>
          </flex-input>
          <template v-if="!product.visible && product.public">
            <br />
            <vs-alert color="warn">
              <template #title>Produkt wciąż jest ukryty</template>
              Produkt jest niewidoczny ponieważ jego marka lub kategoria jest ukryta.
            </vs-alert>
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
                  label="Nazwa"
                  :disabled="!canModify"
                />
                <br /><br />
                <validated-input
                  v-model="form.slug"
                  rules="required|slug"
                  label="Link"
                  :disabled="!canModify"
                />
                <br /><br />
                <validated-input
                  v-model="form.price"
                  rules="required"
                  type="number"
                  step="0.01"
                  label="Cena"
                  :disabled="!canModify"
                />
                <br />
              </div>

              <div>
                <br />
                <validation-provider v-slot="{ errors }">
                  <vs-select
                    :key="productSets.length"
                    v-model="form.sets"
                    placeholder="Wybierz kolekcje"
                    filter
                    multiple
                    label="Kolekcje"
                    :disabled="!canModify"
                    @click.native.prevent.stop
                  >
                    <vs-option
                      v-for="set in productSets"
                      :key="set.id"
                      :label="set.name"
                      :value="set.id"
                    >
                      <i v-if="!set.public" class="bx bx-lock"></i> {{ set.name }}
                    </vs-option>
                    <template #message-danger>{{ errors[0] }}</template>
                  </vs-select>
                </validation-provider>
                <br /><br />
                <validated-input
                  v-model="form.quantity_step"
                  rules="required"
                  type="number"
                  max="999999"
                  step="0.01"
                  label="Format ilości"
                  :disabled="!canModify"
                />
              </div>

              <div class="wide">
                <tags-select v-model="form.tags" :disabled="!canModify" />
              </div>

              <div class="wide">
                <small class="label">Opis</small>
                <rich-editor
                  v-if="!isLoading"
                  v-model="form.description_html"
                  :disabled="!canModify"
                />
                <br />
                <div class="flex">
                  <vs-button v-if="canModify" color="dark" size="large">Zapisz</vs-button>
                  <vs-button
                    v-if="canModify"
                    color="dark"
                    size="large"
                    type="button"
                    @click="handleSubmit(submitAndGoNext)"
                  >
                    Zapisz i dodaj następny
                  </vs-button>
                </div>
              </div>
            </form>
          </validation-observer>
        </card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import slugify from 'slugify'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import cloneDeep from 'lodash/cloneDeep'

import TopNav from '@/components/layout/TopNav.vue'
import Gallery from '@/components/modules/products/Gallery.vue'
import Card from '@/components/layout/Card.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import SchemaConfigurator from '@/components/modules/schemas/Configurator.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import TagsSelect from '@/components/TagsSelect.vue'
import IconButton from '@/components/layout/IconButton.vue'

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
  digital: false,
  public: true,
  sets: [],
  quantity_step: 1,
  schemas: [],
  gallery: [],
  tags: [],
}

export default Vue.extend({
  components: {
    TopNav,
    Gallery,
    Card,
    FlexInput,
    PopConfirm,
    ValidationProvider,
    ValidationObserver,
    SchemaConfigurator,
    RichEditor,
    TagsSelect,
    ValidatedInput,
    IconButton,
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
        this.$toast.success('Produkt został usunięty.')
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
        ? 'Produkt został utworzony'
        : 'Produkt został zaktualizowany'

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

    .vs-select-content {
      max-width: none;
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
      color: #aaa;
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
