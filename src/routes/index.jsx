import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import Settings from '../views/Settings';
import Register from '../views/Register';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/settings" element={<Settings />} />  
    </Routes>
  </Router>
);

export default AppRoutes;