<template>
  <div class="audits-modal">
    <icon-button v-if="id" class="audits-modal__btn" @click="openModal">
      <i slot="icon" class="bx bx-history"></i>
      Rejestr zmian
    </icon-button>

    <a-modal :visible="isModalOpen" width="750px" :footer="null" @cancel="isModalOpen = false">
      <div slot="title" class="audits-modal__header">
        <span>Rejestr wprowadzonych zmian</span>

        <icon-button size="small" @click="downloadAudits">
          <i slot="icon" class="bx bx-history"></i>
          Pobierz historię zmian
        </icon-button>
      </div>

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
          <div slot="header" class="audit-entry__header">
            <span>{{ entry.user.email }}</span>
            <span class="audit-entry__tag">
              {{ entry.event === 'updated' ? 'zmieniono' : entry.event }}
            </span>
            <span>{{ formatDateTime(entry.created_at) }}</span>
          </div>

          <cms-table class="audit-entry__table" :value="getValues(entry)" :config="tableConfig">
            <template #default="{ item: audit }">
              <cms-table-row :item="audit" no-hover :headers="tableConfig.headers">
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

      <empty v-else> Nie zarejestrowano żadnych zmian dla tego obiektu </empty>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import format from 'date-fns/format'

import CmsTable from './cms/CmsTable.vue'
import Empty from './layout/Empty.vue'
import Loading from './layout/Loading.vue'
import AuditFormatter from './modules/audits/AuditFormatter.vue'
import CmsTableRow from './cms/CmsTableRow.vue'

import { downloadJsonAsFile } from '@/utils/download'
import { changeAuditKeyToName } from '@/utils/auditsFieldsNames'

import { UUID } from '@/interfaces/UUID'
import { StoreModulesKeys } from '@/store'
import { AuditEntry } from '@/interfaces/AuditEntry'
import { TableConfig } from '@/interfaces/CmsTable'

export default Vue.extend({
  components: { CmsTable, Empty, Loading, AuditFormatter, CmsTableRow },
  props: {
    model: {
      type: String,
      required: true,
    } as Vue.PropOptions<Exclude<StoreModulesKeys, 'auth'>>,
    id: {
      type: String,
      default: null,
    } as Vue.PropOptions<UUID>,
  },
  data: () => ({
    isModalOpen: false,
    isLoading: false,
    audits: [] as AuditEntry[],
  }),
  computed: {
    tableConfig(): TableConfig {
      return {
        headers: [
          {
            key: 'key',
            label: 'Nazwa',
            render: (key) => changeAuditKeyToName(key),
          },
          { key: 'old', label: 'Stara wartość' },
          { key: 'new', label: 'Nowa wartość' },
        ],
      }
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true
      this.fetchAudits()
    },
    formatDateTime(date: string) {
      return format(new Date(date), 'dd-MM-yyyy HH:mm')
    },

    getValues(audit: AuditEntry): { key: string; old: any; new: any }[] {
      // Makes sure, that there is no key that exists only in one of the objects
      const keys = [
        ...new Set([...Object.keys(audit.old_values), ...Object.keys(audit.new_values)]),
      ]

      return keys.map((key) => ({
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
  },
})
</script>

<style lang="scss" scoped>
.audits-modal {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.audit-entry {
  &__header {
    display: flex;
    align-items: center;

    > span:first-child {
      margin-right: auto;
    }

    > *:not(:last-child) {
      margin-right: 12px;
    }
  }

  &__table ::v-deep {
    .cms-table-row__col,
    .cms-table-header__col {
      padding: 5px 8px;
    }

    .cms-table-header,
    .cms-table-row {
      padding: 0;
    }
  }

  &__tag {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: $green-color-500;
    font-size: 0.8em;
  }
}
</style>
