"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteSupabaseNavegador } from "@/lib/supabase/client";
import type { CertificadoPortfolio } from "@/types/database/certificado-portfolio";

type CertificadoFormProps = {
  modo: "criar" | "editar";
  certificadoInicial?: CertificadoPortfolio | null;
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

export default function CertificadoForm({
  modo,
  certificadoInicial,
}: CertificadoFormProps) {
  const router = useRouter();

  const [titulo, setTitulo] = useState(certificadoInicial?.titulo ?? "");
  const [instituicao, setInstituicao] = useState(
    certificadoInicial?.instituicao ?? "",
  );
  const [descricaoCurta, setDescricaoCurta] = useState(
    certificadoInicial?.descricao_curta ?? "",
  );
  const [imagemCertificadoUrl, setImagemCertificadoUrl] = useState(
    certificadoInicial?.imagem_certificado_url ?? "",
  );
  const [linkCertificado, setLinkCertificado] = useState(
    certificadoInicial?.link_certificado ?? "",
  );
  const [dataEmissao, setDataEmissao] = useState(
    certificadoInicial?.data_emissao ?? "",
  );
  const [dataExpiracao, setDataExpiracao] = useState(
    certificadoInicial?.data_expiracao ?? "",
  );
  const [tecnologias, setTecnologias] = useState(
    certificadoInicial?.tecnologias?.join(", ") ?? "",
  );
  const [visivel, setVisivel] = useState(certificadoInicial?.visivel ?? true);

  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const tituloPagina = useMemo(() => {
    return modo === "criar" ? "Novo certificado" : "Editar certificado";
  }, [modo]);

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
    const nomeBase = criarNomeArquivo(titulo || "certificado");
    const caminhoArquivo = `certificados/${nomeBase}-${Date.now()}.${extensao}`;

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

    setImagemCertificadoUrl(data.publicUrl);
    setEnviandoImagem(false);
  }

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSalvando(true);
    setMensagemErro("");

    const supabase = criarClienteSupabaseNavegador();

    const payload = {
      titulo,
      instituicao,
      descricao_curta: descricaoCurta || null,
      imagem_certificado_url: imagemCertificadoUrl || null,
      link_certificado: linkCertificado || null,
      data_emissao: dataEmissao || null,
      data_expiracao: dataExpiracao || null,
      tecnologias: transformarTextoEmLista(tecnologias),
      visivel,
      atualizado_em: new Date().toISOString(),
    };

    if (modo === "criar") {
      const { error } = await supabase.from("portfolio_certificados").insert({
        ...payload,
        criado_em: new Date().toISOString(),
      });

      setSalvando(false);

      if (error) {
        setMensagemErro(error.message);
        return;
      }

      router.push("/admin/certificados");
      router.refresh();
      return;
    }

    if (!certificadoInicial?.id) {
      setSalvando(false);
      setMensagemErro("Certificado não encontrado para edição.");
      return;
    }

    const { error } = await supabase
      .from("portfolio_certificados")
      .update(payload)
      .eq("id", certificadoInicial.id);

    setSalvando(false);

    if (error) {
      setMensagemErro(error.message);
      return;
    }

    router.push("/admin/certificados");
    router.refresh();
  }

  async function deletarCertificado() {
    if (!certificadoInicial?.id) {
      return;
    }

    const confirmou = window.confirm(
      "Tem certeza que deseja apagar este certificado?",
    );

    if (!confirmou) {
      return;
    }

    setSalvando(true);
    setMensagemErro("");

    const supabase = criarClienteSupabaseNavegador();

    const { error } = await supabase
      .from("portfolio_certificados")
      .delete()
      .eq("id", certificadoInicial.id);

    setSalvando(false);

    if (error) {
      setMensagemErro(error.message);
      return;
    }

    router.push("/admin/certificados");
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
    minHeight: "100px",
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
            Preencha os dados do certificado.
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
            Título do certificado
            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              required
              style={estiloInput}
              placeholder="Ex: AWS Cloud Practitioner"
            />
          </label>

          <label style={estiloLabel}>
            Instituição
            <input
              value={instituicao}
              onChange={(event) => setInstituicao(event.target.value)}
              required
              style={estiloInput}
              placeholder="Ex: AWS, Google, Udemy, Alura"
            />
          </label>

          <label style={estiloLabel}>
            Descrição curta
            <textarea
              value={descricaoCurta}
              onChange={(event) => setDescricaoCurta(event.target.value)}
              style={estiloTextarea}
              placeholder="Resumo sobre o certificado."
            />
          </label>

          <label style={estiloLabel}>
            Upload da imagem do certificado
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

          {imagemCertificadoUrl ? (
            <div
              style={{
                overflow: "hidden",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <img
                src={imagemCertificadoUrl}
                alt="Prévia do certificado"
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
            URL da imagem do certificado
            <input
              value={imagemCertificadoUrl}
              onChange={(event) => setImagemCertificadoUrl(event.target.value)}
              style={estiloInput}
              placeholder="Esse campo será preenchido automaticamente após upload"
            />
          </label>

          <label style={estiloLabel}>
            Link público do certificado
            <input
              value={linkCertificado}
              onChange={(event) => setLinkCertificado(event.target.value)}
              style={estiloInput}
              placeholder="https://..."
            />
          </label>

          <label style={estiloLabel}>
            Data de emissão
            <input
              type="date"
              value={dataEmissao}
              onChange={(event) => setDataEmissao(event.target.value)}
              style={estiloInput}
            />
          </label>

          <label style={estiloLabel}>
            Data de expiração
            <input
              type="date"
              value={dataExpiracao}
              onChange={(event) => setDataExpiracao(event.target.value)}
              style={estiloInput}
            />
          </label>

          <label style={estiloLabel}>
            Tecnologias / assuntos
            <input
              value={tecnologias}
              onChange={(event) => setTecnologias(event.target.value)}
              style={estiloInput}
              placeholder="AWS, Cloud, DevOps"
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
                onClick={deletarCertificado}
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
              {salvando ? "Salvando..." : "Salvar certificado"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}