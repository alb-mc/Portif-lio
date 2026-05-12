import { buscarLivrosVisiveis } from "@/lib/services/livros";

function formatarStatus(status: string) {
  const mapa: Record<string, string> = {
    lido: "Lido",
    lendo: "Lendo",
    quero_ler: "Quero ler",
    pausado: "Pausado",
    abandonado: "Abandonado",
  };

  return mapa[status] ?? status;
}

export default async function LivrosPage() {
  const livros = await buscarLivrosVisiveis();

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
            Books
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
            Livros, estudos e aprendizados que recomendo.
          </p>
        </header>

        {livros.length === 0 ? (
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
              Nenhum livro publicado ainda.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 220px))",
              gap: "18px",
              justifyContent: "center",
            }}
          >
            {livros.map((livro) => (
              <article
                key={livro.id}
                style={{
                  overflow: "hidden",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.045)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
                  display: "flex",
                  flexDirection: "column",
                  width: "220px",
                }}
              >
                {livro.imagem_capa_url ? (
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={livro.imagem_capa_url}
                      alt={livro.titulo}
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
                      height: "300px",
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
                    Sem capa
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
                        fontSize: "18px",
                        lineHeight: 1.25,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {livro.titulo}
                    </h2>

                    {livro.autor ? (
                      <p
                        style={{
                          marginTop: "7px",
                          marginBottom: 0,
                          color: "rgba(255,255,255,0.62)",
                          fontSize: "14px",
                        }}
                      >
                        {livro.autor}
                      </p>
                    ) : null}

                    <p
                      style={{
                        marginTop: "9px",
                        marginBottom: 0,
                        color: "rgba(255,255,255,0.72)",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {formatarStatus(livro.status_leitura)}
                      {livro.nota ? ` · Nota ${livro.nota}/5` : ""}
                    </p>
                  </div>

                  {livro.descricao_curta ? (
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.68)",
                        lineHeight: 1.5,
                        fontSize: "13px",
                      }}
                    >
                      {livro.descricao_curta}
                    </p>
                  ) : null}

                  {livro.categorias.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        marginTop: "auto",
                      }}
                    >
                      {livro.categorias.map((categoria) => (
                        <span
                          key={categoria}
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
                          {categoria}
                        </span>
                      ))}
                    </div>
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