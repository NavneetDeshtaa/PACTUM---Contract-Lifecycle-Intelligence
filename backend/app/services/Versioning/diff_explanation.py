from app.services.LLM.groq_client import call_groq

DIFF_EXPLANATION_PROMPT = """You are a contract analyst explaining changes between two versions of a contract to a business user.

Below is the exact set of changes (in unified diff format -- lines starting with '-' were removed, lines starting with '+' were added). Explain the MEANINGFUL changes in plain English. Skip purely cosmetic changes (formatting, whitespace, typo fixes). For each substantive change, briefly note which party it favors or disfavors, if applicable.

DIFF:
{unified_diff}

Write 2-5 short bullet points, one per meaningful change. If there are no substantive changes (only cosmetic ones), say so in one sentence instead. Output plain text only, no markdown headers.
"""


def explain_diff(unified_diff: str) -> str:
    if not unified_diff.strip():
        return "No changes detected between these versions."

    # Diffs of long contracts can get large -- truncate like other prompts.
    prompt = DIFF_EXPLANATION_PROMPT.format(unified_diff=unified_diff[:12000])
    return call_groq(prompt, temperature=0.2)