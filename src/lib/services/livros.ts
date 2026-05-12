import { criarClienteSupabaseServidor } from "@/lib/supabase/server";
import type {
  AtualizarLivroPortfolioInput,
  CriarLivroPortfolioInput,
  LivroPortfolio,
} from "@/types/database/livro-portfolio";

const NOME_TABELA = "portfolio_livros";

export async function buscarLivrosVisiveis(): Promise<LivroPortfolio[]> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("visivel", true)
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar livros visíveis:", error.message);
    return [];
  }

  return data ?? [];
}

export async function buscarLivrosAdmin(): Promise<LivroPortfolio[]> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar livros no admin:", error.message);
    return [];
  }

  return data ?? [];
}

export async function buscarLivroPorId(
  id: string,
): Promise<LivroPortfolio | null> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar livro por ID:", error.message);
    return null;
  }

  return data;
}

export async function criarLivroPortfolio(
  input: CriarLivroPortfolioInput,
): Promise<LivroPortfolio> {
  const supabase = await criarClienteSupabaseServidor();

  const { data, error } = await supabase
    .from(NOME_TABELA)
    .insert({
      titulo: input.titulo,
      autor: input.autor ?? null,
      descricao_curta: input.descricao_curta ?? null,
      anotacoes_pessoais: input.anotacoes_pessoais ?? null,
      imagem_capa_url: input.imagem_capa_url ?? null,
      status_leitura: input.status_leitura ?? "lido",
      nota: input.nota ?? null,
      data_inicio: input.data_inicio ?? null,
      data_fim: input.data_fim ?? null,
      categorias: input.categorias ?? [],
      visivel: input.visivel ?? true,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarLivroPortfolio(
  id: string,
  input: AtualizarLivroPortfolioInput,
): Promise<LivroPortfolio> {
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

export async function deletarLivroPortfolio(id: string): Promise<void> {
  const supabase = await criarClienteSupabaseServidor();

  const { error } = await supabase.from(NOME_TABELA).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}