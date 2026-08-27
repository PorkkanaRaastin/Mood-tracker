import { Routes, Route } from 'react-router-dom'
import Etusivu from './pages/Etusivu'
import MieliaTracker from "./pages/MielialaTracker";
import Paivakirja from './pages/Paivakirja'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Etusivu />} />
      <Route path="/mielialatracker" element={<MieliaTracker />} />
      <Route path="/paivakirja" element={<Paivakirja />} />
    </Routes>
  )
}

export default App