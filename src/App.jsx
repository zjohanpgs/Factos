import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Search from './components/Search'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <Search />
      <About />
      <Services />
      <Contact />
    </div>
  )
}
