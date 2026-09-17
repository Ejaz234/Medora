import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Allow imports from the backend directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from src.rag import retrieve_documents, SIMILARITY_THRESHOLD


# --------------------------------------------------
# Configuration
# --------------------------------------------------

load_dotenv(BACKEND_DIR / ".env")

QUESTIONS_FILE = Path(__file__).parent / "questions.json"


# --------------------------------------------------
# Load questions
# --------------------------------------------------

with open(QUESTIONS_FILE, "r", encoding="utf-8") as file:
    questions = json.load(file)


# --------------------------------------------------
# Evaluation counters
# --------------------------------------------------

total_questions = len(questions)

in_domain_questions = [
    q for q in questions
    if q["type"] == "in_domain"
]

out_of_domain_questions = [
    q for q in questions
    if q["type"] == "out_of_domain"
]

in_domain_retrieved = 0
out_of_domain_rejected = 0


results = []


# --------------------------------------------------
# Run evaluation
# --------------------------------------------------

print("=" * 60)
print("Medical RAG Retrieval Evaluation")
print("=" * 60)

print(f"Total questions: {total_questions}")
print(f"In-domain: {len(in_domain_questions)}")
print(f"Out-of-domain: {len(out_of_domain_questions)}")
print(f"Similarity threshold: {SIMILARITY_THRESHOLD}")
print()


for item in questions:

    question_id = item["id"]
    question = item["question"]
    question_type = item["type"]

    print(f"[{question_id}] {question}")

    documents = retrieve_documents(question)

    retrieved = len(documents) > 0

    if question_type == "in_domain":

        if retrieved:
            in_domain_retrieved += 1
            status = "PASS"
        else:
            status = "FAIL"

    else:

        if not retrieved:
            out_of_domain_rejected += 1
            status = "PASS"
        else:
            status = "FAIL"

    print(f"    Type: {question_type}")
    print(f"    Retrieved chunks: {len(documents)}")
    print(f"    Status: {status}")

    sources = []

    for document in documents:

        source = os.path.basename(
            document.metadata.get("source", "Unknown")
        )

        page = document.metadata.get(
            "page",
            "Unknown"
        )

        if isinstance(page, int):
            page += 1

        source_info = {
            "source": source,
            "page": page
        }

        if source_info not in sources:
            sources.append(source_info)

    if sources:
        print(f"    Sources: {sources}")

    print()

    results.append(
        {
            "id": question_id,
            "question": question,
            "type": question_type,
            "retrieved_chunks": len(documents),
            "status": status,
            "sources": sources,
        }
    )


# --------------------------------------------------
# Calculate metrics
# --------------------------------------------------

in_domain_accuracy = (
    in_domain_retrieved / len(in_domain_questions)
    if in_domain_questions
    else 0
)

out_of_domain_rejection = (
    out_of_domain_rejected / len(out_of_domain_questions)
    if out_of_domain_questions
    else 0
)

overall_accuracy = (
    (in_domain_retrieved + out_of_domain_rejected)
    / total_questions
    if total_questions
    else 0
)


# --------------------------------------------------
# Print summary
# --------------------------------------------------

print("=" * 60)
print("Evaluation Summary")
print("=" * 60)

print(
    f"In-domain retrieval: "
    f"{in_domain_retrieved}/{len(in_domain_questions)} "
    f"({in_domain_accuracy * 100:.2f}%)"
)

print(
    f"Out-of-domain rejection: "
    f"{out_of_domain_rejected}/{len(out_of_domain_questions)} "
    f"({out_of_domain_rejection * 100:.2f}%)"
)

print(
    f"Overall retrieval/rejection accuracy: "
    f"{overall_accuracy * 100:.2f}%"
)

print("=" * 60)


# --------------------------------------------------
# Save results
# --------------------------------------------------

results_file = Path(__file__).parent / "results.json"

with open(results_file, "w", encoding="utf-8") as file:
    json.dump(
        {
            "threshold": SIMILARITY_THRESHOLD,
            "metrics": {
                "total_questions": total_questions,
                "in_domain_retrieval_accuracy": round(
                    in_domain_accuracy,
                    4,
                ),
                "out_of_domain_rejection_rate": round(
                    out_of_domain_rejection,
                    4,
                ),
                "overall_accuracy": round(
                    overall_accuracy,
                    4,
                ),
            },
            "results": results,
        },
        file,
        indent=2,
        ensure_ascii=False,
    )

print()
print(f"Results saved to: {results_file}")