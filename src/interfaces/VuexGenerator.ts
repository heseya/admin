import { HeseyaPaginatedResponseMeta } from '@heseya/store-core'
import { ActionContext, NuxtStore } from 'typed-vuex'
import { GetterTree, MutationTree, Store } from 'vuex'
import { UUID } from './UUID'

type QueryParams = Record<string, any>

export interface BaseItem {
  id: UUID
}

export interface VuexDefaultCrudParams {
  get?: QueryParams
  add?: QueryParams
  edit?: QueryParams
  update?: QueryParams
  remove?: QueryParams
}

export interface DefaultVuexState<Item extends BaseItem> {
  error: null | Error
  isLoading: boolean
  meta: HeseyaPaginatedResponseMeta
  data: Item[]
  queryParams: QueryParams
  selected: Item | null
}

export interface DefaultVuexGetters<State extends DefaultVuexState<BaseItem>, Item extends BaseItem>
  extends GetterTree<State, any> {
  getError(state: State): Error | null
  getIsLoading(state: State): boolean
  getMeta(state: State): HeseyaPaginatedResponseMeta
  getQueryParams(state: State): QueryParams
  getSelected(state: State): Item
  getData(state: State): Item[]
  getFromListById(state: State): (id: UUID) => Item
}

export enum StoreMutations {
  SetError = 'SET_ERROR',
  SetMeta = 'SET_META',
  SetQueryParams = 'SET_QUERY_PARAMS',
  SetData = 'SET_DATA',
  AddData = 'ADD_DATA',
  EditData = 'EDIT_DATA',
  RemoveData = 'REMOVE_DATA',
  SetSelected = 'SET_SELECTED',
  SetLoading = 'SET_LOADING',
}

export interface DefaultVuexMutations<
  State extends DefaultVuexState<BaseItem>,
  Item extends BaseItem,
> extends MutationTree<State> {
  [StoreMutations.SetError](state: State, error: Error | null): void
  [StoreMutations.SetMeta](state: State, meta: HeseyaPaginatedResponseMeta): void
  [StoreMutations.SetQueryParams](state: State, queryParams: QueryParams): void
  [StoreMutations.SetData](state: State, data: Item[]): void
  [StoreMutations.AddData](state: State, newItem: Item): void
  [StoreMutations.EditData](
    state: State,
    p: { key: keyof Item; value: unknown; item: Partial<Item> },
  ): void
  [StoreMutations.RemoveData](state: State, p: { key: keyof Item; value: unknown }): void
  [StoreMutations.SetSelected](state: State, selected: Item): void
  [StoreMutations.SetLoading](state: State, isLoading: boolean): void
}

// --------------------------------------------
// * This types are a copy of the ones in `typed-vuex`
// They are needed in vuex generator, but are not exported from `typed-vuex`

declare type Not<T, M> = T extends M ? never : T
declare type StateObject = Not<Record<string, any>, Function>
type StateFunction = Not<() => unknown | any, Record<string, any>>
declare type State = StateObject | StateFunction
declare type StateType<T extends State> = T extends () => any ? ReturnType<T> : T

interface ActionHandler<T extends NuxtStore> {
  (this: Store<StateType<T['state']>>, injectee: ActionContext<T>, payload?: any): any
}
export interface ModifiedActionTree<T extends NuxtStore> {
  [key: string]: ActionHandler<T>
}
