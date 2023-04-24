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
          @delete="removePage"
        >
          {{ page.name }}
        </editable-list-item>
      </div>
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
import Vue from 'vue'
import LayoutAccordion from '@/components/layout/Accordion.vue'
import { PageList, Product } from '@heseya/store-core'
import { UUID } from '@heseya/store-core/dist/src/interfaces/UUID'
import Empty from '@/components/layout/Empty.vue'

export default Vue.extend({
  components: { LayoutAccordion, Empty },

  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<PageList[]>,
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Product>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isModalOpen: false,
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
      // TODO
    },
    openEditModal(page: PageList) {
      console.log('🚀 ~ file: AdditionalDescriptions.vue:107 ~ openEditModal ~ page:', page)
      // TODO
    },
    removePage(pageId: UUID) {
      this.descriptions = this.descriptions.filter((item) => item.id !== pageId)
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
