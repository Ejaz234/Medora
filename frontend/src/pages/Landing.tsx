import {
  ArrowRight,
  BookOpen,
  Brain,
  FileSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/react";

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      {/* ───────────────── Background ───────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-teal-500/[0.07] blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[400px] w-[400px] rounded-full bg-teal-400/[0.04] blur-[100px]" />
      </div>

      {/* ───────────────── Navbar ───────────────── */}
      <nav className="relative z-10 border-b border-zinc-800/80">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400">
              <span className="text-sm font-bold text-zinc-950">
                M
              </span>
            </div>

            <div>
              <span className="text-[15px] font-semibold tracking-tight">
                MEDORA
              </span>

              <p className="hidden text-[8px] uppercase tracking-[0.2em] text-zinc-600 sm:block">
                Medical intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <SignInButton
              mode="redirect"
              forceRedirectUrl="/dashboard"
            >
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:text-zinc-100"
              >
                Sign in
              </button>
            </SignInButton>

            <SignUpButton
              mode="redirect"
              forceRedirectUrl="/dashboard"
            >
              <button
                type="button"
                className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-teal-300"
              >
                Get started
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* ───────────────── Hero ───────────────── */}
      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pb-28 pt-24 sm:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.06] px-3.5 py-1.5">
              <Sparkles
                size={13}
                className="text-teal-400"
              />

              <span className="text-[11px] font-medium tracking-wide text-teal-300">
                AI-powered medical knowledge
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-zinc-100 sm:text-6xl md:text-7xl">
              Understand medical
              <br />

              <span className="text-teal-400">
                knowledge differently.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
              Ask questions about medical conditions, symptoms,
              causes, and treatments. Medora retrieves relevant
              information from its medical knowledge base and
              provides source-backed answers.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <SignUpButton
                mode="redirect"
                forceRedirectUrl="/dashboard"
              >
                <button
                  type="button"
                  className="group flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-teal-300"
                >
                  Start exploring

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </SignUpButton>

              <SignInButton
                mode="redirect"
                forceRedirectUrl="/dashboard"
              >
                <button
                  type="button"
                  className="rounded-xl border border-zinc-700 px-6 py-3 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                  Sign in
                </button>
              </SignInButton>
            </div>

            {/* Trust line */}
            <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-zinc-600">
              <ShieldCheck
                size={13}
                className="text-teal-500/70"
              />

              Source-backed responses from the medical
              knowledge base
            </div>
          </div>
        </section>

        {/* ───────────────── Features ───────────────── */}
        <section className="border-y border-zinc-800/80 bg-[#0c0c0f]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-500">
                Built for understanding
              </p>

              <h2 className="mt-3 text-2xl font-medium tracking-tight text-zinc-100 sm:text-3xl">
                More than a chatbot.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                A retrieval-augmented medical assistant designed
                to keep answers grounded in its available sources.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Source-backed answers */}
              <div className="group rounded-2xl border border-zinc-800 bg-[#101012] p-6 transition hover:border-teal-500/30">
                <div className="mb-12 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                  <FileSearch
                    size={18}
                    className="text-teal-400"
                  />
                </div>

                <h3 className="text-base font-medium text-zinc-100">
                  Source-backed answers
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Responses are generated using relevant
                  information retrieved from the medical
                  knowledge base.
                </p>
              </div>

              {/* Conversational RAG */}
              <div className="group rounded-2xl border border-zinc-800 bg-[#101012] p-6 transition hover:border-teal-500/30">
                <div className="mb-12 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                  <Brain
                    size={18}
                    className="text-teal-400"
                  />
                </div>

                <h3 className="text-base font-medium text-zinc-100">
                  Conversational RAG
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Continue conversations naturally while Medora
                  uses previous context to understand follow-up
                  questions.
                </p>
              </div>

              {/* Sources */}
              <div className="group rounded-2xl border border-zinc-800 bg-[#101012] p-6 transition hover:border-teal-500/30">
                <div className="mb-12 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                  <BookOpen
                    size={18}
                    className="text-teal-400"
                  />
                </div>

                <h3 className="text-base font-medium text-zinc-100">
                  Explore the sources
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  See the medical source and page information
                  used to build each response.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── Bottom CTA ───────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#101012] px-6 py-16 text-center sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-teal-400/[0.08] blur-[80px]" />

            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-500">
                Start with a question
              </p>

              <h2 className="mx-auto mt-4 max-w-xl text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                Turn medical information into understanding.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-500">
                Create your account and start exploring the medical
                knowledge available through Medora.
              </p>

              <SignUpButton
                mode="redirect"
                forceRedirectUrl="/dashboard"
              >
                <button
                  type="button"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-teal-300"
                >
                  Create your account

                  <ArrowRight size={16} />
                </button>
              </SignUpButton>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────────── Footer ───────────────── */}
      <footer className="relative z-10 border-t border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] text-zinc-600 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Medora
          </p>

          <p>
            Medical information assistant · Not a substitute for
            professional medical advice
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;