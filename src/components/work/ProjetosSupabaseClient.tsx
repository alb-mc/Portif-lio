"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { ProjetoPortfolio } from "@/types/database/projeto-portfolio";

type ProjetosSupabaseClientProps = {
  projetos: ProjetoPortfolio[];
  compact?: boolean;
};

export default function ProjetosSupabaseClient({
  projetos,
  compact = false,
}: ProjetosSupabaseClientProps) {
  const [buscaDigitada, setBuscaDigitada] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [tecnologiasSelecionadas, setTecnologiasSelecionadas] = useState<
    string[]
  >([]);

  const tecnologiasDisponiveis = useMemo(() => {
    const tecnologias = projetos.flatMap((projeto) => projeto.tecnologias ?? []);

    return Array.from(new Set(tecnologias)).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [projetos]);

  const projetosFiltrados = useMemo(() => {
    const busca = buscaAplicada.trim().toLowerCase();

    return projetos.filter((projeto) => {
      const titulo = projeto.titulo.toLowerCase();
      const descricao = projeto.descricao_curta.toLowerCase();
      const tecnologias = projeto.tecnologias.join(" ").toLowerCase();

      const passouNaBusca = busca
        ? titulo.includes(busca) ||
          descricao.includes(busca) ||
          tecnologias.includes(busca)
        : true;

      const passouNasTecnologias =
        tecnologiasSelecionadas.length > 0
          ? tecnologiasSelecionadas.some((tecnologiaSelecionada) =>
              projeto.tecnologias
                .map((tecnologia) => tecnologia.toLowerCase())
                .includes(tecnologiaSelecionada.toLowerCase()),
            )
          : true;

      return passouNaBusca && passouNasTecnologias;
    });
  }, [projetos, buscaAplicada, tecnologiasSelecionadas]);

  function alternarTecnologia(tecnologia: string) {
    setTecnologiasSelecionadas((tecnologiasAtuais) => {
      if (tecnologiasAtuais.includes(tecnologia)) {
        return tecnologiasAtuais.filter((item) => item !== tecnologia);
      }

      return [...tecnologiasAtuais, tecnologia];
    });
  }

  return (
    <section
      style={{
        width: "100%",
        padding: compact ? "12px 16px 48px" : "24px 16px 64px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <input
            value={buscaDigitada}
            onChange={(event) => setBuscaDigitada(event.target.value)}
            placeholder="Buscar por título, tecnologia..."
            style={{
              flex: "1 1 260px",
              height: "44px",
              padding: "0 14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.045)",
              color: "#ffffff",
              outline: "none",
            }}
          />

          <button
            type="button"
            onClick={() => setBuscaAplicada(buscaDigitada)}
            style={{
              height: "44px",
              padding: "0 18px",
              borderRadius: "12px",
              border: "none",
              background: "#ffffff",
              color: "#000000",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
        </div>

        {tecnologiasDisponiveis.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            {tecnologiasDisponiveis.map((tecnologia) => {
              const selecionada = tecnologiasSelecionadas.includes(tecnologia);

              return (
                <button
                  key={tecnologia}
                  type="button"
                  onClick={() => alternarTecnologia(tecnologia)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: selecionada
                      ? "#ffffff"
                      : "rgba(255,255,255,0.045)",
                    color: selecionada ? "#000000" : "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {tecnologia}
                </button>
              );
            })}
          </div>
        ) : null}

        {projetosFiltrados.length === 0 ? (
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
              Nenhum projeto encontrado.
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
            {projetosFiltrados.map((projeto) => (
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
                  <Link
                    href={`/work/${projeto.nome_url}`}
                    style={{
                      display: "block",
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
                  </Link>
                ) : (
                  <Link
                    href={`/work/${projeto.nome_url}`}
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
                      textDecoration: "none",
                    }}
                  >
                    Sem imagem
                  </Link>
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
                    <Link
                      href={`/work/${projeto.nome_url}`}
                      style={{
                        color: "#ffffff",
                        textDecoration: "none",
                      }}
                    >
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
                    </Link>

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
                      href={`/work/${projeto.nome_url}`}
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
                      Ver projeto
                    </Link>

                    {projeto.link_github ? (
                      <a
                        href={projeto.link_github}
                        target="_blank"
                        rel="noreferrer"
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
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}