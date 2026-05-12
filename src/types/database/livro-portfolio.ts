export type LivroPortfolio = {
  id: string;

  titulo: string;
  autor: string | null;

  descricao_curta: string | null;
  anotacoes_pessoais: string | null;

  imagem_capa_url: string | null;

  status_leitura: string;
  nota: number | null;

  data_inicio: string | null;
  data_fim: string | null;

  categorias: string[];

  visivel: boolean;

  criado_em: string | null;
  atualizado_em: string | null;
};

export type CriarLivroPortfolioInput = {
  titulo: string;
  autor?: string | null;

  descricao_curta?: string | null;
  anotacoes_pessoais?: string | null;

  imagem_capa_url?: string | null;

  status_leitura?: string;
  nota?: number | null;

  data_inicio?: string | null;
  data_fim?: string | null;

  categorias?: string[];

  visivel?: boolean;
};

export type AtualizarLivroPortfolioInput = Partial<CriarLivroPortfolioInput>;