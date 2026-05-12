import Link from "next/link";
import { buscarProjetosAdmin } from "@/lib/services/projetos";

export default async function AdminProjetosPage() {
  const projetos = await buscarProjetosAdmin();

  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        padding: "40px 16px",
        color: "#ffffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1120px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "flex-start",
            marginBottom: "36px",
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
              Projetos
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
              Lista dos projetos cadastrados no Supabase.
            </p>
          </div>

          <Link
            href="/admin/projetos/novo"
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
            Novo projeto
          </Link>
        </div>

        {projetos.length === 0 ? (
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
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)" }}>
              Nenhum projeto encontrado. Clique em "Novo projeto" para cadastrar
              o primeiro.
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
            {projetos.map((projeto) => (
              <article
                key={projeto.id}
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
                {projeto.imagem_capa_url ? (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <img
                      src={projeto.imagem_capa_url}
                      alt={projeto.titulo}
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
                      {projeto.titulo}
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
                      Projeto
                    </p>

                    <p
                      style={{
                        marginTop: "9px",
                        marginBottom: 0,
                        color: "rgba(255,255,255,0.62)",
                        fontSize: "13px",
                      }}
                    >
                      /work/{projeto.nome_url}
                    </p>

                    <p
                      style={{
                        marginTop: "8px",
                        marginBottom: 0,
                        color: "rgba(255,255,255,0.72)",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {projeto.visivel ? "Visível no site" : "Oculto no site"}
                      {projeto.destaque ? " · Destaque" : ""}
                    </p>
                  </div>

                  {projeto.descricao_curta ? (
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.68)",
                        lineHeight: 1.5,
                        fontSize: "13px",
                      }}
                    >
                      {projeto.descricao_curta}
                    </p>
                  ) : null}

                  {projeto.tecnologias.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        marginTop: "auto",
                      }}
                    >
                      {projeto.tecnologias.map((tecnologia) => (
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

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "4px",
                    }}
                  >
                    <Link
                      href={`/admin/projetos/${projeto.id}/editar`}
                      style={{
                        height: "38px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 14px",
                        borderRadius: "10px",
                        background: "#ffffff",
                        color: "#000000",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "14px",
                        flex: "1 1 auto",
                      }}
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/work/${projeto.nome_url}`}
                      target="_blank"
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
                        fontSize: "14px",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      Ver
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