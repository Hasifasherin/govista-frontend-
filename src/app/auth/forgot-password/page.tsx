"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { authAPI } from "../../../services/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword({ email });

      if (res.data.success) {
        // Success message if email exists
        setMessage(res.data.message || "Reset link sent to your email.");
      } else {
        // If backend returns failure (like email not found)
        setError(res.data.message || "Email not found.");
      }
    } catch (err: any) {
      // Handle network or backend errors
      if (err.response?.status === 404) {
        setError(err.response?.data?.message || "Email not found.");
      } else {
        setError(err.response?.data?.message || "Failed to send reset link. Try again.");
      }
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
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your registered email to receive a reset link"
      >
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center", color: "#6B7280" }}>
          Remembered your password?{" "}
          <a
            href="/auth/login"
            style={{ color: "var(--green-primary)", fontWeight: 600 }}
          >
            Login
          </a>
        </p>
      </AuthCard>
    </div>
  );
}
