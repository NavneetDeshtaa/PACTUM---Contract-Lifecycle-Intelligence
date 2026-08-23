import difflib
from typing import List, Dict


def compute_diff(old_text: str, new_text: str) -> Dict:
    """
    Computes an exact, deterministic diff between two versions using
    Python's built-in difflib -- no LLM involved in this step at all.
    This matters: the actual textual differences must be 100% accurate,
    not an LLM's approximation of "what changed." The LLM's job (in
    diff_explanation.py) is purely to narrate the meaning of a diff this
    function has already computed with certainty.

    Splits on lines, since difflib.SequenceMatcher is designed around
    comparing sequences of lines. Contracts with clear paragraph/section
    breaks diff well this way; a contract that's one giant unbroken
    paragraph would diff at a coarser granularity than ideal -- worth
    knowing as a limitation rather than assuming perfect sentence-level
    precision always.
    """
    old_lines = old_text.splitlines()
    new_lines = new_text.splitlines()

    matcher = difflib.SequenceMatcher(None, old_lines, new_lines)

    changes: List[Dict] = []
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            continue  # unchanged lines aren't useful to show or explain
        changes.append({
            "type": tag,   # "replace" | "delete" | "insert"
            "old_text": "\n".join(old_lines[i1:i2]),
            "new_text": "\n".join(new_lines[j1:j2]),
        })

    unified = "\n".join(difflib.unified_diff(
        old_lines, new_lines, lineterm="", n=1,
    ))

    return {
        "changes": changes,
        "unified_diff": unified,
        "has_changes": len(changes) > 0,
    }