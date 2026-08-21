// Topic Quiz Assessment Engine Component
const QuizView = {
  currentData: null,
  currentIndex: 0,
  userAnswers: {},
  startTime: null,
  timerInterval: null,
  remainingSeconds: 600, // 10 minutes total

  async render(container, topicId) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 40px 0;">
        <div style="color: var(--text-muted);">Loading quiz assessment...</div>
      </div>
    `;

    try {
      const quiz = await API.getQuiz(topicId);
      this.currentData = quiz;
      this.currentIndex = 0;
      this.userAnswers = {};
      this.startTime = Date.now();
      this.remainingSeconds = (quiz.time_limit_minutes || 10) * 60;

      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.remainingSeconds--;
        const timerEl = document.getElementById("quiz-timer-display");
        if (timerEl) {
          const mins = Math.floor(this.remainingSeconds / 60);
          const secs = this.remainingSeconds % 60;
          timerEl.textContent = `⏱️ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          if (this.remainingSeconds <= 60) {
            timerEl.style.color = "var(--danger)";
          }
        }
        if (this.remainingSeconds <= 0) {
          clearInterval(this.timerInterval);
          Utils.showToast("Time's up! Submitting quiz...", "warning");
          this.submitQuiz();
        }
      }, 1000);

      this.renderQuestionView(container);
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h2 style="color: var(--danger);">Failed to load quiz</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="location.hash='#/lesson/${topicId}'">Back to Lesson</button>
        </div>
      `;
    }
  },

  renderQuestionView(container) {
    const q = this.currentData.questions[this.currentIndex];
    const total = this.currentData.total_questions;
    const progressPct = Math.round(((this.currentIndex + 1) / total) * 100);
    const selectedAnswer = this.userAnswers[q.id];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 840px; margin: 0 auto;">
        <!-- HEADER -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <a href="#/lesson/${this.currentData.topic_id}" style="color: var(--text-muted); font-size: 13px; font-weight: 600; text-decoration: none;">
              ← Back to Lesson (${this.currentData.topic_title})
            </a>
            <h1 style="font-size: 24px; margin-top: 4px;">Topic Assessment Quiz</h1>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="quiz-timer-display" style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; background: var(--bg-subtle); padding: 6px 14px; border-radius: var(--radius-md);">
              ⏱️ 10:00
            </div>
            <span class="badge badge-primary">Pass Threshold: ${this.currentData.passing_percentage}%</span>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text-muted);">
            <span>Question ${this.currentIndex + 1} of ${total}</span>
            <span>${Object.keys(this.userAnswers).length} / ${total} Answered</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        <!-- QUESTION CARD -->
        <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-subtle">QUESTION ${this.currentIndex + 1}</span>
            <span class="badge badge-warning">${q.points} Points</span>
          </div>

          <h2 style="font-size: 20px; line-height: 1.4;">${Utils.escapeHtml(q.question)}</h2>

          <!-- OPTIONS -->
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
            ${q.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              return `
                <label class="card card-interactive" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; margin: 0; background: ${isSelected ? 'var(--primary-light)' : 'var(--bg-surface)'}; border-color: ${isSelected ? 'var(--primary)' : 'var(--border-color)'};">
                  <input type="radio" name="quiz_opt" value="${Utils.escapeHtml(opt)}" ${isSelected ? 'checked' : ''} onchange="QuizView.selectAnswer('${q.id}', this.value)" style="width: 18px; height: 18px; accent-color: var(--primary);">
                  <span style="font-size: 15px; font-weight: 500; color: var(--text-main);">${Utils.escapeHtml(opt)}</span>
                </label>
              `;
            }).join("")}
          </div>
        </div>

        <!-- BOTTOM CONTROLS -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary" onclick="QuizView.prevQuestion()" ${this.currentIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
            <span>← Previous</span>
          </button>

          <div style="display: flex; gap: 10px;">
            ${this.currentIndex < total - 1 ? `
              <button class="btn btn-primary" onclick="QuizView.nextQuestion()">
                <span>Next Question →</span>
              </button>
            ` : `
              <button class="btn btn-success" onclick="QuizView.submitQuiz()">
                <span>Submit Quiz 🚀</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  selectAnswer(qid, val) {
    this.userAnswers[qid] = val;
    Utils.playSound("click");
  },

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderQuestionView(document.getElementById("app-root"));
    }
  },

  nextQuestion() {
    if (this.currentIndex < this.currentData.total_questions - 1) {
      this.currentIndex++;
      this.renderQuestionView(document.getElementById("app-root"));
    }
  },

  async submitQuiz() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const totalSeconds = (this.currentData.time_limit_minutes || 10) * 60 - this.remainingSeconds;

    try {
      Utils.showToast("Evaluating quiz submission...", "info");
      const result = await API.submitQuiz(
        this.currentData.topic_id,
        State.userId,
        this.userAnswers,
        totalSeconds
      );

      await State.refreshProgress();
      Utils.playSound(result.passed ? "pass" : "wrong");

      const root = document.getElementById("app-root");
      root.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 28px; max-width: 860px; margin: 0 auto;">
          <!-- RESULTS BANNER -->
          <div class="card" style="text-align: center; padding: 36px 20px; border-top: 6px solid ${result.passed ? 'var(--success)' : 'var(--danger)'};">
            <div style="font-size: 52px; margin-bottom: 8px;">${result.passed ? '🎉' : '📖'}</div>
            <h1>${result.passed ? 'Assessment Passed!' : 'Assessment Needs Practice'}</h1>
            <p style="color: var(--text-muted); margin-top: 6px;">${this.currentData.topic_title}</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin: 28px 0;">
              <div class="card" style="background: var(--bg-subtle); padding: 14px;">
                <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Score</span>
                <div style="font-size: 24px; font-weight: 800; color: var(--primary);">${result.score} / ${result.total_points}</div>
              </div>
              <div class="card" style="background: var(--bg-subtle); padding: 14px;">
                <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Percentage</span>
                <div style="font-size: 24px; font-weight: 800; color: ${result.passed ? 'var(--success)' : 'var(--danger)'};">${result.percentage}%</div>
              </div>
              <div class="card" style="background: var(--bg-subtle); padding: 14px;">
                <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Passing Mark</span>
                <div style="font-size: 24px; font-weight: 800; color: var(--text-main);">${result.passing_percentage}%</div>
              </div>
              <div class="card" style="background: var(--bg-subtle); padding: 14px;">
                <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Time Taken</span>
                <div style="font-size: 24px; font-weight: 800; color: var(--text-main);">${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s</div>
              </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
              <button class="btn btn-secondary" onclick="QuizView.render(document.getElementById('app-root'), '${this.currentData.topic_id}')">
                <span>🔄 Retake Quiz</span>
              </button>
              <button class="btn btn-primary" onclick="location.hash='#/lesson/${this.currentData.topic_id}'">
                <span>Return to Lesson →</span>
              </button>
            </div>
          </div>

          <!-- DETAILED QUESTION BREAKDOWN & EXPLANATIONS -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Answer Breakdown & Explanations</h2>
            ${result.breakdown.map((item, idx) => `
              <div class="card" style="border-left: 4px solid ${item.is_correct ? 'var(--success)' : 'var(--danger)'}; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span style="font-weight: 700; font-size: 13px; color: var(--text-muted);">QUESTION ${idx + 1}</span>
                  <span class="badge ${item.is_correct ? 'badge-success' : 'badge-danger'}">${item.is_correct ? '✓ Correct' : '✗ Incorrect'} (+${item.points_earned} Pts)</span>
                </div>
                <h3 style="font-size: 16px; margin-bottom: 12px;">${Utils.escapeHtml(item.question)}</h3>
                <div style="display: flex; flex-direction: column; gap: 4px; font-size: 14px;">
                  <div>Your Answer: <strong>${Utils.escapeHtml(item.user_answer || "None")}</strong></div>
                  ${!item.is_correct ? `<div style="color: var(--success);">Correct Answer: <strong>${Utils.escapeHtml(item.correct_answer)}</strong></div>` : ''}
                </div>
                <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); margin-top: 12px; font-size: 13px; color: var(--text-main);">
                  <strong>Explanation:</strong> ${Utils.escapeHtml(item.explanation)}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    } catch (e) {
      Utils.showToast("Failed to submit quiz: " + e.message, "danger");
    }
  }
};
