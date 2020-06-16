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
              Produkt jest ukryty ponieważ jego marka lub kategoria jest ukryta. Odkryj je by
              produkt był widoczny w sklepie
            </vs-alert>
          </template>
        </card>

        <card>
          <div class="title">Magazyn</div>
          <div class="quantity-input">
            <vs-input v-model="deposit.quantity" type="number" label="Ilość produktów" />
          </div>
        </card>

        <!-- <card>
          <div class="title">Schematy</div>
          <small>Już wkrótce</small>
        </card> -->
      </div>

      <div class="product__details">
        <card style="margin-top: 30px">
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
                  <vs-select v-model="form.brand_id" filter label="Marka">
                    <vs-option label="Wybierz markę" :value="0">Wybierz markę</vs-option>
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
                  <vs-select v-model="form.category_id" filter label="Kategoria">
                    <vs-option label="Wybierz kategorię" :value="0">Wybierz kategorię</vs-option>
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
                <Textarea v-model="form.description_md" />
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
import Textarea from '@/components/Textarea.vue'

const EMPTY_SCHEMA = {
  id: 1,
  name: null,
  type: 0,
  required: true,
  items: [
    {
      item_id: 1,
      value: null,
      extra_price: 0
    }
  ]
}

export default {
  data() {
    return {
      deposit: {
        id: 0,
        quantity: 0,
        originalQuantity: 0
      },
      form: {
        name: '',
        slug: '',
        price: 0,
        description: '',
        digital: false,
        public: true,
        brand_id: 0,
        category_id: 0,
        gallery: [],
        media: []
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
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
    }
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
          title: 'Produkt został usunięty.'
        })
        this.$router.push('/products')
      }
      loading.close()
    },
    async saveProduct() {
      this.form.media = this.form.gallery.map(({ id }) => id)
      const loading = this.$vs.loading({ color: '#000' })

      const successMessage = this.isNew
        ? 'Produkt został utworzony'
        : 'Produkt został zaktualizowany'

      const payload = this.isNew ? this.form : { id: this.id, item: this.form }

      const { id: newID, schemas } = await this.$store.dispatch(
        this.isNew ? 'products/add' : 'products/update',
        payload
      )

      await this.$store.dispatch('products/updateQuantity', {
        id: schemas[0].schema_items[0].item.id,
        quantity: this.deposit.quantity - this.deposit.originalQuantity
      })

      if (newID) {
        this.$vs.notification({
          color: 'success',
          title: successMessage
        })
        this.$router.push(`/products/${newID}`)
      }

      loading.close()
    }
  },
  watch: {
    product(product) {
      if (!this.isNew) {
        this.form = {
          ...product,
          brand_id: product.brand.id,
          category_id: product.category.id,
          schemas: [EMPTY_SCHEMA],
          media: []
        }

        const item = product.schemas[0].schema_items[0].item

        this.deposit = {
          id: item.id,
          quantity: item.quantity || 0,
          originalQuantity: item.quantity || 0
        }
      }
    },
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: error.message,
          text: error?.response?.data?.message
        })
      }
    },
    async '$route.params.id'() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.fetch()
      loading.close()
    }
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })
    await Promise.all([
      this.$store.dispatch('categories/fetch'),
      this.$store.dispatch('brands/fetch')
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
    Textarea
  }
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

  &__details {
    grid-column: 1/-1;
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
