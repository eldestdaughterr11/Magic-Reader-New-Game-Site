import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import ProtectedRoute
import Gameplay from './pages/game/Gameplay';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLessons from './pages/admin/AdminLessons';
import AdminUsers from './pages/admin/AdminUsers';

import Characters from './pages/game/Characters';
import Download from './pages/game/Download';
import Leaderboards from './pages/Leaderboards';
import ScoreSubmit from './pages/ScoreSubmit';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import Forum from './pages/Forum';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Wrap MainLayout with ProtectedRoute so you can't access /home without logging in */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/submit-score" element={<ScoreSubmit />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/game/gameplay" element={<Gameplay />} />
          <Route path="/game/characters" element={<Characters />} />
          <Route path="/game/download" element={<Download />} />
          <Route path="/forum" element={<Forum />} />
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
