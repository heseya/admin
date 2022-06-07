import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import {
  DEFAULT_MENU_ITEMS,
  DEFAULT_AVAILABLE_ITEMS,
  MenuItemType,
  MenuItem,
  MenuLink,
} from '@/consts/menuItems'

const state = () => ({
  activeItems: DEFAULT_MENU_ITEMS,
  availableItems: DEFAULT_AVAILABLE_ITEMS,
})

const getters = getterTree(state, {
  getMenuLinks(state): MenuLink[] {
    return state.activeItems.filter(
      (item: MenuItem) => item.type === MenuItemType.Link,
    ) as MenuLink[]
  },
})

const mutations = mutationTree(state, {
  SET_MENU_ITEMS(
    state,
    { activeItems, availableItems }: { activeItems: MenuItem[]; availableItems: MenuLink[] },
  ) {
    state.activeItems = activeItems
    state.availableItems = availableItems
  },
  SET_DEFAULT(state) {
    state.activeItems = DEFAULT_MENU_ITEMS
    state.availableItems = DEFAULT_AVAILABLE_ITEMS
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    setMenuItems(
      { commit },
      { activeItems, availableItems }: { activeItems: MenuItem[]; availableItems: MenuLink[] },
    ) {
      commit('SET_MENU_ITEMS', { activeItems, availableItems })
    },
    resetMenu({ commit }) {
      commit('SET_DEFAULT')
    },
  },
)

export const menuItems = {
  namespaced: false,
  state,
  getters,
  mutations,
  actions,
}
