<template>
  <xlsx-workbook>
    <xlsx-sheet :sheet-name="file.name" :collection="fileContent" />
    <xlsx-download :filename="`${file.name}.xlsx`">
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
import { FileConfig } from '@/interfaces/FileConfig'

export default Vue.extend({
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  props: {
    file: {
      type: Object,
      default: null,
    } as Vue.PropOptions<FileConfig>,
    fileContent: {
      type: Array,
      default: null,
    } as Vue.PropOptions<Record<string, any>[]>,
  },
})
</script>
