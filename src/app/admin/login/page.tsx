"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const adminUser = await adminLogin(form.email, form.password);
      router.push("/admin/dashboard"); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Admin login failed. Try again.");
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
        background: "var(--green-light)",
        padding: "16px",
      }}
    >
      <AuthCard title="Admin Login" subtitle="Enter your admin credentials">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <AuthInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <AuthInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "#DC2626", fontSize: "14px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "12px",
              background: "var(--green-primary)",
              color: "#fff",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
          Back to{" "}
          <Link href="/auth/login" style={{ color: "var(--green-primary)", fontWeight: 600 }}>
            User Login
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
