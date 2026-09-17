import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from app import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root():
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert data["version"] == "2.0.0"


def test_empty_question():
    response = client.post(
        "/chat",
        json={
            "question": "",
            "history": [],
        },
    )

    assert response.status_code == 422


def test_missing_question():
    response = client.post(
        "/chat",
        json={
            "history": [],
        },
    )

    assert response.status_code == 422