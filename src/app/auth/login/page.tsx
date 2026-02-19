"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // Role-based redirect
      switch (user.role) {
        case "user":
          router.push("/");
          break;
        case "operator":
          router.push("/operator/dashboard");
          break;
        default:
          setError("Unknown role. Cannot redirect.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
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
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "16px" }}
        >
          {/* ================= EMAIL ================= */}
          <AuthInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />

          {/* ================= PASSWORD WITH EYE ================= */}
          <div style={{ display: "grid", gap: "6px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  borderRadius: "10px",
                  border: "1px solid #D1D5DB",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              {/* Eye Icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6B7280",
                  fontSize: "18px",
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          {/* ================= ERROR ================= */}
          {error && (
            <p
              style={{
                color: "#DC2626",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* ================= LOGIN BUTTON ================= */}
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
              transition: "0.2s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ================= FORGOT PASSWORD ================= */}
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <Link
            href="/auth/forgot-password"
            style={{
              color: "var(--green-primary)",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* ================= REGISTER ================= */}
        <p
          style={{
            marginTop: "16px",
            textAlign: "center",
            color: "#6B7280",
          }}
        >
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            style={{
              color: "var(--green-primary)",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Link>
        </p>

        {/* ================= ADMIN LOGIN ================= */}
        <p
          style={{
            marginTop: "8px",
            textAlign: "center",
            color: "#6B7280",
            fontSize: "14px",
          }}
        >
          Are you an admin?{" "}
          <Link
            href="/admin/login"
            style={{
              color: "var(--green-primary)",
              fontWeight: 600,
            }}
          >
            Login here
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
