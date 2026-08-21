# Coding Challenges Dataset and Automated Test Runner for CODE SPRINT
import os
import json
from typing import Dict, Any, List, Optional
try:
    from backend.compiler import evaluate_test_cases
except ImportError:
    from compiler import evaluate_test_cases

_DATA_PATH = os.path.join(os.path.dirname(__file__), "challenges.json")
if os.path.exists(_DATA_PATH):
    with open(_DATA_PATH, "r", encoding="utf-8") as _f:
        CHALLENGES_DATA: List[Dict[str, Any]] = json.load(_f)
else:
    CHALLENGES_DATA = []

def get_all_challenges(language: Optional[str] = None, difficulty: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
    filtered = CHALLENGES_DATA
    if language and language.lower() != "all":
        filtered = [c for c in filtered if c.get("language", "").lower() == language.lower()]
    if difficulty and difficulty.lower() != "all":
        filtered = [c for c in filtered if c.get("difficulty", "").lower() == difficulty.lower()]
    if search:
        s = search.lower().strip()
        filtered = [c for c in filtered if s in c.get("title", "").lower() or s in c.get("category", "").lower() or s in c.get("description", "").lower()]
    return filtered

def get_challenge_by_id(challenge_id: str) -> Optional[Dict[str, Any]]:
    for c in CHALLENGES_DATA:
        if c.get("id") == challenge_id:
            return c
    return None

def evaluate_challenge_submission(challenge_id: str, code: str, language: Optional[str] = None) -> Dict[str, Any]:
    challenge = get_challenge_by_id(challenge_id)
    if not challenge:
        return {
            "success": False,
            "error": "Challenge not found",
            "passed": False,
            "passed_count": 0,
            "total_count": 0,
            "results": []
        }

    # Determine language
    lang = language or challenge.get("language", "python")
    test_cases = challenge.get("test_cases", [])
    eval_result = evaluate_test_cases(lang, code, test_cases)
    points = challenge.get("points", 20)
    score = points if eval_result["passed"] else int((eval_result["passed_count"] / max(eval_result["total_count"], 1)) * points)

    return {
        "success": True,
        "challenge_id": challenge_id,
        "passed": eval_result["passed"],
        "passed_count": eval_result["passed_count"],
        "passed_cases": eval_result["passed_count"],
        "total_count": eval_result["total_count"],
        "total_cases": eval_result["total_count"],
        "score": score,
        "overall_status": eval_result["overall_status"],
        "results": eval_result["results"],
        "message": "Challenge solved successfully!" if eval_result["passed"] else f"Passed {eval_result['passed_count']} of {eval_result['total_count']} test cases."
    }
