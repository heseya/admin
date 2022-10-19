<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="statuses" draggable :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Statuses.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: status }">
        <cms-table-row
          :key="status.id"
          :item="status"
          draggable
          :headers="tableConfig.headers"
          @click="openModal(status.id)"
        >
          <template #name>
            <div class="status-name">
              <avatar small :color="`#${status.color}`" />
              <b class="status-name__name">{{ status.name }}</b>
            </div>
          </template>
          <template #description>
            <small>{{ status.description }}</small>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            :label="$t('common.form.name')"
          />

          <validated-input
            v-model="editedItem.description"
            :disabled="!canModify"
            type="textarea"
            rows="5"
            rules="required"
            :label="$t('common.form.description')"
          />

          <validated-input
            :disabled="!canModify"
            rules="required"
            :value="`#${editedItem.color}`"
            :label="$t('form.color')"
            type="color"
            @input="setColor"
          />

          <br />

          <SwitchInput
            v-model="editedItem.cancel"
            :disabled="!canModify"
            horizontal
            :label="$t('form.cancel')"
          />
          <br />

          <SwitchInput v-model="editedItem.hidden" :disabled="!canModify" horizontal>
            <template #title>
              {{ $t('form.hidden') }}
              <info-tooltip>
                {{ $t('form.hiddenTooltip') }}
              </info-tooltip>
            </template>
          </SwitchInput>
          <br />

          <SwitchInput v-model="editedItem.no_notifications" :disabled="!canModify" horizontal>
            <template #title>
              {{ $t('form.noNotification') }}
              <info-tooltip>
                {{ $t('form.noNotificationTooltip') }}
              </info-tooltip>
            </template>
          </SwitchInput>

          <template v-if="selectedItem">
            <hr />
            <MetadataForm
              ref="publicMeta"
              :value="selectedItem.metadata"
              :disabled="!canModify"
              model="statuses"
            />
            <MetadataForm
              v-if="selectedItem.metadata_private"
              ref="privateMeta"
              :value="selectedItem.metadata_private"
              :disabled="!canModify"
              is-private
              model="statuses"
            />
          </template>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Statuses.Remove"
              :title="$t('deleteText')"
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

<i18n lang="json">
{
  "pl": {
    "title": "Statusy zamówień",
    "add": "Dodaj status",
    "editTitle": "Edycja statusu",
    "newTitle": "Nowy status",
    "deleteText": "Czy na pewno chcesz usunąć ten status?",
    "form": {
      "color": "Kolor",
      "cancel": "Przywracanie stanów magazynowych",
      "hidden": "Ukryj zamówienia z tym statusem na liście",
      "hiddenTooltip": "Zamówienia z tym statusem nie będą domyślnie pokazywać się na liście zamówień. Wciąż będzie można po nim filtrować.",
      "noNotification": "Nie wysyłaj powiadomień",
      "noNotificationTooltip": "Przy zmianie statusu zamówienia na ten, klientowi nie zostanie wysłane powiadomienie mailowe."
    },
    "alerts": {
      "deleted": "Status zamówienia został usunięty.",
      "created": "Status zamówienia został dodany.",
      "updated": "Status zamówienia został zaktualizowany."
    }
  },
  "en": {
    "title": "Order statuses",
    "add": "Add status",
    "editTitle": "Edit status",
    "newTitle": "New status",
    "deleteText": "Are you sure you want to delete this status?",
    "form": {
      "color": "Color",
      "cancel": "Restore stock",
      "hidden": "Hide orders with this status on the list",
      "hiddenTooltip": "Orders with this status will not be shown on the list by default. You can still filter by them.",
      "noNotification": "Don't send notifications",
      "noNotificationTooltip": "When changing order status to this one, the customer will not receive a notification email."
    },
    "alerts": {
      "deleted": "Order status has been deleted.",
      "created": "Order status has been added.",
      "updated": "Order status has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'
import { OrderStatus, OrderStatusUpdateDto } from '@heseya/store-core'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import Avatar from '@/components/layout/Avatar.vue'

import { UUID } from '@/interfaces/UUID'

const CLEAR_STATUS: OrderStatusUpdateDto = {
  name: '',
  description: '',
  color: '000000',
  cancel: false,
  hidden: false,
  no_notifications: false,
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
    MetadataForm,
    CmsTableRow,
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
    editedItem: clone(CLEAR_STATUS) as OrderStatusUpdateDto & { id?: string },
    selectedItem: null as OrderStatus | null,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Statuses.Edit : this.$p.Statuses.Add)
    },
    tableConfig(): TableConfig<OrderStatus> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'description', label: this.$t('common.form.description') as string },
          {
            key: 'cancel',
            label: this.$t('form.cancel') as string,
            width: '0.5fr',
          },
          { key: 'hidden', label: this.$t('form.hidden') as string, width: '0.5fr' },
          {
            key: 'no_notifications',
            label: this.$t('form.noNotification') as string,
            width: '0.5fr',
          },
        ],
      }
    },
  },
  methods: {
    setColor(color: string) {
      this.editedItem.color = color.split('#')[1] ?? color
    },
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = clone(this.$accessor.statuses.getFromListById(id))
        this.selectedItem = this.$accessor.statuses.getFromListById(id)
        this.setColor(this.editedItem.color)
      } else {
        this.editedItem = clone(CLEAR_STATUS)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        // Metadata can be saved only after status is created
        await this.saveMetadata(this.editedItem.id)

        await this.$accessor.statuses.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })

        this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        await this.$accessor.statuses.add(this.editedItem)

        this.$toast.success(this.$t('alerts.created') as string)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.statuses.remove(this.editedItem.id!)

      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}

.status-name {
  display: flex;
  align-items: center;

  &__name {
    display: block;
    margin-left: 8px;
  }
}
</style>
