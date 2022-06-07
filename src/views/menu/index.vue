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
            <div v-for="item in items" :key="item.id" v-can="item.can">
              <list-item :key="item.id">
                <template #avatar>
                  <InlineSvg
                    v-if="item.svgIconPath"
                    :src="require(`@/assets/images/${item.svgIconPath}`)"
                    class="menu-items__svg-icon"
                  />
                  <i v-else :class="item.iconClass" class="menu-items__icon"></i>
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
            <div v-for="item in menu" :key="item.id" v-can="item.can">
              <list-item
                v-if="item.type === 'link'"
                :key="item.id"
                :class="{ draggable: !item.disabled }"
              >
                <template #avatar>
                  <InlineSvg
                    v-if="item.svgIconPath"
                    :src="require(`@/assets/images/${item.svgIconPath}`)"
                    class="menu-items__svg-icon"
                  />
                  <i v-else :class="item.iconClass" class="menu-items__icon"></i>
                </template>
                {{ $t(item.label) }}
                <template #action>
                  <i class="bx bx-menu"></i>
                </template>
              </list-item>
              <div
                v-else-if="item.type === MenuItemType.Spacer"
                :key="item.id"
                class="menu-items__spacer"
              ></div>
            </div>
          </draggable>
        </div>
      </div>
      <hr />
      <div class="row">
        <app-button @click="saveMenu">
          {{ $t('common.save') }}
        </app-button>
        <app-button type="danger" @click="resetMenu">
          {{ $t('common.reset') }}
        </app-button>
      </div>
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
    "successReset": "Menu zostało zresetowane",
    "info": "Tutaj możesz edytować swoje menu. Zakładki: <b>Dashboard</b>, <b>Zamówienia</b> oraz <b>Ustawienia</b> jako jedyne nie mogą zostać z niego usunięte."
  },
  "en": {
    "title": "Edit menu",
    "menu": "Menu",
    "options":"Available tabs",
    "success": "Menu has been changed",
    "successReset": "Menu has been reseted",
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

import { MenuItem, MenuItemType, MenuLink } from '@/consts/menuItems'

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
    menu: [] as MenuItem[],
    items: [] as MenuLink[],
  }),
  computed: {
    MenuItemType(): typeof MenuItemType {
      return MenuItemType
    },
    activeItems(): MenuItem[] {
      return this.$accessor.menuItems.activeItems
    },
    availableItems(): MenuLink[] {
      return this.$accessor.menuItems.availableItems
    },
  },
  created() {
    this.setDefaultMenu()
  },
  methods: {
    saveMenu() {
      this.$accessor.menuItems.setMenuItems({
        activeItems: [...this.menu],
        availableItems: [...this.items],
      })
      this.$toast.success(this.$t('success') as string)
    },
    resetMenu() {
      this.$accessor.menuItems.resetMenu()
      this.setDefaultMenu()
      this.$toast.success(this.$t('successReset') as string)
    },
    setDefaultMenu() {
      this.menu = [...this.activeItems]
      this.items = [...this.availableItems]
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

  &__icon {
    display: block;
    font-size: 18px;
  }

  &__svg-icon {
    display: block;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
  }

  &__spacer {
    height: 10px;
  }

  &__inactive {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
}
</style>
