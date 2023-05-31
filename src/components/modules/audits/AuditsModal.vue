<template>
  <div class="audits-modal">
    <icon-button v-if="id" class="audits-modal__btn" html-type="button" @click="openModal">
      <template #icon>
        <i class="bx bx-history"></i>
      </template>
      {{ $t('title') }}
    </icon-button>

    <a-modal :visible="isModalOpen" width="750px" :footer="null" @cancel="isModalOpen = false">
      <template #title>
        <div class="audits-modal__header">
          <span> {{ $t('header') }}</span>

          <icon-button size="small" @click="downloadAudits">
            <template #icon>
              <i class="bx bx-history"></i>
            </template>
            {{ $t('download') }}
          </icon-button>
        </div>
      </template>

      <loading :active="isLoading" />

      <a-collapse
        v-if="audits && audits[0]"
        :default-active-key="audits[0].id"
        accordion
        :bordered="false"
        class="audits-modal__content"
      >
        <template #expandIcon="{ isActive }">
          <div>
            <i v-if="isActive" class="bx bx-chevron-up"></i>
            <i v-else class="bx bx-chevron-down"></i>
          </div>
        </template>

        <a-collapse-panel v-for="entry in audits" :key="entry.id" class="audit-entry">
          <template #header>
            <div class="audit-entry__header">
              <span class="audit-entry__header-user">
                {{ getIssuer(entry) }}
              </span>
              <span class="audit-entry__tag">
                {{ entry.event === 'updated' ? $t('eventChanged') : entry.event }}
              </span>
              <span class="audit-entry__header-date">{{ formatDate(entry.created_at) }}</span>
            </div>
          </template>

          <cms-table class="audit-entry__table" :value="getValues(entry)" :config="tableConfig">
            <template #item="{ item: audit }">
              <cms-table-row :key="audit.id" :item="audit" no-hover :headers="tableConfig.headers">
                <template #new>
                  <audit-formatter :field-key="audit.key" :value="audit.new" />
                </template>
                <template #old>
                  <audit-formatter :field-key="audit.key" :value="audit.old" />
                </template>
              </cms-table-row>
            </template>
          </cms-table>
        </a-collapse-panel>
      </a-collapse>

      <empty v-else> {{ $t('noChanges') }} </empty>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Rejestr zmian",
    "header": "Rejestr wprowadzonych zmian",
    "download": "Pobierz historię zmian",
    "noChanges": "Nie zarejestrowano żadnych zmian dla tego obiektu",
    "table": {
      "name": "Nazwa",
      "old": "Starta wartość",
      "new": "Nowa wartość"
    },
    "unauthenticatedUser": "Niezalogowany użytkownik",
    "unknownApp": "Nieznana aplikacja",
    "eventChanged": "zmieniono",
    "keyValues": {
      "code": "Kod",
      "email": "Email",
      "comment": "Komentarz",
      "currency": "Waluta",
      "coupons": "Kody rabatowe",
      "shipping_method_id": "Metoda dostawy",
      "shipping_price": "Koszt dostawy",
      "delivery_address_id": "Adres dostawy",
      "invoice_address_id": "Adres rozliczeniowy",
      "status_id": "Status zamówienia",
      "content_html": "Treść",
      "slug": "Link",
      "name": "Nazwa",
      "public": "Widoczność",
      "available": "Dostępność",
      "price": "Cena",
      "quantity_step": "Format ilości",
      "description_html": "Opis"
    }
  },
  "en": {
    "title": "Audit log",
    "header": "Audit log",
    "download": "Download audit log",
    "noChanges": "No changes have been logged for this object",
    "table": {
      "name": "Name",
      "old": "Old value",
      "new": "New value"
    },
    "unauthenticatedUser": "Unauthenticated user",
    "unknownApp": "Unknown application",
    "eventChanged": "changed",
    "keyValues": {
      "code": "Code",
      "email": "Email",
      "comment": "Comment",
      "currency": "Currency",
      "coupons": "Coupons",
      "shipping_method_id": "Shipping method",
      "shipping_price": "Shipping price",
      "delivery_address_id": "Delivery address",
      "invoice_address_id": "Invoice address",
      "status_id": "Order status",
      "content_html": "Content",
      "slug": "Link",
      "name": "Name",
      "public": "Visibility",
      "available": "Availability",
      "price": "Price",
      "quantity_step": "Quantity format",
      "description_html": "Description"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { capitalize } from 'lodash'
import { EntityAudits } from '@heseya/store-core'

import CmsTable from '../../cms/CmsTable.vue'
import Empty from '../../layout/Empty.vue'
import Loading from '../../layout/Loading.vue'
import AuditFormatter from './AuditFormatter.vue'
import CmsTableRow from '../../cms/CmsTableRow.vue'

import { downloadJsonAsFile } from '@/utils/download'
import { formatDate } from '@/utils/dates'

import { UUID } from '@/interfaces/UUID'
import { GeneratedStoreModulesKeys } from '@/store'
import { TableConfig } from '@/interfaces/CmsTable'

const transformKey = (key: string): string =>
  capitalize(key.split('_id').join('').split('_').join(' '))

export default defineComponent({
  components: { CmsTable, Empty, Loading, AuditFormatter, CmsTableRow },
  props: {
    model: {
      type: String,
      required: true,
    } as PropOptions<GeneratedStoreModulesKeys>,
    id: {
      type: String,
      default: null,
    } as PropOptions<UUID>,
  },
  data: () => ({
    isModalOpen: false,
    isLoading: false,
    audits: [] as EntityAudits<Record<string, any>>[],
  }),
  computed: {
    tableConfig(): TableConfig {
      return {
        headers: [
          {
            key: 'key',
            label: this.$t('table.name') as string,
            render: (key) =>
              this.$te(`keyValues.${key}`)
                ? (this.$t(`keyValues.${key}`) as string)
                : transformKey(key),
          },
          { key: 'old', label: this.$t('table.old') as string },
          { key: 'new', label: this.$t('table.new') as string },
        ],
      }
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true
      this.fetchAudits()
    },
    formatDate(date: string) {
      return formatDate(new Date(date))
    },

    getValues(audit: EntityAudits<Record<string, any>>): { key: string; old: any; new: any }[] {
      // Makes sure, that there is no key that exists only in one of the objects
      const keys = [
        ...new Set([...Object.keys(audit.old_values), ...Object.keys(audit.new_values)]),
      ]

      return keys
        .filter((key) => key !== 'id') // Remove ID key
        .map((key) => ({
          key,
          old: audit.old_values[key],
          new: audit.new_values[key],
        }))
    },

    async fetchAudits() {
      this.isLoading = true

      const audits = await this.$accessor[this.model].fetchAudits(this.id)
      this.audits = audits

      this.isLoading = false
      return audits
    },
    downloadAudits() {
      downloadJsonAsFile(this.audits, `${this.id}-${this.model}-history`)
    },
    getIssuer(entry: EntityAudits<Record<string, any>>) {
      if (entry.issuer_type === 'user') {
        return entry.issuer ? entry.issuer.email : this.$t('unauthenticatedUser')
      }
      return entry.issuer?.name || this.$t('unknownApp')
    },
  },
})
</script>

<style lang="scss" scoped>
.audits-modal {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    > *:last-child {
      margin-left: auto;
    }
  }
}

.audit-entry {
  &__header {
    display: flex;
    align-items: center;
    flex-direction: column;
    line-height: 1.1em;

    @media ($viewport-5) {
      padding: 0.5em 0;
      flex-direction: row;
    }
  }

  &__header-user {
    margin-right: auto;

    @media ($viewport-5) {
      margin-right: 12px;
    }
  }

  &__header-date {
    color: var(--gray-color-500);
    margin-left: auto;
    font-size: 0.8em;

    @media ($viewport-5) {
      font-size: 1em;
    }
  }

  &__table {
    :deep(.cms-table-row__col),
    :deep(.cms-table-header__col) {
      padding: 5px 8px;
    }

    :deep(.cms-table-header),
    :deep(.cms-table-row) {
      padding: 0;
    }
  }

  &__table &__tag {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--green-color-500);
    font-size: 0.8em;
    margin-left: auto;

    @media ($viewport-5) {
      margin: 0 8px;
    }
  }
}
</style>
