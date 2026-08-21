# SQLite Database Initializer and Persistence Layer for CodeLearn
import sqlite3
import os
import json
import time
from typing import Dict, Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "codelearn.db")

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT NOT NULL DEFAULT 'Learner',
    password_hash TEXT,
    salt TEXT,
    streak INTEGER DEFAULT 1,
    last_active_date TEXT,
    total_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS topic_progress (
    user_id TEXT,
    topic_id TEXT,
    completed BOOLEAN DEFAULT FALSE,
    theory_read BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS worksheet_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    topic_id TEXT,
    score INTEGER,
    percentage REAL,
    correct_count INTEGER,
    incorrect_count INTEGER,
    time_seconds INTEGER,
    passed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    topic_id TEXT,
    score INTEGER,
    total_points INTEGER,
    percentage REAL,
    passed BOOLEAN,
    time_taken_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenge_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    challenge_id TEXT,
    passed BOOLEAN,
    passed_cases INTEGER,
    total_cases INTEGER,
    score INTEGER,
    submitted_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    type TEXT,
    title TEXT,
    score_desc TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

def get_db_connection():
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        # Quick integrity test
        conn.execute("SELECT 1 FROM sqlite_master LIMIT 1")
        return conn
    except sqlite3.DatabaseError:
        try:
            if os.path.exists(DB_FILE):
                os.remove(DB_FILE)
        except Exception:
            pass
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.executescript(SCHEMA_SQL)
    except sqlite3.DatabaseError:
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.executescript(SCHEMA_SQL)
    
    # Safe migrations for existing SQLite table
    cursor.execute("PRAGMA table_info(users)")
    cols = [col["name"] for col in cursor.fetchall()]
    if "username" not in cols:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN username TEXT")
        except Exception:
            pass
    if "email" not in cols:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN email TEXT")
        except Exception:
            pass
    if "password_hash" not in cols:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
        except Exception:
            pass
    if "salt" not in cols:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN salt TEXT")
        except Exception:
            pass
            
    conn.commit()
    conn.close()

def get_or_create_user(user_id: str = "guest_user") -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    
    today_str = time.strftime("%Y-%m-%d")
    
    if not row:
        cursor.execute("INSERT INTO users (id, name, streak, last_active_date) VALUES (?, ?, ?, ?)",
                       (user_id, "Learner", 1, today_str))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
    else:
        # Check streak calculation
        last_date = row["last_active_date"]
        streak = row["streak"]
        if last_date != today_str:
            # Update last active
            cursor.execute("UPDATE users SET last_active_date = ? WHERE id = ?", (today_str, user_id))
            conn.commit()
            
    user_data = dict(row)
    conn.close()
    return user_data

def update_topic_progress(user_id: str, topic_id: str, completed: bool = True):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO topic_progress (user_id, topic_id, completed, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, topic_id) DO UPDATE SET
            completed = excluded.completed,
            updated_at = CURRENT_TIMESTAMP
    """, (user_id, topic_id, completed))
    
    # Log activity
    cursor.execute("""
        INSERT INTO user_activity (user_id, type, title, score_desc)
        VALUES (?, 'topic', ?, 'Completed Lesson')
    """, (user_id, topic_id))
    
    conn.commit()
    conn.close()

def save_worksheet_result(user_id: str, topic_id: str, score: int, percentage: float, correct: int, incorrect: int, time_sec: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    passed = percentage >= 70.0
    
    cursor.execute("""
        INSERT INTO worksheet_results (user_id, topic_id, score, percentage, correct_count, incorrect_count, time_seconds, passed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, topic_id, score, percentage, correct, incorrect, time_sec, passed))
    
    cursor.execute("""
        INSERT INTO user_activity (user_id, type, title, score_desc)
        VALUES (?, 'worksheet', ?, ?)
    """, (user_id, f"Worksheet: {topic_id}", f"{int(percentage)}% Score ({correct}/{correct + incorrect})"))
    
    conn.commit()
    conn.close()

def save_quiz_result(user_id: str, topic_id: str, score: int, total_points: int, percentage: float, passed: bool, time_sec: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO quiz_results (user_id, topic_id, score, total_points, percentage, passed, time_taken_seconds)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, topic_id, score, total_points, percentage, passed, time_sec))
    
    status_str = "Passed" if passed else "Needs Retry"
    cursor.execute("""
        INSERT INTO user_activity (user_id, type, title, score_desc)
        VALUES (?, 'quiz', ?, ?)
    """, (user_id, f"Quiz: {topic_id}", f"{int(percentage)}% - {status_str}"))
    
    conn.commit()
    conn.close()

def save_challenge_result(user_id: str, challenge_id: str, passed: bool, passed_cases: int, total_cases: int, score: int, code: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO challenge_results (user_id, challenge_id, passed, passed_cases, total_cases, score, submitted_code)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, challenge_id, passed, passed_cases, total_cases, score, code))
    
    cursor.execute("""
        INSERT INTO user_activity (user_id, type, title, score_desc)
        VALUES (?, 'challenge', ?, ?)
    """, (user_id, f"Challenge: {challenge_id}", f"{'Solved' if passed else 'Attempted'} ({passed_cases}/{total_cases} tests)"))
    
    conn.commit()
    conn.close()

def get_user_full_progress(user_id: str = "guest_user") -> Dict[str, Any]:
    from backend.curriculum import TOPICS_DATA, LANGUAGES_DATA
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. User profile info
    user = get_or_create_user(user_id)
    
    # 2. Completed topics
    cursor.execute("SELECT topic_id FROM topic_progress WHERE user_id = ? AND completed = 1", (user_id,))
    completed_topics = [row["topic_id"] for row in cursor.fetchall()]
    
    # 3. Worksheets
    cursor.execute("""
        SELECT topic_id, MAX(percentage) as best_percentage, MAX(score) as best_score, MAX(passed) as passed
        FROM worksheet_results
        WHERE user_id = ?
        GROUP BY topic_id
    """, (user_id,))
    worksheet_rows = cursor.fetchall()
    worksheets_scores = {
        row["topic_id"]: {
            "best_percentage": row["best_percentage"],
            "best_score": row["best_score"],
            "passed": bool(row["passed"])
        } for row in worksheet_rows
    }
    
    # 4. Quizzes
    cursor.execute("""
        SELECT topic_id, MAX(percentage) as best_percentage, MAX(score) as best_score, MAX(passed) as passed
        FROM quiz_results
        WHERE user_id = ?
        GROUP BY topic_id
    """, (user_id,))
    quiz_rows = cursor.fetchall()
    quiz_scores = {
        row["topic_id"]: {
            "best_percentage": row["best_percentage"],
            "best_score": row["best_score"],
            "passed": bool(row["passed"])
        } for row in quiz_rows
    }
    
    # 5. Challenges
    cursor.execute("""
        SELECT COUNT(DISTINCT challenge_id) as total_solved
        FROM challenge_results
        WHERE user_id = ? AND passed = 1
    """, (user_id,))
    ch_row = cursor.fetchone()
    challenges_solved = ch_row["total_solved"] if ch_row else 0
    
    # 6. Recent activity
    cursor.execute("""
        SELECT type, title, score_desc, timestamp
        FROM user_activity
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 10
    """, (user_id,))
    recent_activity = [dict(r) for r in cursor.fetchall()]
    conn.close()
    
    # Calculate language breakdowns
    total_all_topics = len(TOPICS_DATA)
    lang_progress = {}
    
    for lang in LANGUAGES_DATA:
        lid = lang["id"]
        lang_topics = [t for t in TOPICS_DATA if t["language_id"] == lid]
        total_in_lang = len(lang_topics)
        completed_in_lang = sum(1 for t in lang_topics if t["id"] in completed_topics)
        pct = round((completed_in_lang / total_in_lang * 100) if total_in_lang > 0 else 0, 1)
        lang_progress[lid] = {
            "name": lang["name"],
            "total_topics": total_in_lang,
            "completed_topics": completed_in_lang,
            "percentage": pct
        }
        
    avg_quiz = 0.0
    if quiz_scores:
        avg_quiz = round(sum(q["best_percentage"] for q in quiz_scores.values()) / len(quiz_scores), 1)
        
    overall_pct = round((len(completed_topics) / total_all_topics * 100) if total_all_topics > 0 else 0, 1)
    
    return {
        "user_id": user_id,
        "overall_percentage": overall_pct,
        "completed_topics_count": len(completed_topics),
        "total_topics_count": total_all_topics,
        "worksheets_completed_count": len(worksheets_scores),
        "quizzes_completed_count": len(quiz_scores),
        "challenges_solved_count": challenges_solved,
        "average_quiz_score": avg_quiz,
        "current_streak_days": user.get("streak", 1),
        "total_learning_time_minutes": user.get("total_time_minutes", 15),
        "language_progress": lang_progress,
        "completed_topics": completed_topics,
        "worksheet_scores": worksheets_scores,
        "quiz_scores": quiz_scores,
        "challenge_stats": {
            "total_solved": challenges_solved
        },
        "recent_activity": recent_activity
    }

# Auto-initialize DB on import
init_db()
