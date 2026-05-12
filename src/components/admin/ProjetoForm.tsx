"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteSupabaseNavegador } from "@/lib/supabase/client";
import type { ProjetoPortfolio } from "../../types/database/projeto-portfolio";

type ProjetoFormProps = {
  modo: "criar" | "editar";
  projetoInicial?: ProjetoPortfolio | null;
};

const BUCKET_IMAGENS = "portfolio-imagens";

function criarNomeUrl(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function transformarTextoEmLista(texto: string) {
  return texto
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function pegarExtensaoArquivo(nomeArquivo: string) {
  const partes = nomeArquivo.split(".");
  return partes.length > 1 ? partes.pop()?.toLowerCase() : "jpg";
}

export default function ProjetoForm({ modo, projetoInicial }: ProjetoFormProps) {
  const router = useRouter();

  const [titulo, setTitulo] = useState(projetoInicial?.titulo ?? "");
  const [nomeUrl, setNomeUrl] = useState(projetoInicial?.nome_url ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(
    projetoInicial?.descricao_curta ?? "",
  );
  const [descricaoCompleta, setDescricaoCompleta] = useState(
    projetoInicial?.descricao_completa ?? "",
  );
  const [imagemCapaUrl, setImagemCapaUrl] = useState(
    projetoInicial?.imagem_capa_url ?? "",
  );
  const [linkProjeto, setLinkProjeto] = useState(
    projetoInicial?.link_projeto ?? "",
  );
  const [linkGithub, setLinkGithub] = useState(
    projetoInicial?.link_github ?? "",
  );
  const [tecnologias, setTecnologias] = useState(
    projetoInicial?.tecnologias?.join(", ") ?? "",
  );
  const [dataPublicacao, setDataPublicacao] = useState(
    projetoInicial?.data_publicacao ?? new Date().toISOString().slice(0, 10),
  );
  const [destaque, setDestaque] = useState(projetoInicial?.destaque ?? false);
  const [visivel, setVisivel] = useState(projetoInicial?.visivel ?? true);

  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const tituloPagina = useMemo(() => {
    return modo === "criar" ? "Novo projeto" : "Editar projeto";
  }, [modo]);

  function atualizarTitulo(valor: string) {
    setTitulo(valor);

    if (modo === "criar") {
      setNomeUrl(criarNomeUrl(valor));
    }
  }

  async function enviarImagem(arquivo: File) {
    setMensagemErro("");

    if (!arquivo.type.startsWith("image/")) {
      setMensagemErro("Selecione apenas arquivos de imagem.");
      return;
    }

    const tamanhoMaximoEmMb = 5;
    const tamanhoMaximoEmBytes = tamanhoMaximoEmMb * 1024 * 1024;

    if (arquivo.size > tamanhoMaximoEmBytes) {
      setMensagemErro(`A imagem precisa ter no máximo ${tamanhoMaximoEmMb} MB.`);
      return;
    }

    setEnviandoImagem(true);

    const supabase = criarClienteSupabaseNavegador();

    const extensao = pegarExtensaoArquivo(arquivo.name);
    const nomeBase = nomeUrl || criarNomeUrl(titulo) || "projeto";
    const caminhoArquivo = `projetos/${nomeBase}-${Date.now()}.${extensao}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_IMAGENS)
      .upload(caminhoArquivo, arquivo, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setEnviandoImagem(false);
      setMensagemErro(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from(BUCKET_IMAGENS)
      .getPublicUrl(caminhoArquivo);

    setImagemCapaUrl(data.publicUrl);
    setEnviandoImagem(false);
  }

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSalvando(true);
    setMensagemErro("");

    const supabase = criarClienteSupabaseNavegador();

    const payload = {
      titulo,
      nome_url: nomeUrl,
      descricao_curta: descricaoCurta,
      descricao_completa: descricaoCompleta || null,
      imagem_capa_url: imagemCapaUrl || null,
      link_projeto: linkProjeto || null,
      link_github: linkGithub || null,
      tecnologias: transformarTextoEmLista(tecnologias),
      data_publicacao: dataPublicacao,
      destaque,
      visivel,
      atualizado_em: new Date().toISOString(),
    };

    if (modo === "criar") {
      const { error } = await supabase.from("portfolio_projetos").insert({
        ...payload,
        criado_em: new Date().toISOString(),
      });

      setSalvando(false);

      if (error) {
        setMensagemErro(error.message);
        return;
      }

      router.push("/admin/projetos");
      router.refresh();
      return;
    }

    if (!projetoInicial?.id) {
      setSalvando(false);
      setMensagemErro("Projeto não encontrado para edição.");
      return;
    }

    const { error } = await supabase
      .from("portfolio_projetos")
      .update(payload)
      .eq("id", projetoInicial.id);

    setSalvando(false);

    if (error) {
      setMensagemErro(error.message);
      return;
    }

    router.push("/admin/projetos");
    router.refresh();
  }

  async function deletarProjeto() {
    if (!projetoInicial?.id) {
      return;
    }

    const confirmou = window.confirm(
      "Tem certeza que deseja apagar este projeto?",
    );

    if (!confirmou) {
      return;
    }

    setSalvando(true);
    setMensagemErro("");

    const supabase = criarClienteSupabaseNavegador();

    const { error } = await supabase
      .from("portfolio_projetos")
      .delete()
      .eq("id", projetoInicial.id);

    setSalvando(false);

    if (error) {
      setMensagemErro(error.message);
      return;
    }

    router.push("/admin/projetos");
    router.refresh();
  }

  const estiloInput = {
    height: "44px",
    padding: "0 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.28)",
    color: "#ffffff",
    outline: "none",
  };

  const estiloTextarea = {
    minHeight: "120px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.28)",
    color: "#ffffff",
    outline: "none",
    resize: "vertical" as const,
  };

  const estiloLabel = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    fontWeight: 700,
  };

  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        padding: "40px 16px",
        color: "#ffffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: "820px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
            }}
          >
            {tituloPagina}
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.5,
            }}
          >
            Preencha os dados que vão aparecer no seu portfólio.
          </p>
        </div>

        <form
          onSubmit={salvar}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "24px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.045)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
          }}
        >
          <label style={estiloLabel}>
            Título do projeto
            <input
              value={titulo}
              onChange={(event) => atualizarTitulo(event.target.value)}
              required
              style={estiloInput}
              placeholder="Ex: Sistema de Gestão Imobiliária"
            />
          </label>

          <label style={estiloLabel}>
            Nome na URL
            <input
              value={nomeUrl}
              onChange={(event) => setNomeUrl(criarNomeUrl(event.target.value))}
              required
              style={estiloInput}
              placeholder="Ex: sistema-gestao-imobiliaria"
            />
          </label>

          <label style={estiloLabel}>
            Descrição curta
            <textarea
              value={descricaoCurta}
              onChange={(event) => setDescricaoCurta(event.target.value)}
              required
              style={estiloTextarea}
              placeholder="Resumo pequeno para aparecer no card."
            />
          </label>

          <label style={estiloLabel}>
            Descrição completa
            <textarea
              value={descricaoCompleta}
              onChange={(event) => setDescricaoCompleta(event.target.value)}
              style={estiloTextarea}
              placeholder="Descrição mais completa do projeto."
            />
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <label style={estiloLabel}>
              Upload da imagem de capa
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const arquivo = event.target.files?.[0];

                  if (arquivo) {
                    enviarImagem(arquivo);
                  }
                }}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,0.28)",
                  color: "#ffffff",
                }}
              />
            </label>

            {enviandoImagem ? (
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 700,
                }}
              >
                Enviando imagem...
              </p>
            ) : null}

            {imagemCapaUrl ? (
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <img
                  src={imagemCapaUrl}
                  alt="Prévia da imagem de capa"
                  style={{
                    width: "100%",
                    maxHeight: "260px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ) : null}
          </div>

          <label style={estiloLabel}>
            URL da imagem de capa
            <input
              value={imagemCapaUrl}
              onChange={(event) => setImagemCapaUrl(event.target.value)}
              style={estiloInput}
              placeholder="Esse campo será preenchido automaticamente após upload"
            />
          </label>

          <label style={estiloLabel}>
            Link do projeto online
            <input
              value={linkProjeto}
              onChange={(event) => setLinkProjeto(event.target.value)}
              style={estiloInput}
              placeholder="https://..."
            />
          </label>

          <label style={estiloLabel}>
            Link do GitHub
            <input
              value={linkGithub}
              onChange={(event) => setLinkGithub(event.target.value)}
              style={estiloInput}
              placeholder="https://github.com/..."
            />
          </label>

          <label style={estiloLabel}>
            Tecnologias
            <input
              value={tecnologias}
              onChange={(event) => setTecnologias(event.target.value)}
              style={estiloInput}
              placeholder="Next.js, TypeScript, Supabase"
            />
          </label>

          <label style={estiloLabel}>
            Data de publicação
            <input
              type="date"
              value={dataPublicacao}
              onChange={(event) => setDataPublicacao(event.target.value)}
              required
              style={estiloInput}
            />
          </label>

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            <input
              type="checkbox"
              checked={destaque}
              onChange={(event) => setDestaque(event.target.checked)}
            />
            Marcar como destaque
          </label>

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            <input
              type="checkbox"
              checked={visivel}
              onChange={(event) => setVisivel(event.target.checked)}
            />
            Visível no site
          </label>

          {mensagemErro ? (
            <p
              style={{
                margin: 0,
                color: "#ff6b6b",
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {mensagemErro}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {modo === "editar" ? (
              <button
                type="button"
                onClick={deletarProjeto}
                disabled={salvando || enviandoImagem}
                style={{
                  height: "44px",
                  padding: "0 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,80,80,0.45)",
                  background: "rgba(255,80,80,0.08)",
                  color: "#ff8a8a",
                  cursor: salvando || enviandoImagem ? "not-allowed" : "pointer",
                  fontWeight: 800,
                }}
              >
                Apagar
              </button>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={salvando || enviandoImagem}
              style={{
                height: "44px",
                padding: "0 18px",
                borderRadius: "10px",
                border: "none",
                background: "#ffffff",
                color: "#000000",
                cursor: salvando || enviandoImagem ? "not-allowed" : "pointer",
                fontWeight: 900,
                opacity: salvando || enviandoImagem ? 0.7 : 1,
              }}
            >
              {salvando ? "Salvando..." : "Salvar projeto"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}