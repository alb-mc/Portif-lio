import { buscarCertificadosVisiveis } from "@/lib/services/certificados";

function formatarData(data: string | null) {
  if (!data) {
    return null;
  }

  const partes = data.split("-");

  if (partes.length !== 3) {
    return data;
  }

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

export default async function CertificationsPage() {
  const certificados = await buscarCertificadosVisiveis();

  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        padding: "40px 16px 64px",
        color: "#ffffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1120px", margin: "0 auto" }}>
        <header
          style={{
            marginBottom: "36px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(44px, 7vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.06em",
            }}
          >
            Certifications
          </h1>

          <p
            style={{
              marginTop: "16px",
              marginBottom: 0,
              color: "rgba(255,255,255,0.72)",
              fontSize: "18px",
              lineHeight: 1.6,
            }}
          >
            Certificados, cursos e formações que fazem parte da minha trajetória.
          </p>
        </header>

        {certificados.length === 0 ? (
          <div
            style={{
              padding: "28px",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.045)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.6,
              }}
            >
              Nenhum certificado publicado ainda.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 300px))",
              gap: "18px",
              justifyContent: "center",
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
                  display: "flex",
                  flexDirection: "column",
                  width: "300px",
                }}
              >
                {certificado.imagem_certificado_url ? (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <img
                      src={certificado.imagem_certificado_url}
                      alt={certificado.titulo}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.48)",
                      fontWeight: 800,
                      fontSize: "18px",
                      textAlign: "center",
                      padding: "24px",
                    }}
                  >
                    Sem imagem
                  </div>
                )}

                <div
                  style={{
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        lineHeight: 1.25,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {certificado.titulo}
                    </h2>

                    <p
                      style={{
                        marginTop: "7px",
                        marginBottom: 0,
                        color: "#00e676",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      {certificado.instituicao}
                    </p>

                    {certificado.data_emissao ? (
                      <p
                        style={{
                          marginTop: "9px",
                          marginBottom: 0,
                          color: "rgba(255,255,255,0.62)",
                          fontSize: "13px",
                        }}
                      >
                        Emitido em {formatarData(certificado.data_emissao)}
                      </p>
                    ) : null}
                  </div>

                  {certificado.descricao_curta ? (
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.68)",
                        lineHeight: 1.5,
                        fontSize: "13px",
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
                        gap: "7px",
                        marginTop: "auto",
                      }}
                    >
                      {certificado.tecnologias.map((tecnologia) => (
                        <span
                          key={tecnologia}
                          style={{
                            padding: "5px 9px",
                            borderRadius: "999px",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.78)",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {tecnologia}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {certificado.link_certificado ? (
                    <a
                      href={certificado.link_certificado}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        height: "38px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "4px",
                        padding: "0 14px",
                        borderRadius: "10px",
                        background: "#ffffff",
                        color: "#000000",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "14px",
                      }}
                    >
                      Ver certificado
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}