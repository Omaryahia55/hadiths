import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import HadithList from './pages/HadithList';
import HadithDetail from './pages/HadithDetail';
import Favorites from './pages/Favorites';
import Exercises from './pages/Exercises';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="hadiths" element={<HadithList />} />
                <Route path="hadith/:id" element={<HadithDetail />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="exercises" element={<Exercises />} />
                <Route path="contact" element={<Contact />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;