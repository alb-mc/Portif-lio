import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL, blog, person } from "@/resources";
import { Certificates } from "@/components/blog/Certificates";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={blog.path}
        title={blog.title}
        description={blog.description}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${blog.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="display-strong-xl" align="center">
        <span style={{ color: "#ffffff" }}>{blog.label}</span>
      </Heading>
      {/* Agora busca certificados da pasta blog/posts */}
      <Certificates compact={true} />
    </Column>
  );
}
