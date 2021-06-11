<template>
  <div>
    <ItemsPaginatedList title="Kody rabatowe" storeKey="discounts">
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: discount }">
        <list-item @click="openModal(discount.id)">
          {{ discount.code }}
          <small>{{ discount.description }}</small>

          <template #action>
            -{{ discount.discount }} {{ discount.type === 0 ? '%' : currency }}
            <small style="white-space: nowrap"
              >wykorzystano {{ discount.uses }} z {{ discount.max_uses }}</small
            >
          </template>
        </list-item>
      </template>
    </ItemsPaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja kodu rabatowego' : 'Nowy kod rabatowy' }}</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.code" label="Kod">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider v-slot="{ errors }">
            <vs-input v-model="editedItem.description" label="Opis">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
            <validation-provider rules="required" v-slot="{ errors }">
              <vs-input v-model="editedItem.max_uses" label="Maksymalna ilość użyć">
                <template #message-danger>{{ errors[0] }}</template>
              </vs-input>
            </validation-provider>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.discount" label="Zniżka">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-select v-model="editedItem.type" label="Typ">
              <vs-option label="Procentowy" value="0">Rabat Procentowy</vs-option>
              <vs-option label="Kwotowy" value="1">Rabat Kwotowy</vs-option>
              <template #message-danger>{{ errors[0] }}</template>
            </vs-select>
          </validation-provider>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <!--            <pop-confirm-->
            <!--              title="Czy na pewno chcesz usunąć ten kod?"-->
            <!--              okText="Usuń"-->
            <!--              cancelText="Anuluj"-->
            <!--              @confirm="deleteItem"-->
            <!--              v-slot="{ open }"-->
            <!--            >-->
            <!--              <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>-->
            <!--            </pop-confirm>-->
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'
import ItemsPaginatedList from '@/components/ItemsPaginatedList.vue'

const EMPTY_FORM = {
  name: '',
  slug: '',
  type: 0,
  discount: 0.0,
  max_uses: 1,
}

export default {
  components: {
    ListItem,
    ModalForm,
    ValidationProvider,
    ValidationObserver,
    ItemsPaginatedList,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      ...EMPTY_FORM,
    },
  }),
  computed: {
    currency() {
      return this.$store.state.currency
    },
  },
  methods: {
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['discounts/getFromListById'](id)
      } else {
        this.editedItem = {
          ...EMPTY_FORM,
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('discounts/update', {
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$store.dispatch('discounts/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('discounts/remove', this.editedItem.id)
      loading.close()
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
}
</script>
