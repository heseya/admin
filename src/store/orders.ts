import { createVuexCRUD } from './generator'
import { DefaultVuexMutation } from '@/interfaces/VuexGenerator'
import { sdk } from '../api'
import {
  Order,
  OrderCreateDto,
  OrderProduct,
  OrderDocument,
  OrderDocumentCreateDto,
  OrderUpdateDto,
} from '@heseya/store-core'
import { UUID } from '@/interfaces/UUID'
import { cloneDeep } from 'lodash'

export const orders = createVuexCRUD<Order, OrderCreateDto, OrderUpdateDto>()(
  'orders',
  {
    state: {},
    getters: {},
    mutations: {
      SET_ORDER_DOCUMENTS(
        state,
        { orderId, documents }: { orderId: UUID; documents: OrderDocument[] },
      ) {
        if (state.selected?.id === orderId) state.selected.documents = documents
      },
      ADD_ORDER_DOCUMENT(state, { orderId, document }: { orderId: UUID; document: OrderDocument }) {
        if (state.selected?.id === orderId) state.selected.documents.push(document)
      },
      REMOVE_ORDER_DOCUMENT(state, { orderId, documentId }: { orderId: UUID; documentId: UUID }) {
        if (state.selected?.id === orderId)
          state.selected.documents = state.selected.documents.filter((d) => d.id !== documentId)
      },
      UPDATE_SELECTED_ORDER_PRODUCT(state, orderProduct: OrderProduct) {
        if (state.selected) {
          const clone = cloneDeep(state.selected)
          const index = clone.products.findIndex((p) => p.id === orderProduct.id)

          if (index !== -1) clone.products[index] = orderProduct
          else clone.products.push(orderProduct)

          state.selected = clone
        }
      },
    },
    actions: {
      async changeStatus({ commit }, { orderId, statusId }: { orderId: UUID; statusId: UUID }) {
        commit(DefaultVuexMutation.SetError, null)
        try {
          await sdk.Orders.updateStatus(orderId, { status_id: statusId })
          const order = await sdk.Orders.getOne(orderId)
          commit(DefaultVuexMutation.SetSelected, order)
          return true
        } catch (error: any) {
          commit(DefaultVuexMutation.SetError, error)
          return false
        }
      },

      async createOrderDocument(
        { commit },
        { orderId, document }: { orderId: UUID; document: OrderDocumentCreateDto },
      ) {
        commit(DefaultVuexMutation.SetError, null)
        try {
          const orderDocument = await sdk.Orders.Documents.create(orderId, document)

          commit('ADD_ORDER_DOCUMENT', { orderId, document: orderDocument })

          return orderDocument
        } catch (error: any) {
          commit(DefaultVuexMutation.SetError, error)
          return null
        }
      },

      async getOrderDocument(
        { commit },
        { orderId, documentId }: { orderId: UUID; documentId: UUID },
      ) {
        commit(DefaultVuexMutation.SetError, null)
        try {
          return await sdk.Orders.Documents.download(orderId, documentId)
        } catch (e) {
          commit(DefaultVuexMutation.SetError, e)
          return null
        }
      },

      async removeOrderDocument(
        { commit },
        { orderId, documentId }: { orderId: UUID; documentId: UUID },
      ) {
        commit(DefaultVuexMutation.SetError, null)
        try {
          await sdk.Orders.Documents.delete(orderId, documentId)
          commit('REMOVE_ORDER_DOCUMENT', { orderId, documentId })
          return true
        } catch (error: any) {
          commit(DefaultVuexMutation.SetError, error)
          return false
        }
      },

      async sendOrderDocuments(
        { commit },
        { orderId, documentIds }: { orderId: UUID; documentIds: UUID[] },
      ) {
        commit(DefaultVuexMutation.SetError, null)
        try {
          await sdk.Orders.Documents.send(orderId, documentIds)
          return true
        } catch (error: any) {
          commit(DefaultVuexMutation.SetError, error)
          return false
        }
      },

      async updateOrderProductUrls(
        { commit },
        {
          orderId,
          productId,
          urls,
        }: { orderId: UUID; productId: UUID; urls: Record<string, string | null> },
      ) {
        commit(DefaultVuexMutation.SetError, null)
        try {
          const orderProduct = await sdk.Orders.updateProduct(orderId, productId, {
            urls,
          })
          commit('UPDATE_SELECTED_ORDER_PRODUCT', orderProduct)
          return true
        } catch (error: any) {
          commit(DefaultVuexMutation.SetError, error)
          return false
        }
      },
    },
  },
  {
    get: { lang_fallback: 'any' },
    getOne: { lang_fallback: 'any' },
    edit: { lang_fallback: 'any' },
    update: { lang_fallback: 'any' },
  },
)
