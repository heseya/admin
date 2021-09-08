<template>
  <div>
    <PaginatedList title="Statusy zamówień" store-key="statuses" draggable>
      <template #nav>
        <icon-button v-can="$p.Statuses.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj status
        </icon-button>
      </template>
      <template v-slot="{ item: status }">
        <list-item :key="status.id" @click="openModal(status.id)">
          <template #avatar>
            <avatar :color="`#${status.color}`" />
          </template>
          {{ status.name }}
          <small>{{ status.description }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja statusu' : 'Nowy status'"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            label="Nazwa"
          />

          <validated-input
            v-model="editedItem.description"
            :disabled="!canModify"
            rules="required"
            label="Opis"
          />

          <validated-input
            :disabled="!canModify"
            rules="required"
            :value="`#${editedItem.color}`"
            label="Kolor statusu"
            type="color"
            @input="setColor"
          />
          <SwitchInput
            v-model="editedItem.cancel"
            :disabled="!canModify"
            horizontal
            label="Anulowanie zamówienia"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <pop-confirm
              v-can="$p.Statuses.Remove"
              title="Czy na pewno chcesz usunąć ten status?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">Usuń</app-button>
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
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import Avatar from '@/components/layout/Avatar.vue'

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
  metaInfo: { title: 'Statusy zamówień' },
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
    Avatar,
  },
  data: () => ({
    isModalActive: false,
    editedItem: clone(CLEAR_STATUS) as OrderStatus,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Statuses.Edit : this.$p.Statuses.Add)
    },
  },
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
