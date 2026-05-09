import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Subjects from './pages/Subjects'
import Vouchers from './pages/Vouchers'
import VoucherForm from './pages/VoucherForm'
import Ledgers from './pages/Ledgers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="vouchers" element={<Vouchers />} />
        <Route path="vouchers/new" element={<VoucherForm />} />
        <Route path="vouchers/:id/edit" element={<VoucherForm />} />
        <Route path="ledgers" element={<Ledgers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
