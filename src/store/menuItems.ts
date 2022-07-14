import { actionTree, getterTree, mutationTree } from 'typed-vuex'
import { App } from '@heseya/store-core'

import { DEFAULT_MENU_ITEMS, MenuItemType, MenuItem, MenuLink } from '@/consts/menuItems'

const state = () => ({
  activeItems: DEFAULT_MENU_ITEMS,
})

const getters = getterTree(state, {
  getMenuLinks(state): MenuLink[] {
    return state.activeItems.filter(
      (item: MenuItem) => item.type === MenuItemType.Link,
    ) as MenuLink[]
  },
})

const mutations = mutationTree(state, {
  SET_ACTIVE_ITEMS(state, activeItems: MenuItem[]) {
    state.activeItems = activeItems
  },
  SET_DEFAULT(state) {
    state.activeItems = DEFAULT_MENU_ITEMS
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    setMenuItems({ commit }, activeItems: MenuItem[]) {
      commit('SET_ACTIVE_ITEMS', activeItems)
    },
    resetMenu({ commit }) {
      commit('SET_DEFAULT')
    },

    removeNotExistingApps({ state, rootState, commit }) {
      const menuItemsWithoutNotExistingApps = state.activeItems.filter((item) =>
        item.type === MenuItemType.Link && item.isMicrofrontend
          ? !!rootState.apps.data.find((app: App) => app.id === item.id)
          : true,
      )
      commit('SET_ACTIVE_ITEMS', menuItemsWithoutNotExistingApps)
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
