<template>
  <LayoutAccordion :title="$t('title')">
    <div class="additional-descriptions">
      <icon-button
        class="additional-descriptions__btn"
        size="small"
        :disabled="disabled"
        @click="openAddModal"
      >
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addTitle') }}
      </icon-button>

      <Empty v-if="descriptions.length === 0" class="additional-descriptions__empty">
        {{ $t('emptyText') }}
      </Empty>

      <div class="additional-descriptions__content">
        <editable-list-item
          v-for="page in descriptions"
          :key="page.id"
          :item="page"
          :disabled="disabled"
          :delete-text="$t('deleteText')"
          @edit="openEditModal"
          @remove="removePage"
        >
          {{ page.name }}
        </editable-list-item>
      </div>

      <a-modal
        v-model="isModalOpen"
        width="800px"
        :title="selectedPageId !== 'new' ? $t('editTitle') : $t('addTitle')"
        :footer="null"
      >
        <SimplePageForm
          :key="selectedPageId"
          :page-id="selectedPageId"
          :slug-prefix="product.id"
          @created="onCreated"
          @updated="onUpdated"
        />
      </a-modal>
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Additional descriptions",
    "addTitle": "Add description",
    "editTitle": "Edit description",
    "deleteText": "Are you sure you want to delete this attachment?",
    "onDeletedText": "Description has been deleted",
    "onCreatedText": "Description has been created and added to product",
    "onUpdatedText": "Description has been updated",
    "emptyText": "No additional descriptions added yet"
  },
  "pl": {
    "title": "Dodatkowe opisy",
    "addTitle": "Dodaj opis",
    "editTitle": "Edytuj opis",
    "deleteText": "Czy na pewno chcesz usunąć ten opis?",
    "onDeletedText": "Opis został usunięty",
    "onCreatedText": "Opis został dodany do produktu",
    "onUpdatedText": "Opis został zaktualizowany",
    "emptyText": "Brak dodatkowych opisów"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PageList, Product } from '@heseya/store-core'

import LayoutAccordion from '@/components/layout/Accordion.vue'
import SimplePageForm from './Form.vue'

import Empty from '@/components/layout/Empty.vue'
import EditableListItem from '@/components/layout/EditableListItem.vue'

export default defineComponent({
  components: { LayoutAccordion, Empty, SimplePageForm, EditableListItem },

  props: {
    value: {
      type: Array as PropType<PageList[]>,
      required: true,
    },
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isModalOpen: false,
    selectedPageId: 'new',
  }),

  computed: {
    descriptions: {
      get(): PageList[] {
        return this.value
      },
      set(value: PageList[]) {
        this.$emit('input', value)
      },
    },
  },

  methods: {
    openAddModal() {
      this.isModalOpen = true
      this.selectedPageId = 'new'
    },
    openEditModal(page: PageList) {
      //   this.isModalOpen = true
      //   this.selectedPageId = page.id
      // TODO: temporary fix, because of bug in rich editor
      window.open(`/pages/${page.id}`, '_blank')?.focus()
    },

    removePage(page: PageList) {
      // Remove page in API? Or just remove from list? User does not confirmed this deletion...
      this.descriptions = this.descriptions.filter((item) => item.id !== page.id)
      this.$toast.success(this.$t('onDeletedText') as string)
    },
    onCreated(page: PageList) {
      this.descriptions = [...this.descriptions, page]
      this.isModalOpen = false
      this.$toast.success(this.$t('onCreatedText') as string)
    },
    onUpdated(page: PageList) {
      this.descriptions = this.descriptions.map((item) => (item.id === page.id ? page : item))
      this.isModalOpen = false
      this.$toast.success(this.$t('onUpdatedText') as string)
    },
  },
})
</script>

<style lang="scss" scoped>
.additional-descriptions {
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  &__btn {
    margin-left: auto;
    margin-bottom: 8px;
  }
}
</style>
