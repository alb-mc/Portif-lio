import Link from "next/link";

export default function AdminPage() {
  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        padding: "40px 16px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "rgba(255,255,255,0.68)",
              fontSize: "16px",
              lineHeight: 1.5,
            }}
          >
            Gerencie o conteúdo do seu portfólio sem alterar o código
            manualmente.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          <Link
            href="/admin/projetos"
            style={{
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.045)",
              color: "#ffffff",
              textDecoration: "none",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                lineHeight: 1.2,
              }}
            >
              Projetos
            </h2>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.5,
              }}
            >
              Cadastrar, listar e editar projetos do portfólio.
            </p>
          </Link>

          <Link
            href="/admin/certificados"
            style={{
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.045)",
              color: "#ffffff",
              textDecoration: "none",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                lineHeight: 1.2,
              }}
            >
              Certificados
            </h2>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.5,
              }}
            >
              Cadastrar certificados, links e instituições.
            </p>
          </Link>

          <Link
            href="/admin/livros"
            style={{
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.045)",
              color: "#ffffff",
              textDecoration: "none",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                lineHeight: 1.2,
              }}
            >
              Livros
            </h2>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.5,
              }}
            >
              Cadastrar livros lidos, notas e anotações.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}