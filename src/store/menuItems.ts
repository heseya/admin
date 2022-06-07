import { createVuexCRUD } from './generator'

import {
  DEFAULT_MENU_ITEMS,
  DEFAULT_AVAILABLE_ITEMS,
  MenuItemType,
  MenuItem,
} from '@/consts/menuItems'

export const menuItems = createVuexCRUD<MenuItem>()('menu-items', {
  state: {
    activeItems: localStorage.hasOwnProperty('menu')
      ? JSON.parse(localStorage.getItem('menu') || '[]')
      : DEFAULT_MENU_ITEMS,
    availableItems: localStorage.hasOwnProperty('items')
      ? JSON.parse(localStorage.getItem('items') || '[]')
      : DEFAULT_AVAILABLE_ITEMS,
  },
  getters: {
    getMenuLinks(state) {
      return state.activeItems.filter((item: MenuItem) => item.type === MenuItemType.Link)
    },
  },
  mutations: {
    SET_MENU_ITEMS(
      state,
      { activeItems, availableItems }: { activeItems: MenuItem[]; availableItems: MenuItem[] },
    ) {
      state.activeItems = activeItems
      state.availableItems = availableItems
    },
    SET_DEFAULT(state) {
      state.activeItems = DEFAULT_MENU_ITEMS
      state.availableItems = DEFAULT_AVAILABLE_ITEMS
    },
  },
  actions: {
    setMenuItems(
      { commit },
      { activeItems, availableItems }: { activeItems: MenuItem[]; availableItems: MenuItem[] },
    ) {
      localStorage.setItem('menu', JSON.stringify(activeItems))
      localStorage.setItem('items', JSON.stringify(availableItems))

      commit('SET_MENU_ITEMS', { activeItems, availableItems })
    },
    resetMenu({ commit }) {
      localStorage.removeItem('menu')
      localStorage.removeItem('items')
      commit('SET_DEFAULT')
    },
  },
})
