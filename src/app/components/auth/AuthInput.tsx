interface AuthInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
}: AuthInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: 500 }}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled} 
        required
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          outline: "none",
          backgroundColor: disabled ? "#F3F4F6" : "#fff", 
        }}
      />
    </div>
  );
}
