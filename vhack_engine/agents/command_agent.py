"""
Command Agent - Top-level AI agent responsible for orchestrating the drone fleet.
Uses LangChain with Ollama to reason about mission state and dispatch tool calls via MCP.
"""
import asyncio
import re
from typing import Optional, Dict, Any, List
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from vhack_engine.llm.prompts import MISSION_PLANNING_PROMPT


class CommandAgent:
    """
    The central AI agent that receives mission objectives and coordinates
    multiple drones to locate survivors in a disaster zone.
    
    Uses LangChain + LangGraph + MCP to provide autonomous decision-making.
    """

    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name
        self.llm: Optional[ChatOllama] = None
        self.tools = []
        self.tool_dict = {}  # Map tool names to functions
        self._initialized = False
        self._mcp_tools = None

    def initialize(self, mcp_tools=None):
        """
        Load tools from MCP and build the tool dictionary.
        
        Args:
            mcp_tools: Pre-loaded MCP tools (from langchain_mcp_adapters)
        """
        # Initialize ChatOllama
        self.llm = ChatOllama(model=self.model_name, temperature=0.7)
        
        # Store MCP tools
        if mcp_tools:
            self._mcp_tools = mcp_tools
            self.tools = mcp_tools
            # Create tool name -> function mapping
            self.tool_dict = {tool.name: tool for tool in mcp_tools}
        
        self._initialized = True

    def run(self, mission_brief: str) -> str:
        """
        Execute a mission step using ReAct reasoning loop.

        Args:
            mission_brief: Text describing the current mission state or objective.

        Returns:
            Agent response with all actions taken.
        """
        if not self._initialized:
            self.initialize()
        
        if not self.tools:
            return "[CommandAgent] Error: No tools loaded. Call initialize() with mcp_tools parameter."
        
        try:
            result = asyncio.run(self._run_react_loop(mission_brief))
            return result
        except Exception as e:
            return f"[CommandAgent] Error during execution: {str(e)}"

    async def _run_react_loop(self, mission_brief: str, max_iterations: int = 15) -> str:
        """
        Manual ReAct loop that works with any LLM (including Ollama models without native function calling).
        
        ReAct pattern:
        Thought: [reasoning about what to do]
        Action: [tool name]
        Action Input: [tool parameters as JSON]
        Observation: [tool result]
        ... (repeat)
        Thought: [final reasoning]
        Final Answer: [mission summary]
        """
        # Build system prompt with tool descriptions
        tool_descriptions = self._format_tool_descriptions()
        
        system_prompt = f"""You are a First Responder Swarm Commander controlling autonomous drones in a disaster zone.

AVAILABLE TOOLS:
{tool_descriptions}

RESPONSE FORMAT - You MUST follow this exact format:
Thought: [your reasoning about what to do next]
Action: [exact tool name from the list above]
Action Input: {{"parameter_name": "value"}}

After receiving an Observation, continue with another Thought/Action/Action Input cycle.
When you have completed the mission, respond with:
Thought: [final reasoning]
Final Answer: [comprehensive mission report]

CRITICAL TACTICAL RULES:
1. ALWAYS start responses with "Thought:" - never skip this
2. Action must be EXACTLY one of the tool names listed above
3. Action Input must be valid JSON with correct parameters
4. EFFICIENCY: Before moving drones, calculate which drone is NEAREST to target (minimize Manhattan distance)
5. THERMAL SCANS: Have 2-cell radius - scan covers 5x5 area centered on drone
6. SEARCH STRATEGY: Use systematic grid coverage - space drones 4-5 cells apart to maximize coverage
7. BATTERY MANAGEMENT: Check battery before long moves (each move drains ~1%)
8. HUMAN INTEL: Check get_human_intelligence first, but verify with thermal scans
9. SURVIVOR DETECTION: When thermal scan detects survivors, calculate exact rescue coordinates
10. CONTINUE until mission objectives met or all viable search areas covered

TACTICAL EFFICIENCY EXAMPLES:
- Target at (10,15): Check ALL drone positions first, send nearest one
- Grid search: Position drones at (4,4), (4,10), (4,16), (10,4), etc. for full coverage
- After detection: Move drone to exact survivor position for rescue

MISSION BRIEF:
{mission_brief}

Begin!"""

        messages = [SystemMessage(content=system_prompt)]
        responses = []
        
        for iteration in range(max_iterations):
            # Get LLM response
            response = await self.llm.ainvoke(messages)
            agent_output = response.content.strip()
            
            responses.append(f"[Iteration {iteration + 1}]")
            responses.append(agent_output)
            
            # Check for Final Answer
            if "Final Answer:" in agent_output:
                break
            
            # Parse Action and Action Input
            action_match = re.search(r'Action:\s*(.+?)(?:\n|$)', agent_output, re.IGNORECASE)
            action_input_match = re.search(r'Action Input:\s*(\{.+?\})', agent_output, re.DOTALL | re.IGNORECASE)
            
            if not action_match:
                # Agent didn't specify an action, prompt it to continue
                messages.append(AIMessage(content=agent_output))
                messages.append(HumanMessage(content="Please specify an Action and Action Input to continue, or provide a Final Answer if the mission is complete."))
                continue
            
            action_name = action_match.group(1).strip()
            
            # Execute the tool
            try:
                if action_name not in self.tool_dict:
                    observation = f"Error: Tool '{action_name}' not found. Available tools: {', '.join(self.tool_dict.keys())}"
                else:
                    tool = self.tool_dict[action_name]
                    
                    # Parse action input
                    if action_input_match:
                        import json
                        action_input_str = action_input_match.group(1).strip()
                        action_params = json.loads(action_input_str)
                    else:
                        action_params = {}
                    
                    # Execute tool
                    if asyncio.iscoroutinefunction(tool.func):
                        result = await tool.func(**action_params)
                    else:
                        result = tool.func(**action_params)
                    
                    observation = f"Observation: {result}"
                
                responses.append(observation)
                
                # Add to message history
                messages.append(AIMessage(content=agent_output))
                messages.append(HumanMessage(content=observation))
                
            except Exception as e:
                error_msg = f"Observation: Error executing {action_name}: {str(e)}"
                responses.append(error_msg)
                messages.append(AIMessage(content=agent_output))
                messages.append(HumanMessage(content=error_msg))
        
        return "\n\n".join(responses)
    
    def _format_tool_descriptions(self) -> str:
        """Format tool descriptions for the prompt."""
        descriptions = []
        for tool in self.tools:
            # Get parameter info from args_schema if available
            params_info = ""
            if hasattr(tool, 'args_schema') and tool.args_schema:
                schema = tool.args_schema
                if hasattr(schema, 'schema'):
                    props = schema.schema().get('properties', {})
                    param_list = []
                    for param_name, param_info in props.items():
                        param_desc = param_info.get('description', '')
                        param_list.append(f"{param_name}: {param_desc}")
                    if param_list:
                        params_info = f" Parameters: {', '.join(param_list)}"
            
            descriptions.append(f"- {tool.name}: {tool.description}{params_info}")
        
        return "\n".join(descriptions)
    
    def run_sync(self, mission_brief: str) -> dict:
        """
        Synchronous execution that returns structured results.
        
        Returns:
            dict with 'status', 'actions', and 'report' keys
        """
        response = self.run(mission_brief)
        return {
            "status": "completed",
            "response": response,
            "brief": mission_brief
        }
