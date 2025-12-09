import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Auth: React.FC = () => {
  const { signIn, signUp, user, loading, signOutUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user) return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOutUser}>Sign Out</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "2rem auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isRegister ? "Register" : "Login"}</button>
      <button type="button" onClick={() => setIsRegister(r => !r)}>
        {isRegister ? "Already have an account? Login" : "No account? Register"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default Auth;
