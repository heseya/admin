<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="settings">
      <template #nav>
        <icon-button v-can="$p.Settings.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: setting }">
        <list-item :key="setting.id" :hidden="!setting.public" @click="openModal(setting)">
          {{ setting.name }}
          <small>{{ setting.value }}</small>
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
            v-model="editedItem.name"
            rules="required"
            :label="$t('form.name')"
            :disabled="editedItem.permanent || !canModify"
          />

          <div class="settings-upload-value">
            <validated-input
              v-model="editedItem.value"
              :disabled="!canModify"
              rules="required"
              :label="$t('form.value')"
            />
            <media-uploader v-slot="{ drag, loading }" @upload="handleUpload">
              <button
                class="settings-upload-value__btn"
                :class="{
                  'settings-upload-value__btn--drag': drag,
                  'settings-upload-value__btn--loading': loading,
                }"
              >
                {{ drag ? $t('form.mediaDrag') : $t('form.media') }}
              </button>
            </media-uploader>
          </div>

          <SwitchInput
            v-model="editedItem.public"
            :disabled="!canModify"
            :label="$t('form.public')"
            horizontal
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Settings.Remove"
              :title="$t('deleteText')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteItem"
            >
              <app-button
                v-if="editedItem.id"
                v-can="$p.Settings.Remove"
                type="danger"
                :disabled="editedItem.permanent"
              >
                {{ $t('common.delete') }}
              </app-button>
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
    "title": "Ustawienia zaawansowane",
    "add": "Dodaj ustawienie",
    "editTitle": "Edycja ustawienia",
    "newTitle": "Nowe ustawienie",
    "deleteText": "Czy na pewno chcesz usunąć to ustawienie?",
    "form": {
      "name": "Klucz",
      "value": "Wartość",
      "public": "Wartość publiczna",
      "media": "Prześlij media",
      "mediaDrag": "Upuść plik"
    }
  },
  "en": {
    "title": "Advanced settings",
    "add": "Add setting",
    "editTitle": "Edit setting",
    "newTitle": "New setting",
    "deleteText": "Are you sure you want to delete this setting?",
    "form": {
      "name": "Key",
      "value": "Value",
      "public": "Public value",
      "media": "Upload media",
      "mediaDrag": "Drop file"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import clone from 'lodash/clone'
import { ValidationObserver } from 'vee-validate'
import { CdnMedia, Setting } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import MediaUploader from '@/components/modules/media/MediaUploader.vue'

const CLEAR_SETTING: Setting = {
  id: '',
  name: '',
  value: '',
  permanent: false,
  public: true,
}

export default Vue.extend({
  metaInfo(this: any) {
    return {
      title: this.$t('title') as string,
    }
  },
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
    MediaUploader,
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
    isModalActive: false,
    editedItem: clone(CLEAR_SETTING),
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Settings.Edit : this.$p.Settings.Add)
    },
  },
  methods: {
    openModal(item?: Setting) {
      if (!this.$verboseCan(this.$p.Settings.ShowDetails)) return

      this.isModalActive = true
      if (item) {
        this.editedItem = { ...clone(item), id: item.name }
      } else {
        this.editedItem = clone(CLEAR_SETTING)
      }
    },
    handleUpload(file: CdnMedia) {
      this.editedItem.value = file.url
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.settings.updateByKey({
          key: 'name',
          value: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.settings.add(this.editedItem)
      }
      await this.$accessor.config.fetchSettings()
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.settings.removeByKey({ key: 'name', value: this.editedItem.id })
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>

<style lang="scss" scoped>
.settings-upload-value {
  display: flex;
  align-items: flex-end;

  &__btn {
    background-color: $background-color-700;
    border: solid 1px #d9d9d9;
    height: 32px;
    margin-bottom: 8px;
    font-size: 10px;
    border-radius: 4px;
    margin-left: 8px;
    cursor: pointer;
    transition: 0.3s;

    &:hover,
    &--drag {
      background-color: $background-color-500;
    }
  }
}
</style>
