import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7fafc" }}>
      <form onSubmit={handleSubmit} style={{ width: 350, padding: 32, borderRadius: 16, boxShadow: "0 2px 16px #0001", background: "#fff", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 48 }}>✨</span>
          <h2 style={{ fontSize: 28, margin: "12px 0 0 0" }}>Sign In</h2>
          <p style={{ color: "#888", fontSize: 16 }}>Welcome back! Log in to your dashboard.</p>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ fontSize: 16, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ fontSize: 16, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "12px 0", fontSize: 18, borderRadius: 8, background: "#3182ce", color: "#fff", border: "none", cursor: "pointer", marginTop: 8 }}>
          Sign In
        </button>
        <button type="button" style={{ background: "none", border: "none", color: "#3182ce", cursor: "pointer", fontSize: 16, marginTop: 4 }} onClick={() => navigate("/signup")}>No account? Register</button>
        {error && <div style={{ color: "#e53e3e", textAlign: "center" }}>{error}</div>}
      </form>
    </div>
  );
};

export default SignIn;
