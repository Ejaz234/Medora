import os

from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

from src.helper import (
    load_pdf_file,
    filter_to_minimal_docs,
    text_split,
    download_hugging_face_embeddings,
)


# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set in .env")


# --------------------------------------------------
# Load PDF
# --------------------------------------------------

print("Loading PDF documents...")

documents = load_pdf_file("data/")

print(f"Loaded {len(documents)} pages.")


# --------------------------------------------------
# Clean metadata
# --------------------------------------------------

documents = filter_to_minimal_docs(documents)

print("Metadata processed.")


# --------------------------------------------------
# Split documents
# --------------------------------------------------

text_chunks = text_split(documents)

print(f"Created {len(text_chunks)} chunks.")


# --------------------------------------------------
# Create embeddings
# --------------------------------------------------

print("Loading HuggingFace embedding model...")

embeddings = download_hugging_face_embeddings()

# Get actual embedding dimension
embedding_dimension = len(
    embeddings.embed_query("medical chatbot")
)

print(f"Embedding dimension: {embedding_dimension}")


# --------------------------------------------------
# Connect to Pinecone
# --------------------------------------------------

pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "medical-chatbot"


# --------------------------------------------------
# Create index if it doesn't exist
# --------------------------------------------------

if not pc.has_index(index_name):

    print("Creating Pinecone index...")

    pc.create_index(
        name=index_name,
        dimension=embedding_dimension,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1",
        ),
    )

    print("Pinecone index created.")

else:

    print("Pinecone index already exists.")


# --------------------------------------------------
# Connect to index
# --------------------------------------------------

index = pc.Index(index_name)


# --------------------------------------------------
# Create vector store
# --------------------------------------------------

vector_store = PineconeVectorStore(
    index=index,
    embedding=embeddings,
)


# --------------------------------------------------
# Create deterministic IDs
# --------------------------------------------------

ids = []

for i, doc in enumerate(text_chunks):

    source = doc.metadata.get("source", "unknown")
    page = doc.metadata.get("page", 0)

    chunk_id = f"{source}-{page}-{i}"

    # Pinecone IDs should not contain problematic characters
    chunk_id = chunk_id.replace("\\", "_").replace("/", "_")

    ids.append(chunk_id)


# --------------------------------------------------
# Upload documents
# --------------------------------------------------

print("Uploading chunks to Pinecone...")

vector_store.add_documents(
    documents=text_chunks,
    ids=ids,
)

print("====================================")
print("Medical documents indexed successfully!")
print(f"Total chunks: {len(text_chunks)}")
print(f"Embedding dimension: {embedding_dimension}")
print("====================================")