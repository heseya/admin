<template>
  <div class="narrower-page">
    <PaginatedList
      ref="table"
      :title="$t('title').toString()"
      store-key="languages"
      :table="tableConfig"
    >
      <template #nav>
        <icon-button v-can="$p.Languages.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: language }">
        <cms-table-row
          :item="language"
          :headers="tableConfig.headers"
          @click="openModal(language.id)"
        >
          <template #iso="{ value }">
            <code>{{ value }}</code>
          </template>
          <template #hidden="{ value }">
            <boolean-tag :value="value" />
          </template>
          <template #default="{ value }">
            <boolean-tag :value="value" />
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
        <LanguagesForm v-model="editedItem" :disabled="!canModify" />
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>

            <pop-confirm
              v-if="!editedItem.default"
              v-can="$p.Languages.Remove"
              :title="$t('deleteText').toString()"
              :ok-text="$t('common.delete').toString()"
              :cancel-text="$t('common.cancel').toString()"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">
                {{ $t('common.delete') }}
              </app-button>
            </pop-confirm>
            <a-tooltip v-else>
              <template #title> {{ $t('deleteDefaultTooltip') }} </template>
              <div>
                <app-button v-if="editedItem.id" type="danger" disabled>
                  {{ $t('common.delete') }}
                </app-button>
              </div>
            </a-tooltip>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Języki",
    "add": "Dodaj język",
    "editTitle": "Edycja jęzka",
    "newTitle": "Nowy język",
    "deleteText": "Czy na pewno chcesz usunąć ten język? Spowoduje to usunięce wszystkich treści, które zostały zapisane w tym języku!",
    "form": {
      "iso": "Kod ISO",
      "default": "Język domyślny",
      "hidden": "Ukryty"
    },
    "deleteDefaultTooltip": "Nie można usunąć języka domyślnego"
  },
  "en": {
    "title": "Languages",
    "add": "Add language",
    "editTitle": "Edit language",
    "newTitle": "New language",
    "deleteText": "Are you sure you want to delete this language? This will delete all content in this language!",
    "form": {
      "iso": "ISO code",
      "default": "Default language",
      "hidden": "Hidden"
    },
    "deleteDefaultTooltip": "You can't delete default language"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Language, LanguageCreateDto } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import LanguagesForm from '@/components/modules/languages/Form.vue'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

const EMPTY_FORM: LanguageCreateDto = {
  name: '',
  iso: '',
  default: false,
  hidden: false,
}

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    LanguagesForm,
    CmsTableRow,
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
    editedItem: { ...EMPTY_FORM } as LanguageCreateDto & { id?: string },
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Languages.Edit : this.$p.Languages.Add)
    },
    tableConfig(): TableConfig<Language> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, sortable: true },
          { key: 'iso', label: this.$t('form.iso') as string, width: '0.5fr' },
          { key: 'hidden', label: this.$t('form.hidden') as string, width: '0.5fr' },
          { key: 'default', label: this.$t('form.default') as string, width: '0.5fr' },
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
        // Fetch all languages again, to check if the default language has changed
        if (this.editedItem.default) await (this.$refs.table as any).getItems()

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
