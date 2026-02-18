interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div
      style={{
        width: "420px",
        padding: "32px",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#14532d" }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{ marginTop: "8px", marginBottom: "24px", color: "#6B7280" }}>
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
