"""
Standalone API (Teammate's Version)
Alternative to main.py - runs mcp_client_standalone.py as subprocess
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI(title="Beacon-Net API")

# CRITICAL FOR REACT: This allows your local React app to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any React localhost port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This defines the data React will send us
class ManualDeployment(BaseModel):
    intelligence_report: str


@app.post("/api/deploy")
async def trigger_ai_commander(deployment: ManualDeployment):
    """React calls this endpoint to inject human intel and trigger the swarm."""
    try:
        # Run your AI client and pass the React text to it!
        result = subprocess.run(
            ["python", "mcp_client_standalone.py", deployment.intelligence_report],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        # Send the entire terminal output back to React
        return {
            "status": "SUCCESS",
            "mission_logs": result.stdout,
            "errors": result.stderr if result.stderr else None
        }
        
    except subprocess.TimeoutExpired:
        return {"status": "FAILED", "error": "Agent execution timeout (>2 minutes)"}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


@app.get("/")
def root():
    """Health check"""
    return {"status": "operational", "mode": "standalone_subprocess"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
