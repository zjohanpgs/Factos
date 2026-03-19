import Navbar from '../components/Navbar'
import Services from '../components/Services'
import Contact from '../components/Contact'

export default function Servicios() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-32" />
      <Services />
      <Contact />
    </div>
  )
}
