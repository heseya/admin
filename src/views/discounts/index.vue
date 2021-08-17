<template>
  <div>
    <PaginatedList title="Kody rabatowe" storeKey="discounts">
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
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja kodu rabatowego' : 'Nowy kod rabatowy' }}</h4>
        </template>
        <modal-form>
          <validated-input rules="required" v-model="editedItem.code" label="Kod" />
          <validated-input rules="required" v-model="editedItem.description" label="Opis" />

          <validated-input
            rules="required"
            v-model="editedItem.max_uses"
            label="Maksymalna ilość użyć"
          />
          <validated-input rules="required" v-model="editedItem.discount" label="Zniżka" />
          <ValidationProvider rules="required" v-slot="{ errors }">
            <vs-select v-model="editedItem.type" label="Typ">
              <vs-option label="Procentowy" value="0">Rabat Procentowy</vs-option>
              <vs-option label="Kwotowy" value="1">Rabat Kwotowy</vs-option>
              <template #message-danger>{{ errors[0] }}</template>
            </vs-select>
          </ValidationProvider>
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

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { DiscountCode } from '@/interfaces/DiscountCode'
import { UUID } from '@/interfaces/UUID'

const EMPTY_DISCOUNT_CODE: DiscountCode = {
  id: '',
  type: 0,
  code: '',
  discount: 0.0,
  max_uses: 1,
  available: true,
  uses: 0,
}

export default Vue.extend({
  components: {
    ListItem,
    ModalForm,
    ValidationProvider,
    ValidationObserver,
    PaginatedList,
    ValidatedInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      ...EMPTY_DISCOUNT_CODE,
    } as DiscountCode,
  }),
  computed: {
    currency(): string {
      return this.$accessor.currency
    },
  },
  methods: {
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$accessor.discounts.getFromListById(id)
      } else {
        this.editedItem = {
          ...EMPTY_DISCOUNT_CODE,
        }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.discounts.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.discounts.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.discounts.remove(this.editedItem.id)
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
