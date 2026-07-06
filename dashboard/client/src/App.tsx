import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import EmployeePage from './pages/EmployeesPage';
import AdminPage from './pages/AdminPage';
import './index.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/EmployeePage" element={<EmployeePage />} />
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;