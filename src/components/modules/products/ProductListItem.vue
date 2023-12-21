<template>
  <cms-table-row
    class="product-list-item"
    :item="product"
    :headers="table.headers"
    :to="`products/${product.id}`"
  >
    <template #cover>
      <avatar color="#eee">
        <media-element v-if="product.cover" :media="product.cover" :size="100" />
        <i v-else class="product-list-item__img-icon bx bx-image"></i>
      </avatar>
    </template>

    <template #name>
      <b>{{ product.name }}</b>
    </template>

    <template #price>
      <ProductPrice class="product-list-item__price" :product="product" />
    </template>

    <template #tags>
      <div class="product-list-item__tags">
        <tag v-for="tag in product.tags" :key="tag.id" small :color="`#${tag.color}`">
          {{ tag.name }}
        </tag>
        <span v-if="product.tags.length === 0">-</span>
      </div>
    </template>

    <template #public>
      <switch-input
        :value="product.public"
        class="product-list-item__visibility"
        :loading="publicIsLoading"
        @input="changeVisibility"
      />
    </template>

    <template #action>
      <a-dropdown v-can.any="[$p.ProductSets.ShowDetails, $p.ProductSets.Add]" :trigger="['click']">
        <icon-button type="transparent" size="big" @click.stop>
          <template #icon>
            <i class="bx bx-dots-vertical-rounded"></i>
          </template>
        </icon-button>

        <template #overlay>
          <a-menu v-can.any="[$p.Products.Edit, $p.Products.Remove]">
            <a-menu-item v-can="$p.Products.Edit" @click="$router.push(`products/${product.id}`)">
              <i class="bx bx-edit"></i> &nbsp; {{ $t('common.edit') }}
            </a-menu-item>
            <a-menu-item v-can="$p.Products.Remove">
              <pop-confirm
                :ok-text="$t('common.delete').toString()"
                :cancel-text="$t('common.cancel').toString()"
                placement="bottom"
                @confirm="deleteProduct"
              >
                <template #title>
                  {{ $t('confirmDelete') }}: <b>{{ product.name }}</b>
                  ?
                </template>
                <i class="bx bx-trash"></i> &nbsp; {{ $t('common.delete') }}
              </pop-confirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </cms-table-row>
</template>

<i18n lang="json">
{
  "en": {
    "confirmDelete": "Are you sure you want to delete product"
  },
  "pl": {
    "confirmDelete": "Czy na pewno chcesz usunąć produkt"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@heseya/store-core'

import Avatar from '@/components/layout/Avatar.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import MediaElement from '@/components/MediaElement.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ProductPrice from './ProductPrice.vue'

import { TableConfig } from '@/interfaces/CmsTable'
import { FEATURE_FLAGS } from '@/consts/featureFlags'

export default defineComponent({
  components: { Avatar, CmsTableRow, MediaElement, ProductPrice, PopConfirm },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
    table: {
      type: Object as PropType<TableConfig<Product>>,
      required: true,
    },
  },
  data: () => ({ publicIsLoading: false }),
  computed: {
    objectFit(): string {
      return +this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover'
    },
  },
  mounted() {
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
  },
  methods: {
    async changeVisibility(isPublic: boolean) {
      this.publicIsLoading = true
      await this.$accessor.products.update({ id: this.product.id, item: { public: isPublic } })
      this.publicIsLoading = false
    },
    async deleteProduct() {
      this.$accessor.startLoading()
      await this.$accessor.products.remove(this.product.id)
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss">
.product-list-item {
  position: relative;

  .cms-table-row__col:first-of-type,
  .cms-table-row__col:last-of-type {
    padding: 6px;
  }

  &__icon {
    position: absolute;
    top: 8px;
    left: 8px;

    i {
      font-size: 0.9em;
    }
  }

  &__img-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: var(--gray-color-500);

    &::after {
      content: '';
      display: block;
      width: 120%;
      height: 2px;
      background-color: firebrick;
      position: absolute;
      top: 50%;
      left: -10%;
      transform: rotate(-45deg);
    }
  }

  &__tags {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  &__visibility {
    align-items: start;
  }
}
</style>
