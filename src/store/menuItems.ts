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
  SET_ACTIVE_ITEMS(state, { activeItems }: { activeItems: MenuItem[] }) {
    state.activeItems = activeItems
  },
  SET_AVAILABLE_ITEMS(state, { availableItems }: { availableItems: MenuLink[] }) {
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
      commit('SET_ACTIVE_ITEMS', { activeItems })
      commit('SET_AVAILABLE_ITEMS', { availableItems })
    },
    resetMenu({ commit }) {
      commit('SET_DEFAULT')
    },
  },
)

export const menuItems = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
