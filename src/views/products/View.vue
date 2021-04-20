<template>
  <div>
    <top-nav :title="!isNew ? product.name : 'Nowy produkt'">
      <pop-confirm
        v-if="!isNew"
        title="Czy na pewno chcesz usunąć ten produkt?"
        okText="Usuń"
        cancelText="Anuluj"
        @confirm="deleteProduct"
        v-slot="{ open }"
      >
        <vs-button dark icon @click="open">
          <i class="bx bx-trash"></i>
        </vs-button>
      </pop-confirm>
    </top-nav>

    <div class="product">
      <gallery v-model="form.gallery" />

      <div>
        <card>
          <flex-input>
            <label class="title">Widoczność produktu</label>
            <vs-switch success v-model="form.public">
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
          <SchemaConfigurator v-model="form.schemas" />
        </card>
      </div>

      <div class="product__details">
        <card>
          <validation-observer v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(saveProduct)" class="product__info">
              <div>
                <br />
                <validation-provider rules="required" v-slot="{ errors }">
                  <vs-input v-model="form.name" @input="editSlug" label="Nazwa">
                    <template #message-danger>{{ errors[0] }}</template>
                  </vs-input>
                </validation-provider>
                <br /><br />
                <validation-provider rules="required|slug" v-slot="{ errors }">
                  <vs-input v-model="form.slug" label="Link">
                    <template #message-danger>{{ errors[0] }}</template>
                  </vs-input>
                </validation-provider>
                <br /><br />
                <validation-provider rules="required" v-slot="{ errors }">
                  <vs-input v-model="form.price" type="number" step="0.01" label="Cena">
                    <template #message-danger>{{ errors[0] }}</template>
                  </vs-input>
                </validation-provider>
                <br />
              </div>

              <div>
                <br />
                <validation-provider rules="id-required" v-slot="{ errors }">
                  <vs-select
                    v-model="form.brand_id"
                    placeholder="Wybierz markę"
                    :key="brands.length"
                    filter
                    label="Marka"
                  >
                    <vs-option
                      v-for="brand in brands"
                      :key="brand.id"
                      :label="brand.name"
                      :value="brand.id"
                    >
                      <i class="bx bx-lock" v-if="!brand.public"></i> {{ brand.name }}
                    </vs-option>
                    <template #message-danger>{{ errors[0] }}</template>
                  </vs-select>
                </validation-provider>
                <br /><br />
                <validation-provider rules="id-required" v-slot="{ errors }">
                  <vs-select
                    v-model="form.category_id"
                    :key="categories.length"
                    filter
                    placeholder="Wybierz kategorię"
                    label="Kategoria"
                  >
                    <vs-option
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id"
                    >
                      <i class="bx bx-lock" v-if="!category.public"></i> {{ category.name }}
                    </vs-option>
                    <template #message-danger>{{ errors[0] }}</template>
                  </vs-select>
                </validation-provider>
              </div>

              <div class="wide">
                <small class="label">Opis</small>
                <md-editor v-if="!isLoading" v-model="form.description_md" />
                <br />
                <vs-button color="dark" size="large">Zapisz</vs-button>
              </div>
            </form>
          </validation-observer>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import slugify from 'slugify'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import TopNav from '@/layout/TopNav.vue'
import Gallery from '@/components/Gallery.vue'
import Card from '@/components/Card.vue'
import FlexInput from '@/components/FlexInput.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import MdEditor from '@/components/MdEditor.vue'
import SchemaConfigurator from '@/components/schema/Configurator.vue'
import { formatApiError } from '@/utils/errors'

export default {
  data() {
    return {
      form: {
        name: '',
        slug: '',
        price: 0,
        description: '',
        digital: false,
        public: true,
        brand_id: 0,
        category_id: 0,
        schemas: [],
        gallery: [],
        media: [],
      },
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    isLoading() {
      return this.$store.state.products.isLoading
    },
    isNew() {
      return this.id === 'create'
    },
    product() {
      return this.$store.getters['products/getSelected']
    },
    brands() {
      return this.$store.getters['brands/getData']
    },
    categories() {
      return this.$store.getters['categories/getData']
    },
    error() {
      return (
        this.$store.getters['products/getError'] || this.$store.getters['products/getDepositError']
      )
    },
  },
  methods: {
    async fetch() {
      return this.$store.dispatch('products/get', this.$route.params.id)
    },
    editSlug() {
      this.form.slug = slugify(this.form.name, { lower: true, remove: /[.]/g })
    },
    async deleteProduct() {
      const loading = this.$vs.loading({ color: '#000' })
      const success = await this.$store.dispatch('products/remove', this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Produkt został usunięty.',
        })
        this.$router.push('/products')
      }
      loading.close()
    },
    async saveProduct() {
      const apiPayload = {
        ...this.form,
        media: this.form.gallery.map(({ id }) => id),
        schemas: this.form.schemas.map(({ id }) => id),
      }
      const loading = this.$vs.loading({ color: '#000' })

      const successMessage = this.isNew
        ? 'Produkt został utworzony'
        : 'Produkt został zaktualizowany'

      const actionPayload = this.isNew ? apiPayload : { id: this.id, item: apiPayload }

      const { id: newID } = await this.$store.dispatch(
        this.isNew ? 'products/add' : 'products/update',
        actionPayload,
      )

      if (newID) {
        this.$vs.notification({
          color: 'success',
          title: successMessage,
        })
        this.$router.push(`/products/${newID}`)
      }

      loading.close()
    },
  },
  watch: {
    product(product) {
      if (!this.isNew) {
        this.form = {
          ...product,
          brand_id: product.brand.id,
          category_id: product.category.id,
          media: [],
        }
      }
    },
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
    async '$route.params.id'() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.fetch()
      loading.close()
    },
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })
    await Promise.all([
      this.$store.dispatch('categories/fetch'),
      this.$store.dispatch('brands/fetch'),
    ])
    if (!this.isNew) await this.fetch()
    loading.close()
  },
  components: {
    TopNav,
    Gallery,
    Card,
    FlexInput,
    PopConfirm,
    ValidationProvider,
    ValidationObserver,
    SchemaConfigurator,
    MdEditor,
  },
}
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

@media (min-width: $break) {
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
