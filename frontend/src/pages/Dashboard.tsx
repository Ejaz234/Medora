import { useEffect, useState } from "react";

import {
  ArrowRight,
  Brain,
  Clock3,
  FileSearch,
  Loader2,
  MessageSquare,
  Plus,
  ShieldCheck,
} from "lucide-react";

import {
  UserButton,
  useAuth,
  useUser,
} from "@clerk/react";

import { useNavigate } from "react-router-dom";

import {
  getConversations,
} from "../services/api";

import type {
  Conversation,
} from "../services/api";


function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const navigate = useNavigate();

  const firstName =
    user?.firstName || "there";

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    isLoadingConversations,
    setIsLoadingConversations,
  ] = useState(true);

  const [
    conversationError,
    setConversationError,
  ] = useState<string | null>(null);


  // --------------------------------------------------
  // Load conversations from FastAPI / Supabase
  // --------------------------------------------------

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        setConversationError(null);

        const token = await getToken();

        if (!token) {
          throw new Error(
            "Authentication token not available."
          );
        }

        const data =
          await getConversations(token);

        setConversations(data);

      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );

        setConversationError(
          "Unable to load your conversations."
        );

      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, [getToken]);


  // --------------------------------------------------
  // Open conversation
  // --------------------------------------------------

  const handleOpenConversation = (
    conversationId: string
  ) => {
    navigate(
      `/chat?conversation=${conversationId}`
    );
  };


  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">

      {/* Navbar */}

      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400">
              <span className="text-sm font-bold text-zinc-950">
                M
              </span>
            </div>

            <div className="text-left">
              <span className="text-[15px] font-semibold tracking-tight">
                MEDORA
              </span>

              <p className="hidden text-[8px] uppercase tracking-[0.2em] text-zinc-600 sm:block">
                Medical intelligence
              </p>
            </div>
          </button>


          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-200">
                {user?.fullName || firstName}
              </p>

              <p className="text-[11px] text-zinc-600">
                Medical workspace
              </p>
            </div>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />

          </div>
        </div>
      </header>


      {/* Main */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Welcome */}

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-teal-500">
            Medical workspace
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Explore medical information through
            grounded, source-backed conversations.
          </p>
        </section>


        {/* New Chat Card */}

        <section className="relative mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-[#101012]">

          <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-[280px] w-[280px] rounded-full bg-teal-400/[0.07] blur-[90px]" />

          <div className="relative p-7 sm:p-9">

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

              <div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                  <MessageSquare
                    size={19}
                    className="text-teal-400"
                  />
                </div>

                <h2 className="mt-5 text-xl font-medium text-zinc-100">
                  Start a medical conversation
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
                  Ask questions about symptoms,
                  conditions, causes, treatments,
                  or other medical topics covered by
                  the knowledge base.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate("/chat")
                }
                className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-teal-300"
              >
                <Plus size={17} />

                New medical chat

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>

            </div>
          </div>
        </section>


        {/* Recent Conversations */}

        <section className="mt-10">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-medium text-zinc-100">
                Recent conversations
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Your previous medical conversations
                will appear here.
              </p>
            </div>

            <Clock3
              size={18}
              className="text-zinc-700"
            />

          </div>


          {/* Loading */}

          {isLoadingConversations && (

            <div className="mt-4 flex items-center justify-center rounded-2xl border border-zinc-800 bg-[#0c0c0f] px-6 py-14">

              <div className="text-center">

                <Loader2
                  size={20}
                  className="mx-auto animate-spin text-teal-400"
                />

                <p className="mt-3 text-xs text-zinc-600">
                  Loading conversations...
                </p>

              </div>

            </div>
          )}


          {/* Error */}

          {!isLoadingConversations &&
            conversationError && (

              <div className="mt-4 rounded-2xl border border-zinc-800 bg-[#0c0c0f] px-6 py-10 text-center">

                <p className="text-sm text-zinc-400">
                  {conversationError}
                </p>

              </div>

            )}


          {/* Empty */}

          {!isLoadingConversations &&
            !conversationError &&
            conversations.length === 0 && (

              <div className="mt-4 rounded-2xl border border-dashed border-zinc-800 bg-[#0c0c0f] px-6 py-14 text-center">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900">
                  <MessageSquare
                    size={19}
                    className="text-zinc-600"
                  />
                </div>

                <h3 className="mt-4 text-sm font-medium text-zinc-300">
                  No conversations yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                  Start your first conversation and
                  your chat history will appear here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/chat")
                  }
                  className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-teal-400 transition hover:text-teal-300"
                >
                  Start a conversation

                  <ArrowRight size={13} />
                </button>

              </div>

            )}


          {/* Conversations */}

          {!isLoadingConversations &&
            !conversationError &&
            conversations.length > 0 && (

              <div className="mt-4 grid gap-3">

                {conversations.map(
                  (conversation) => (

                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() =>
                        handleOpenConversation(
                          conversation.id
                        )
                      }
                      className="group flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-[#101012] px-5 py-4 text-left transition hover:border-teal-500/30 hover:bg-zinc-900"
                    >

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10">
                          <MessageSquare
                            size={16}
                            className="text-teal-400"
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-zinc-300">
                            {conversation.title}
                          </p>

                          <p className="mt-1 text-[10px] text-zinc-600">
                            {new Date(
                              conversation.updated_at
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>


                      <ArrowRight
                        size={15}
                        className="shrink-0 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-teal-400"
                      />

                    </button>

                  )
                )}

              </div>

            )}

        </section>


        {/* Capabilities */}

        <section className="mt-10">

          <h2 className="text-lg font-medium text-zinc-100">
            What Medora provides
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-zinc-800 bg-[#101012] p-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                <Brain
                  size={17}
                  className="text-teal-400"
                />
              </div>

              <h3 className="mt-5 text-sm font-medium text-zinc-200">
                Conversational RAG
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Follow-up questions are understood
                using the context of your conversation.
              </p>

            </div>


            <div className="rounded-2xl border border-zinc-800 bg-[#101012] p-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                <FileSearch
                  size={17}
                  className="text-teal-400"
                />
              </div>

              <h3 className="mt-5 text-sm font-medium text-zinc-200">
                Source-backed answers
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Answers are generated from information
                retrieved from the medical knowledge
                base.
              </p>

            </div>


            <div className="rounded-2xl border border-zinc-800 bg-[#101012] p-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                <ShieldCheck
                  size={17}
                  className="text-teal-400"
                />
              </div>

              <h3 className="mt-5 text-sm font-medium text-zinc-200">
                Grounded responses
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Medora is designed to avoid unsupported
                answers when the available sources do
                not contain enough information.
              </p>

            </div>

          </div>
        </section>


        {/* Disclaimer */}

        <div className="mt-10 border-t border-zinc-800/80 pb-8 pt-6">

          <div className="flex gap-3">

            <ShieldCheck
              size={15}
              className="mt-0.5 shrink-0 text-zinc-700"
            />

            <p className="max-w-3xl text-[11px] leading-5 text-zinc-600">
              Medora provides information retrieved
              from its medical knowledge base for
              educational and informational purposes.
              It is not a substitute for professional
              medical advice, diagnosis, or treatment.
            </p>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;