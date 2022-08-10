<template>
  <xlsx-workbook>
    <xlsx-sheet :sheet-name="fileName" :collection="fileContent" />
    <xlsx-download :filename="`${fileName}.xlsx`">
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
import { XlsxWorkbook, XlsxDownload, XlsxSheet } from 'vue-xlsx'

export default Vue.extend({
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  props: {
    fileName: {
      type: String,
      default: '',
    },
    fileContent: {
      type: Array,
      default: null,
    } as Vue.PropOptions<Record<string, any>[]>,
  },
})
</script>
