<template>
  <xlsx-workbook v-if="fileContent.length">
    <xlsx-sheet :sheet-name="fileName" :collection="fileContent" />
    <xlsx-download :filename="`${fileName}-${getDate()}.xlsx`">
      <icon-button>
        <template #icon>
          <i class="bx bxs-download"></i>
        </template>
        {{ $t('downloadXlSX') }}
      </icon-button>
    </xlsx-download>
  </xlsx-workbook>
</template>

<i18n lang="json">
{
  "en": {
    "downloadXlSX": "Download XLSX file"
  },
  "pl": {
    "downloadXlSX": "Pobierz plik XLSX"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import { XlsxWorkbook, XlsxDownload, XlsxSheet } from 'vue-xlsx'

import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'
import { VuexBaseItem } from '@/interfaces/VuexGenerator'
import { formatDateTimeInput } from '@/utils/dates'

export default Vue.extend({
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  props: {
    items: {
      type: Array,
      default: null,
    } as Vue.PropOptions<VuexBaseItem[]>,
    xlsxFileConfig: {
      type: Object,
      default: null,
    } as Vue.PropOptions<XlsxFileConfig>,
  },
  computed: {
    fileContent(): Record<string, any>[] {
      return this.items.map((item) => {
        return this.xlsxFileConfig.headers.reduce((acc, { key, label, format }) => {
          return {
            ...acc,
            [label]: format ? format(item[key], item) : item[key],
          }
        }, {})
      })
    },
    fileName(): string {
      return this.xlsxFileConfig.name
    },
  },
  methods: {
    getDate(): string {
      return formatDateTimeInput(Date.now()) as string
    },
  },
})
</script>
