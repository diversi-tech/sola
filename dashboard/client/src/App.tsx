import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import EmployeePage from './pages/EmployeesPage';
import AdminPage from './pages/AdminPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

import AllMeetingsPage from './pages/AllMeetingsPage';
import './index.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/EmployeePage" element={<ProtectedRoute><EmployeePage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/meetings" element={<ProtectedRoute><AllMeetingsPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
      </Routes>
    </Router>
  );
}
export default App;