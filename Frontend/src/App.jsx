import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AnimeDetailPage from "./pages/AnimeDetail";
import SearchPage from "./pages/SearchPage";
import { useAuth } from "./context/AuthContext";
import React from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import AboutUs from './Components/AboutUs';
import Contact from './Components/Contact';
import HomePage from './pages/HomePage';
import GlobalLoader from './Components/GlobalLoader';
import ToastContainer from './Components/ToastContainer';

const App = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-container">
      <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />
      <ToastContainer />

      <main className="main-content">
        <GlobalLoader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/register" element={<RegisterPage />} />
          
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
