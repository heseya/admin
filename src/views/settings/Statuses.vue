<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      store-key="statuses"
      draggable
      :table="tableConfig"
    >
      <template #nav>
        <icon-button v-can="$p.Statuses.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: status }">
        <CmsTableRow
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
        </CmsTableRow>
      </template>
    </PaginatedList>

    <StatusModalForm
      :active="isModalActive"
      :selected-item="selectedItem"
      :disabled="!canModify"
      @close="onModalClose"
    />
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
import { defineComponent } from 'vue'
import { OrderStatus } from '@heseya/store-core'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'

import PaginatedList from '@/components/PaginatedList.vue'
import StatusModalForm from '@/components/modules/statuses/ModalForm.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import Avatar from '@/components/layout/Avatar.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    StatusModalForm,
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
    selectedItem: null as OrderStatus | null,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.selectedItem ? this.$p.Statuses.Edit : this.$p.Statuses.Add)
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
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.selectedItem = this.$accessor.statuses.getFromListById(id)
      } else {
        this.selectedItem = null
      }
    },
    onModalClose() {
      this.isModalActive = false
      this.selectedItem = null
    },
  },
})
</script>

<style lang="scss">
.status-name {
  display: flex;
  align-items: center;

  &__name {
    display: block;
    margin-left: 8px;
  }
}
</style>
