import { getPosts } from "@/utils/utils";
import ProjectsClient from "../work/ProjectsClient";

interface CertificatesProps {
  range?: [number, number?];
  exclude?: string[];
  compact?: boolean;
}

export function Certificates({ range, exclude, compact }: CertificatesProps) {
  // Busca certificados na pasta de blog posts
  let allCertificates = getPosts(["src", "app", "blog", "posts"]);

  // Exclui por slug se necessário
  if (exclude && exclude.length > 0) {
    allCertificates = allCertificates.filter((post) => !exclude.includes(post.slug));
  }

  // Ordena por data de publicação
  const sortedCertificates = allCertificates.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedCertificates = range
    ? sortedCertificates.slice(range[0] - 1, range[1] ?? sortedCertificates.length)
    : sortedCertificates;

  // Usa o mesmo cliente visual de Projects
  return <ProjectsClient posts={displayedCertificates} compact={!!compact} />;
}
