<template>
  <div>
    <PaginatedList title="Statusy zamówień" storeKey="statuses" draggable>
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: status }">
        <list-item @click="openModal(status.id)" :key="status.id">
          <template #avatar>
            <vs-avatar :color="`#${status.color}`" />
          </template>
          {{ status.name }}
          <small>{{ status.description }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja statusu' : 'Nowy status' }}</h4>
        </template>
        <modal-form>
          <validated-input rules="required" v-model="editedItem.name" label="Nazwa" />

          <validated-input rules="required" v-model="editedItem.description" label="Opis" />

          <validated-input
            rules="required"
            :value="`#${editedItem.color}`"
            label="Kolor statusu"
            @input="setColor"
            type="color"
          />
          <SwitchInput horizontal v-model="editedItem.cancel" label="Anulowanie zamówienia" />
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten status?"
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

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { UUID } from '@/interfaces/UUID'
import { OrderStatus } from '@/interfaces/Order'

const CLEAR_STATUS: OrderStatus = {
  id: '',
  name: '',
  description: '',
  color: '000000',
  cancel: false,
}

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
    ValidatedInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: clone(CLEAR_STATUS) as OrderStatus,
  }),
  methods: {
    setColor(color: string) {
      this.editedItem.color = color.split('#')[1] ?? color
    },
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$accessor.statuses.getFromListById(id)
        this.setColor(this.editedItem.color)
      } else {
        this.editedItem = clone(CLEAR_STATUS)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.statuses.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.statuses.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.statuses.remove(this.editedItem.id)
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

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}
</style>
