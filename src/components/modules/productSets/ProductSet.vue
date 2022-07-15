<template>
  <div
    class="product-set"
    :class="{ 'product-set--searched': asSearched }"
    @click.stop="toggleChildrenVisibility"
  >
    <div class="product-set__content">
      <i class="bx bx-move-vertical handle"></i>

      <icon-button type="transparent" size="small" :disabled="!childrenQuantity">
        <template #icon>
          <i v-if="areChildrenVisible" class="bx bx-minus"></i>
          <i v-else class="bx bx-plus"></i>
        </template>
      </icon-button>

      <loading :active="isLoading" />

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
      <div class="product-set__search" @click.stop>
        <app-input
          v-if="searchable"
          v-model="searchPhrase"
          type="search"
          :placeholder="$t('search.placeholder')"
          allow-clear
          @input="searchForChildren"
        ></app-input>
      </div>

      <div
        v-show="searchPhrase.length > 2"
        class="search-results"
        :class="{
          'search-results--success': searchedChildren.length,
          'search-results--error': isSearchError,
        }"
      >
        <loading v-if="isSearching" :active="isSearching" :size="16" />
        <p v-else-if="searchingError" class="search-results__description">
          {{ $t('search.error') }}
        </p>
        <p v-else-if="searchedChildren.length" class="search-results__description">
          <span class="search-results__info"
            >{{
              $t('search.found', {
                positions: String(totalSearchedResults),
                phrase: searchedPhrase,
              })
            }}
          </span>
          <span v-if="totalSearchedResults >= searchedDisplayLimit" class="search-results__info"
            ><b>{{
              $t('search.display', {
                positions: String(searchedDisplayLimit),
              })
            }}</b>
          </span>
          <span
            v-if="totalSearchedResults > searchedDisplayLimit"
            class="search-results__info search-results__info--last"
          >
            {{ $t('search.specify') }}
          </span>
        </p>
        <p v-else-if="isSearchError" class="search-results__description">
          {{ $t('search.didNotFound', { phrase: searchedPhrase }) }}
        </p>
      </div>

      <div v-if="searchedChildren.length">
        <product-set
          v-for="child in searchedChildren"
          :key="child.id"
          :set="{ ...child, parent: set }"
          as-searched
          @update-parent="updateChild"
          @delete-child="deleteChild"
        />
      </div>

      <Draggable v-model="children" handle=".handle" @change="onDrop">
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

    <ProductSetForm
      v-if="isFormModalActive"
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
    "search": {
      "placeholder": "Wyszukaj (min. 3 znaki)",
      "found": "Znaleziono {positions} pozycji z frazą '{phrase}'",
      "didNotFound": "Nie znaleziono pozycji dla '{phrase}'",
      "error": "Podczas pobierania danych wystąpił błąd",
      "display": "Wyświetlonych pozycji: {positions}",
      "specify": "Aby uzyskać dokładniejsze wyniki, sprecyzuj swoje zapytanie"
    },
    "collection": "Kolekcja",
    "deleteText": "Czy na pewno chcesz usunąć tę kolekcję? Wraz z nią usuniesz wszystkie jej subkolekcje!",
    "deleteSuccess": "Kolekcja została usunięta",
    "fetchMore": "Wczytaj więcej"
  },
  "en": {
    "menu": {
      "addSubset": "Add subset",
      "edit": "Edit collection",
      "editParent": "Change parent collection",
      "delete": "Delete collection",
      "showProducts": "Show products in collection"
    },
    "search": {
      "placeholder": "Search (min. 3 letters)",
      "found": "Found {positions} positions with phrase '{phrase}'",
      "didNotFound": "Did not found positions for '{phrase}'",
      "error": "An error occurred while downloading a data",
      "display": "Positions displayed: {positions}",
      "specify": "For more accurate results, please refine your query"
    },
    "collection": "Collection",
    "deleteText": "Are you sure you want to delete this collection? All subcollections will be deleted as well!",
    "deleteSuccess": "Collection has been deleted",
    "fetchMore": "Fetch more"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'
import { cloneDeep, debounce } from 'lodash'
import { ProductSet, ProductSetUpdateDto, HeseyaPaginatedResponseMeta } from '@heseya/store-core'
import { api } from '@/api'

import Loading from '@/components/layout/Loading.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ProductSetForm, { CLEAR_PRODUCT_SET_FORM } from '@/components/modules/productSets/Form.vue'
import SetProductsList from '@/components/modules/productSets/SetProductsList.vue'
import ChangeParentForm from '@/components/modules/productSets/ParentForm.vue'

import { UUID } from '@/interfaces/UUID'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  name: 'ProductSet',
  components: { Draggable, PopConfirm, ProductSetForm, SetProductsList, ChangeParentForm, Loading },
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
    children: [] as ProductSet[],
    searchedChildren: [] as ProductSet[],
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
    isSearchError(): boolean {
      if (Number.isInteger(this.totalSearchedResults))
        return !this.totalSearchedResults || this.searchingError
      return false
    },
    areMoreChildren(): boolean {
      return this.children.length < this.childrenQuantity
    },
    // TODO: That's probably should be deleted
    isFetchAllChildren(): boolean {
      return this.$accessor.env.autoload_all_product_set_children === '1'
    },
    uniqueChildren: {
      get(): ProductSet[] {
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
    searchForChildren: debounce(function (this: any) {
      this.searchingError = false
      if (this.searchPhrase.length > 2) {
        this.fetchBySearch(this.set.id, this.searchPhrase)
        return
      }
      this.totalSearchedResults = null
      this.searchedChildren = []
    }, 500),
    createSuccess(set: ProductSet) {
      if (this.children.length) {
        this.children.push({ ...set, children_ids: [] })
      }
      this.childrenQuantity++
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
          const { data: subcollections } = await this.fetchByParentId(
            this.set.id,
            this.limit,
            this.page - 1,
          )
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
      const { data: res } = await api.get<{
        data: ProductSet[]
        meta: HeseyaPaginatedResponseMeta
      }>(`/product-sets?parent_id=${parentId}&page=${page}&tree=0&limit=${limit}`)
      return res
    },
    async fetchBySearch(parentId: UUID, search: string) {
      this.isSearching = true
      try {
        this.searchedPhrase = this.searchPhrase
        const { data: res } = await api.get<{
          data: ProductSet[]
          meta: HeseyaPaginatedResponseMeta
        }>(`/product-sets?parent_id=${parentId}&search=${search}`)

        this.searchedChildren = res.data
        this.totalSearchedResults = res.meta.total
        this.searchedDisplayLimit = res.meta.per_page
      } catch (e: any) {
        this.searchedPhrase = ''
        this.searchingError = true
        this.isSearching = false
        this.totalSearchedResults = null
        this.$toast.error(formatApiNotificationError(e))
      }
      this.isSearching = false
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
  transition: 0.3s;

  &--searched {
    background-color: $green-color-200;
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

  .handle {
    cursor: grab;
  }
}

.search-results {
  min-height: 53px;
  position: relative;
  padding: 16px;
  text-align: center;
  margin-bottom: 8px;

  &--success {
    background-color: $green-color-200;
  }

  &--error {
    background-color: $red-color-400;
    color: white;
  }

  &__description {
    font-size: 13px;
    text-align: left;
  }

  &__info {
    display: block;

    &--last {
      margin-top: 8px;
    }
  }

  p {
    margin: 0;
  }
}
</style>
