<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="tags">
      <template #nav>
        <icon-button v-can="$p.Tags.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: tag }">
        <list-item :key="tag.id" @click="openModal(tag.id)">
          <template #avatar>
            <avatar :key="tag.color" :color="`#${tag.color}`" />
          </template>
          {{ tag.name }}
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <modal-form>
          <validated-input
            v-model="editedName"
            :disabled="!canModify"
            rules="required"
            :label="$t('common.form.name')"
          />

          <validated-input
            :disabled="!canModify"
            rules="required"
            :value="`#${editedItem.color}`"
            :label="$t('form.color')"
            type="color"
            @input="setColor"
          />

          <br />
          <PublishedLangsForm v-model="editedItem.published" />

          <AbsoluteContentLangSwitch :value="editedLang" @input="setEditedLang" />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Tags.Remove"
              :title="$t('deleteText').toString()"
              :ok-text="$t('common.delete').toString()"
              :cancel-text="$t('common.cancel').toString()"
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

<i18n lang="json">
{
  "pl": {
    "title": "Tagi",
    "add": "Dodaj tag",
    "editTitle": "Edycja taga",
    "newTitle": "Nowy tag",
    "deleteText": "Czy na pewno chcesz usunąć ten tag?",
    "form": {
      "color": "Kolor"
    }
  },
  "en": {
    "title": "Tags",
    "add": "Add tag",
    "editTitle": "Edit tag",
    "newTitle": "New tag",
    "deleteText": "Are you sure you want to delete this tag?",
    "form": {
      "color": "Color"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'
import { TagCreateDto } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import Avatar from '@/components/layout/Avatar.vue'

import { UUID } from '@/interfaces/UUID'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'

const CLEAR_TAG: TagCreateDto & { id?: string } = {
  color: '000000',
  published: [],
  translations: {},
}

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    Avatar,
    PublishedLangsForm,
    AbsoluteContentLangSwitch,
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
    editedLang: '',
    isModalActive: false,
    editedItem: clone(CLEAR_TAG) as TagCreateDto & { id?: string },
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Tags.Edit : this.$p.Tags.Add)
    },

    editedName: {
      get(): string {
        return this.editedItem.translations[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.editedItem.translations[this.editedLang].name = value
      },
    },
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.editedItem.translations[langId])
        this.$set(this.editedItem.translations, langId, { name: '' })
    },

    setColor(color?: string) {
      this.editedItem.color = color?.split('#')[1] ?? color
    },
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.tags.getFromListById(id)
        this.editedItem = {
          ...item,
          translations: {
            ...item.translations,
          },
        }
        this.setColor(this.editedItem.color)
      } else {
        this.editedItem = clone(CLEAR_TAG)
      }

      this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.tags.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.tags.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      if (!this.editedItem.id) return
      this.$accessor.startLoading()
      await this.$accessor.tags.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}
</style>
