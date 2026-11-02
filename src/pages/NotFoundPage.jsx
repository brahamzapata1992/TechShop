import { Link } from 'react-router-dom'
export default function NotFoundPage(){return <section className="container section empty"><h1>404</h1><p>La página solicitada no existe.</p><Link className="btn" to="/">Volver al inicio</Link></section>}
