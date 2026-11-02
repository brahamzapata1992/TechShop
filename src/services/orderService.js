import { readStorage, writeStorage } from '../utils/storage'

const KEY = 'techstore_orders'

export const getOrders = () => readStorage(KEY, [])

export const getOrdersByUser = (userId) =>
  getOrders().filter((order) => order.userId === userId)

export function saveOrder(order) {
  const orders = getOrders()
  orders.unshift(order)
  writeStorage(KEY, orders)
  return order
}

export function updateOrderStatus(orderId, status) {
  const orders = getOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order,
  )
  writeStorage(KEY, orders)
  return orders.find((order) => order.id === orderId)
}
