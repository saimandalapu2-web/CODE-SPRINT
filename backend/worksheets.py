# Worksheets Data and Evaluation Engine for CODE SPRINT
import os
import json
from typing import Dict, Any, List, Optional
try:
    from backend.compiler import evaluate_test_cases
except ImportError:
    from compiler import evaluate_test_cases

_DATA_PATH = os.path.join(os.path.dirname(__file__), "worksheets.json")
if os.path.exists(_DATA_PATH):
    with open(_DATA_PATH, "r", encoding="utf-8") as _f:
        WORKSHEETS_BY_TOPIC: Dict[str, List[Dict[str, Any]]] = json.load(_f)
else:
    WORKSHEETS_BY_TOPIC = {}

def get_worksheet_by_topic(topic_id: str) -> List[Dict[str, Any]]:
    data = WORKSHEETS_BY_TOPIC.get(topic_id, [])
    if isinstance(data, dict):
        return data.get("questions", [])
    return data

def get_worksheet_for_topic(topic_id: str, topic_title: str = "", language_id: str = "") -> Dict[str, Any]:
    questions = get_worksheet_by_topic(topic_id)
    return {
        "topic_id": topic_id,
        "topic_title": topic_title,
        "language_id": language_id,
        "total_questions": len(questions),
        "questions": questions
    }

def check_worksheet_answer(question_id: str, topic_id: str, answer: str, language: str = "python") -> Dict[str, Any]:
    question = get_worksheet_question_by_id(question_id)
    if not question:
        return {"correct": False, "explanation": "Question not found."}
    
    expected = question.get("expected_solution", "").strip()
    user_ans = answer.strip()
    is_correct = (expected.lower() == user_ans.lower()) or (expected == user_ans)
    
    return {
        "correct": is_correct,
        "expected": expected,
        "explanation": question.get("explanation", "Review the topic example.")
    }

def get_worksheet_question_by_id(question_id: str) -> Optional[Dict[str, Any]]:
    for topic_id, val in WORKSHEETS_BY_TOPIC.items():
        questions = val.get("questions", []) if isinstance(val, dict) else val
        for q in questions:
            if q.get("id") == question_id:
                return q
    return None

def evaluate_worksheet_submission(question_id: str, language: str, code: str) -> Dict[str, Any]:
    question = get_worksheet_question_by_id(question_id)
    if not question:
        return {
            "success": False,
            "error": "Question not found",
            "passed": False,
            "passed_count": 0,
            "total_count": 0,
            "results": []
        }
    
    test_cases = question.get("test_cases", [])
    if not test_cases:
        test_cases = [{"input": "", "expected_output": question.get("expected_solution", ""), "hidden": False}]
        
    eval_result = evaluate_test_cases(language, code, test_cases)
    return {
        "success": True,
        "question_id": question_id,
        "passed": eval_result["passed"],
        "passed_count": eval_result["passed_count"],
        "total_count": eval_result["total_count"],
        "overall_status": eval_result["overall_status"],
        "results": eval_result["results"],
        "points_earned": question.get("points", 10) if eval_result["passed"] else 0
    }
