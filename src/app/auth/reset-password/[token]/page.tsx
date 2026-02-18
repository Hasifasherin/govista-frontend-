"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AuthCard from "../../../components/auth/AuthCard";
import AuthInput from "../../../components/auth/AuthInput";
import { authAPI } from "../../../../services/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams(); // Grab token from URL
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await authAPI.resetPassword(token as string, form);
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
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
      <AuthCard title="Reset Password" subtitle="Enter your new password">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <AuthInput
            label="New Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />

          {error && (
            <p style={{ color: "#DC2626", fontSize: "14px", textAlign: "center" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "#059669", fontSize: "14px", textAlign: "center" }}>
              {message}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
