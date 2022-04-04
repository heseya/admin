<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="packageTemplates">
      <template #nav>
        <icon-button v-can="$p.Packages.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: packageTemplate }">
        <list-item :key="packageTemplate.id" @click="openModal(packageTemplate.id)">
          {{ packageTemplate.name }}
          <small>
            {{ $t('item.weight') }}: <b>{{ packageTemplate.weight }}kg</b>, {{ $t('item.height') }}:
            <b>{{ packageTemplate.height }}cm</b>, {{ $t('item.width') }}:
            <b>{{ packageTemplate.width }}cm</b>, {{ $t('item.depth') }}:
            <b>{{ packageTemplate.depth }}cm</b>
          </small>
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
            :disabled="!canModify"
            rules="required"
            :label="$t('common.form.name')"
          />

          <validated-input
            v-model="editedItem.weight"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            step="0.01"
            :label="$t('form.weight')"
          />

          <validated-input
            v-model="editedItem.width"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            :label="$t('form.width')"
          />

          <validated-input
            v-model="editedItem.height"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            :label="$t('form.height')"
          />

          <validated-input
            v-model="editedItem.depth"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            :label="$t('form.depth')"
          />

          <template v-if="editedItem.id">
            <hr />
            <MetadataForm
              ref="publicMeta"
              :value="editedItem.metadata"
              :disabled="!canModify"
              model="packageTemplates"
            />
            <MetadataForm
              v-if="editedItem.metadata_private"
              ref="privateMeta"
              :value="editedItem.metadata_private"
              :disabled="!canModify"
              is-private
              model="packageTemplates"
            />
          </template>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Packages.Remove"
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
    "title": "Szablony przesyłek",
    "add": "Dodaj szablon",
    "editTitle": "Edycja szablonu",
    "newTitle": "Nowy szablon",
    "deleteText": "Czy na pewno chcesz usunąć ten szablon dostawy?",
    "item": {
      "weight": "waga",
      "height": "wysokość",
      "width": "szerokość",
      "depth": "głębokość"
    },
    "form": {
      "weight": "Waga (kg)",
      "height": "Wysokość (cm)",
      "width": "Szerokość (cm)",
      "depth": "Głębokość (cm)"
    },
    "alerts": {
      "deleted": "Szablon przesyłki został usunięty.",
      "created": "Szablon przesyłki został dodany.",
      "updated": "Szablon przesyłki został zaktualizowany."
    }
  },
  "en": {
    "title": "Package templates",
    "add": "Add template",
    "editTitle": "Edit template",
    "newTitle": "New template",
    "deleteText": "Are you sure you want to delete this template?",
    "item": {
      "weight": "weight",
      "height": "height",
      "width": "width",
      "depth": "depth"
    },
    "form": {
      "weight": "Weight (kg)",
      "height": "Height (cm)",
      "width": "Width (cm)",
      "depth": "Depth (cm)"
    },
    "alerts": {
      "deleted": "Package template has been deleted.",
      "created": "Package template has been added.",
      "updated": "Package template has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import { PackageTemplate } from '@/interfaces/PackageTemplate'

const CLEAR_PACKAGE_TEMPALTE: PackageTemplate = {
  id: '',
  name: '',
  width: 0,
  height: 0,
  depth: 0,
  weight: 0,
  metadata: {},
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
    MetadataForm,
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
    editedItem: clone(CLEAR_PACKAGE_TEMPALTE),
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Packages.Edit : this.$p.Packages.Add)
    },
  },
  methods: {
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.packageTemplates.getFromListById(id)
        this.editedItem = clone(item)
      } else {
        this.editedItem = clone(CLEAR_PACKAGE_TEMPALTE)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        // Metadata can be saved only after package template is created
        await this.saveMetadata(this.editedItem.id)

        await this.$accessor.packageTemplates.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })

        this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        await this.$accessor.packageTemplates.add(this.editedItem)

        this.$toast.success(this.$t('alerts.created') as string)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.packageTemplates.remove(this.editedItem.id)

      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>
