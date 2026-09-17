import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.database import (
    conversation_belongs_to_user,
    create_conversation,
    get_conversations,
    get_messages,
    save_message,
    update_conversation,
)
from src.rag import ask_medical_question
from src.auth import CurrentUser


# ==================================================
# Logging
# ==================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)


# ==================================================
# FastAPI Application
# ==================================================

app = FastAPI(
    title="Medora Medical RAG API",
    description=(
        "Medical question-answering API powered by "
        "FastAPI, LangChain, Pinecone, HuggingFace and Groq."
    ),
    version="2.0.0",
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://medora-brown.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# Request Schemas
# ==================================================

class ChatMessage(BaseModel):
    """
    Represents one previous conversation turn.
    """

    user: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Previous user message",
    )

    assistant: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Previous assistant response",
    )


class ChatRequest(BaseModel):
    """
    Request body for the /chat endpoint.
    """

    question: str = Field(
        ...,
        min_length=2,
        max_length=1000,
        description="Medical question from the user",
    )

    history: list[ChatMessage] = Field(
        default_factory=list,
        description="Previous conversation history",
    )

    conversation_id: str | None = Field(
        default=None,
        description="Existing conversation ID",
    )


# ==================================================
# Routes
# ==================================================

@app.get("/")
def root():
    """
    Basic API information.
    """

    return {
        "message": "Medora Medical RAG API is running",
        "version": "2.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    """
    Health check endpoint.
    """

    return {
        "status": "healthy",
    }


# ==================================================
# Conversations
# ==================================================

@app.get("/conversations")
def conversations(user_id: CurrentUser):
    """
    Get all conversations belonging to the
    currently authenticated user.
    """

    try:
        return get_conversations(user_id)

    except Exception:
        logger.exception(
            "Error while fetching conversations"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch conversations.",
        )


@app.get("/conversations/{conversation_id}")
def conversation_messages(
    conversation_id: str,
    user_id: CurrentUser,
):
    """
    Get all messages for a conversation.

    The conversation must belong to the
    authenticated Clerk user.
    """

    try:
        messages = get_messages(
            conversation_id=conversation_id,
            clerk_user_id=user_id,
        )

        return {
            "conversation_id": conversation_id,
            "messages": messages,
        }

    except ValueError:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    except Exception:
        logger.exception(
            "Error while fetching conversation: %s",
            conversation_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch conversation.",
        )


# ==================================================
# Chat
# ==================================================

@app.post("/chat")
def chat(
    request: ChatRequest,
    user_id: CurrentUser,
):
    """
    Process a medical question using the RAG pipeline
    and save the conversation in Supabase.
    """

    logger.info(
        "Received chat request from user: %s",
        user_id,
    )

    try:
        # ------------------------------------------
        # Get or create conversation
        # ------------------------------------------

        conversation_id = request.conversation_id

        # ------------------------------------------
        # Existing conversation
        # ------------------------------------------

        if conversation_id:

            logger.info(
                "Continuing conversation: %s",
                conversation_id,
            )

            # Security check:
            # Make sure this conversation belongs
            # to the currently authenticated user.
            if not conversation_belongs_to_user(
                conversation_id=conversation_id,
                clerk_user_id=user_id,
            ):
                logger.warning(
                    "User %s attempted to access "
                    "conversation %s without ownership",
                    user_id,
                    conversation_id,
                )

                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found.",
                )

        # ------------------------------------------
        # New conversation
        # ------------------------------------------

        else:
            conversation = create_conversation(
                clerk_user_id=user_id,
                title=request.question[:80],
            )

            conversation_id = conversation["id"]

            logger.info(
                "Created conversation: %s",
                conversation_id,
            )

        # ------------------------------------------
        # Save user message
        # ------------------------------------------

        save_message(
            conversation_id=conversation_id,
            role="user",
            content=request.question,
        )

        # ------------------------------------------
        # Convert history to dictionaries
        # ------------------------------------------

        history = [
            {
                "user": message.user,
                "assistant": message.assistant,
            }
            for message in request.history
        ]

        # ------------------------------------------
        # Run RAG pipeline
        # ------------------------------------------

        response = ask_medical_question(
            question=request.question,
            history=history,
        )

        # ------------------------------------------
        # Save assistant response
        # ------------------------------------------

        save_message(
            conversation_id=conversation_id,
            role="assistant",
            content=response["answer"],
            sources=response.get("sources", []),
        )

        # ------------------------------------------
        # Update conversation title
        # ------------------------------------------

        if request.conversation_id is None:
            update_conversation(
                conversation_id=conversation_id,
                clerk_user_id=user_id,
                title=request.question[:80],
            )

        # ------------------------------------------
        # Return response
        # ------------------------------------------

        response["conversation_id"] = conversation_id

        logger.info(
            "Chat request completed successfully"
        )

        return response

    # ----------------------------------------------
    # Preserve intentional HTTP errors
    # ----------------------------------------------

    except HTTPException:
        raise

    # ----------------------------------------------
    # Handle unexpected errors
    # ----------------------------------------------

    except Exception:
        logger.exception(
            "Error while processing chat request"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process your question right now. "
                "Please try again later."
            ),
        )