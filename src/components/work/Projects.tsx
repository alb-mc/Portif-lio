import { buscarProjetosVisiveis } from "@/lib/services/projetos";
import ProjetosSupabaseClient from "./ProjetosSupabaseClient";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  compact?: boolean;
}

export async function Projects({ range, exclude, compact }: ProjectsProps) {
  let projetos = await buscarProjetosVisiveis();

  if (exclude && exclude.length > 0) {
    projetos = projetos.filter((projeto) => !exclude.includes(projeto.nome_url));
  }

  const projetosOrdenados = projetos.sort((a, b) => {
    return (
      new Date(b.data_publicacao).getTime() -
      new Date(a.data_publicacao).getTime()
    );
  });

  const projetosExibidos = range
    ? projetosOrdenados.slice(range[0] - 1, range[1] ?? projetosOrdenados.length)
    : projetosOrdenados;

  return (
    <ProjetosSupabaseClient projetos={projetosExibidos} compact={!!compact} />
  );
}