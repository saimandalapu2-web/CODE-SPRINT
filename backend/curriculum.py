# Comprehensive Curriculum Module for CODE SPRINT
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

def get_curriculum_by_language(language_id: str) -> Optional[Dict[str, Any]]:
    lang_id = language_id.lower().strip()
    lang_info = next((l for l in LANGUAGES_DATA if l["id"] == lang_id), None)
    if not lang_info:
        return None
    topics = get_topics_by_language(lang_id)
    
    categories_map = {}
    for t in topics:
        cat_name = t["category_name"]
        if cat_name not in categories_map:
            categories_map[cat_name] = []
        categories_map[cat_name].append(t)
        
    categories = [
        {"id": f"{lang_id}-cat-{name.lower().replace(' ', '-')}", "name": name, "topics": t_list}
        for name, t_list in categories_map.items()
    ]
    
    return {
        "language": lang_info,
        "categories": categories,
        "topics": topics,
        "total_topics": len(topics)
    }

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
