import express from "express";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// In-Memory & Local File Persistence for Progress
const PROGRESS_FILE = path.join(process.cwd(), "user_progress.json");

function loadProgressData(): Record<string, any> {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading progress file:", e);
  }
  return {};
}

function saveProgressData(data: Record<string, any>) {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing progress file:", e);
  }
}

// ==================== PYTHON SUBPROCESS BRIDGE HELPER ====================
function runPythonCommand(scriptArgs: string[], stdinInput: string = ""): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const py = spawn("python3", scriptArgs);
    let stdout = "";
    let stderr = "";

    if (stdinInput) {
      py.stdin.write(stdinInput);
      py.stdin.end();
    }

    py.stdout.on("data", (d) => { stdout += d.toString(); });
    py.stderr.on("data", (d) => { stderr += d.toString(); });

    py.on("close", (code) => {
      resolve({ stdout, stderr, code: code || 0 });
    });

    py.on("error", (err) => {
      resolve({ stdout: "", stderr: err.message, code: 1 });
    });
  });
}

// ==================== AUTHENTICATION API ENDPOINTS ====================

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password, name } = req.body;
  const pyScript = `
import json, sys
from backend.auth import register_user
data = json.loads(sys.stdin.read())
result = register_user(data.get("username"), data.get("email"), data.get("password"), data.get("name"))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ username, email, password, name });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    const data = JSON.parse(result.stdout);
    if (!data.success) {
      return res.status(400).json(data);
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: "Internal server error during registration." });
  }
});

// Log in an existing user
app.post("/api/auth/login", async (req, res) => {
  const { identifier, username, email, password } = req.body;
  const loginId = identifier || username || email;
  const pyScript = `
import json, sys
from backend.auth import login_user
data = json.loads(sys.stdin.read())
result = login_user(data.get("identifier"), data.get("password"))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ identifier: loginId, password });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    const data = JSON.parse(result.stdout);
    if (!data.success) {
      return res.status(401).json(data);
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: "Internal server error during login." });
  }
});

// Verify current session / token
app.get("/api/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : (req.query.token as string || "");

  if (!token) {
    return res.status(401).json({ valid: false, error: "No session token provided." });
  }

  const pyScript = `
import json, sys
from backend.auth import verify_session
data = json.loads(sys.stdin.read())
result = verify_session(data.get("token"))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ token });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    const data = JSON.parse(result.stdout);
    if (!data.valid) {
      return res.status(401).json(data);
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ valid: false, error: "Failed to verify session." });
  }
});

// Log out user
app.post("/api/auth/logout", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = (req.body && req.body.token) || (authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "");

  const pyScript = `
import json, sys
from backend.auth import logout_user
data = json.loads(sys.stdin.read())
result = logout_user(data.get("token"))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ token });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.json({ success: true, message: "Logged out." });
  }
});

// ==================== API ENDPOINTS ====================

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "CODE SPRINT Backend",
    engine: "Deterministic Local Engine",
    timestamp: new Date().toISOString()
  });
});

// 2. Languages endpoint
app.get("/api/languages", async (req, res) => {
  const pyCode = `
import json
from backend.curriculum import LANGUAGES_DATA, TOPICS_DATA
result = []
for lang in LANGUAGES_DATA:
    lid = lang["id"]
    topics_count = sum(1 for t in TOPICS_DATA if t["language_id"] == lid)
    cats = {t["category_id"] for t in TOPICS_DATA if t["language_id"] == lid}
    result.append({**lang, "total_topics": topics_count, "category_count": len(cats)})
print(json.dumps(result))
`;
  const result = await runPythonCommand(["-c", pyCode]);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to load languages: " + result.stderr });
  }
});

// 3. Curriculum endpoint
app.get("/api/curriculum/:language", async (req, res) => {
  const lang = req.params.language;
  const pyCode = `
import json
from backend.curriculum import get_curriculum_by_language
data = get_curriculum_by_language("${lang}")
print(json.dumps(data if data else {}))
`;
  const result = await runPythonCommand(["-c", pyCode]);
  try {
    const data = JSON.parse(result.stdout);
    if (!data.language) return res.status(404).json({ error: "Language not found" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to load curriculum" });
  }
});

// 4. Topic detail endpoint
app.get("/api/topics/:topicId", async (req, res) => {
  const tid = req.params.topicId;
  const pyCode = `
import json
from backend.curriculum import get_topic_by_id
t = get_topic_by_id("${tid}")
print(json.dumps(t if t else {}))
`;
  const result = await runPythonCommand(["-c", pyCode]);
  try {
    const data = JSON.parse(result.stdout);
    if (!data.id) return res.status(404).json({ error: "Topic not found" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to load topic" });
  }
});

// 5. Worksheet for topic
app.get("/api/topics/:topicId/worksheet", async (req, res) => {
  const tid = req.params.topicId;
  const pyCode = `
import json
from backend.curriculum import get_topic_by_id
from backend.worksheets import get_worksheet_for_topic
t = get_topic_by_id("${tid}")
if t:
    ws = get_worksheet_for_topic(t["id"], t["title"], t["language_id"])
    print(json.dumps(ws))
else:
    print(json.dumps({}))
`;
  const result = await runPythonCommand(["-c", pyCode]);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to load worksheet" });
  }
});

// 6. Worksheet answer checker (Standard question input)
app.post("/api/worksheet/check", async (req, res) => {
  const { question_id, topic_id, user_answer, language_id } = req.body;
  const pyScript = `
import json, sys
from backend.worksheets import check_worksheet_answer
data = json.loads(sys.stdin.read())
result = check_worksheet_answer(data["qid"], data["tid"], data["ans"], data.get("lang", "python"))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ qid: question_id, tid: topic_id, ans: user_answer, lang: language_id || "python" });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Error checking worksheet answer: " + result.stderr });
  }
});

// 6b. Worksheet Code Submission with Live Test Runner ("Try Myself")
app.post("/api/worksheet/submit", async (req, res) => {
  const { question_id, language, code, user_id, topic_id } = req.body;
  const pyScript = `
import json, sys
from backend.worksheets import evaluate_worksheet_submission
data = json.loads(sys.stdin.read())
result = evaluate_worksheet_submission(data["qid"], data.get("lang", "python"), data.get("code", ""))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ qid: question_id, lang: language || "python", code: code || "" });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Error evaluating worksheet code submission: " + result.stderr });
  }
});

// 7. Quiz for topic
app.get("/api/topics/:topicId/quiz", async (req, res) => {
  const tid = req.params.topicId;
  const pyCode = `
import json
from backend.curriculum import get_topic_by_id
from backend.quizzes import get_quiz_for_topic
t = get_topic_by_id("${tid}")
if t:
    qz = get_quiz_for_topic(t["id"], t["title"], t["language_id"])
    print(json.dumps(qz))
else:
    print(json.dumps({}))
`;
  const result = await runPythonCommand(["-c", pyCode]);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to load quiz" });
  }
});

// 8. Quiz submission
app.post("/api/quiz/submit", async (req, res) => {
  const { topic_id, user_id, answers, time_taken_seconds } = req.body;
  const pyScript = `
import json, sys
from backend.quizzes import evaluate_quiz_submission
from backend.database import save_quiz_result
data = json.loads(sys.stdin.read())
result = evaluate_quiz_submission(data["tid"], data["answers"])
save_quiz_result(data.get("uid", "guest"), data["tid"], result["score"], result["total_points"], result["percentage"], result["passed"], data.get("time", 0))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ tid: topic_id, uid: user_id, answers, time: time_taken_seconds });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Error submitting quiz" });
  }
});

// 9. Code execution sandbox
app.post("/api/compiler/execute", async (req, res) => {
  const { language, code, stdin } = req.body;
  const pyScript = `
import json, sys
from backend.compiler import execute_code
data = json.loads(sys.stdin.read())
result = execute_code(data["lang"], data["code"], data.get("stdin", ""))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ lang: language, code: code || "", stdin: stdin || "" });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Execution error: " + result.stderr });
  }
});

// 10. Challenges endpoints with filtering
app.get("/api/challenges", async (req, res) => {
  const language = (req.query.language as string) || "";
  const difficulty = (req.query.difficulty as string) || "";
  const search = (req.query.search as string) || "";

  const pyScript = `
import json, sys
from backend.challenges import get_all_challenges
data = json.loads(sys.stdin.read())
challenges = get_all_challenges()
lang = data.get("lang", "").lower().strip()
diff = data.get("diff", "").lower().strip()
search = data.get("search", "").lower().strip()

if lang and lang != "all":
    challenges = [c for c in challenges if c.get("language", "").lower() == lang or (lang == "c" and c.get("language", "").lower() == "c")]
if diff and diff != "all":
    challenges = [c for c in challenges if c.get("difficulty", "").lower() == diff]
if search:
    challenges = [c for c in challenges if search in c.get("title", "").lower() or search in c.get("description", "").lower() or search in c.get("category", "").lower()]

print(json.dumps(challenges))
`;
  const inputStr = JSON.stringify({ lang: language, diff: difficulty, search });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to list challenges: " + result.stderr });
  }
});

app.get("/api/challenges/:challengeId", async (req, res) => {
  const cid = req.params.challengeId;
  const pyCode = `
import json
from backend.challenges import get_challenge_by_id
ch = get_challenge_by_id("${cid}")
print(json.dumps(ch if ch else {}))
`;
  const result = await runPythonCommand(["-c", pyCode]);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to get challenge" });
  }
});

app.post("/api/challenges/submit", async (req, res) => {
  const { challenge_id, user_id, code } = req.body;
  const pyScript = `
import json, sys
from backend.challenges import evaluate_challenge_submission
from backend.database import save_challenge_result
data = json.loads(sys.stdin.read())
result = evaluate_challenge_submission(data["cid"], data["code"])
if result.get("success"):
    try:
        save_challenge_result(data.get("uid", "guest"), data["cid"], result.get("passed", False), result.get("passed_cases", 0), result.get("total_cases", 0), result.get("score", 0), data["code"])
    except Exception as e:
        pass
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ cid: challenge_id, uid: user_id, code: code || "" });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to evaluate challenge: " + result.stderr });
  }
});

// 11. Interview Questions
app.get("/api/interview", async (req, res) => {
  const category = (req.query.category as string) || "";
  const difficulty = (req.query.difficulty as string) || "";
  const company = (req.query.company as string) || "";
  const search = (req.query.search as string) || "";

  const pyScript = `
import json, sys
from backend.interview import filter_interview_questions
data = json.loads(sys.stdin.read())
result = filter_interview_questions(data.get("cat"), data.get("diff"), data.get("comp"), data.get("search"))
print(json.dumps(result))
`;
  const inputStr = JSON.stringify({ cat: category, diff: difficulty, comp: company, search });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to load interview questions" });
  }
});

// 12. Progress APIs
app.post("/api/progress/topic", async (req, res) => {
  const { user_id, topic_id, completed } = req.body;
  const pyScript = `
import json, sys
from backend.database import update_topic_progress
data = json.loads(sys.stdin.read())
update_topic_progress(data.get("uid", "guest_user"), data["tid"], data.get("completed", True))
print(json.dumps({"success": True}))
`;
  const inputStr = JSON.stringify({ uid: user_id, tid: topic_id, completed: completed !== false });
  await runPythonCommand(["-c", pyScript], inputStr);
  res.json({ success: true });
});

app.post("/api/progress/worksheet", async (req, res) => {
  const { user_id, topic_id, score, percentage, correct, incorrect, time_seconds } = req.body;
  const pyScript = `
import json, sys
from backend.database import save_worksheet_result
data = json.loads(sys.stdin.read())
save_worksheet_result(data.get("uid", "guest_user"), data["tid"], data["score"], data["pct"], data["cor"], data["incor"], data["time"])
print(json.dumps({"success": True}))
`;
  const inputStr = JSON.stringify({
    uid: user_id, tid: topic_id, score: score || 0, pct: percentage || 0,
    cor: correct || 0, incor: incorrect || 0, time: time_seconds || 0
  });
  await runPythonCommand(["-c", pyScript], inputStr);
  res.json({ success: true });
});

app.get("/api/progress/:userId", async (req, res) => {
  const uid = req.params.userId || "guest_user";
  const pyScript = `
import json
from backend.database import get_user_full_progress
res = get_user_full_progress("${uid}")
print(json.dumps(res))
`;
  const result = await runPythonCommand(["-c", pyScript]);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.status(500).json({ error: "Failed to get progress: " + result.stderr });
  }
});

// 13. Search endpoint
app.get("/api/search", async (req, res) => {
  const q = (req.query.q as string) || "";
  const pyScript = `
import json, sys
from backend.curriculum import LANGUAGES_DATA, TOPICS_DATA
from backend.challenges import get_all_challenges
from backend.interview import get_all_interview_questions

data = json.loads(sys.stdin.read())
query = data["q"].lower().strip()
results = []

for l in LANGUAGES_DATA:
    if query in l["name"].lower() or query in l["description"].lower():
        results.append({
            "id": l["id"], "type": "language", "title": l["name"],
            "subtitle": "Language Roadmap", "category": "Language", "language": l["name"],
            "link": f"#/syllabus/{l['id']}"
        })

for t in TOPICS_DATA:
    if query in t["title"].lower() or query in t["description"].lower() or query in t["theory"].lower():
        results.append({
            "id": t["id"], "type": "topic", "title": t["title"],
            "subtitle": f"{t['language_id'].capitalize()} • {t['level']} • {t['category_name']}",
            "category": t["category_name"], "language": t["language_id"],
            "link": f"#/lesson/{t['id']}"
        })

for c in get_all_challenges():
    if query in c["title"].lower() or query in c["description"].lower():
        results.append({
            "id": c["id"], "type": "challenge", "title": c["title"],
            "subtitle": f"{c['language']} • {c['difficulty']} Challenge",
            "category": c["category"], "language": c["language"],
            "link": f"#/challenges/{c['id']}"
        })

for i in get_all_interview_questions():
    if query in i["question"].lower() or query in i["answer"].lower():
        results.append({
            "id": i["id"], "type": "interview", "title": i["question"],
            "subtitle": f"{i['category']} • {i['difficulty']} Interview Question",
            "category": i["category"], "language": i.get("language"),
            "link": "#/interview"
        })

print(json.dumps(results[:30]))
`;
  const inputStr = JSON.stringify({ q });
  const result = await runPythonCommand(["-c", pyScript], inputStr);
  try {
    res.json(JSON.parse(result.stdout));
  } catch (e) {
    res.json([]);
  }
});

// ==================== STATIC FRONTEND SERVING ====================
const frontendDir = path.join(process.cwd(), "frontend");
app.use("/static", express.static(frontendDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CODE SPRINT Full-Stack Server listening on http://0.0.0.0:${PORT}`);
});
