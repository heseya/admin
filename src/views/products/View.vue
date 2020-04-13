<template>
<div>
  <top-nav :title="product.name">
    <vs-tooltip bottom shadow not-hover v-model="deleteConfirm">
      <vs-button dark icon @click="deleteConfirm =! deleteConfirm">
        <i class="bx bx-trash"></i>
      </vs-button>
      <template #tooltip>
        <div class="content-tooltip">
          <p>Czy na pewno chcesz usunąć ten produkt?</p>
          <footer>
            <vs-button @click="deleteConfirm = false" danger block>
              Usuń
            </vs-button>
            <vs-button @click="deleteConfirm = false" transparent dark block>
              Anuluj
            </vs-button>
          </footer>
        </div>
      </template>
    </vs-tooltip>
  </top-nav>

  <div class="product">
    <div>
      <gallery :images="product.gallery"></gallery>

      <card style="margin-top: 30px">
        <div class="product__info">

          <div>
            <br>
            <vs-input v-model="product.name" label="Nazwa"/>
            <br><br>
            <vs-input v-model="product.slug" label="Link"/>
            <br><br>
            <vs-input v-model="product.price" type="number" step="0.01" label="Cena"/>
            <br>
          </div>

          <div>
            <br><vs-select v-model="product.brand.id" filter label="Marka">
              <vs-option label="Depth" value="1">
                Depth
              </vs-option>
              <vs-option label="Depth Steel" value="2">
                Depth Steel
              </vs-option>
            </vs-select>
            <br><br>
            <vs-select v-model="product.category.id" filter label="Kategoria">
              <vs-option label="Naszyjniki" value="1">
                Naszyjniki
              </vs-option>
              <vs-option label="Sygnety" value="2">
                Sygnety
              </vs-option>
            </vs-select>
          </div>

        </div>
        <br>
        <vs-button color="dark" size="large" @click="openNotification(null, 'success')">
          Zapisz
        </vs-button>
      </card>
    </div>

    <div>

      <card>
        <flex-input>
          <label class="title">Widoczność produktu</label>
          <vs-switch @click="changePublic" success v-model="product.public" :loading="activeLoading">
            <template #off>
              <i class='bx bx-x' ></i>
            </template>
            <template #on>
              <i class='bx bx-check' ></i>
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

export default {
  data () {
    return {
      deleteConfirm: false,
      activeLoading: false
    }
  },
  computed: {
    product () {
      return this.$store.state.products.selectedProduct
    }
  },
  methods: {
    openNotification (position = null, color) {
      return this.$vs.notification({
        color,
        position,
        title: 'Produkt został zaktualizowany.'
      })
    },
    changePublic () {
      this.activeLoading = true

      setTimeout(() => {
        this.activeLoading = false
      }, 3000)
    }
  },
  async created () {
    const loading = this.$vs.loading({ color: '#000' })

    try {
      await this.$store.dispatch('products/view', this.$route.params.id)
    } catch (e) {
      console.log(e)
    } finally {
      loading.close()
    }
  },
  components: {
    TopNav,
    Gallery,
    Card,
    FlexInput
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
