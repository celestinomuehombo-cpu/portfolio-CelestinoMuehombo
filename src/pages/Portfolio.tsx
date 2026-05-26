import Navbar from '../components/ui/Navbar'
import Hero from '../components/portfolio/Hero'
import About from '../components/portfolio/About'
import Skills from '../components/portfolio/Skills'
import Projects from '../components/portfolio/Projects'
import CV from '../components/portfolio/CV'
import Contact from '../components/portfolio/Contact'
import Footer from '../components/ui/Footer'

export default function Portfolio() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <CV />
      <Contact />
      <Footer />
    </div>
  )
}