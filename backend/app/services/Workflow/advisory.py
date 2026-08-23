from app.services.LLM.groq_client import call_groq, parse_json_response

ADVISORY_PROMPT = """You are an approval advisory assistant. You do NOT make approval decisions -- you only give a human reviewer useful context before THEY decide.

CURRENT APPROVAL STAGE: {current_stage}
CONTRACT VALUE: {value} {currency}
RISK ASSESSMENT: {risk_score}/100 ({risk_level})
FLAGGED CLAUSES: {flagged_clauses}
MISSING CLAUSES: {missing_clauses}

Respond with ONLY a valid JSON object, no markdown:
{{
  "recommendation": "proceed" or "extra_scrutiny" or "escalate",
  "reasoning": "1-2 sentence plain-English note for the reviewer at THIS specific stage -- what should they specifically look for, given their role"
}}

This is advisory only. Never say you are approving, rejecting, or making the decision -- you are only helping the human reviewer know what to pay attention to.
"""


def generate_advisory(
    current_stage: str, value, currency: str,
    risk_score, risk_level: str, flagged_clauses: list, missing_clauses: list,
) -> dict:
    prompt = ADVISORY_PROMPT.format(
        current_stage=current_stage,
        value=value if value is not None else "Not specified",
        currency=currency or "",
        risk_score=risk_score if risk_score is not None else "Not yet analyzed",
        risk_level=risk_level or "unknown",
        flagged_clauses=flagged_clauses or "None",
        missing_clauses=missing_clauses or "None",
    )
    raw = call_groq(prompt, temperature=0.2)
    return parse_json_response(raw)