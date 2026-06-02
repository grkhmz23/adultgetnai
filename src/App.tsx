import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import InvestorDemo from './pages/InvestorDemo'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/investor-demo" element={<InvestorDemo />} />
    </Routes>
  )
}
