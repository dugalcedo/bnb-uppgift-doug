import Header from "./components/layout/Header.tsx"
import Footer from "./components/layout/Footer.tsx"
import Background from "./components/layout/Background.tsx"
import { Routes, Route } from "react-router-dom"

// Pages
import HomePage from "./pages/HomePage/HomePage.tsx"
import AuthPage from "./pages/AuthPage/AuthPage.tsx"
import BrowsePage from "./pages/BrowsePage/BrowsePage.tsx"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx"
import PropertyPage from "./pages/PropertyPage/PropertyPage.tsx"
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx"
import AdminPage from "./pages/AdminPage/AdminPage.tsx"
import ManagePage from "./pages/ManagePage/ManagePage.tsx"

function App() {

  return (
    <>
      <Background />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/manage/:id" element={<ManagePage />} />
          <Route path="/:fel" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
