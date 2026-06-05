import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import AgeGate from './components/AgeGate'

const Home = lazy(() => import('./pages/Home'))
const InvestorDemo = lazy(() => import('./pages/InvestorDemo'))
const About = lazy(() => import('./pages/About'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const ContentPolicy = lazy(() => import('./pages/ContentPolicy'))

export default function App() {
  return (
    <AgeGate>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/investor-demo" element={<InvestorDemo />} />
          <Route path="/chat" element={<InvestorDemo />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/content-policy" element={<ContentPolicy />} />
        </Routes>
      </Suspense>
    </AgeGate>
  )
}