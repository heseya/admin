<template>
  <div class="narrower-page">
    <PaginatedList title="Statusy zamówień" store-key="statuses" draggable>
      <template #nav>
        <icon-button v-can="$p.Statuses.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj status
        </icon-button>
      </template>
      <template #default="{ item: status }">
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
            type="textarea"
            rows="5"
            rules="required"
            label="Opis"
          />

          <validated-input
            :disabled="!canModify"
            rules="required"
            :value="`#${editedItem.color}`"
            label="Kolor"
            type="color"
            @input="setColor"
          />

          <br />

          <SwitchInput
            v-model="editedItem.cancel"
            :disabled="!canModify"
            horizontal
            label="Przywracanie stanów magazynowych"
          />
          <br />

          <SwitchInput v-model="editedItem.hidden" :disabled="!canModify" horizontal>
            <template #title>
              Ukryj zamówienia z tym statusem na liście
              <a-tooltip>
                <template #title>
                  Zamówienia z tym statusem nie będą domyślnie pokazywać się na liście zamówień.
                  Wciąż będzie można po nim filtrować.
                </template>
                <i class="bx bxs-info-circle"></i>
              </a-tooltip>
            </template>
          </SwitchInput>
          <br />

          <SwitchInput v-model="editedItem.no_notifications" :disabled="!canModify" horizontal>
            <template #title>
              Nie wysyłaj powiadomień
              <a-tooltip>
                <template #title>
                  Przy zmianie statusu zamówienia na ten, klientowi nie zostanie wysłane
                  powiadomienie mailowe.
                </template>
                <i class="bx bxs-info-circle"></i>
              </a-tooltip>
            </template>
          </SwitchInput>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Statuses.Remove"
              title="Czy na pewno chcesz usunąć ten status?"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">{{ $t('common.delete') }}</app-button>
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
  hidden: false,
  no_notifications: false,
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
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
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
})
</script>

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}
</style>
