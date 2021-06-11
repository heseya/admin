<template>
  <div>
    <PaginatedList title="Opcje Dostawy" storeKey="shippingMethods" draggable>
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: shippingMethod }">
        <list-item @click="openModal(shippingMethod.id)" :hidden="!shippingMethod.public">
          {{ shippingMethod.name }}
          <small v-if="shippingMethod.countries.length">
            {{ shippingMethod.black_list ? 'Wszystkie kraje poza:' : 'Tylko wybrane kraje:' }}
            {{ shippingMethod.countries.map((c) => c.name).join(', ') }}
          </small>
          <small v-else>
            {{
              shippingMethod.black_list
                ? 'Metoda dostepna w każdym kraju'
                : 'Metoda niedostepna w żadnym kraju'
            }}
          </small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="660px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja opcji' : 'Nowa opcja' }} dostawy</h4>
        </template>
        <ShippingMethodsForm v-model="editedItem" :countries="countries" />
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć tą metode dostawy?"
              okText="Usuń"
              cancelText="Anuluj"
              @confirm="deleteItem"
              v-slot="{ open }"
            >
              <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>
            </pop-confirm>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ShippingMethodsForm from '@/components/forms/shippingMethods/Index.vue'

import { api } from '../../api'

export default {
  components: {
    ListItem,
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    ShippingMethodsForm,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {},
    countries: [],
  }),
  methods: {
    openModal(id) {
      this.isModalActive = true
      if (id) {
        const item = this.$store.getters['shippingMethods/getFromListById'](id)
        this.editedItem = {
          ...item,
          payment_methods: item.payment_methods.map(({ id }) => id),
          countries: item.countries.map(({ code }) => code),
          price_ranges: item.price_ranges.map(({ start, prices }) => ({
            start,
            value: prices[0].value,
          })),
        }
      } else {
        this.editedItem = {
          name: '',
          black_list: false,
          payment_methods: [],
          countries: [],
          price_ranges: [
            {
              start: 0,
              value: 0,
            },
          ],
          public: true,
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('shippingMethods/update', {
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$store.dispatch('shippingMethods/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('shippingMethods/remove', this.editedItem.id)
      loading.close()
      this.isModalActive = false
    },
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })
    this.$store.dispatch('paymentMethods/fetch')
    const { data } = await api.get('countries')
    this.countries = data.data
    loading.close()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>
