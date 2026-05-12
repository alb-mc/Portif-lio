import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarProjetoPorNomeUrl } from "@/lib/services/projetos";

type ProjetoDetalhePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjetoDetalhePage({
  params,
}: ProjetoDetalhePageProps) {
  const { slug } = await params;

  const projeto = await buscarProjetoPorNomeUrl(slug);

  if (!projeto) {
    console.log("Projeto não encontrado para slug:", slug);
    notFound();
  }

  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        padding: "40px 16px 64px",
        color: "#ffffff",
      }}
    >
      <article
        style={{
          width: "100%",
          maxWidth: "920px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/work"
          style={{
            color: "rgba(255,255,255,0.72)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Voltar para projetos
        </Link>

        <header style={{ marginTop: "28px", marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(40px, 8vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.06em",
            }}
          >
            {projeto.titulo}
          </h1>

          <p
            style={{
              marginTop: "18px",
              marginBottom: 0,
              maxWidth: "720px",
              color: "rgba(255,255,255,0.72)",
              fontSize: "18px",
              lineHeight: 1.6,
            }}
          >
            {projeto.descricao_curta}
          </p>
        </header>

        {projeto.imagem_capa_url ? (
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.045)",
              marginBottom: "28px",
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
        ) : null}

        {projeto.tecnologias.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            {projeto.tecnologias.map((tecnologia: string) => (
              <span
                key={tecnologia}
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {tecnologia}
              </span>
            ))}
          </div>
        ) : null}

        <section
          style={{
            padding: "28px",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.045)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
            marginBottom: "28px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "16px",
              fontSize: "24px",
            }}
          >
            Sobre o projeto
          </h2>

          <p
            style={{
              margin: 0,
              whiteSpace: "pre-line",
              color: "rgba(255,255,255,0.74)",
              lineHeight: 1.8,
              fontSize: "16px",
            }}
          >
            {projeto.descricao_completa || projeto.descricao_curta}
          </p>
        </section>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {projeto.link_projeto ? (
            <a
              href={projeto.link_projeto}
              target="_blank"
              rel="noreferrer"
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
                fontWeight: 900,
              }}
            >
              Acessar projeto
            </a>
          ) : null}

          {projeto.link_github ? (
            <a
              href={projeto.link_github}
              target="_blank"
              rel="noreferrer"
              style={{
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 18px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 800,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              Ver GitHub
            </a>
          ) : null}
        </div>
      </article>
    </main>
  );
}