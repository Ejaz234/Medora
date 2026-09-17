const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ChatHistoryMessage {
  user: string;
  assistant: string;
}

export interface Source {
  source: string;
  page: number | string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  question: string;
  conversation_id?: string;
}
export async function sendMessage(
  question: string,
  history: ChatHistoryMessage[] = [],
  token?: string,
  conversationId?: string | null
): Promise<ChatResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      question,
      history,
      conversation_id: conversationId ?? null,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to get a response from Medora.";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export interface Conversation {
  id: string;
  clerk_user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface SavedMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  sources: Source[];
  created_at: string;
}

export async function getConversations(
  token: string
): Promise<Conversation[]> {
  const response = await fetch(
    `${API_URL}/conversations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load conversations.");
  }

  return response.json();
}

export async function getConversationMessages(
  conversationId: string,
  token: string
): Promise<SavedMessage[]> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load conversation.");
  }

  const data = await response.json();

  return data.messages;
}