import { notFound } from "next/navigation";
import ProjetoForm from "@/components/admin/ProjetoForm";
import { buscarProjetoPorId } from "@/lib/services/projetos";

type EditarProjetoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarProjetoPage({
  params,
}: EditarProjetoPageProps) {
  const { id } = await params;

  const projeto = await buscarProjetoPorId(id);

  if (!projeto) {
    notFound();
  }

  return <ProjetoForm modo="editar" projetoInicial={projeto} />;
}