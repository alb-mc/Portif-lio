"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteSupabaseNavegador } from "@/lib/supabase/client";

export default function LoginAdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCarregando(true);
    setMensagemErro("");

    const supabase = criarClienteSupabaseNavegador();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error || !data.user) {
      setMensagemErro(
        "Não foi possível entrar. Confira se o usuário existe no Supabase Auth e se a senha está correta.",
      );
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main
      style={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <form
        onSubmit={entrar}
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "32px",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.045)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
          color: "#ffffff",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
            }}
          >
            Admin
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.5,
            }}
          >
            Entre para gerenciar projetos, certificados e livros do portfólio.
          </p>
        </div>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontWeight: 600,
          }}
        >
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="seu@email.com"
            style={{
              height: "44px",
              padding: "0 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.28)",
              color: "#ffffff",
              outline: "none",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontWeight: 600,
          }}
        >
          Senha
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
            placeholder="Digite sua senha"
            style={{
              height: "44px",
              padding: "0 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.28)",
              color: "#ffffff",
              outline: "none",
            }}
          />
        </label>

        {mensagemErro ? (
          <p
            style={{
              color: "#ff6b6b",
              margin: 0,
              lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            {mensagemErro}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={carregando}
          style={{
            height: "44px",
            borderRadius: "10px",
            border: "none",
            cursor: carregando ? "not-allowed" : "pointer",
            fontWeight: 800,
            background: "#ffffff",
            color: "#000000",
            opacity: carregando ? 0.7 : 1,
          }}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}