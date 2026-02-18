"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    dob: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: "user" | "operator") => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validations
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.gender ||
      !form.dob ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email format");
      return;
    }

    if (!/^\d{10,15}$/.test(form.phone)) {
      setError("Invalid phone number");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      // Redirect to login after successful signup
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "16px",
      }}
    >
      <AuthCard title="Create Account" subtitle="Start your journey with us">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
          <AuthInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <AuthInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          <AuthInput label="Email" name="email" value={form.email} onChange={handleChange} />
          <AuthInput label="Phone" name="phone" value={form.phone} onChange={handleChange} />

          {/* Gender selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="gender" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#fff",
                fontSize: "14px",
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <AuthInput label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} />
          <AuthInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
          <AuthInput label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

          {/* Role Selection Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
            {["user", "operator"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r as "user" | "operator")}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: form.role === r ? "2px solid #14532d" : "1px solid #d1d5db",
                  background: form.role === r ? "#14532d" : "#fff",
                  color: form.role === r ? "#fff" : "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {r === "user" ? "Traveler" : "Tour Operator"}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: "#DC2626", fontSize: "14px", textAlign: "center", marginTop: "8px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "12px",
              background: "#14532d",
              color: "#fff",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Already have an account */}
        <p style={{ marginTop: "16px", fontSize: "14px", textAlign: "center", color: "#6B7280" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#14532d", fontWeight: 600 }}>
            Login
          </Link>
        </p>

        {/* Admin login link */}
        
      </AuthCard>
    </div>
  );
}
