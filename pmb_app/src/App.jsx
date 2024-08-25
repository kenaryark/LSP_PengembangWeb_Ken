import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pendaftaran from "./pages/Pendaftaran";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectAuth from "./components/RedirectAuth";
import User from "./pages/User";
import EditUser from "./pages/EditUser";
import EditMahasiswa from "./pages/EditMahasiswa";
import PrintData from "./pages/PrintData";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/login"
            element={<RedirectAuth element={<LoginForm />} />}
          />
          <Route
            path="/register"
            element={<RedirectAuth element={<RegisterForm />} />}
          />
          <Route
            path="/pendaftaran"
            element={<ProtectedRoute element={<Pendaftaran />} />}
          />
          <Route path="/user" element={<ProtectedRoute element={<User />} />} />
          <Route
            path="/edituser/:id"
            element={<ProtectedRoute element={<EditUser />} />}
          />
          <Route
            path="/editData/:id"
            element={<ProtectedRoute element={<EditMahasiswa />} />}
          />
          <Route
            path="/printData/:id"
            element={<ProtectedRoute element={<PrintData />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
