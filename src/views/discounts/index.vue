<template>
  <div>
    <PaginatedList title="Kody rabatowe" store-key="discounts">
      <template #nav>
        <icon-button v-can="$p.Discounts.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj kod rabatowy
        </icon-button>
      </template>

      <template v-slot="{ item: discount }">
        <list-item @click="openModal(discount.id)">
          {{ discount.code }}
          <small>{{ discount.description }}</small>

          <template #action>
            -{{ discount.type === 0 ? `${discount.discount}%` : formatCurrency(discount.discount) }}
            <small style="white-space: nowrap"
              >wykorzystano {{ discount.uses }} z {{ discount.max_uses }}</small
            >
          </template>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja kodu rabatowego' : 'Nowy kod rabatowy'"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.code"
            :disabled="!canModify"
            rules="required"
            label="Kod"
          />
          <validated-input v-model="editedItem.description" :disabled="!canModify" label="Opis" />

          <validated-input
            v-model="editedItem.max_uses"
            :disabled="!canModify"
            rules="required"
            label="Maksymalna ilość użyć"
          />
          <validated-input
            v-model="editedItem.discount"
            :disabled="!canModify"
            rules="required"
            label="Zniżka"
          />
          <ValidationProvider v-slot="{ errors }" rules="required">
            <app-select v-model="editedItem.type" :disabled="!canModify" label="Typ">
              <a-select-option :value="0">Rabat Procentowy</a-select-option>
              <a-select-option :value="1">Rabat Kwotowy</a-select-option>
              <template #error>{{ errors[0] }}</template>
            </app-select>
          </ValidationProvider>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <!-- <pop-confirm-->
            <!--              title="Czy na pewno chcesz usunąć ten kod?"-->
            <!--              v-can="$p.Discounts.Remove"-->
            <!--              okText="Usuń"-->
            <!--              cancelText="Anuluj"-->
            <!--              @confirm="deleteItem"-->
            <!--            >-->
            <!-- <app-button v-if="editedItem.id" type="danger" >Usuń</app-button> -->
            <!--            </pop-confirm> -->
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { DiscountCode } from '@/interfaces/DiscountCode'
import { UUID } from '@/interfaces/UUID'

import { formatCurrency } from '@/utils/currency'

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
  metaInfo: { title: 'Kody rabatowe' },
  components: {
    ListItem,
    ModalForm,
    ValidationProvider,
    ValidationObserver,
    PaginatedList,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      ...EMPTY_DISCOUNT_CODE,
    } as DiscountCode,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Discounts.Edit : this.$p.Discounts.Add)
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
    openModal(id?: UUID) {
      if (!this.$verboseCan(this.$p.Discounts.ShowDetails)) return
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
