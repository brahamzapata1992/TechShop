import { createContext, useContext, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

const CartContext = createContext(null)
const KEY = 'techstore_cart'
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(KEY, []))
  const persist = (next) => { setItems(next); writeStorage(KEY, next) }
  const addToCart = (product, quantity = 1) => {
    const found = items.find((item) => item.id === product.id)
    if (found) persist(items.map((item) => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item))
    else persist([...items, { ...product, quantity: Math.min(quantity, product.stock) }])
  }
  const updateQuantity = (id, quantity) => persist(items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item))
  const removeItem = (id) => persist(items.filter((item) => item.id !== id))
  const clearCart = () => persist([])
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 && subtotal < 500 ? 5 : 0
  const total = subtotal + shipping
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const value = useMemo(() => ({ items, addToCart, updateQuantity, removeItem, clearCart, subtotal, shipping, total, count }), [items, subtotal, shipping, total, count])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
