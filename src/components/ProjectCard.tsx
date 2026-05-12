"use client";

import React, { useState } from "react";
import { Column, Flex, Heading, SmartLink, Text, Row, Tag } from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars?: { src: string }[];
  link: string;
  tags?: string[];
  issuer?: string;
  publishedAt?: string;
}

function shortTitle(title: string, words = 5) {
  if (!title) return "";
  const parts = title.split(" ");
  if (parts.length <= words) return title;
  return parts.slice(0, words).join(" ") + "…";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  link,
  tags = [],
  issuer,
  publishedAt,
}) => {
  const [hovered, setHovered] = useState(false);
  const cover = images && images.length > 0 ? images[0] : "";
  
  // Se tem link externo, usa ele, senão usa o href interno
  const handleClick = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.04)",
        background: "var(--once-surface, #0b0b0b)",
        cursor: link || href ? "pointer" : "default",
        opacity: hovered ? 0.8 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      {/* image */}
      <div style={{ width: "100%", height: 200, backgroundColor: "#111", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundImage: cover ? `url(${cover})` : undefined }} />

      <Column fillWidth gap="s" style={{ padding: 16 }}>
        {/* short title above description, smaller font */}
        {title && (
          <Heading as="h3" variant="heading-strong-m" style={{ margin: 0 }}>
            {shortTitle(title, 5)}
          </Heading>
        )}

        {/* issuer name in green below title */}
        {issuer && (
          <Text variant="body-default-xs" style={{ color: "#10b981", marginTop: "-4px" }}>
            {issuer}
          </Text>
        )}

        {tags && tags.length > 0 && (
          <Row wrap gap="8" paddingTop="12">
            {tags.map((t, i) => (
              <Tag key={i} size="s">
                {t}
              </Tag>
            ))}
          </Row>
        )}

        {/* published date in green below tags */}
        {publishedAt && (
          <Text variant="body-default-xs" style={{ color: "#10b981", marginTop: "8px" }}>
            {publishedAt}
          </Text>
        )}
      </Column>
    </div>
  );
};
