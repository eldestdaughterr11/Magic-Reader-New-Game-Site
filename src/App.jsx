import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import ProtectedRoute

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLessons from './pages/admin/AdminLessons';
import AdminUsers from './pages/admin/AdminUsers';

// Placeholder components for incomplete pages
const About = () => <div style={{textAlign: 'center', padding: '50px'}}><h1 className="section-title">About</h1><p>About page content.</p></div>;
const Leaderboards = () => <div style={{textAlign: 'center', padding: '50px'}}><h1 className="section-title">Leaderboards</h1><p>Leaderboards page content.</p></div>;
const Resources = () => <div style={{textAlign: 'center', padding: '50px'}}><h1 className="section-title">Resources</h1><p>Resources page content.</p></div>;
const Gameplay = () => <div style={{textAlign: 'center', padding: '50px'}}><h1 className="section-title">Gameplay</h1><p>Gameplay page content.</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Wrap MainLayout with ProtectedRoute so you can't access /home without logging in */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/game/gameplay" element={<Gameplay />} />
        </Route>
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Wrap AdminLayout with ProtectedRoute and require Admin access */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
