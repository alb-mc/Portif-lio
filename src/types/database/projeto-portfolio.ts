export type ProjetoPortfolio = {
  id: string;

  titulo: string;
  nome_url: string;

  descricao_curta: string;
  descricao_completa: string | null;

  imagem_capa_url: string | null;
  link_projeto: string | null;
  link_github: string | null;

  tecnologias: string[];

  data_publicacao: string;

  destaque: boolean;
  visivel: boolean;

  criado_em: string | null;
  atualizado_em: string | null;
};

export type CriarProjetoPortfolioInput = {
  titulo: string;
  nome_url: string;

  descricao_curta: string;
  descricao_completa?: string | null;

  imagem_capa_url?: string | null;
  link_projeto?: string | null;
  link_github?: string | null;

  tecnologias?: string[];

  data_publicacao?: string;

  destaque?: boolean;
  visivel?: boolean;
};

export type AtualizarProjetoPortfolioInput =
  Partial<CriarProjetoPortfolioInput>;