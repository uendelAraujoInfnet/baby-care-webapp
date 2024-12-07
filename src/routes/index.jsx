import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import Settings from '../views/Settings';
import Register from '../views/Register';
import Form from "../views/Form";
import EditPage from "../views/EditPage";
import Dashboard from "../views/Dashboard";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/settings" element={<Settings />} />  
      <Route path="/form" element={<Form />} />;
      <Route path="/edit/:id" element={<EditPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default AppRoutes;
