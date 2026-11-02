import { createContext, useContext, useMemo, useState } from 'react'
import { initialProducts } from '../data/products'
import { readStorage, writeStorage } from '../utils/storage'

const ProductContext = createContext(null)
const KEY = 'techstore_products'
export const useProducts = () => useContext(ProductContext)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => readStorage(KEY, initialProducts))
  const persist = (next) => { setProducts(next); writeStorage(KEY, next) }
  const addProduct = (product) => persist([...products, { ...product, id: crypto.randomUUID(), rating: 4.5, features: ['Garantía de 12 meses'], emoji: product.emoji || '📦' }])
  const updateProduct = (id, changes) => persist(products.map((p) => p.id === id ? { ...p, ...changes } : p))
  const deleteProduct = (id) => persist(products.filter((p) => p.id !== id))
  const reduceStock = (items) => persist(products.map((p) => {
    const line = items.find((i) => i.id === p.id)
    return line ? { ...p, stock: Math.max(0, p.stock - line.quantity) } : p
  }))
  const resetProducts = () => persist(initialProducts)
  const value = useMemo(() => ({ products, addProduct, updateProduct, deleteProduct, reduceStock, resetProducts }), [products])
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}
