// Centralized API Client for CodeLearn
const API_BASE = "/api";

const API = {
  // Authentication
  async register(username, email, password, name) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, name })
    });
    return res.json();
  },

  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password })
    });
    return res.json();
  },

  async getMe(token) {
    if (!token) return { valid: false };
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  async logout(token) {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      return res.json();
    } catch (e) {
      return { success: true };
    }
  },

  async getLanguages() {
    const res = await fetch(`${API_BASE}/languages`);
    if (!res.ok) throw new Error("Failed to fetch languages");
    return res.json();
  },

  async getCurriculum(language) {
    const res = await fetch(`${API_BASE}/curriculum/${language}`);
    if (!res.ok) throw new Error(`Failed to fetch curriculum for ${language}`);
    return res.json();
  },

  async getTopic(topicId) {
    const res = await fetch(`${API_BASE}/topics/${topicId}`);
    if (!res.ok) throw new Error(`Failed to fetch topic ${topicId}`);
    return res.json();
  },

  async getWorksheet(topicId) {
    const res = await fetch(`${API_BASE}/topics/${topicId}/worksheet`);
    if (!res.ok) throw new Error(`Failed to fetch worksheet for ${topicId}`);
    return res.json();
  },

  async checkWorksheetAnswer(questionId, topicId, userAnswer, languageId = "python") {
    const res = await fetch(`${API_BASE}/worksheet/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        topic_id: topicId,
        user_answer: userAnswer,
        language_id: languageId
      })
    });
    if (!res.ok) throw new Error("Failed to evaluate answer");
    return res.json();
  },

  async getQuiz(topicId) {
    const res = await fetch(`${API_BASE}/topics/${topicId}/quiz`);
    if (!res.ok) throw new Error(`Failed to fetch quiz for ${topicId}`);
    return res.json();
  },

  async submitQuiz(topicId, userId, answers, timeTakenSeconds) {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic_id: topicId,
        user_id: userId,
        answers: answers,
        time_taken_seconds: timeTakenSeconds
      })
    });
    if (!res.ok) throw new Error("Failed to submit quiz");
    return res.json();
  },

  async executeCode(language, code, stdin = "") {
    const res = await fetch(`${API_BASE}/compiler/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        code: code,
        stdin: stdin
      })
    });
    if (!res.ok) throw new Error("Compiler execution failed");
    return res.json();
  },

  async getChallenges(params = {}) {
    const query = new URLSearchParams();
    if (params.language && params.language !== "all") query.append("language", params.language);
    if (params.difficulty && params.difficulty !== "all") query.append("difficulty", params.difficulty);
    if (params.search) query.append("search", params.search);
    const qs = query.toString();
    const res = await fetch(`${API_BASE}/challenges${qs ? '?' + qs : ''}`);
    if (!res.ok) throw new Error("Failed to fetch challenges");
    return res.json();
  },

  async submitWorksheetCode(questionId, language, code, userId = "guest", topicId = null) {
    const res = await fetch(`${API_BASE}/worksheet/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        language: language,
        code: code,
        user_id: userId,
        topic_id: topicId
      })
    });
    if (!res.ok) throw new Error("Failed to evaluate worksheet code");
    return res.json();
  },

  async getChallenge(challengeId) {
    const res = await fetch(`${API_BASE}/challenges/${challengeId}`);
    if (!res.ok) throw new Error(`Failed to fetch challenge ${challengeId}`);
    return res.json();
  },

  async submitChallenge(challengeId, userId, code) {
    const res = await fetch(`${API_BASE}/challenges/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challenge_id: challengeId,
        user_id: userId,
        code: code
      })
    });
    if (!res.ok) throw new Error("Challenge submission failed");
    return res.json();
  },

  async getInterviewQuestions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.company) params.append("company", filters.company);
    if (filters.search) params.append("search", filters.search);

    const res = await fetch(`${API_BASE}/interview?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch interview questions");
    return res.json();
  },

  async markTopicComplete(userId, topicId, completed = true) {
    const res = await fetch(`${API_BASE}/progress/topic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        topic_id: topicId,
        completed: completed
      })
    });
    return res.json();
  },

  async saveWorksheetProgress(userId, topicId, score, percentage, correct, incorrect, timeSeconds) {
    const res = await fetch(`${API_BASE}/progress/worksheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        topic_id: topicId,
        score: score,
        percentage: percentage,
        correct: correct,
        incorrect: incorrect,
        time_seconds: timeSeconds
      })
    });
    return res.json();
  },

  async getUserProgress(userId = "guest_user") {
    const res = await fetch(`${API_BASE}/progress/${userId}`);
    if (!res.ok) throw new Error("Failed to load progress");
    return res.json();
  },

  async search(query) {
    if (!query || query.trim().length === 0) return [];
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    return res.json();
  }
};
