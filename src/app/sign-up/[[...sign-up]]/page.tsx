import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: "var(--accent)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
          NextFlow
        </span>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>
        Create your account to get started
      </p>
      <SignUp />
    </div>
  )
}
