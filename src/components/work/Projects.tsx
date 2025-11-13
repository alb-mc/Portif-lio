import { getPosts } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import ProjectsClient from "./ProjectsClient";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  compact?: boolean;
}

export function Projects({ range, exclude, compact }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  // Exclude by slug (exact match)
  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return <ProjectsClient posts={displayedProjects} compact={!!compact} />;
}
