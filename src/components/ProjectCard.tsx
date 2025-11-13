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
}) => {
  const [hovered, setHovered] = useState(false);
  const cover = images && images.length > 0 ? images[0] : "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        boxShadow: hovered ? "0 10px 30px rgba(0,0,0,0.6)" : "none",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.04)",
        background: "var(--once-surface, #0b0b0b)",
      }}
    >
      {/* image */}
      <div style={{ width: "100%", height: 140, backgroundColor: "#111", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: cover ? `url(${cover})` : undefined }} />

      <Column fillWidth gap="s" style={{ padding: 16 }}>
        {/* short title above description, smaller font */}
        {title && (
          <Heading as="h3" variant="heading-strong-m" style={{ margin: 0 }}>
            {shortTitle(title, 5)}
          </Heading>
        )}

        {/* description below title; collapsed when not hovered */}
        {description && (
          <div style={{ overflow: "hidden", maxHeight: hovered ? 400 : 72, transition: "max-height 220ms ease" }}>
            <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
              {description}
            </Text>
          </div>
        )}

        {/* links and tags */}
        <Flex gap="12" style={{ marginTop: 8, alignItems: "center" }}>
          {content?.trim() && (
            <SmartLink suffixIcon="arrowRight" style={{ margin: 0, width: "fit-content" }} href={href}>
              <Text variant="body-default-s">Read case study</Text>
            </SmartLink>
          )}
          {link && (
            <SmartLink suffixIcon="arrowUpRightFromSquare" style={{ margin: 0, width: "fit-content" }} href={link}>
              <Text variant="body-default-s">View project</Text>
            </SmartLink>
          )}
        </Flex>

        {tags && tags.length > 0 && (
          <Row wrap gap="8" paddingTop="12">
            {tags.map((t, i) => (
              <Tag key={i} size="s">
                {t}
              </Tag>
            ))}
          </Row>
        )}
      </Column>
    </div>
  );
};
