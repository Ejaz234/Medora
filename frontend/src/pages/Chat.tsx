import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessage from "../components/ChatMessage";
import type {
  ChatMessageData,
} from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

import {
  getConversationMessages,
  getConversations,
  sendMessage,
} from "../services/api";

import type {
  ChatHistoryMessage,
  Conversation,
} from "../services/api";


function Chat() {
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [isLoadingConversations, setIsLoadingConversations] =
    useState(true);


  // --------------------------------------------------
  // Load conversations
  // --------------------------------------------------

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const token = await getToken();

        if (!token) {
          return;
        }

        const data = await getConversations(token);

        setConversations(data);
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, [getToken]);


  // --------------------------------------------------
  // Start new conversation
  // --------------------------------------------------

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");

    setSidebarOpen(true);
  };


  // --------------------------------------------------
  // Select existing conversation
  // --------------------------------------------------

  const handleSelectConversation = async (
    id: string
  ) => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      setIsLoading(true);

      const savedMessages =
        await getConversationMessages(
          id,
          token
        );

      const formattedMessages: ChatMessageData[] =
        savedMessages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          sources: message.sources || [],
        }));

      setMessages(formattedMessages);
      setConversationId(id);

    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };


  // --------------------------------------------------
  // Build conversation history for RAG
  // --------------------------------------------------

  const buildHistory = (): ChatHistoryMessage[] => {
    const history: ChatHistoryMessage[] = [];

    for (let i = 0; i < messages.length - 1; i += 2) {
      const userMessage = messages[i];
      const assistantMessage = messages[i + 1];

      if (
        userMessage?.role === "user" &&
        assistantMessage?.role === "assistant"
      ) {
        history.push({
          user: userMessage.content,
          assistant: assistantMessage.content,
        });
      }
    }

    return history;
  };


  // --------------------------------------------------
  // Send message
  // --------------------------------------------------

  const handleSendMessage = async () => {
    const question = input.trim();

    if (!question || isLoading) {
      return;
    }

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      const history = buildHistory();

      const response = await sendMessage(
        question,
        history,
        token,
        conversationId
      );

      const assistantMessage: ChatMessageData = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        sources: response.sources || [],
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      // Save conversation ID returned by backend.
      if (response.conversation_id) {
        setConversationId(
          response.conversation_id
        );
      }

      // Refresh sidebar conversations.
      const updatedConversations =
        await getConversations(token);

      setConversations(
        updatedConversations
      );

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      const errorMessage: ChatMessageData = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);

    } finally {
      setIsLoading(false);
    }
  };


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <main className="flex h-screen overflow-hidden bg-[#09090b] text-zinc-100">

      {/* Sidebar */}

      {sidebarOpen && (
        <Sidebar
          conversations={conversations}
          selectedConversationId={conversationId}
          isLoading={isLoadingConversations}
          onNewConversation={
            handleNewConversation
          }
          onSelectConversation={
            handleSelectConversation
          }
          onCollapse={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* Main chat area */}

      <section className="flex min-w-0 flex-1 flex-col">

        {/* Header */}

        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
          onBackToDashboard={() =>
            navigate("/dashboard")
          }
        />


        {/* Messages */}

        <div className="flex-1 overflow-y-auto">

          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-8 sm:px-6">

            {messages.length === 0 ? (

              /* Empty state */

              <div className="flex flex-1 flex-col items-center justify-center text-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/10">
                  <span className="text-lg font-semibold text-teal-400">
                    M
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-medium text-zinc-200">
                  How can I help you?
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  Ask a medical question and
                  Medora will search its medical
                  knowledge base before generating
                  an answer.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">

                  {[
                    "What are the symptoms of diabetes?",
                    "What causes anemia?",
                    "What are common asthma symptoms?",
                  ].map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() =>
                        setInput(question)
                      }
                      className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-500 transition hover:border-teal-500/30 hover:text-zinc-300"
                    >
                      {question}
                    </button>
                  ))}

                </div>

              </div>

            ) : (

              /* Conversation */

              <div className="space-y-7">

                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    userImageUrl={
                      user?.imageUrl
                    }
                    userName={
                      user?.fullName ||
                      user?.firstName ||
                      "User"
                    }
                  />
                ))}

                {/* Loading indicator */}

                {isLoading && (
                  <div className="flex gap-3">

                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
                    </div>

                    <div className="flex items-center gap-1 pt-2">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600" />
                    </div>

                  </div>
                )}

              </div>

            )}

          </div>

        </div>


        {/* Input */}

        <ChatInput
          value={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSendMessage}
        />

      </section>

    </main>
  );
}

export default Chat;