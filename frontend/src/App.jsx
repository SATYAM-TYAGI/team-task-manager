import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectPage from "./pages/ProjectPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user") || "null");

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <nav className="top-nav">
        <h2>Team Task Manager</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          {!userData ? <Link to="/login">Login</Link> : null}
          {!userData ? <Link to="/signup">Signup</Link> : null}
          {userData ? <button onClick={doLogout}>Logout</button> : null}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}
