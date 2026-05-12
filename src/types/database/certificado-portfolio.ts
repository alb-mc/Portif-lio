export type CertificadoPortfolio = {
  id: string;

  titulo: string;
  instituicao: string;

  descricao_curta: string | null;

  imagem_certificado_url: string | null;
  link_certificado: string | null;

  data_emissao: string | null;
  data_expiracao: string | null;

  tecnologias: string[];

  visivel: boolean;

  criado_em: string | null;
  atualizado_em: string | null;
};

export type CriarCertificadoPortfolioInput = {
  titulo: string;
  instituicao: string;

  descricao_curta?: string | null;

  imagem_certificado_url?: string | null;
  link_certificado?: string | null;

  data_emissao?: string | null;
  data_expiracao?: string | null;

  tecnologias?: string[];

  visivel?: boolean;
};

export type AtualizarCertificadoPortfolioInput =
  Partial<CriarCertificadoPortfolioInput>;