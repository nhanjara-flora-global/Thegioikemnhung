export default function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2.25rem", lineHeight: 1.2, color: "var(--primary)" }}>
          Thế Giới Kem Nhung
        </h1>
        <p style={{ marginTop: "0.75rem", color: "var(--muted)" }}>Sắp ra mắt</p>
      </div>
    </main>
  );
}
