<template>
  <div>
    <PaginatedList title="Opcje Dostawy" store-key="shippingMethods" draggable>
      <template #nav>
        <icon-button v-can="$p.ShippingMethods.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj opcję dostawy
        </icon-button>
      </template>

      <template v-slot="{ item: shippingMethod }">
        <list-item :hidden="!shippingMethod.public" @click="openModal(shippingMethod.id)">
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
      <a-modal
        v-model="isModalActive"
        width="660px"
        :title="editedItem.id ? 'Edycja opcji dostawy' : 'Nowa opcja dostawy'"
      >
        <ShippingMethodsForm v-model="editedItem" :countries="countries" :disabled="!canModify" />
        <template #footer>
          <div class="row">
            <vs-button v-if="canModify" color="dark" @click="handleSubmit(saveModal)">
              Zapisz
            </vs-button>
            <pop-confirm
              v-slot="{ open }"
              v-can="$p.ShippingMethods.Remove"
              title="Czy na pewno chcesz usunąć tą metode dostawy?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
            >
              <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { api } from '../../api'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ShippingMethodsForm from '@/components/modules/shippingMethods/Index.vue'
import IconButton from '@/components/layout/IconButton.vue'

import { UUID } from '@/interfaces/UUID'
import { ShippingMethodDTO } from '@/interfaces/ShippingMethod'

export default Vue.extend({
  components: {
    ListItem,
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    ShippingMethodsForm,
    IconButton,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {} as ShippingMethodDTO,
    countries: [],
  }),
  computed: {
    canModify(): boolean {
      return this.$can(
        this.editedItem.id ? this.$p.ShippingMethods.Edit : this.$p.ShippingMethods.Add,
      )
    },
  },
  async created() {
    this.$accessor.startLoading()
    this.$accessor.paymentMethods.fetch()
    const { data } = await api.get('countries')
    this.countries = data.data
    this.$accessor.stopLoading()
  },
  methods: {
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.shippingMethods.getFromListById(id)
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
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.shippingMethods.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.shippingMethods.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      if (!this.editedItem.id) return
      this.$accessor.startLoading()
      await this.$accessor.shippingMethods.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>
