import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'

const slides = [
  {
    eyebrow: 'Tecnología y accesorios',
    title: 'Tecnología para tu día a día',
    description:
      'Explora computadores, celulares, audio, gaming y accesorios en un catálogo moderno y fácil de usar.',
    emoji: '💻',
    floating: ['🎧', '📱'],
    className: 'slide-blue',
  },
  {
    eyebrow: 'Audio que se siente',
    title: 'Escucha cada detalle',
    description:
      'Audífonos, parlantes y accesorios para estudiar, trabajar, jugar o disfrutar tu música favorita.',
    emoji: '🎧',
    floating: ['🎵', '🔊'],
    className: 'slide-purple',
  },
  {
    eyebrow: 'Conectado siempre',
    title: 'El celular ideal está aquí',
    description:
      'Compara modelos, marcas, precios y características antes de agregar tu favorito al carrito.',
    emoji: '📱',
    floating: ['⚡', '📸'],
    className: 'slide-teal',
  },
]

export default function HomePage() {
  const { products } = useProducts()
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [paused])

  const previousSlide = () =>
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  const nextSlide = () =>
    setActiveSlide((current) => (current + 1) % slides.length)

  return (
    <>
      <section
        className="hero-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="hero-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          {slides.map((slide) => (
            <article className={`hero-slide ${slide.className}`} key={slide.title}>
              <div className="container hero-grid">
                <div className="hero-copy">
                  <span className="badge">{slide.eyebrow}</span>
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <div className="hero-actions">
                    <Link className="btn" to="/productos">
                      Ver productos
                    </Link>
                    <Link className="btn secondary" to="/productos?oferta=true">
                      Ver ofertas
                    </Link>
                  </div>
                </div>
                <div className="hero-art animated-art" aria-hidden="true">
                  <div className="hero-orbit orbit-one" />
                  <div className="hero-orbit orbit-two" />
                  <strong>{slide.emoji}</strong>
                  <span>{slide.floating[0]}</span>
                  <small>{slide.floating[1]}</small>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="carousel-arrow carousel-prev" onClick={previousSlide} aria-label="Anterior">
          <ChevronLeft />
        </button>
        <button className="carousel-arrow carousel-next" onClick={nextSlide} aria-label="Siguiente">
          <ChevronRight />
        </button>

        <div className="carousel-dots" aria-label="Seleccionar diapositiva">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              className={index === activeSlide ? 'active' : ''}
              onClick={() => setActiveSlide(index)}
              aria-label={`Mostrar diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="container benefits">
        <div><Truck /><span><strong>Envíos rápidos</strong><small>A todo el país</small></span></div>
        <div><ShieldCheck /><span><strong>Compra segura</strong><small>Proyecto simulado</small></span></div>
        <div><CreditCard /><span><strong>Pagos simulados</strong><small>Sin cobros reales</small></span></div>
        <div><Headphones /><span><strong>Soporte</strong><small>Atención local</small></span></div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div><p className="eyebrow">Selección especial</p><h2>Productos destacados</h2></div>
          <Link to="/productos">Ver todos</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  )
}
