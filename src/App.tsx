import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Ingredients } from './pages/Ingredients'
import { Taste } from './pages/Taste'
import { Results } from './pages/Results'
import { Recipe } from './pages/Recipe'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/taste" element={<Taste />} />
        <Route path="/results" element={<Results />} />
        <Route path="/recipe/:id" element={<Recipe />} />
{/* Любой неизвестный путь → главная */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
