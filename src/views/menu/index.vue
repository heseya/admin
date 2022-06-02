<template>
  <div>
    <top-nav :title="$t('title')" />
    <card>
      <a-alert type="info" show-icon>
        <template #message>
          <span v-html="$t('info')"></span>
        </template>
      </a-alert>
      <div class="menu-items">
        <div class="menu-items__container">
          <legend class="menu-items__title">
            {{ $t('options') }}
          </legend>
          <draggable
            class="dragArea list-group menu-items__inactive"
            :list="items"
            :group="{ name: 'menu-items' }"
          >
            <div v-for="item in items" :key="item.id">
              <list-item :key="item.id">
                <template #avatar>
                  <InlineSvg
                    v-if="item.predefinedIcon"
                    :src="require(`@/assets/images/${item.predefinedIcon}`)"
                  />
                  <i v-else :class="item.icon"></i>
                </template>
                {{ $t(item.label) }}
              </list-item>
            </div>
          </draggable>
        </div>
        <div class="menu-items__container">
          <legend class="menu-items__title">
            {{ $t('menu') }}
          </legend>
          <draggable
            class="dragArea list-group menu-items__active"
            handle=".draggable"
            :list="menu"
            :group="{ name: 'menu-items' }"
          >
            <div v-for="item in menu" :key="item.id">
              <list-item :key="item.id" :class="{ draggable: !item.disabled }">
                <template #avatar>
                  <InlineSvg
                    v-if="item.predefinedIcon"
                    :src="require(`@/assets/images/${item.predefinedIcon}`)"
                  />
                  <i v-else :class="item.icon"></i>
                </template>
                {{ $t(item.label) }}
                <template #action>
                  <i class="bx bx-menu"></i>
                </template>
              </list-item>
            </div>
          </draggable>
        </div>
      </div>
      <hr />
      <app-button @click="saveMenu">
        {{ $t('common.save') }}
      </app-button>
    </card>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Edycja menu",
    "menu": "Menu",
    "options":"Dostępne zakładki",
    "success": "Menu zostało zmienione",

    "info": "Tutaj możesz edytować swoje menu. Zakładki: <b>Dashboard</b>, <b>Zamówienia</b> oraz <b>Ustawienia</b> jako jedyne nie mogą zostać z niego usunięte."
  },
  "en": {
    "title": "Edit menu",
    "menu": "Menu",
    "options":"Available tabs",
    "success": "Menu has been changed",
    "info": "You can customize your menu. The tabs: <b>Dashboard</b>, <b>Orders</b> and <b>Settings</b> cannot be modified."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import InlineSvg from 'vue-inline-svg'
import Draggable from 'vuedraggable'

import Card from '@/components/layout/Card.vue'
import TopNav from '@/components/layout/TopNav.vue'

import ListItem from '@/components/layout/ListItem.vue'

import { DEFAULT_MENU_ITEMS, AVAILABLE_MENU_ITEMS } from '@/consts/menuItems'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    TopNav,
    Draggable,
    InlineSvg,
    ListItem,
    Card,
  },
  data: () => ({
    menu: [...DEFAULT_MENU_ITEMS],
    items: [...AVAILABLE_MENU_ITEMS],
  }),
  created() {
    const savedMenu = JSON.parse(window.localStorage.getItem('menu') || '[]')
    const savedItems = JSON.parse(window.localStorage.getItem('items') || '[]')
    if (savedMenu.length) this.menu = [...savedMenu]
    if (savedItems.length) this.items = [...savedItems]
  },
  methods: {
    saveMenu() {
      window.localStorage.setItem('menu', JSON.stringify(this.menu))
      window.localStorage.setItem('items', JSON.stringify(this.items))
      window.dispatchEvent(new CustomEvent('menuChanged'))
      this.$toast.success(this.$t('success') as string)
    },
  },
})
</script>

<style lang="scss" scoped>
.menu-items {
  display: flex;
  flex-direction: column;

  &__container {
    width: 100%;
  }

  &__title {
    margin-top: 1em;
    padding: 0 10px;
  }

  &__active {
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 10px;

    button:not(.draggable) {
      cursor: auto;
    }

    @media ($max-viewport-5) {
      padding: 0;
    }
  }

  &__inactive {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
}
</style>
