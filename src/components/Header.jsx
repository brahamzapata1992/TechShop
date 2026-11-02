import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ShoppingCart, UserRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  return <header className="site-header">
    <div className="container nav-wrap">
      <Link className="brand" to="/">◉ TechStore</Link>
      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        {isAdmin && <NavLink to="/admin"><ShieldCheck size={17}/> Admin</NavLink>}
      </nav>
      <div className="nav-actions">
        <Link className="icon-button cart-link" to="/carrito"><ShoppingCart size={21}/>{count > 0 && <span>{count}</span>}</Link>
        {user ? <><Link className="user-link" to="/perfil"><UserRound size={18}/>{user.name}</Link><button className="icon-button" onClick={handleLogout} title="Cerrar sesión"><LogOut size={19}/></button></> : <Link className="btn btn-small" to="/login">Iniciar sesión</Link>}
      </div>
    </div>
  </header>
}
