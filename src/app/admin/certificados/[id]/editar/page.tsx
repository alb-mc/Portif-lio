import { notFound } from "next/navigation";
import CertificadoForm from "@/components/admin/CertificadoForm";
import { buscarCertificadoPorId } from "@/lib/services/certificados";

type EditarCertificadoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarCertificadoPage({
  params,
}: EditarCertificadoPageProps) {
  const { id } = await params;

  const certificado = await buscarCertificadoPorId(id);

  if (!certificado) {
    notFound();
  }

  return <CertificadoForm modo="editar" certificadoInicial={certificado} />;
}