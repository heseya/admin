<template>
  <xlsx-workbook v-if="fileContent.length" :key="fileName">
    <xlsx-sheet :sheet-name="fileName" :collection="fileContent" />
    <xlsx-download :filename="`${fileName}-${getDate()}.xlsx`">
      <icon-button>
        <template #icon>
          <i class="bx bxs-download"></i>
        </template>
        {{ text || $t('downloadXlSX') }}
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
import { defineComponent, PropType } from 'vue'
// @ts-ignore types for vue-xlsx are not needed
import { XlsxWorkbook, XlsxDownload, XlsxSheet } from 'vue-xlsx'

import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'
import { VuexBaseItem } from '@/interfaces/VuexGenerator'
import { formatDateTimeInput } from '@/utils/dates'

export default defineComponent({
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  props: {
    text: {
      type: String,
      default: null,
    },
    items: {
      type: Array as PropType<VuexBaseItem[]>,
      default: null,
    },
    xlsxFileConfig: {
      type: Object as PropType<XlsxFileConfig<any>>,
      default: null,
    },
  },
  computed: {
    fileContent(): Record<string, any>[] {
      return this.items.map((item) => {
        return this.xlsxFileConfig.headers.reduce((acc, { key, label, format }) => {
          return {
            ...acc,
            // @ts-expect-error
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
