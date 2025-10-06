import Header from "./components/layout/Header.tsx"
import Test from "./components/test/Test.tsx"
import { Routes, Route } from "react-router-dom"

// Pages
import HomePage from "./pages/HomePage/HomePage.tsx"
import AuthPage from "./pages/AuthPage/AuthPage.tsx"
import SearchPage from "./pages/SearchPage/SearchPage.tsx"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx"

function App() {

  return (
    <>
      <Header />
      <main className="responsive">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/:fel" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
