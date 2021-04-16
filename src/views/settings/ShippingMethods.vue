<template>
  <div>
    <top-nav title="Opcje Dostawy">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!shippingMethods.length">Nie ma żadnej opcji dostawy</app-empty>
      <list>
        <draggable v-model="shippingMethods">
          <list-item
            v-for="shippingMethod in shippingMethods"
            :key="shippingMethod.id"
            @click="openModal(shippingMethod.id)"
            :hidden="!shippingMethod.public"
          >
            {{ shippingMethod.name }}
            <small>{{ shippingMethod.price }} {{ currency }}</small>
          </list-item>
        </draggable>
      </list>
    </card>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja opcji' : 'Nowa opcja' }} dostawy</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.name" label="Nazwa">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <vs-input v-model="editedItem.price" label="Cena" type="number" step="0.01" />
          <div class="center">
            <vs-select
              v-model="editedItem.payment_methods"
              :key="paymentMethods.length"
              multiple
              filter
              collapse-chips
              label="Metody płatności"
            >
              <vs-option
                v-for="method in paymentMethods"
                :key="method.id"
                :value="method.id"
                :label="method.name"
              >
                {{ method.name }}
              </vs-option>
            </vs-select>
          </div>
          <br />
          <div class="center">
            <flex-input>
              <label class="title">Widoczność opcji dostawy</label>
              <vs-switch success v-model="editedItem.public">
                <template #off>
                  <i class="bx bx-x"></i>
                </template>
                <template #on>
                  <i class="bx bx-check"></i>
                </template>
              </vs-switch>
            </flex-input>
          </div>
        </modal-form>
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
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import FlexInput from '@/components/FlexInput.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import Draggable from 'vuedraggable'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    ModalForm,
    PopConfirm,
    FlexInput,
    appEmpty: Empty,
    ValidationProvider,
    ValidationObserver,
    Draggable,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      price: 0,
      payment_methods: [],
      public: true
    }
  }),
  computed: {
    paymentMethods() {
      return this.$store.getters['paymentMethods/getData']
    },
    shippingMethods: {
      get() {
        return this.$store.getters['shippingMethods/getData']
      },
      async set(val) {
        const loading = this.$vs.loading({ color: '#000' })
        await this.$store.dispatch('shippingMethods/setOrder', val.map((method) => method.id))
        await this.$store.dispatch('shippingMethods/fetch')
        loading.close()
      }
    },
    error() {
      return this.$store.getters['shippingMethods/getError']
    },
    currency() {
      return this.$store.state.currency
    }
  },
  watch: {
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: error.message,
          text: error.response.data?.error?.message
        })
      }
    }
  },
  methods: {
    openModal(id) {
      this.isModalActive = true
      if (id) {
        const item = this.$store.getters['shippingMethods/getFromListById'](id)
        this.editedItem = { ...item, payment_methods: item.payment_methods.map(({ id }) => id) }
      } else {
        this.editedItem = {
          name: '',
          price: 0,
          public: true
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('shippingMethods/update', {
          id: this.editedItem.id,
          item: this.editedItem
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
    }
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })
    await Promise.all([
      this.$store.dispatch('shippingMethods/fetch'),
      this.$store.dispatch('paymentMethods/fetch')
    ])
    loading.close()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>
