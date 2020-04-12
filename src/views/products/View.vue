<template>
<div>
  <top-nav :title="product.name">
     <vs-button color="dark" icon @click="deleteConfirm=!deleteConfirm">
        <i class='bx bx-trash' ></i>
      </vs-button>
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
          <vs-switch success v-model="product.public">
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

  <vs-dialog width="550px" not-center v-model="deleteConfirm">
    <h4 class="not-margin">
      Czy na pewno chcesz usunąć ten produkt?
    </h4>

    <div>
      <vs-button danger @click="openNotification(null, 'danger')">
        Usuń
      </vs-button>
      <vs-button dark @click="deleteConfirm = false">
        Wróć
      </vs-button>
    </div>
  </vs-dialog>

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
      deleteConfirm: false
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
    }
  },
  async created () {
    const loading = this.$vs.loading({
      color: '#000'
    })

    await this.$store.dispatch('products/view', this.$route.params.id)

    loading.close()
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
  margin: 40px 0;

  &__info {

    input {
      width: 100%;
    }

    .vs-select-content {
      max-width: none;
    }
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
