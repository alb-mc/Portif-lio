import { criarClienteSupabaseServidor } from "@/lib/supabase/server";
import type {
  AtualizarCertificadoPortfolioInput,
  CertificadoPortfolio,
  CriarCertificadoPortfolioInput,
} from "@/types/database/certificado-portfolio";

const NOME_TABELA = "portfolio_certificados";

export async function buscarCertificadosVisiveis(): Promise<
  CertificadoPortfolio[]
> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("visivel", true)
    .order("data_emissao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar certificados visíveis:", error.message);
    return [];
  }

  return data ?? [];
}

export async function buscarCertificadosAdmin(): Promise<
  CertificadoPortfolio[]
> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar certificados no admin:", error.message);
    return [];
  }

  return data ?? [];
}

export async function buscarCertificadoPorId(
  id: string,
): Promise<CertificadoPortfolio | null> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar certificado por ID:", error.message);
    return null;
  }

  return data;
}

export async function criarCertificadoPortfolio(
  input: CriarCertificadoPortfolioInput,
): Promise<CertificadoPortfolio> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .insert({
      titulo: input.titulo,
      instituicao: input.instituicao,
      descricao_curta: input.descricao_curta ?? null,
      imagem_certificado_url: input.imagem_certificado_url ?? null,
      link_certificado: input.link_certificado ?? null,
      data_emissao: input.data_emissao ?? null,
      data_expiracao: input.data_expiracao ?? null,
      tecnologias: input.tecnologias ?? [],
      visivel: input.visivel ?? true,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarCertificadoPortfolio(
  id: string,
  input: AtualizarCertificadoPortfolioInput,
): Promise<CertificadoPortfolio> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .update({
      ...input,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletarCertificadoPortfolio(id: string): Promise<void> {
  const supabase = await criarClienteSupabaseServidor();

  const { error } = await supabase.from(NOME_TABELA).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}