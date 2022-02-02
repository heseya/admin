<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="languages" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Languages.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <LanguagesForm v-model="editedItem" :disabled="!canModify" />
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Languages.Remove"
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

<i18n>
{
  "pl": {
    "title": "Języki",
    "add": "Dodaj język",
    "editTitle": "Edycja jęzka",
    "newTitle": "Nowy język",
    "deleteText": "Czy na pewno chcesz usunąć ten język?",
    "form": {
      "iso": "Kod ISO",
      "default": "Język domyślny",
      "hidden": "Ukryty"
    }
  },
  "en": {
    "title": "Languages",
    "add": "Add language",
    "editTitle": "Edit language",
    "newTitle": "New language",
    "deleteText": "Are you sure you want to delete this language?",
    "form": {
      "iso": "ISO code",
      "default": "Default language",
      "hidden": "Hidden"
    }
  }
}
</i18n>

<script lang="ts">
// TODO: wyłączyć usuwanie domyślnego języka
// TODO: dostosować szerokość tabelek
// TODO: wyświetlać tagi zamiast true/false
// TODO: lepszy komunikat potwierdzający usuwanie (opisać konsekwencje)
// TODO: tooltip przy języku domyślnym z konsekwencjami zmiani

import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import LanguagesForm from '@/components/modules/languages/Form.vue'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'
import { Language, LanguageDto } from '@/interfaces/Language'

const EMPTY_FORM: LanguageDto = {
  name: '',
  iso: '',
  default: false,
  hidden: false,
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    LanguagesForm,
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isModalActive: false,
    editedItem: { ...EMPTY_FORM } as LanguageDto,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Languages.Edit : this.$p.Languages.Add)
    },
    tableConfig(): TableConfig<Language> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, sortable: true },
          { key: 'iso', label: this.$t('form.iso') as string },
          { key: 'hidden', label: this.$t('form.hidden') as string },
          { key: 'default', label: this.$t('form.default') as string },
        ],
      }
    },
  },
  methods: {
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$accessor.languages.getFromListById(id)
      } else {
        this.editedItem = { ...EMPTY_FORM }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      let success = false
      if (this.editedItem.id) {
        success = !!(await this.$accessor.languages.update({
          id: this.editedItem.id,
          item: this.editedItem,
        }))
      } else {
        success = !!(await this.$accessor.languages.add(this.editedItem))
      }
      this.$accessor.stopLoading()

      if (success) {
        this.isModalActive = false
      }
    },
    async deleteItem() {
      if (!this.editedItem.id) return

      this.$accessor.startLoading()
      await this.$accessor.languages.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>
