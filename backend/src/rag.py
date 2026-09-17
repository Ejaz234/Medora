import os
from typing import List, Dict, Any

from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from src.helper import download_hugging_face_embeddings
from src.prompt import system_prompt


# --------------------------------------------------
# Environment
# --------------------------------------------------

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set in .env")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in .env")


# --------------------------------------------------
# Configuration
# --------------------------------------------------

INDEX_NAME = "medical-chatbot"

RETRIEVAL_K = 5

# Starting threshold.
# We can tune this later during RAG evaluation.
SIMILARITY_THRESHOLD = 0.35


# --------------------------------------------------
# Embeddings
# --------------------------------------------------

embeddings = download_hugging_face_embeddings()


# --------------------------------------------------
# Pinecone Vector Store
# --------------------------------------------------

vector_store = PineconeVectorStore.from_existing_index(
    index_name=INDEX_NAME,
    embedding=embeddings,
)


# --------------------------------------------------
# Groq LLM
# --------------------------------------------------

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    api_key=GROQ_API_KEY,
)


# --------------------------------------------------
# Question Rewriting Prompt
# --------------------------------------------------

rewrite_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a question-rewriting assistant for a medical RAG system.

Your task is to rewrite the user's latest question into a standalone
question that can be understood without the previous conversation.

Rules:
- Use the conversation history when necessary.
- Resolve references such as "it", "this", "they", "that disease", etc.
- Preserve the original meaning.
- Do not answer the question.
- If the question is already standalone, return it unchanged.
- Return only the rewritten question.
""",
        ),
        (
            "human",
            """
Conversation history:
{history}

Latest question:
{question}
""",
        ),
    ]
)


# --------------------------------------------------
# Answer Prompt
# --------------------------------------------------

answer_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_prompt,
        ),
        (
            "human",
            "{input}",
        ),
    ]
)


# --------------------------------------------------
# Question Rewriter
# --------------------------------------------------

def rewrite_question(
    question: str,
    history: List[Dict[str, str]],
) -> str:

    # No history means no rewriting is necessary
    if not history:
        return question

    history_text = "\n".join(
        [
            f"User: {message['user']}\n"
            f"Assistant: {message['assistant']}"
            for message in history
        ]
    )

    chain = rewrite_prompt | llm | StrOutputParser()

    rewritten_question = chain.invoke(
        {
            "history": history_text,
            "question": question,
        }
    )

    return rewritten_question.strip()


# --------------------------------------------------
# Retrieve Documents
# --------------------------------------------------

def retrieve_documents(
    question: str,
) -> List[Document]:

    results = vector_store.similarity_search_with_score(
        question,
        k=RETRIEVAL_K,
    )

    relevant_documents = [
        document
        for document, score in results
        if float(score) >= SIMILARITY_THRESHOLD
    ]

    return relevant_documents


# --------------------------------------------------
# Format Documents
# --------------------------------------------------

def format_documents(
    documents: List[Document],
) -> str:

    formatted_documents = []

    for document in documents:

        source = document.metadata.get(
            "source",
            "Unknown",
        )

        page = document.metadata.get(
            "page",
            "Unknown",
        )

        formatted_documents.append(
            f"""
Source: {os.path.basename(source)}
Page: {page + 1 if isinstance(page, int) else page}

Content:
{document.page_content}
"""
        )

    return "\n\n".join(formatted_documents)


# --------------------------------------------------
# Extract Sources
# --------------------------------------------------

def extract_sources(
    documents: List[Document],
) -> List[Dict[str, Any]]:

    sources = []

    for document in documents:

        source = document.metadata.get(
            "source",
            "Unknown",
        )

        page = document.metadata.get(
            "page",
            "Unknown",
        )

        source_info = {
            "source": (
                os.path.basename(source)
                if source != "Unknown"
                else source
            ),
            "page": (
                page + 1
                if isinstance(page, int)
                else page
            ),
        }

        if source_info not in sources:
            sources.append(source_info)

    return sources


# --------------------------------------------------
# Generate Answer
# --------------------------------------------------

def generate_answer(
    question: str,
    context: str,
) -> str:

    chain = answer_prompt | llm | StrOutputParser()

    answer = chain.invoke(
        {
            "input": question,
            "context": context,
        }
    )

    return answer.strip()


# --------------------------------------------------
# Main RAG Function
# --------------------------------------------------

def ask_medical_question(
    question: str,
    history: List[Dict[str, str]] | None = None,
) -> Dict[str, Any]:

    if history is None:
        history = []

    # ----------------------------------------------
    # 1. Rewrite question using conversation history
    # ----------------------------------------------

    standalone_question = rewrite_question(
        question,
        history,
    )

    # ----------------------------------------------
    # 2. Retrieve relevant medical documents
    # ----------------------------------------------

    retrieved_documents = retrieve_documents(
        standalone_question
    )

    # ----------------------------------------------
    # 3. Confidence check
    # ----------------------------------------------

    if not retrieved_documents:

        return {
            "answer": (
                "I don't have enough information in the provided "
                "medical sources to answer this question."
            ),
            "sources": [],
            "question": standalone_question,
        }

    # ----------------------------------------------
    # 4. Build context
    # ----------------------------------------------

    context = format_documents(
        retrieved_documents
    )

    # ----------------------------------------------
    # 5. Generate answer with Groq
    # ----------------------------------------------

    answer = generate_answer(
        standalone_question,
        context,
    )

    # ----------------------------------------------
    # 6. Extract sources
    # ----------------------------------------------

    sources = extract_sources(
        retrieved_documents
    )

    # ----------------------------------------------
    # 7. Return complete response
    # ----------------------------------------------

    return {
        "answer": answer,
        "sources": sources,
        "question": standalone_question,
    }