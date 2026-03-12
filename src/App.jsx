import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="bg-navy-900 min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Contact />
    </div>
  )
}
