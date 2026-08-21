import os
import sys
from typing import Optional, List, Dict, Any

try:
    from fastapi import FastAPI, HTTPException, Query, Header
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
except ImportError:
    class FastAPI:
        def __init__(self, **kwargs):
            self.title = kwargs.get("title", "CODE SPRINT")
            self.description = kwargs.get("description", "")
            self.version = kwargs.get("version", "2.0.0")
        def add_middleware(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
        def post(self, *args, **kwargs): return lambda f: f
        def mount(self, *args, **kwargs): pass
    class HTTPException(Exception):
        def __init__(self, status_code: int = 400, detail: str = ""):
            self.status_code = status_code
            self.detail = detail
            super().__init__(f"{status_code}: {detail}")
    def Query(default=None, **kwargs): return default
    def Header(default=None, **kwargs): return default
    CORSMiddleware = None
    StaticFiles = None
    FileResponse = None

try:
    from pydantic import BaseModel
except ImportError:
    class BaseModel:
        def __init__(self, **data):
            for k, v in data.items():
                setattr(self, k, v)
        def dict(self):
            return self.__dict__
        def model_dump(self):
            return self.__dict__

from backend.schemas import (
    LanguageInfo, TopicDetail, WorksheetData, WorksheetCheckRequest,
    WorksheetCheckResponse, QuizData, QuizSubmitRequest, QuizSubmitResponse,
    CompilerExecuteRequest, CompilerExecuteResponse, Challenge,
    ChallengeSubmitRequest, ChallengeSubmitResponse, ChallengeRunRequest,
    InterviewQuestion, TopicProgressRequest, WorksheetProgressRequest,
    UserProgress, SearchResultItem
)
from backend.curriculum import (
    get_languages, get_topics_by_language, get_topic_by_id, TOPICS_DATA, LANGUAGES_DATA
)
from backend.worksheets import (
    get_worksheet_by_topic, get_worksheet_question_by_id, evaluate_worksheet_submission
)
from backend.quizzes import get_quiz_for_topic, evaluate_quiz_submission
from backend.challenges import get_all_challenges, get_challenge_by_id, evaluate_challenge_submission
from backend.interview import get_all_interview_questions, filter_interview_questions
from backend.compiler import execute_code, evaluate_test_cases
from backend.database import (
    init_db, update_topic_progress, save_worksheet_result, save_quiz_result,
    save_challenge_result, get_user_full_progress, get_or_create_user
)
from backend.auth import (
    register_user, login_user, verify_session, get_user_by_id, logout_user
)

# Initialize database schema
init_db()

app = FastAPI(
    title="CODE SPRINT API",
    description="Deterministic programming education API with comprehensive syllabus, worksheets, quizzes, compiler, and challenges.",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Request Models
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    name: Optional[str] = None

class LoginRequest(BaseModel):
    identifier: str
    password: str

class WorksheetCodeSubmitRequest(BaseModel):
    question_id: str
    language: str
    code: str
    user_id: Optional[str] = "guest"
    topic_id: Optional[str] = None

# ==================== API ROUTES ====================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CODE SPRINT Backend",
        "tagline": "Learn. Practice. Code. Master.",
        "version": "2.0.0"
    }

# ==================== AUTHENTICATION ====================

@app.post("/api/auth/register")
def auth_register(req: RegisterRequest):
    res = register_user(
        username=req.username,
        email=req.email,
        password=req.password,
        name=req.name
    )
    return res

@app.post("/api/auth/login")
def auth_login(req: LoginRequest):
    res = login_user(
        identifier=req.identifier,
        password=req.password
    )
    return res

@app.get("/api/auth/me")
def auth_me(authorization: Optional[str] = Header(None)):
    if not authorization:
        return {"valid": False, "error": "No token provided"}
    
    token = authorization
    if token.startswith("Bearer "):
        token = token[7:].strip()
        
    return verify_session(token)

@app.post("/api/auth/logout")
def auth_logout(authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization
        if token.startswith("Bearer "):
            token = token[7:].strip()
        logout_user(token)
    return {"success": True}

# ==================== CURRICULUM & SYLLABUS ====================

@app.get("/api/languages")
def api_get_languages():
    languages = get_languages()
    res = []
    for lang in languages:
        lid = lang["id"]
        topics_count = sum(1 for t in TOPICS_DATA if t["language_id"] == lid)
        cats = {t["category_id"] for t in TOPICS_DATA if t["language_id"] == lid}
        res.append({
            **lang,
            "total_topics": topics_count,
            "category_count": len(cats)
        })
    return res

@app.get("/api/curriculum")
def get_full_curriculum():
    return {
        "languages": get_languages(),
        "topics": TOPICS_DATA
    }

@app.get("/api/curriculum/{language}")
def get_language_curriculum(language: str):
    lang_id = language.lower().strip()
    topics = get_topics_by_language(lang_id)
    lang_info = next((l for l in LANGUAGES_DATA if l["id"] == lang_id), None)
    if not lang_info:
        raise HTTPException(status_code=404, detail=f"Language '{language}' not found.")
        
    # Group into categories
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

@app.get("/api/topics/{topic_id}")
def get_topic(topic_id: str):
    topic = get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found.")
    return topic

# ==================== WORKSHEETS ====================

@app.get("/api/topics/{topic_id}/worksheet")
def get_topic_worksheet(topic_id: str):
    topic = get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found.")
    questions = get_worksheet_by_topic(topic_id)
    return {
        "topic_id": topic_id,
        "topic_title": topic["title"],
        "language_id": topic["language_id"],
        "level": topic["level"],
        "total_questions": len(questions),
        "questions": questions
    }

@app.get("/api/worksheet/questions/{question_id}")
def get_single_worksheet_question(question_id: str):
    q = get_worksheet_question_by_id(question_id)
    if not q:
        raise HTTPException(status_code=404, detail="Worksheet question not found.")
    return q

@app.post("/api/worksheet/submit")
def submit_worksheet_code(req: WorksheetCodeSubmitRequest):
    res = evaluate_worksheet_submission(req.question_id, req.language, req.code)
    if req.user_id and req.topic_id and res.get("passed"):
        save_worksheet_result(
            user_id=req.user_id,
            topic_id=req.topic_id,
            score=res.get("points_earned", 10),
            percentage=100.0,
            correct=res.get("passed_count", 1),
            incorrect=res.get("total_count", 1) - res.get("passed_count", 1),
            time_sec=15
        )
    return res

# Backward-compat
@app.post("/api/worksheet/check")
def check_worksheet_legacy(req: WorksheetCheckRequest):
    res = evaluate_worksheet_submission(req.question_id, req.language_id or "python", req.user_answer)
    return {
        "correct": res.get("passed", False),
        "feedback": "All test cases passed!" if res.get("passed") else "Test cases failed. Verify output format.",
        "expected_answer": "",
        "points_awarded": 10 if res.get("passed") else 0
    }

# ==================== QUIZZES ====================

@app.get("/api/topics/{topic_id}/quiz")
def get_topic_quiz(topic_id: str):
    topic = get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found.")
    return get_quiz_for_topic(topic["id"], topic["title"], topic["language_id"])

@app.post("/api/quiz/submit")
def submit_quiz(req: QuizSubmitRequest):
    result = evaluate_quiz_submission(req.topic_id, req.answers)
    save_quiz_result(
        user_id=req.user_id,
        topic_id=req.topic_id,
        score=result["score"],
        total_points=result["total_points"],
        percentage=result["percentage"],
        passed=result["passed"],
        time_sec=req.time_taken_seconds
    )
    return result

# ==================== REAL COMPILER EXECUTION ====================

@app.post("/api/compiler/execute")
def execute_compiler(req: CompilerExecuteRequest):
    res = execute_code(req.language, req.code, req.stdin or "")
    return res

# ==================== CODING CHALLENGES ====================

@app.get("/api/challenges")
def list_challenges(
    language: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    return get_all_challenges(language=language, difficulty=difficulty, search=search)

@app.get("/api/challenges/{challenge_id}")
def get_challenge(challenge_id: str):
    ch = get_challenge_by_id(challenge_id)
    if not ch:
        raise HTTPException(status_code=404, detail=f"Challenge '{challenge_id}' not found.")
    return ch

@app.post("/api/challenges/submit")
def submit_challenge(req: ChallengeSubmitRequest):
    res = evaluate_challenge_submission(req.challenge_id, req.code)
    save_challenge_result(
        user_id=req.user_id,
        challenge_id=req.challenge_id,
        passed=res["passed"],
        passed_cases=res["passed_count"],
        total_cases=res["total_count"],
        score=100 if res["passed"] else int((res["passed_count"] / max(1, res["total_count"])) * 100),
        code=req.code
    )
    return {
        "passed": res["passed"],
        "passed_cases": res["passed_count"],
        "total_cases": res["total_count"],
        "overall_status": res["overall_status"],
        "score": 100 if res["passed"] else int((res["passed_count"] / max(1, res["total_count"])) * 100),
        "results": res["results"]
    }

# ==================== INTERVIEW QUESTIONS ====================

@app.get("/api/interview")
def get_interview_questions(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    return filter_interview_questions(category, difficulty, company, search)

# ==================== PROGRESS ====================

@app.post("/api/progress/topic")
def set_topic_progress(req: TopicProgressRequest):
    update_topic_progress(req.user_id, req.topic_id, req.completed)
    return {"success": True, "user_id": req.user_id, "topic_id": req.topic_id}

@app.post("/api/progress/worksheet")
def set_worksheet_progress(req: WorksheetProgressRequest):
    save_worksheet_result(
        user_id=req.user_id,
        topic_id=req.topic_id,
        score=req.score,
        percentage=req.percentage,
        correct=req.correct,
        incorrect=req.incorrect,
        time_sec=req.time_seconds
    )
    return {"success": True}

@app.get("/api/progress/{user_id}")
def get_progress(user_id: str):
    return get_user_full_progress(user_id)

# ==================== GLOBAL SEARCH ====================

@app.get("/api/search")
def search_all(q: str = Query(..., min_length=1)):
    query = q.lower().strip()
    results = []

    # 1. Search Languages
    for l in LANGUAGES_DATA:
        if query in l["name"].lower() or query in l["description"].lower():
            results.append({
                "id": l["id"],
                "type": "language",
                "title": l["name"],
                "subtitle": "Language Roadmap (50 Topics)",
                "category": "Language",
                "language": l["name"],
                "link": f"#/syllabus/{l['id']}"
            })

    # 2. Search Topics
    for t in TOPICS_DATA:
        if (query in t["title"].lower() or 
            query in t["description"].lower() or 
            query in t["theory"].lower() or 
            any(query in sub.lower() for sub in t.get("subtopics", []))):
            results.append({
                "id": t["id"],
                "type": "topic",
                "title": t["title"],
                "subtitle": f"{t['language_id'].capitalize()} • {t['level']} • {t['category_name']}",
                "category": t["category_name"],
                "language": t["language_id"],
                "link": f"#/lesson/{t['id']}"
            })

    # 3. Search Challenges
    for c in get_all_challenges():
        if query in c["title"].lower() or query in c["description"].lower() or query in c["category"].lower():
            results.append({
                "id": c["id"],
                "type": "challenge",
                "title": c["title"],
                "subtitle": f"{c['language']} • {c['difficulty']} Challenge",
                "category": c["category"],
                "language": c["language"],
                "link": f"#/challenges/{c['id']}"
            })

    # 4. Search Interview Questions
    for i in get_all_interview_questions():
        if query in i["question"].lower() or query in i["answer"].lower() or query in i["category"].lower():
            results.append({
                "id": i["id"],
                "type": "interview",
                "title": i["question"],
                "subtitle": f"{i['category']} • {i['difficulty']} Interview Question",
                "category": i["category"],
                "language": i.get("language"),
                "link": f"#/interview"
            })

    return results[:30]

# Serve Frontend Static Assets
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir) and StaticFiles is not None:
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_index():
        if FileResponse:
            return FileResponse(os.path.join(frontend_dir, "index.html"))
        return {"status": "ok", "message": "CODE SPRINT Backend API active"}
