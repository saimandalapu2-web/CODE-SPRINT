# User Authentication & Security Module for CodeLearn
import sqlite3
import hashlib
import secrets
import time
import re
from typing import Dict, Any, Optional
from backend.database import get_db_connection, init_db

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    # PBKDF2 HMAC SHA-256 with 100,000 iterations
    pwd_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return pwd_hash, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    new_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(new_hash, stored_hash)

def sanitize_user(user_row: Dict[str, Any]) -> Dict[str, Any]:
    safe_fields = ["id", "username", "email", "name", "streak", "last_active_date", "total_time_minutes", "created_at"]
    return {k: user_row.get(k) for k in safe_fields if k in user_row}

def register_user(username: str, email: str, password: str, name: Optional[str] = None) -> Dict[str, Any]:
    username = (username or "").strip()
    email = (email or "").strip().lower()
    name = (name or "").strip() or username
    
    if len(username) < 3:
        return {"success": False, "error": "Username must be at least 3 characters long."}
    if not re.match(r"^[a-zA-Z0-9_-]+$", username):
        return {"success": False, "error": "Username can only contain letters, numbers, hyphens, and underscores."}
    if not email or "@" not in email:
        return {"success": False, "error": "Please provide a valid email address."}
    if len(password) < 6:
        return {"success": False, "error": "Password must be at least 6 characters long."}
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if username or email is already in use
    cursor.execute("SELECT id, username, email FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = ?", (username, email))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        if existing["username"].lower() == username.lower():
            return {"success": False, "error": "This username is already taken. Please choose another."}
        else:
            return {"success": False, "error": "An account with this email already exists."}
            
    user_id = "usr_" + secrets.token_hex(8)
    pwd_hash, salt = hash_password(password)
    today_str = time.strftime("%Y-%m-%d")
    
    try:
        cursor.execute("""
            INSERT INTO users (id, username, email, name, password_hash, salt, streak, last_active_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, username, email, name, pwd_hash, salt, 1, today_str))
        
        # Generate session token
        token = "tok_" + secrets.token_urlsafe(32)
        cursor.execute("""
            INSERT INTO sessions (token, user_id)
            VALUES (?, ?)
        """, (token, user_id))
        
        conn.commit()
        
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user_row = dict(cursor.fetchone())
        conn.close()
        
        return {
            "success": True,
            "message": "Account created successfully!",
            "user": sanitize_user(user_row),
            "token": token
        }
    except Exception as e:
        conn.close()
        return {"success": False, "error": f"Failed to register user: {str(e)}"}

def login_user(identifier: str, password: str) -> Dict[str, Any]:
    identifier = (identifier or "").strip()
    if not identifier or not password:
        return {"success": False, "error": "Username/Email and Password are required."}
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Search by username or email
    cursor.execute("""
        SELECT * FROM users
        WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
    """, (identifier, identifier))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return {"success": False, "error": "Invalid username or password."}
        
    user_data = dict(row)
    stored_hash = user_data.get("password_hash")
    salt = user_data.get("salt")
    
    if not stored_hash or not salt:
        conn.close()
        return {"success": False, "error": "This account was created without a password or is incomplete."}
        
    if not verify_password(password, stored_hash, salt):
        conn.close()
        return {"success": False, "error": "Invalid username or password."}
        
    # Update streak & last active
    user_id = user_data["id"]
    today_str = time.strftime("%Y-%m-%d")
    last_date = user_data.get("last_active_date")
    streak = user_data.get("streak", 1) or 1
    
    if last_date != today_str:
        # If active yesterday, streak increment, else reset to 1 if gap > 1 day
        cursor.execute("UPDATE users SET last_active_date = ? WHERE id = ?", (today_str, user_id))
        user_data["last_active_date"] = today_str
        
    # Generate new session token
    token = "tok_" + secrets.token_urlsafe(32)
    cursor.execute("""
        INSERT INTO sessions (token, user_id)
        VALUES (?, ?)
    """, (token, user_id))
    
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "message": f"Welcome back, {user_data.get('name', 'Learner')}!",
        "user": sanitize_user(user_data),
        "token": token
    }

def verify_session(token: str) -> Dict[str, Any]:
    if not token or not token.startswith("tok_"):
        return {"valid": False}
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT u.* FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "valid": True,
            "user": sanitize_user(dict(row))
        }
    return {"valid": False}

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    if not user_id:
        return None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return sanitize_user(dict(row))
    return None

def logout_user(token: str) -> Dict[str, Any]:
    if not token:
        return {"success": True}
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Logged out successfully."}
