import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await apiCall("/auth/signup", "POST", { name, email, password, role });
      setMsg("signup done, now login");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Signup</h3>
      <form onSubmit={handleSignup}>
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      {msg ? <p>{msg}</p> : null}
    </div>
  );
}
