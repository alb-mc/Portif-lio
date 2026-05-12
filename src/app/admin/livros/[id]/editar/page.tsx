import { notFound } from "next/navigation";
import LivroForm from "@/components/admin/LivroForm";
import { buscarLivroPorId } from "@/lib/services/livros";

type EditarLivroPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarLivroPage({ params }: EditarLivroPageProps) {
  const { id } = await params;

  const livro = await buscarLivroPorId(id);

  if (!livro) {
    notFound();
  }

  return <LivroForm modo="editar" livroInicial={livro} />;
}