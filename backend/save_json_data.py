#!/usr/bin/env python3
import os
import json
from generate_data import LANG_TOPICS
from build_full_dataset import generate_topic_details, generate_topic_worksheet, build_challenges

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

def build_and_save_all():
    all_topics = []
    all_worksheets = {}

    for lang_id, topic_list in LANG_TOPICS.items():
        for order, (t_id, title, category, level) in enumerate(topic_list, start=1):
            topic_obj = generate_topic_details(lang_id, t_id, title, category, level, order)
            all_topics.append(topic_obj)

            ws_list = generate_topic_worksheet(lang_id, t_id, title, level)
            all_worksheets[t_id] = ws_list

    challenges = build_challenges()

    # Save JSON files
    with open(os.path.join(CURRENT_DIR, "curriculum.json"), "w", encoding="utf-8") as f:
        json.dump(all_topics, f, indent=2)

    with open(os.path.join(CURRENT_DIR, "worksheets.json"), "w", encoding="utf-8") as f:
        json.dump(all_worksheets, f, indent=2)

    with open(os.path.join(CURRENT_DIR, "challenges.json"), "w", encoding="utf-8") as f:
        json.dump(challenges, f, indent=2)

    print(f"Saved {len(all_topics)} topics -> curriculum.json")
    print(f"Saved {len(all_worksheets)} worksheets -> worksheets.json")
    print(f"Saved {len(challenges)} challenges -> challenges.json")

    # Write Python wrapper files
    with open(os.path.join(CURRENT_DIR, "curriculum.py"), "w", encoding="utf-8") as f:
        f.write('''# Comprehensive Curriculum Module for CODE SPRINT
import os
import json
from typing import List, Dict, Any, Optional

LANGUAGES_DATA = [
    {
        "id": "python",
        "name": "Python",
        "icon": "code-2",
        "description": "High-level, readable language widely used for web development, data science, automation, and AI.",
        "color": "#3776AB",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    },
    {
        "id": "java",
        "name": "Java",
        "icon": "coffee",
        "description": "Class-based, object-oriented language designed for cross-platform enterprise software and Android apps.",
        "color": "#EA2D2E",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    },
    {
        "id": "c",
        "name": "C",
        "icon": "cpu",
        "description": "Foundational procedural systems programming language providing direct memory manipulation and hardware control.",
        "color": "#A8B9CC",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    },
    {
        "id": "cpp",
        "name": "C++",
        "icon": "layers",
        "description": "High-performance language extending C with object-oriented and generic features, used in games and system tools.",
        "color": "#00599C",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    },
    {
        "id": "javascript",
        "name": "JavaScript",
        "icon": "zap",
        "description": "The language of the web, powering interactive browser frontends and server-side applications with Node.js.",
        "color": "#F7DF1E",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    },
    {
        "id": "sql",
        "name": "SQL",
        "icon": "database",
        "description": "Standard declarative query language for creating, querying, updating, and managing relational databases.",
        "color": "#336791",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    },
    {
        "id": "html-css",
        "name": "HTML/CSS",
        "icon": "layout",
        "description": "Core building blocks of web design: HTML structures content semantics while CSS styles layout and appearance.",
        "color": "#E34F26",
        "levels": ["Beginner", "Intermediate", "Advanced"]
    }
]

_DATA_PATH = os.path.join(os.path.dirname(__file__), "curriculum.json")
if os.path.exists(_DATA_PATH):
    with open(_DATA_PATH, "r", encoding="utf-8") as _f:
        TOPICS_DATA: List[Dict[str, Any]] = json.load(_f)
else:
    TOPICS_DATA = []

def get_languages() -> List[Dict[str, Any]]:
    return LANGUAGES_DATA

def get_topics_by_language(language_id: str, level: Optional[str] = None) -> List[Dict[str, Any]]:
    results = [t for t in TOPICS_DATA if t["language_id"] == language_id]
    if level:
        results = [t for t in results if t["level"].lower() == level.lower()]
    return sorted(results, key=lambda x: x["order"])

def get_topic_by_id(topic_id: str) -> Optional[Dict[str, Any]]:
    for t in TOPICS_DATA:
        if t["id"] == topic_id:
            return t
    return None

def get_curriculum_summary() -> Dict[str, Any]:
    summary = {}
    for lang in LANGUAGES_DATA:
        lang_id = lang["id"]
        topics = [t for t in TOPICS_DATA if t["language_id"] == lang_id]
        summary[lang_id] = {
            "total_topics": len(topics),
            "beginner": len([t for t in topics if t["level"] == "Beginner"]),
            "intermediate": len([t for t in topics if t["level"] == "Intermediate"]),
            "advanced": len([t for t in topics if t["level"] == "Advanced"]),
        }
    return summary
''')

    with open(os.path.join(CURRENT_DIR, "worksheets.py"), "w", encoding="utf-8") as f:
        f.write('''# Worksheets Data and Evaluation Engine for CODE SPRINT
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
    return WORKSHEETS_BY_TOPIC.get(topic_id, [])

def get_worksheet_question_by_id(question_id: str) -> Optional[Dict[str, Any]]:
    for topic_id, questions in WORKSHEETS_BY_TOPIC.items():
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
''')

    with open(os.path.join(CURRENT_DIR, "challenges.py"), "w", encoding="utf-8") as f:
        f.write('''# Coding Challenges Dataset and Automated Test Runner for CODE SPRINT
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

def evaluate_challenge_submission(challenge_id: str, language: str, code: str) -> Dict[str, Any]:
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

    test_cases = challenge.get("test_cases", [])
    eval_result = evaluate_test_cases(language, code, test_cases)
    return {
        "success": True,
        "challenge_id": challenge_id,
        "passed": eval_result["passed"],
        "passed_count": eval_result["passed_count"],
        "total_count": eval_result["total_count"],
        "overall_status": eval_result["overall_status"],
        "results": eval_result["results"]
    }
''')

if __name__ == "__main__":
    build_and_save_all()
