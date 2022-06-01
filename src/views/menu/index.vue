<template>
  <div>
    <top-nav :title="$t('title')" />
    <div class="menu">
      <draggable
        class="dragArea list-group"
        handle=".draggable"
        :list="menu"
        :group="{ name: 'menu-items' }"
      >
        <div v-for="item in menu" :key="item.id">
          <list-item :key="item.id" :class="{ draggable: !item.permanent }">
            <template #avatar>
              <InlineSvg
                v-if="item.image"
                class="nav-link-img"
                :src="require(`@/assets/images/${item.image}`)"
              />
              <i v-else :class="item.icon"></i>
            </template>
            {{ $t(item.label) }}
          </list-item>
        </div>
      </draggable>
      <div class="col-3">
        <draggable class="dragArea list-group" :list="items" :group="{ name: 'menu-items' }">
          <div v-for="item in items" :key="item.id">
            <list-item :key="item.id">
              <template #avatar>
                <InlineSvg
                  v-if="item.image"
                  class="nav-link-img"
                  :src="require(`@/assets/images/${item.image}`)"
                />
                <i v-else :class="item.icon"></i>
              </template>
              {{ $t(item.label) }}
            </list-item>
          </div>
        </draggable>
      </div>
    </div>
    <app-button @click="changeMenu">
      {{ $t('common.save') }}
    </app-button>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Edycja menu",
    "success": "Zapisano menu"
  },
  "en": {
    "title": "Edit menu",
    "success": "Menu has been changed"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import InlineSvg from 'vue-inline-svg'
import Draggable from 'vuedraggable'
import TopNav from '@/components/layout/TopNav.vue'

import ListItem from '@/components/layout/ListItem.vue'

import { MenuItem, MENU_ITEMS, DEFAULT_MENU_ITEMS, AVAILABLE_MENU_ITEMS } from '@/consts/menuItems'

interface IMenuItem {
  exact?: boolean
  icon: string
  label: string
  to: string
  image?: string
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    TopNav,
    Draggable,
    InlineSvg,
    ListItem,
  },
  data: () => ({
    menu: [...DEFAULT_MENU_ITEMS],
    items: [...AVAILABLE_MENU_ITEMS],
  }),
  computed: {
    MENU_ITEMS(): MenuItem[] {
      return MENU_ITEMS
    },
  },
  created() {
    const savedMenu = JSON.parse(window.localStorage.getItem('menu') || '[]')
    const savedItems = JSON.parse(window.localStorage.getItem('items') || '[]')
    if (savedMenu.length) this.menu = [...savedMenu]
    if (savedItems.length) this.items = [...savedItems]
  },
  methods: {
    changeMenu() {
      // @ts-ignore
      window.localStorage.setItem('menu', JSON.stringify(this.menu))
      window.localStorage.setItem('items', JSON.stringify(this.items))
      window.dispatchEvent(
        new CustomEvent('menu-localstorage-changed', {
          detail: {
            storage: localStorage.getItem('menu'),
          },
        }),
      )
      this.$toast.success(this.$t('success') as string)
    },
  },
})
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  div {
    width: 50%;
  }
}
</style>
