"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteSupabaseNavegador } from "@/lib/supabase/client";
import type { LivroPortfolio } from "@/types/database/livro-portfolio";

type LivroFormProps = {
  modo: "criar" | "editar";
  livroInicial?: LivroPortfolio | null;
};

const BUCKET_IMAGENS = "portfolio-imagens";

function criarNomeArquivo(texto: string) {
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

export default function LivroForm({ modo, livroInicial }: LivroFormProps) {
  const router = useRouter();

  const [titulo, setTitulo] = useState(livroInicial?.titulo ?? "");
  const [autor, setAutor] = useState(livroInicial?.autor ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(
    livroInicial?.descricao_curta ?? "",
  );
  const [anotacoesPessoais, setAnotacoesPessoais] = useState(
    livroInicial?.anotacoes_pessoais ?? "",
  );
  const [imagemCapaUrl, setImagemCapaUrl] = useState(
    livroInicial?.imagem_capa_url ?? "",
  );
  const [statusLeitura, setStatusLeitura] = useState(
    livroInicial?.status_leitura ?? "lido",
  );
  const [nota, setNota] = useState(
    livroInicial?.nota ? String(livroInicial.nota) : "",
  );
  const [dataInicio, setDataInicio] = useState(
    livroInicial?.data_inicio ?? "",
  );
  const [dataFim, setDataFim] = useState(livroInicial?.data_fim ?? "");
  const [categorias, setCategorias] = useState(
    livroInicial?.categorias?.join(", ") ?? "",
  );
  const [visivel, setVisivel] = useState(livroInicial?.visivel ?? true);

  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  async function enviarImagem(arquivo: File) {
    setMensagemErro("");

    if (!arquivo.type.startsWith("image/")) {
      setMensagemErro("Selecione apenas arquivos de imagem.");
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagemErro("A imagem precisa ter no máximo 5 MB.");
      return;
    }

    setEnviandoImagem(true);

    const supabase = criarClienteSupabaseNavegador();

    const extensao = pegarExtensaoArquivo(arquivo.name);
    const nomeBase = criarNomeArquivo(titulo || "livro");
    const caminhoArquivo = `livros/${nomeBase}-${Date.now()}.${extensao}`;

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

    const notaConvertida = nota ? Number(nota) : null;

    if (notaConvertida !== null && (notaConvertida < 1 || notaConvertida > 5)) {
      setSalvando(false);
      setMensagemErro("A nota precisa estar entre 1 e 5.");
      return;
    }

    const payload = {
      titulo,
      autor: autor || null,
      descricao_curta: descricaoCurta || null,
      anotacoes_pessoais: anotacoesPessoais || null,
      imagem_capa_url: imagemCapaUrl || null,
      status_leitura: statusLeitura,
      nota: notaConvertida,
      data_inicio: dataInicio || null,
      data_fim: dataFim || null,
      categorias: transformarTextoEmLista(categorias),
      visivel,
      atualizado_em: new Date().toISOString(),
    };

    if (modo === "criar") {
      const { error } = await supabase.from("portfolio_livros").insert({
        ...payload,
        criado_em: new Date().toISOString(),
      });

      setSalvando(false);

      if (error) {
        setMensagemErro(error.message);
        return;
      }

      router.push("/admin/livros");
      router.refresh();
      return;
    }

    if (!livroInicial?.id) {
      setSalvando(false);
      setMensagemErro("Livro não encontrado para edição.");
      return;
    }

    const { error } = await supabase
      .from("portfolio_livros")
      .update(payload)
      .eq("id", livroInicial.id);

    setSalvando(false);

    if (error) {
      setMensagemErro(error.message);
      return;
    }

    router.push("/admin/livros");
    router.refresh();
  }

  async function deletarLivro() {
    if (!livroInicial?.id) {
      return;
    }

    const confirmou = window.confirm("Tem certeza que deseja apagar este livro?");

    if (!confirmou) {
      return;
    }

    setSalvando(true);
    setMensagemErro("");

    const supabase = criarClienteSupabaseNavegador();

    const { error } = await supabase
      .from("portfolio_livros")
      .delete()
      .eq("id", livroInicial.id);

    setSalvando(false);

    if (error) {
      setMensagemErro(error.message);
      return;
    }

    router.push("/admin/livros");
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
    minHeight: "110px",
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
            {modo === "criar" ? "Novo livro" : "Editar livro"}
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.5,
            }}
          >
            Preencha os dados do livro.
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
            Título do livro
            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              required
              style={estiloInput}
              placeholder="Ex: Código Limpo"
            />
          </label>

          <label style={estiloLabel}>
            Autor
            <input
              value={autor}
              onChange={(event) => setAutor(event.target.value)}
              style={estiloInput}
              placeholder="Ex: Robert C. Martin"
            />
          </label>

          <label style={estiloLabel}>
            Descrição curta
            <textarea
              value={descricaoCurta}
              onChange={(event) => setDescricaoCurta(event.target.value)}
              style={estiloTextarea}
              placeholder="Resumo curto sobre o livro."
            />
          </label>

          <label style={estiloLabel}>
            Anotações pessoais
            <textarea
              value={anotacoesPessoais}
              onChange={(event) => setAnotacoesPessoais(event.target.value)}
              style={estiloTextarea}
              placeholder="Suas observações, aprendizados ou comentários."
            />
          </label>

          <label style={estiloLabel}>
            Upload da capa do livro
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
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)" }}>
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
                alt="Prévia da capa do livro"
                style={{
                  width: "100%",
                  maxHeight: "260px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ) : null}

          <label style={estiloLabel}>
            URL da capa
            <input
              value={imagemCapaUrl}
              onChange={(event) => setImagemCapaUrl(event.target.value)}
              style={estiloInput}
              placeholder="Esse campo será preenchido automaticamente após upload"
            />
          </label>

          <label style={estiloLabel}>
            Status da leitura
            <select
              value={statusLeitura}
              onChange={(event) => setStatusLeitura(event.target.value)}
              style={estiloInput}
            >
              <option value="lido">Lido</option>
              <option value="lendo">Lendo</option>
              <option value="quero_ler">Quero ler</option>
              <option value="pausado">Pausado</option>
              <option value="abandonado">Abandonado</option>
            </select>
          </label>

          <label style={estiloLabel}>
            Nota de 1 a 5
            <input
              type="number"
              min="1"
              max="5"
              value={nota}
              onChange={(event) => setNota(event.target.value)}
              style={estiloInput}
              placeholder="Ex: 5"
            />
          </label>

          <label style={estiloLabel}>
            Data de início
            <input
              type="date"
              value={dataInicio}
              onChange={(event) => setDataInicio(event.target.value)}
              style={estiloInput}
            />
          </label>

          <label style={estiloLabel}>
            Data de fim
            <input
              type="date"
              value={dataFim}
              onChange={(event) => setDataFim(event.target.value)}
              style={estiloInput}
            />
          </label>

          <label style={estiloLabel}>
            Categorias
            <input
              value={categorias}
              onChange={(event) => setCategorias(event.target.value)}
              style={estiloInput}
              placeholder="Software, Arquitetura, Filosofia"
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
                onClick={deletarLivro}
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
              {salvando ? "Salvando..." : "Salvar livro"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}