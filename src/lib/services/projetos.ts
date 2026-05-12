import { criarClienteSupabaseServidor } from "../supabase/server";
import type {
  AtualizarProjetoPortfolioInput,
  CriarProjetoPortfolioInput,
  ProjetoPortfolio,
} from "../../types/database/projeto-portfolio";

const NOME_TABELA = "portfolio_projetos";

export async function buscarProjetosVisiveis(): Promise<ProjetoPortfolio[]> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("visivel", true)
    .order("data_publicacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar projetos visíveis:", error.message);
    return [];
  }

  return data ?? [];
}

export async function buscarProjetosAdmin(): Promise<ProjetoPortfolio[]> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar projetos no admin:", error.message);
    return [];
  }

  return data ?? [];
}

export async function buscarProjetoPorId(
  id: string,
): Promise<ProjetoPortfolio | null> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar projeto por ID:", error.message);
    return null;
  }

  return data;
}

export async function buscarProjetoPorNomeUrl(
  nomeUrl: string,
): Promise<ProjetoPortfolio | null> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("nome_url", nomeUrl)
    .eq("visivel", true)
    .single();

  if (error) {
    console.error("Erro ao buscar projeto por nome_url:", error.message);
    return null;
  }

  return data;
}

export async function criarProjetoPortfolio(
  input: CriarProjetoPortfolioInput,
): Promise<ProjetoPortfolio> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .insert({
      titulo: input.titulo,
      nome_url: input.nome_url,
      descricao_curta: input.descricao_curta,
      descricao_completa: input.descricao_completa ?? null,
      imagem_capa_url: input.imagem_capa_url ?? null,
      link_projeto: input.link_projeto ?? null,
      link_github: input.link_github ?? null,
      tecnologias: input.tecnologias ?? [],
      data_publicacao:
        input.data_publicacao ?? new Date().toISOString().slice(0, 10),
      destaque: input.destaque ?? false,
      visivel: input.visivel ?? true,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarProjetoPortfolio(
  id: string,
  input: AtualizarProjetoPortfolioInput,
): Promise<ProjetoPortfolio> {
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

export async function deletarProjetoPortfolio(id: string): Promise<void> {
  const supabase = await criarClienteSupabaseServidor();

  const { error } = await supabase.from(NOME_TABELA).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}