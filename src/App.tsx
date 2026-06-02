import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import InvestorDemo from './pages/InvestorDemo'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ContentPolicy from './pages/ContentPolicy'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/investor-demo" element={<InvestorDemo />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/content-policy" element={<ContentPolicy />} />
    </Routes>
  )
}
