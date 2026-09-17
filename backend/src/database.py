import os
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv
from supabase import Client, create_client


# ==================================================
# Environment
# ==================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is not set in .env")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is not set in .env")


# ==================================================
# Supabase Client
# ==================================================

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
)


# ==================================================
# Conversations
# ==================================================

def create_conversation(
    clerk_user_id: str,
    title: str = "New conversation",
) -> dict[str, Any]:

    response = (
        supabase
        .table("conversations")
        .insert(
            {
                "clerk_user_id": clerk_user_id,
                "title": title,
            }
        )
        .execute()
    )

    return response.data[0]


def conversation_belongs_to_user(
    conversation_id: str,
    clerk_user_id: str,
) -> bool:
    """
    Verify that a conversation belongs to
    the authenticated Clerk user.
    """

    response = (
        supabase
        .table("conversations")
        .select("id")
        .eq("id", conversation_id)
        .eq("clerk_user_id", clerk_user_id)
        .maybe_single()
        .execute()
    )

    return response.data is not None


def get_conversations(
    clerk_user_id: str,
) -> list[dict[str, Any]]:
    """
    Get all conversations belonging to the
    authenticated user, with most recently
    updated conversations first.
    """

    response = (
        supabase
        .table("conversations")
        .select("*")
        .eq("clerk_user_id", clerk_user_id)
        .order("updated_at", desc=True)
        .execute()
    )

    return response.data


def get_messages(
    conversation_id: str,
    clerk_user_id: str,
) -> list[dict[str, Any]]:
    """
    Get messages only if the conversation
    belongs to the authenticated user.
    """

    # Verify conversation ownership first.
    conversation = (
        supabase
        .table("conversations")
        .select("id")
        .eq("id", conversation_id)
        .eq("clerk_user_id", clerk_user_id)
        .maybe_single()
        .execute()
    )

    if not conversation.data:
        raise ValueError("Conversation not found")

    response = (
        supabase
        .table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )

    return response.data


def update_conversation(
    conversation_id: str,
    clerk_user_id: str,
    title: str | None = None,
) -> dict[str, Any]:
    """
    Update conversation details and refresh
    the updated_at timestamp.
    """

    updates: dict[str, Any] = {
        "updated_at": datetime.now(
            timezone.utc
        ).isoformat(),
    }

    if title is not None:
        updates["title"] = title

    response = (
        supabase
        .table("conversations")
        .update(updates)
        .eq("id", conversation_id)
        .eq("clerk_user_id", clerk_user_id)
        .execute()
    )

    if not response.data:
        raise ValueError("Conversation not found")

    return response.data[0]


# ==================================================
# Messages
# ==================================================

def save_message(
    conversation_id: str,
    role: str,
    content: str,
    sources: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """
    Save a message and update the conversation's
    updated_at timestamp.
    """

    # ----------------------------------------------
    # Save message
    # ----------------------------------------------

    response = (
        supabase
        .table("messages")
        .insert(
            {
                "conversation_id": conversation_id,
                "role": role,
                "content": content,
                "sources": sources or [],
            }
        )
        .execute()
    )

    # ----------------------------------------------
    # Update conversation activity
    # ----------------------------------------------

    (
        supabase
        .table("conversations")
        .update(
            {
                "updated_at": datetime.now(
                    timezone.utc
                ).isoformat(),
            }
        )
        .eq("id", conversation_id)
        .execute()
    )

    return response.data[0]