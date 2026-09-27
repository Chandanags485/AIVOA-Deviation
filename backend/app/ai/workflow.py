import os
from typing import TypedDict, Optional

from dotenv import load_dotenv
from groq import Groq
from langgraph.graph import StateGraph, START, END

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# -----------------------------
# 1. Define the workflow state
# -----------------------------

class DeviationState(TypedDict):
    text: str
    extracted: dict
    risk: dict


# -----------------------------
# 2. Extract deviation details
# -----------------------------

def extract_deviation(state: DeviationState):
    prompt = f"""
You are an AI assistant for a pharmaceutical Quality Management System.

Extract structured information from the following deviation report.

Return ONLY valid JSON with these exact fields:

{{
    "deviation_title": "",
    "batch_number": "",
    "process_step": "",
    "parameter": "",
    "observed_value": "",
    "approved_range": "",
    "duration": "",
    "description": "",
    "potential_impact": ""
}}

If a value is not available, use an empty string.

Deviation report:

{state["text"]}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "You extract pharmaceutical deviation information into structured JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )

    extracted = response.choices[0].message.content

    import json

    return {
        "extracted": json.loads(extracted)
    }


# -----------------------------
# 3. Assess impact and severity
# -----------------------------

def assess_risk(state: DeviationState):
    extracted = state["extracted"]

    prompt = f"""
You are an AI assistant supporting pharmaceutical deviation assessment.

Based on the deviation information below, provide an INITIAL severity recommendation.

Severity must be exactly one of:

Minor
Major
Critical

Return ONLY valid JSON:

{{
    "severity": "",
    "severity_reason": ""
}}

Important:
- This is an AI recommendation only.
- Do not claim that the recommendation is the final quality decision.
- Give a short, factual reason based only on the supplied information.

Deviation information:

{extracted}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "You assist with pharmaceutical deviation impact assessment."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )

    risk = response.choices[0].message.content

    import json

    return {
        "risk": json.loads(risk)
    }


# -----------------------------
# 4. Build LangGraph
# -----------------------------

workflow = StateGraph(DeviationState)

workflow.add_node("extract_deviation", extract_deviation)
workflow.add_node("assess_risk", assess_risk)

workflow.add_edge(START, "extract_deviation")
workflow.add_edge("extract_deviation", "assess_risk")
workflow.add_edge("assess_risk", END)

deviation_graph = workflow.compile()


# -----------------------------
# 5. Helper function
# -----------------------------

def analyze_deviation(text: str):
    result = deviation_graph.invoke(
        {
            "text": text,
            "extracted": {},
            "risk": {}
        }
    )

    return {
        "extracted": result["extracted"],
        "risk": result["risk"]
    }