"use client";

import React, { useMemo, useState } from "react";
import { Column, Input, Row, Button } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

interface Post {
  slug: string;
  metadata: any;
  content: string;
}

interface Props {
  posts: Post[];
  compact?: boolean;
}

export default function ProjectsClient({ posts, compact = false }: Props) {
  const [query, setQuery] = useState("");
  const [stagedQuery, setStagedQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // fixed tag buttons requested by design
  const fixedTags = [
    "JavaScript",
    "React",
    "Next.js",
    "Python",
    "CSS",
    "AI/ML",
    "Frontend",
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((post) => {
      const title = (post.metadata.title || "").toLowerCase();
      const summary = (post.metadata.summary || "").toLowerCase();
      const tagsArr = Array.isArray(post.metadata.tag) ? post.metadata.tag : post.metadata.tag ? [post.metadata.tag] : [];
      const tags = tagsArr.join(" ").toLowerCase();
      const matchesText = q ? title.includes(q) || summary.includes(q) || tags.includes(q) : true;
      // If tags are selected, require the post to contain any of the selected tags
      if (selectedTags.length > 0) {
        const lowerTags = tagsArr.map((t: string) => t.toLowerCase());
        const hasTag = selectedTags.some((st) => lowerTags.includes(st.toLowerCase()));
        return matchesText && hasTag;
      }
      return matchesText;
    });
  }, [posts, query, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <Column fillWidth gap="m" marginBottom="40" paddingX="l">
      <Row gap="12" vertical="center" fillWidth style={{ marginTop: 24 }}>
        <Input
          id="project-search"
          placeholder="Search by title, tag, tool..."
          value={stagedQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStagedQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={() => setQuery(stagedQuery)}>Search</Button>
      </Row>

  {/* fixed tag filters (as requested) */}
  <Row wrap gap="8" paddingTop="8" fillWidth style={{ justifyContent: "center" }}>
        {fixedTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "primary" : "tertiary"}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </Row>

      <Row wrap gap={compact ? "16" : "24"} fillWidth>
        {filtered.map((post) => (
          <div
            key={post.slug}
            style={{
              // 3 cards per row in compact mode (blog certificates)
              flex: compact ? "1 1 calc(33.333% - 16px)" : "1 1 240px",
              maxWidth: compact ? "33.333%" : 260,
              minWidth: compact ? "280px" : "240px",
            }}
          >
            <ProjectCard
              priority={false}
              href={`/work/${post.slug}`}
              images={post.metadata.images || []}
              title={post.metadata.title}
              description={post.metadata.summary}
              content={post.content}
              tags={Array.isArray(post.metadata.tag) ? post.metadata.tag : post.metadata.tag ? [post.metadata.tag] : []}
              link={post.metadata.link || ""}
              issuer={post.metadata.issuer || ""}
              publishedAt={post.metadata.publishedAt || ""}
            />
          </div>
        ))}
      </Row>
    </Column>
  );
}
