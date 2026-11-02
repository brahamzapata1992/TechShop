import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
export default function ProductCard({ product }) {
 const { addToCart } = useCart()
 return <article className="product-card"><Link className="product-image" to={`/productos/${product.id}`}><span>{product.emoji}</span></Link><div className="product-body"><p className="eyebrow">{product.category} · {product.brand}</p><Link className="product-title" to={`/productos/${product.id}`}>{product.name}</Link><div className="rating"><Star size={15} fill="currentColor"/> {product.rating}</div><div className="price-row"><strong>{formatCurrency(product.price)}</strong>{product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}</div><p className={product.stock ? 'stock' : 'stock out'}>{product.stock ? `Stock: ${product.stock}` : 'Agotado'}</p><button className="btn full" disabled={!product.stock} onClick={() => addToCart(product)}><ShoppingCart size={18}/>Agregar</button></div></article>
}
