<template>
  <div class="product-set" @click.stop="toggleChildrenVisibility">
    <div class="product-set__content">
      <icon-button type="transparent" size="small" :disabled="!childrenQuantity">
        <template #icon>
          <i v-if="areChildrenVisible" class="bx bx-minus"></i>
          <i v-else class="bx bx-plus"></i>
        </template>
      </icon-button>

      <span class="product-set__name">
        <i v-if="!set.public" class="product-set__hidden-icon bx bx-low-vision"></i>
        {{ set.name }} <small>(/{{ set.slug }})</small>
      </span>

      <div class="product-set__actions">
        <a-dropdown
          v-can.any="[$p.ProductSets.ShowDetails, $p.ProductSets.Add]"
          :trigger="['click']"
        >
          <icon-button type="transparent" size="small" @click.stop>
            <template #icon>
              <i class="bx bx-menu"></i>
            </template>
          </icon-button>

          <template #overlay>
            <a-menu>
              <a-menu-item v-can="$p.ProductSets.Add" @click="createProductSet">
                <i class="bx bx-plus"></i> &nbsp; {{ $t('menu.addSubset') }}
              </a-menu-item>
              <a-menu-item v-can="$p.ProductSets.ShowDetails" @click="showSetProducts">
                <i class="bx bx-customize"></i> &nbsp; {{ $t('menu.showProducts') }}
              </a-menu-item>
              <a-menu-item v-can="$p.ProductSets.ShowDetails" @click="editProductSet">
                <i class="bx bx-edit"></i> &nbsp; {{ $t('menu.edit') }}
              </a-menu-item>
              <a-menu-item v-can="$p.ProductSets.Edit" @click="changeParent">
                <i class="bx bx-move-vertical"></i> &nbsp; {{ $t('menu.editParent') }}
              </a-menu-item>
              <a-menu-item v-can="$p.ProductSets.Remove">
                <pop-confirm
                  :title="`${$t('collection')}: ${set.name}. ${$t('deleteText')}`"
                  :ok-text="$t('common.delete')"
                  :cancel-text="$t('common.cancel')"
                  placement="bottom"
                  @confirm="deleteCollection"
                >
                  <i class="bx bx-trash"></i> &nbsp; {{ $t('menu.delete') }}
                </pop-confirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <div v-show="areChildrenVisible" class="product-set__children">
      <Draggable v-model="children" @change="onDrop">
        <product-set
          v-for="child in children"
          :key="child.id"
          :set="{ ...child, parent: set }"
          @update-parent="updateChild"
          @delete-child="deleteChild"
        />
      </Draggable>
      <div v-if="areMoreChildren" class="product-set__fetch">
        <icon-button @click.stop="fetchChildren">
          <template #icon>
            <i class="bx bx-chevron-down"></i>
          </template>
          {{ $t('fetchMore') }}
        </icon-button>
      </div>
    </div>

    <ProductSetForm
      :value="editedItem"
      :slug-prefix="editedItemSlugPrefix"
      :is-open="isFormModalActive"
      :disabled="!$can(editedItem.id ? $p.ProductSets.Edit : $p.ProductSets.Add)"
      :deletable="$can($p.ProductSets.Remove)"
      @create-success="createSuccess"
      @edit-success="editSuccess"
      @delete-success="deleteSuccess"
      @close="isFormModalActive = false"
    />
    <SetProductsList :set="selectedSet" :is-open="!!selectedSet" @close="selectedSet = null" />
    <ChangeParentForm
      v-if="!!selectedChildren"
      :set="selectedChildren"
      :is-open="!!selectedChildren"
      @close="selectedChildren = null"
      @delete="deleteSuccess"
    />
  </div>
</template>

<i18n>
{
  "pl": {
    "menu": {
      "addSubset": "Dodaj subkolekcję",
      "edit": "Edytuj kolekcję",
      "editParent": "Zmień nadrzędną kolekcję",
      "delete": "Usuń kolekcję",
      "showProducts": "Zobacz produkty w kolekcji"
    },
     "collection": "Kolekcja",
     "deleteText": "Czy na pewno chcesz usunąć tę kolekcję? Wraz z nią usuniesz wszystkie jej subkolekcje!",
     "deleteSuccess": "Kolekcja została usunięta",
     "fetchMore":"Wczytaj więcej"


  },
  "en": {
    "menu": {
      "addSubset": "Add subset",
      "edit": "Edit collection",
      "editParent": "Change parent collection",
      "delete": "Delete collection",
      "showProducts": "Show products in collection"
    },
    "collection": "Collection",
    "deleteText": "Are you sure you want to delete this collection? All subcollections will be deleted as well!",
    "deleteSuccess": "Collection has been deleted",
    "fetchMore":"Fetch more"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import { api } from '@/api'

import PopConfirm from '@/components/layout/PopConfirm.vue'
import ProductSetForm, { CLEAR_PRODUCT_SET_FORM } from '@/components/modules/productSets/Form.vue'
import SetProductsList from '@/components/modules/productSets/SetProductsList.vue'
import ChangeParentForm from '@/components/modules/productSets/ParentForm.vue'

import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'
import { UUID } from '@/interfaces/UUID'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  name: 'ProductSet',
  components: { Draggable, PopConfirm, ProductSetForm, SetProductsList, ChangeParentForm },
  props: {
    set: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSet>,
  },
  data: () => ({
    childrenQuantity: 0,
    page: 1,
    limit: 50,
    children: [] as ProductSet[],
    selectedSet: null as null | ProductSet,
    selectedChildren: null as null | ProductSet,
    editedItem: cloneDeep(CLEAR_PRODUCT_SET_FORM) as ProductSetDTO,
    editedItemSlugPrefix: '',
    areChildrenVisible: false,
    isFormModalActive: false,
  }),
  computed: {
    areMoreChildren(): boolean {
      return this.children.length < this.childrenQuantity
    },
  },
  created() {
    this.childrenQuantity = this.set.children_ids.length
  },
  methods: {
    createSuccess(set: ProductSet) {
      if (this.children.length) {
        this.children.push({ ...set, children_ids: [] })
        this.childrenQuantity++
      }
    },
    editSuccess(set: ProductSet) {
      this.$emit('update-parent', set)
    },
    deleteSuccess(setId: UUID) {
      this.$emit('delete-child', setId)
    },

    updateChild(set: ProductSet) {
      const updatedIndex = this.children.findIndex((child) => child.id === set.id)
      this.children.splice(updatedIndex, 1, { ...set, children_ids: [] })
    },
    async deleteChild(setId: UUID) {
      this.children = this.children.filter((child) => child.id !== setId)
      this.childrenQuantity--

      //Load additional child in place of the deleted one
      if (this.areMoreChildren) {
        this.$accessor.stopLoading()
        try {
          const subcollections = await this.fetchByParentId(this.set.id, this.limit, this.page - 1)
          this.children.push(subcollections.pop() as ProductSet)
        } catch (error: any) {}
        this.$accessor.stopLoading()
      }
    },
    async onDrop() {
      this.$accessor.startLoading()
      // @ts-ignore // TODO: fix extended store actions typings
      await this.$accessor.productSets.reorderChildren({
        parentId: this.set.id,
        ids: this.children.map((i) => i.id),
      })
      this.$accessor.stopLoading()
    },
    async toggleChildrenVisibility() {
      if (this.childrenQuantity && !this.children.length) {
        await this.fetchChildren()
      }
      if (this.children.length) this.areChildrenVisible = !this.areChildrenVisible
    },
    async fetchChildren() {
      this.$accessor.stopLoading()
      try {
        const subcollections = await this.fetchByParentId(this.set.id, this.limit, this.page)
        this.children = [...this.children, ...subcollections]
        this.page++
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },
    async fetchByParentId(parentId: UUID, limit: number, page: number) {
      const {
        data: { data: subcollections },
      } = await api.get<{ data: ProductSet[] }>(
        `/product-sets?parent_id=${parentId}&limit=${limit}&page=${page}&tree=0`,
      )
      return subcollections
    },
    async deleteCollection() {
      this.$accessor.startLoading()
      try {
        await this.$accessor.productSets.remove(this.set.id)
        this.$toast.success(this.$t('deleteSuccess') as string)
        this.$emit('delete-child', this.set.id)
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      }

      this.$accessor.stopLoading()
    },
    editProductSet() {
      this.editedItem = {
        ...cloneDeep(this.set),
        parent_id: this.set.parent?.id || null,
        attributes: this.set.attributes?.map((attr) => attr.id) || [],
      }
      this.editedItemSlugPrefix = this.set.parent?.slug || ''
      this.isFormModalActive = true
    },
    createProductSet() {
      this.editedItem = {
        ...cloneDeep(CLEAR_PRODUCT_SET_FORM),
        parent_id: this.set?.id || null,
      }
      this.editedItemSlugPrefix = this.set?.slug || ''
      this.$nextTick(() => {
        this.isFormModalActive = true
      })
    },
    showSetProducts() {
      this.selectedSet = this.set
    },
    changeParent() {
      this.selectedChildren = this.set
    },
  },
})
</script>

<style lang="scss">
.product-set {
  cursor: default;
  border-radius: 0;
  padding: 2px 8px;
  padding-right: 0;
  border-bottom: solid 1px $background-color-700;
  cursor: grab;
  transition: 0.3s;

  &.sortable-chosen,
  &:hover {
    background-color: $background-color-500;
  }

  &__hidden-icon {
    font-size: 0.7em;
  }

  &:last-of-type {
    border-bottom: none;
  }

  &__content {
    display: flex;
    align-items: center;
  }

  &__name {
    font-weight: 600;

    small {
      font-weight: 400;
    }
  }

  &__actions {
    display: flex;
    align-items: flex-start;
    margin-left: 24px;
    margin-left: auto;
  }

  .list-item__action {
    align-self: flex-start;
  }
  .list-item__content {
    width: 100% !important;
  }

  &__children {
    padding-left: 12px;
  }
  &__fetch {
    display: flex;
    justify-content: center;
    padding: 0.5em 0;
  }
}
</style>
