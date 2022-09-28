<template>
  <div
    class="product-set"
    :class="{ 'product-set--searched': asSearched }"
    @click.stop="toggleChildrenVisibility"
  >
    <icon-button class="product-set__reorder reorder-handle" size="small" type="transparent">
      <template #icon> <i class="bx bx-menu"></i> </template>
    </icon-button>

    <div class="product-set__expandable">
      <icon-button
        :type="areChildrenVisible && childrenQuantity ? 'burgund' : 'primary'"
        size="small"
        :disabled="!childrenQuantity"
      >
        <template #icon>
          <i
            v-if="areChildrenVisible && childrenQuantity"
            class="bx bx-chevron-down product-set__down"
          ></i>
          <i v-else class="bx bx-chevron-right"></i>
        </template>
      </icon-button>
      <div v-if="areChildrenVisible && childrenQuantity" class="product-set__line"></div>
    </div>
    <div class="product-set__container">
      <div class="product-set__content">
        <loading :active="isLoading" />

        <span class="product-set__name">
          {{ set.name }} <small>/{{ set.slug }}</small>
        </span>

        <div class="product-set__actions">
          <div class="product-set__visibility">
            <span v-if="set.public" class="product-set__public product-set__public--visible">
              <i class="bx bx-show-alt"></i>
              <span class="product-set__public_text">{{ $t('visible') }}</span>
            </span>
            <span v-else class="product-set__public">
              <i class="bx bx-low-vision"></i>
              <span class="product-set__public_text">{{ $t('hidden') }}</span>
            </span>
          </div>
          <a-dropdown
            v-can.any="[$p.ProductSets.ShowDetails, $p.ProductSets.Add]"
            :trigger="['click']"
          >
            <icon-button type="transparent" size="small" @click.stop>
              <template #icon>
                <i class="bx bx-dots-vertical-rounded"></i>
              </template>
            </icon-button>

            <template #overlay>
              <a-menu>
                <a-menu-item v-can="$p.ProductSets.Add">
                  <router-link :to="`/collections/create?parentId=${set.id}`">
                    <i class="bx bx-plus"></i> &nbsp; {{ $t('menu.addSubset') }}
                  </router-link>
                </a-menu-item>
                <a-menu-item v-can="$p.ProductSets.ShowDetails" @click="showSetProducts">
                  <i class="bx bx-customize"></i> &nbsp; {{ $t('menu.showProducts') }}
                </a-menu-item>
                <a-menu-item v-can="$p.ProductSets.ShowDetails">
                  <router-link :to="`/collections/${set.id}`">
                    <i class="bx bx-edit"></i> &nbsp; {{ $t('menu.edit') }}
                  </router-link>
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

      <div v-show="areChildrenVisible">
        <Draggable v-model="children" handle=".reorder-handle" @change="onDrop">
          <product-set
            v-for="child in uniqueChildren"
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
    </div>

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

<i18n lang="json">
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
    "fetchMore": "Wczytaj więcej",
    "visible": "Widoczna",
    "hidden": "Ukryta"
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
    "fetchMore": "Fetch more",
    "visible": "Visible",
    "hidden": "Hidden"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import { ProductSet, ProductSetUpdateDto, ProductSetList } from '@heseya/store-core'
import { sdk } from '@/api'

import Loading from '@/components/layout/Loading.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SetProductsList from '@/components/modules/productSets/SetProductsList.vue'
import ChangeParentForm from '@/components/modules/productSets/ParentForm.vue'
import { CLEAR_PRODUCT_SET_FORM } from '@/views/productSets/View.vue'

import { UUID } from '@/interfaces/UUID'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  name: 'ProductSet',
  components: { Draggable, PopConfirm, SetProductsList, ChangeParentForm, Loading },
  props: {
    set: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSet>,
    searchable: {
      type: Boolean,
      required: false,
      default: true,
    },
    asSearched: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    childrenQuantity: 0,
    page: 1,
    limit: 50,
    children: [] as ProductSetList[],
    searchedChildren: [] as ProductSetList[],
    selectedSet: null as null | ProductSet,
    selectedChildren: null as null | ProductSet,
    editedItem: cloneDeep(CLEAR_PRODUCT_SET_FORM) as ProductSetUpdateDto,
    editedItemSlugPrefix: '' as string,
    areChildrenVisible: false,
    isFormModalActive: false,
    isLoading: false,
    isSearching: false,
    searchingError: false,
    searchPhrase: '' as string,
    searchedDisplayLimit: 24,
    searchedPhrase: '' as string,
    totalSearchedResults: null as null | number,
  }),
  computed: {
    areMoreChildren(): boolean {
      return this.children.length < this.childrenQuantity
    },
    uniqueChildren: {
      get(): ProductSetList[] {
        if (!this.searchedChildren.length) {
          return this.children
        }
        return this.children.filter(
          ({ id: childId }) => !this.searchedChildren.find(({ id }) => id === childId),
        )
      },
    },
  },
  created() {
    this.childrenQuantity = this.set.children_ids?.length || 0
  },
  methods: {
    deleteSuccess(setId: UUID) {
      this.$emit('delete-child', setId)
    },

    updateChild(set: ProductSetList) {
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
          const { data: subcollections } = await this.fetchByParentId(
            this.set.id,
            this.limit,
            this.page - 1,
          )
          this.children.push(subcollections.pop() as ProductSetList)
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
      this.isLoading = true
      try {
        const { data: subcollections } = await this.fetchByParentId(
          this.set.id,
          this.limit,
          this.page,
        )
        this.children = [...this.children, ...subcollections]
        this.page++
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
      this.isLoading = false
    },
    async fetchByParentId(parentId: UUID, limit: number, page: number) {
      const list = await sdk.ProductSets.get({
        parent_id: parentId,
        page,
        limit,
        tree: false,
      })
      return list
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
  display: flex;
  padding: 6px 8px;
  padding-right: 0;
  border-bottom: solid 1px $background-color-700;
  transition: 0.3s;

  &--searched {
    background-color: $green-color-200;
  }

  &__reorder {
    align-self: flex-start;
    color: $gray-color-500;
    cursor: move;
  }

  &__search {
    .app-input {
      padding-right: 20px;
    }
  }

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

  &__expandable {
    width: 30px;
  }

  &__line {
    background-color: #f7eff0;
    border-radius: 20px;
    width: 4px;
    height: calc(100% - 30px);
    margin: 0 auto;
    transform: translateY(-3px);
  }

  &__container {
    width: calc(100% - 30px);
  }

  &__content {
    display: flex;
    align-items: center;
  }

  &__name {
    font-weight: 600;
    padding-left: 0.8em;

    small {
      font-weight: 400;
      color: $gray-color-500;
      margin-left: 5px;
    }
  }

  &__visibility {
    display: flex;
    align-items: center;
    margin: auto 0;

    @media ($viewport-7) {
      width: 90px;
    }
  }

  &__public {
    border-radius: 25px;
    padding: 0.2em 1em;
    color: $gray-color-500;
    display: flex;
    font-size: 11px;
    align-items: center;
    gap: 5px;
    margin: auto 0;

    &--visible {
      background: #e6fbe6 0% 0% no-repeat padding-box;
      color: #10d310;
    }
  }

  &__public_text {
    display: none;
    @media ($viewport-7) {
      display: inline;
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

  &__fetch {
    display: flex;
    justify-content: center;
    padding: 0.5em 0;
  }

  .handle {
    cursor: grab;
  }
}
</style>
