<template>
  <div>
    <top-nav :title="product.name">
      <pop-confirm
        v-if="!isNew"
        title="Czy na pewno chcesz usunąć ten produkt?"
        okText="Usuń"
        cancelText="Anuluj"
        @confirm="deleteProduct"
        v-model="isDeleteConfirm"
      >
        <vs-button dark icon @click="isDeleteConfirm = !isDeleteConfirm">
          <i class="bx bx-trash"></i>
        </vs-button>
      </pop-confirm>
    </top-nav>

    <div class="product">
      <div>
        <gallery :images="product.gallery"></gallery>

        <card style="margin-top: 30px">
          <div class="product__info">
            <div>
              <br />
              <vs-input v-model="form.name" label="Nazwa" />
              <br /><br />
              <vs-input v-model="form.slug" label="Link" />
              <br /><br />
              <vs-input v-model="form.price" type="number" step="0.01" label="Cena" />
              <br /><br />
              <vs-input v-model="form.description" label="Opis" />
              <br />
            </div>

            <div>
              <br /><vs-select v-model="form.brand_id" filter label="Marka">
                <vs-option label="Wybierz markę" :value="0">Wybierz markę</vs-option>
                <vs-option
                  v-for="brand in brands"
                  :key="brand.id"
                  :label="brand.name"
                  :value="brand.id"
                >
                  {{ brand.name }}
                </vs-option>
              </vs-select>
              <br /><br />
              <vs-select v-model="form.category_id" filter label="Kategoria">
                <vs-option label="Wybierz kategorię" :value="0">Wybierz kategorię</vs-option>
                <vs-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                >
                  {{ category.name }}
                </vs-option>
              </vs-select>
            </div>
          </div>
          <br />
          <vs-button color="dark" size="large" @click="saveProduct">
            Zapisz
          </vs-button>
        </card>
      </div>

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
        </card>

        <card>
          <div class="title">Magazyn</div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Gallery from '@/components/Gallery.vue'
import Card from '@/components/Card.vue'
import FlexInput from '@/components/FlexInput.vue'
import PopConfirm from '@/components/PopConfirm.vue'

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
      isDeleteConfirm: false,
      form: {
        name: '',
        slug: '',
        price: 0,
        description: '',
        digital: false,
        public: true,
        brand_id: 0,
        category_id: 0,
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
      return this.$store.getters['products/getError']
    }
  },
  methods: {
    async fetch() {
      return this.$store.dispatch('products/get', this.$route.params.id)
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
      const loading = this.$vs.loading({ color: '#000' })

      const successMessage = this.isNew
        ? 'Produkt został utworzony'
        : 'Produkt został zaktualizowany'

      const payload = this.isNew ? this.form : { id: this.id, item: this.form }

      const newID = await this.$store.dispatch(
        this.isNew ? 'products/add' : 'products/edit',
        payload
      )

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
          media: product.gallery.map(({ id }) => id)
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
    PopConfirm
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
    column-gap: 35px;

    &__info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 20px;
    }
  }
}
</style>
