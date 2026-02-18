"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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
      const user = await login(form.email, form.password);

      // Redirect based on role safely
      switch (user.role) {
        case "user":
          router.push("/");
          break;
        case "operator":
          router.push("/operator/dashboard");
          break;
        default:
          setError("Unknown role. Cannot redirect.");
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Try again.");
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
      <AuthCard title="Welcome Back" subtitle="Login to your Govista account">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <AuthInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
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

        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <Link
            href="/auth/forgot-password"
            style={{ color: "var(--green-primary)", fontWeight: 600, fontSize: "14px" }}
          >
            Forgot Password?
          </Link>
        </div>

        <p style={{ marginTop: "16px", textAlign: "center", color: "#6B7280" }}>
          Don’t have an account?{" "}
          <Link href="/auth/register" style={{ color: "var(--green-primary)", fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>

        <p style={{ marginTop: "8px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
          Are you an admin?{" "}
          <Link href="/admin/login" style={{ color: "var(--green-primary)", fontWeight: 600 }}>
            Login here
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
