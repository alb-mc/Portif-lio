import Link from "next/link";
import { buscarCertificadosAdmin } from "@/lib/services/certificados";

export default async function AdminCertificadosPage() {
  const certificados = await buscarCertificadosAdmin();

  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        padding: "40px 16px",
        color: "#ffffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1040px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "flex-start",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "40px",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              Certificados
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
              Lista dos certificados cadastrados no Supabase.
            </p>
          </div>

          <Link
            href="/admin/certificados/novo"
            style={{
              height: "44px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#000000",
              textDecoration: "none",
              fontWeight: 800,
              boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
            }}
          >
            Novo certificado
          </Link>
        </div>

        {certificados.length === 0 ? (
          <div
            style={{
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.045)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
            }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)" }}>
              Nenhum certificado encontrado. Clique em "Novo certificado" para
              cadastrar o primeiro.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {certificados.map((certificado) => (
              <article
                key={certificado.id}
                style={{
                  overflow: "hidden",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.045)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
                }}
              >
                {certificado.imagem_certificado_url ? (
                  <img
                    src={certificado.imagem_certificado_url}
                    alt={certificado.titulo}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}

                <div
                  style={{
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "21px",
                        lineHeight: 1.25,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {certificado.titulo}
                    </h2>

                    <p
                      style={{
                        marginTop: "8px",
                        marginBottom: 0,
                        color: "rgba(255,255,255,0.62)",
                      }}
                    >
                      {certificado.instituicao}
                    </p>

                    <p
                      style={{
                        marginTop: "8px",
                        marginBottom: 0,
                        color: "rgba(255,255,255,0.72)",
                        fontSize: "14px",
                      }}
                    >
                      {certificado.visivel
                        ? "Visível no site"
                        : "Oculto no site"}
                    </p>
                  </div>

                  {certificado.descricao_curta ? (
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.68)",
                        lineHeight: 1.5,
                        fontSize: "14px",
                      }}
                    >
                      {certificado.descricao_curta}
                    </p>
                  ) : null}

                  {certificado.tecnologias.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {certificado.tecnologias.map((tecnologia) => (
                        <span
                          key={tecnologia}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.78)",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {tecnologia}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "auto",
                    }}
                  >
                    <Link
                      href={`/admin/certificados/${certificado.id}/editar`}
                      style={{
                        height: "38px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 14px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: 700,
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}