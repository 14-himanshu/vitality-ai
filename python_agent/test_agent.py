import pytest
from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_health_check_or_unknown_endpoint():
    response = client.get("/unknown")
    assert response.status_code == 404

def test_ask_endpoint_no_params():
    # Should fail if command and userId are missing
    response = client.post("/ask", data={})
    assert response.status_code == 422 # Validation error from FastAPI Form(...)

def test_ask_endpoint_with_mocked_agent(monkeypatch):
    # Mock the process_agent_query so we don't hit real APIs
    async def mock_process_agent_query(command, user_id, image_bytes, user_context):
        return {
            "actionType": "CHAT",
            "message": "Mocked response",
            "data": {}
        }
    
    import main
    monkeypatch.setattr(main, "process_agent_query", mock_process_agent_query)
    
    response = client.post("/ask", data={
        "command": "Hello",
        "userId": "123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["actionType"] == "CHAT"
    assert data["message"] == "Mocked response"
