import { Link } from 'react-router-dom'
import { CircleCheckBig } from 'lucide-react'
import { formatCurrency } from '../utils/format'
export default function ConfirmationPage(){const order=JSON.parse(sessionStorage.getItem('last_order')||'null');return <section className="container section"><div className="confirmation"><CircleCheckBig size={76}/><h1>¡Pedido confirmado!</h1>{order?<><p>Tu pedido fue guardado correctamente.</p><strong>Número de pedido: {order.id}</strong><p>Total: {formatCurrency(order.total)}</p></>:<p>Tu compra fue procesada.</p>}<Link className="btn" to="/perfil">Ver mis pedidos</Link></div></section>}
