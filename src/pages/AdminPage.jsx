import { useMemo, useState } from 'react'
import { Eye, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { getOrders, updateOrderStatus } from '../services/orderService'
import { readStorage } from '../utils/storage'
import { formatCurrency } from '../utils/format'

const empty = {
  name: '',
  category: 'Accesorios',
  brand: '',
  price: 0,
  stock: 0,
  description: '',
  emoji: '📦',
  featured: false,
}

const statusOptions = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado']

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState(() => getOrders())
  const [selectedOrder, setSelectedOrder] = useState(null)
  const users = readStorage('techstore_users', [])

  const sales = useMemo(
    () => orders.filter((order) => order.status !== 'Cancelado').reduce((sum, order) => sum + order.total, 0),
    [orders],
  )

  const submit = (event) => {
    event.preventDefault()
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
    if (editing) updateProduct(editing, payload)
    else addProduct(payload)
    setForm(empty)
    setEditing(null)
  }

  const edit = (product) => {
    setEditing(product.id)
    setForm(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeStatus = (orderId, status) => {
    updateOrderStatus(orderId, status)
    const updated = getOrders()
    setOrders(updated)
    setSelectedOrder((current) => (current?.id === orderId ? { ...current, status } : current))
  }

  const orderCustomer = (order) =>
    order.shippingInfo?.name || order.userEmail || 'Cliente sin nombre'

  const formatDate = (date) =>
    new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))

  return (
    <section className="container section">
      <div className="page-title">
        <p className="eyebrow">Administración local</p>
        <h1>Panel de administración</h1>
        <p>Los datos se guardan en el navegador mediante LocalStorage.</p>
      </div>

      <div className="stats">
        <div><span>Productos</span><strong>{products.length}</strong></div>
        <div><span>Pedidos</span><strong>{orders.length}</strong></div>
        <div><span>Usuarios</span><strong>{users.length}</strong></div>
        <div><span>Ventas</span><strong>{formatCurrency(sales)}</strong></div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Pedidos</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Productos</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Usuarios</button>
      </div>

      {activeTab === 'orders' && (
        <div className="table-wrap admin-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Seguimiento</p><h2>Pedidos realizados</h2></div>
            <span>{orders.length} pedidos</span>
          </div>
          {orders.length ? (
            <table>
              <thead>
                <tr><th>Pedido</th><th>Cliente</th><th>Fecha y hora</th><th>Total</th><th>Estado</th><th>Detalle</th></tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td><strong>{orderCustomer(order)}</strong><small className="table-subtext">{order.userEmail}</small></td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td><strong>{formatCurrency(order.total)}</strong></td>
                    <td>
                      <select
                        className={`status-select status-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(event) => changeStatus(order.id, event.target.value)}
                      >
                        {statusOptions.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td><button className="icon-button view-button" onClick={() => setSelectedOrder(order)}><Eye /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty compact-empty"><h3>Todavía no hay pedidos</h3><p>Cuando un cliente finalice una compra, aparecerá aquí automáticamente.</p></div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <>
          <form className="admin-form" onSubmit={submit}>
            <h3>{editing ? 'Editar producto' : 'Agregar producto'}</h3>
            <input placeholder="Nombre" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Categoría" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input placeholder="Marca" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <input type="number" min="0" step="0.01" placeholder="Precio" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" min="0" placeholder="Stock" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input placeholder="Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
            <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn"><Plus /> {editing ? 'Guardar cambios' : 'Agregar producto'}</button>
            {editing && <button type="button" className="btn secondary" onClick={() => { setEditing(null); setForm(empty) }}>Cancelar</button>}
            <button type="button" className="btn secondary" onClick={resetProducts}><RotateCcw /> Restablecer catálogo</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.emoji} {product.name}</td><td>{product.category}</td><td>{formatCurrency(product.price)}</td><td>{product.stock}</td>
                    <td><button className="icon-button" onClick={() => edit(product)}><Pencil /></button><button className="icon-button danger" onClick={() => deleteProduct(product.id)}><Trash2 /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="table-wrap admin-panel">
          <div className="panel-heading"><div><p className="eyebrow">Clientes</p><h2>Usuarios registrados</h2></div></div>
          <table>
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Pedidos</th><th>Total gastado</th></tr></thead>
            <tbody>
              {users.map((registeredUser) => {
                const userOrders = orders.filter((order) => order.userId === registeredUser.id && order.status !== 'Cancelado')
                return (
                  <tr key={registeredUser.id}>
                    <td>{registeredUser.name} {registeredUser.lastName}</td>
                    <td>{registeredUser.email}</td>
                    <td>{registeredUser.role || 'customer'}</td>
                    <td>{userOrders.length}</td>
                    <td>{formatCurrency(userOrders.reduce((sum, order) => sum + order.total, 0))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <article className="order-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}><X /></button>
            <p className="eyebrow">Detalle del pedido</p>
            <h2>{selectedOrder.id}</h2>
            <div className="order-meta-grid">
              <div><span>Cliente</span><strong>{orderCustomer(selectedOrder)}</strong></div>
              <div><span>Correo</span><strong>{selectedOrder.userEmail}</strong></div>
              <div><span>Fecha</span><strong>{formatDate(selectedOrder.createdAt)}</strong></div>
              <div><span>Teléfono</span><strong>{selectedOrder.shippingInfo?.phone || 'No registrado'}</strong></div>
              <div><span>Ciudad</span><strong>{selectedOrder.shippingInfo?.city || 'No registrada'}</strong></div>
              <div><span>Dirección</span><strong>{selectedOrder.shippingInfo?.address || 'No registrada'}</strong></div>
              <div><span>Pago</span><strong>{selectedOrder.shippingInfo?.payment || 'No registrado'}</strong></div>
              <div>
                <span>Estado</span>
                <select value={selectedOrder.status} onChange={(event) => changeStatus(selectedOrder.id, event.target.value)}>
                  {statusOptions.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>
            <h3>Productos comprados</h3>
            <div className="order-items-list">
              {selectedOrder.items.map((item) => (
                <div key={item.id}>
                  <span className="order-item-name"><b>{item.emoji}</b>{item.name}<small>{item.quantity} × {formatCurrency(item.price)}</small></span>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div><span>Subtotal</span><strong>{formatCurrency(selectedOrder.subtotal)}</strong></div>
              <div><span>Envío</span><strong>{selectedOrder.shipping ? formatCurrency(selectedOrder.shipping) : 'Gratis'}</strong></div>
              <div className="grand-total"><span>Total</span><strong>{formatCurrency(selectedOrder.total)}</strong></div>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
