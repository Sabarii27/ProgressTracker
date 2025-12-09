import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, profile, updateProfile, signOutUser } = useAuth();
  const navigate = useNavigate();

  // Editable name and age (local state)
  const [name, setName] = React.useState(profile?.name || "");
  const [age, setAge] = React.useState(profile?.age || 18);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    setName(profile?.name || "");
    setAge(profile?.age || 18);
  }, [profile]);

  const handleSave = async () => {
    await updateProfile({ name, age });
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, borderRadius: 16, boxShadow: "0 2px 16px #0001", background: "var(--card, #fff)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 64 }}>👤</span>
        {editing ? (
          <>
            <input
              style={{ fontSize: 24, padding: 8, borderRadius: 8, border: "1px solid #ccc", textAlign: "center" }}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="number"
              style={{ fontSize: 18, padding: 8, borderRadius: 8, border: "1px solid #ccc", textAlign: "center" }}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              placeholder="Age"
              min={0}
              max={120}
            />
            <button
              style={{ marginTop: 12, padding: "8px 20px", fontSize: 16, borderRadius: 8, background: "#3182ce", color: "#fff", border: "none", cursor: "pointer" }}
              onClick={handleSave}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 28, margin: 0 }}>{profile?.name || ""}</h2>
            <p style={{ fontSize: 18, color: "#888", margin: 0 }}>Age: {profile?.age ?? ""}</p>
            <button
              style={{ marginTop: 12, padding: "8px 20px", fontSize: 16, borderRadius: 8, background: "#3182ce", color: "#fff", border: "none", cursor: "pointer" }}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          </>
        )}
        <button
          style={{ marginTop: 24, padding: "10px 24px", fontSize: 16, borderRadius: 8, background: "#e53e3e", color: "#fff", border: "none", cursor: "pointer" }}
          onClick={() => { signOutUser(); navigate("/signin"); }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
