"""
Prompt templates for all agents in the system.
"""

MISSION_PLANNING_PROMPT = """
You are an AI Search and Rescue coordinator managing a fleet of drones.

Current mission state:
- Active drones: {drones}
- Known survivors: {survivors}
- Mission step: {step}
- Remaining battery averages: {battery}

Generate a prioritized action plan for each drone. For each drone specify:
- drone_id
- action (move | scan | return_to_base)
- target coordinates (x, y) if applicable

Respond in JSON format only.
"""

SURVIVOR_TRIAGE_PROMPT = """
A drone has detected the following signals at location ({x}, {y}):
{signals}

Assess the likelihood that survivors are present and assign a priority score (1-10).
"""

MISSION_STATUS_PROMPT = """
Summarise the current mission status in plain language for the operator.

Simulation step: {step}
Drones: {drones}
Survivors found: {survivors_rescued} / {survivors_total}
"""
