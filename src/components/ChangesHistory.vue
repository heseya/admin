<template>
  <div class="changes-history">
    <icon-button v-if="id" @click="openModal">
      <i slot="icon" class="bx bx-history"></i>
      Rejestr zmian
    </icon-button>

    <a-modal :visible="isModalOpen" width="800px" :footer="null" @cancel="isModalOpen = false">
      <div slot="title" class="changes-history__header">
        <span>Rejestr wprowadzonych zmian</span>

        <icon-button size="small" @click="downloadAudits">
          <i slot="icon" class="bx bx-history"></i>
          Pobierz historię zmian
        </icon-button>
      </div>

      <a-collapse
        v-if="audits && audits[0]"
        :default-active-key="audits[0].id"
        accordion
        :bordered="false"
        class="changes-history__content"
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

          <p>{{ entry }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import format from 'date-fns/format'

import { downloadJsonAsFile } from '@/utils/download'

import { UUID } from '@/interfaces/UUID'
import { StoreModulesKeys } from '@/store'
import { AuditEntry } from '@/interfaces/AuditEntry'

export default Vue.extend({
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
  methods: {
    openModal() {
      this.isModalOpen = true
      this.fetchAudits()
    },
    formatDateTime(date: string) {
      return format(new Date(date), 'dd-MM-yyyy HH:mm')
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
.changes-history {
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

  &__tag {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: $green-color-500;
    font-size: 0.8em;
  }
}
</style>
