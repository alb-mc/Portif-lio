"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSecretButton() {
  const pathname = usePathname();

  const estaNoAdmin = pathname.startsWith("/admin");

  if (estaNoAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      aria-label="Área administrativa"
      title="Admin"
      style={{
        position: "fixed",
        right: "18px",
        bottom: "18px",
        width: "30px",
        height: "30px",
        borderRadius: "999px",
        zIndex: 9999,
        opacity: 0.12,
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.24)",
        backdropFilter: "blur(8px)",
        transition: "opacity 160ms ease, transform 160ms ease",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.7)",
        fontSize: "11px",
        fontWeight: 800,
        textDecoration: "none",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.opacity = "0.55";
        event.currentTarget.style.transform = "scale(1.08)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.opacity = "0.12";
        event.currentTarget.style.transform = "scale(1)";
      }}
    >
      A
    </Link>
  );
}