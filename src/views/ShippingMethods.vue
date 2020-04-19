<template>
  <div>
    <top-nav title="Opcje Dostawy">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <list>
        <list-item
          v-for="shippingMethod in shippingMethods"
          :key="shippingMethod.id"
          @click="openModal(shippingMethod.id)"
          :hidden="!shippingMethod.public"
        >
          {{ shippingMethod.name }}
          <small>{{ shippingMethod.price }} zł</small>
        </list-item>
      </list>
    </card>

    <vs-dialog width="550px" not-center v-model="isModalActive">
      <template #header>
        <h4>{{editedItem.id ? 'Edycja' : 'Dodawanie'}} opcji dostawy</h4>
      </template>
      <modal-form>
        <vs-input v-model="editedItem.name" label="Nazwa" />
        <vs-input v-model="editedItem.price" label="Cena" type="number" />
        <div class="center">
          <vs-switch v-model="editedItem.public">
            <template #off>Ukryty</template>
            <template #on>Widoczny</template>
          </vs-switch>
        </div>
      </modal-form>
      <template #footer>
        <vs-button color="dark" @click="saveModal">
          Zapisz
        </vs-button>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    ModalForm
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      price: 0,
      public: true
    }
  }),
  computed: {
    shippingMethods () {
      return this.$store.getters['shippingMethods/getData']
    }
  },
  methods: {
    async getShippingMethods () {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('shippingMethods/fetch')
      loading.close()
    },
    openModal (id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['shippingMethods/getFromListById'](id)
      } else {
        this.editedItem = {
          name: '',
          price: 0,
          public: true
        }
      }
    },
    async saveModal () {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('shippingMethods/edit', { id: this.editedItem.id, item: this.editedItem })
      } else {
        await this.$store.dispatch('shippingMethods/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    }
  },
  created () {
    this.getShippingMethods()
  }
}
</script>
