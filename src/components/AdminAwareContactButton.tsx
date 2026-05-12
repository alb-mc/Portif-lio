"use client";

import { usePathname } from "next/navigation";
import ContactButton from "@/components/ContactButton";

export default function AdminAwareContactButton() {
  const pathname = usePathname();

  const estaNoAdmin = pathname.startsWith("/admin");

  if (estaNoAdmin) {
    return null;
  }

  return <ContactButton />;
}