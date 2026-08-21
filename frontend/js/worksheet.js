// Interactive Practice Worksheet & Split-Screen "Try Myself" Workspace for CODE SPRINT
const WorksheetView = {
  currentData: null,
  currentIndex: 0,
  userAnswers: {},
  checkedStatus: {},
  solvedSet: new Set(),
  startTime: null,
  timerInterval: null,
  elapsedSeconds: 0,
  splitScreenMode: false,

  async render(container, topicId, questionId = null) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 60px 0;">
        <div style="color: var(--text-muted); font-size: 15px;">Loading worksheet questions...</div>
      </div>
    `;

    try {
      const [worksheet, progress] = await Promise.all([
        API.getWorksheet(topicId),
        State.refreshProgress()
      ]);

      this.currentData = worksheet;
      this.userAnswers = {};
      this.checkedStatus = {};
      this.solvedSet = new Set();
      this.startTime = Date.now();
      this.elapsedSeconds = 0;

      // Restore any solved state from progress if exists
      if (progress && progress.solved_questions) {
        progress.solved_questions.forEach(qid => this.solvedSet.add(qid));
      }

      if (questionId) {
        const foundIdx = worksheet.questions.findIndex(q => q.id === questionId);
        this.currentIndex = foundIdx >= 0 ? foundIdx : 0;
        this.splitScreenMode = true;
      } else {
        this.currentIndex = 0;
        this.splitScreenMode = false;
      }

      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds++;
        const timerEl = document.getElementById("worksheet-timer");
        if (timerEl) {
          const mins = Math.floor(this.elapsedSeconds / 60);
          const secs = this.elapsedSeconds % 60;
          timerEl.textContent = `⏱️ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      }, 1000);

      if (this.splitScreenMode) {
        this.renderSplitScreenWorkspace(container);
      } else {
        this.renderQuestionsList(container);
      }
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; max-width: 600px; margin: 40px auto;">
          <h2 style="color: var(--danger);">Failed to load worksheet</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="location.hash='#/lesson/${topicId}'">Back to Lesson</button>
        </div>
      `;
    }
  },

  // ----------------------------------------------------
  // LIST-BASED WORKSHEET OVERVIEW
  // ----------------------------------------------------
  renderQuestionsList(container) {
    const data = this.currentData;
    const questions = data.questions || [];
    const totalPoints = questions.reduce((acc, q) => acc + (q.points || 10), 0);
    const solvedCount = questions.filter(q => this.solvedSet.has(q.id)).length;
    const solvedPct = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0;
    const langId = data.language_id || "python";

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 28px; max-width: 960px; margin: 0 auto; padding-bottom: 60px;">
        <!-- HEADER & BREADCRUMB -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted);">
              <a href="#/syllabus/${langId}" style="color: var(--primary); text-decoration: none;">Curriculum</a>
              <span>/</span>
              <a href="#/lesson/${data.topic_id}" style="color: var(--primary); text-decoration: none;">${Utils.escapeHtml(data.topic_title)}</a>
              <span>/</span>
              <span>Worksheet</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-primary">${langId.toUpperCase()}</span>
              <div id="worksheet-timer" style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; background: var(--bg-subtle); padding: 4px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                ⏱️ 00:00
              </div>
            </div>
          </div>

          <div class="card" style="padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; border-left: 6px solid var(--primary);">
            <div>
              <h1 style="font-size: 26px; margin: 0; font-weight: 800;">${Utils.escapeHtml(data.topic_title)} Practice Worksheet</h1>
              <p style="font-size: 14px; color: var(--text-muted); margin: 6px 0 0;">
                ${questions.length} Practical Exercises progressing from Beginner foundation to Advanced challenges.
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-size: 13px; font-weight: 600; color: var(--text-muted);">Solved Progress</span>
                <span style="font-size: 20px; font-weight: 800; color: var(--primary);">${solvedCount} / ${questions.length} (${solvedPct}%)</span>
              </div>
              <button class="btn btn-primary" onclick="WorksheetView.openSplitScreen(0)">
                <span>Start Solving (Q1) →</span>
              </button>
            </div>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text-muted);">
            <span>Overall Worksheet Completion</span>
            <span>${totalPoints} Total Available Points</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${solvedPct}%;"></div>
          </div>
        </div>

        <!-- QUESTIONS LIST -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${questions.map((q, idx) => {
            const isSolved = this.solvedSet.has(q.id);
            const diffBadge = q.difficulty === 'Beginner' ? 'badge-success' : (q.difficulty === 'Easy' ? 'badge-success' : (q.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'));
            
            return `
              <div class="card card-interactive" onclick="WorksheetView.openSplitScreen(${idx})" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 18px 24px; border-left: ${isSolved ? '4px solid var(--success)' : '1px solid var(--border-color)'};">
                <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 280px;">
                  <div style="width: 38px; height: 38px; border-radius: var(--radius-sm); background: ${isSolved ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-subtle)'}; color: ${isSolved ? 'var(--success)' : 'var(--text-muted)'}; font-family: var(--font-mono); font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
                    ${isSolved ? '✓' : (idx + 1)}
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <h3 style="font-size: 15px; margin: 0; font-weight: 700; color: var(--text-main);">${Utils.escapeHtml(q.title || `Exercise ${idx + 1}`)}</h3>
                      <span class="badge ${diffBadge}" style="font-size: 11px;">${q.difficulty}</span>
                      <span class="badge badge-warning" style="font-size: 11px;">${q.points || 10} Pts</span>
                      ${isSolved ? '<span class="badge badge-success" style="font-size: 11px;">✓ Solved</span>' : ''}
                    </div>
                    <p style="font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.4;">${Utils.escapeHtml(q.prompt || q.description || "")}</p>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; align-items: center;">
                  <button class="btn ${isSolved ? 'btn-secondary' : 'btn-primary'}" style="padding: 7px 16px; font-size: 13px;">
                    <span>${isSolved ? 'Review Code' : 'Solve in IDE →'}</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- BOTTOM CONTROLS -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px;">
          <button class="btn btn-secondary" onclick="location.hash='#/lesson/${data.topic_id}'">
            <span>← Back to Lesson</span>
          </button>
          <button class="btn btn-primary" onclick="location.hash='#/syllabus/${langId}'">
            <span>Explore Next Topics in Roadmap →</span>
          </button>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // "TRY MYSELF" SPLIT-SCREEN WORKSPACE
  // ----------------------------------------------------
  openSplitScreen(target) {
    if (typeof target === "number") {
      this.currentIndex = target;
    } else if (typeof target === "string") {
      const foundIdx = this.currentData.questions.findIndex(q => q.id === target);
      if (foundIdx >= 0) this.currentIndex = foundIdx;
    }
    this.splitScreenMode = true;
    this.renderSplitScreenWorkspace(document.getElementById("app-root"));
  },

  closeSplitScreen() {
    this.splitScreenMode = false;
    this.renderQuestionsList(document.getElementById("app-root"));
  },

  renderSplitScreenWorkspace(container) {
    const q = this.currentData.questions[this.currentIndex];
    const total = this.currentData.questions.length;
    const currentCode = this.userAnswers[q.id] || q.starter_code || `# Solution for: ${q.title || q.prompt}\n\n`;
    const diffBadge = q.difficulty === 'Beginner' ? 'badge-success' : (q.difficulty === 'Easy' ? 'badge-success' : (q.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'));
    const langId = this.currentData.language_id || "python";
    const isSolved = this.solvedSet.has(q.id);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; height: calc(100vh - 110px); min-height: 580px;">
        <!-- TOP TOOLBAR -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; background: var(--bg-surface); padding: 12px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-secondary" onclick="WorksheetView.closeSplitScreen()" style="padding: 6px 12px; font-size: 13px;">
              <span>← All Questions List</span>
            </button>
            <div style="font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px;">
              <span>Question ${this.currentIndex + 1} of ${total}:</span>
              <span style="color: var(--text-muted); font-weight: normal;">${Utils.escapeHtml(q.title || `Exercise ${this.currentIndex + 1}`)}</span>
              ${isSolved ? '<span class="badge badge-success" style="font-size: 10px;">✓ Solved</span>' : ''}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="badge ${diffBadge}">${q.difficulty}</span>
            <span class="badge badge-warning">${q.points || 10} Pts</span>
            <span class="badge badge-primary">${langId.toUpperCase()}</span>
            <div id="worksheet-timer" style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; background: var(--bg-subtle); padding: 4px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              ⏱️ 00:00
            </div>
          </div>
        </div>

        <!-- SPLIT CONTAINER (SPECS vs COMPILER) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; min-height: 0;">
          <!-- LEFT PANE: PROBLEM DESCRIPTION & TEST CASES -->
          <div class="card" style="display: flex; flex-direction: column; gap: 16px; overflow-y: auto; padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="badge badge-subtle">PROBLEM SPECIFICATION</span>
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted);">Topic: ${Utils.escapeHtml(this.currentData.topic_title)}</span>
            </div>

            <div>
              <h2 style="font-size: 18px; margin: 0 0 8px; color: var(--text-main); font-weight: 800;">${Utils.escapeHtml(q.title || `Exercise ${this.currentIndex + 1}`)}</h2>
              <p style="font-size: 14px; line-height: 1.6; color: var(--text-main); margin: 0;">${Utils.escapeHtml(q.prompt || q.description || "")}</p>
            </div>

            ${q.constraints ? `
              <div style="background: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; border: 1px solid var(--border-color);">
                <strong style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 2px;">Constraints & Specs:</strong>
                <span>${Utils.escapeHtml(q.constraints)}</span>
              </div>
            ` : ''}

            ${q.examples && q.examples.length > 0 ? `
              <div>
                <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Example Test Cases:</span>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                  ${q.examples.map((ex, idx) => `
                    <div style="background: var(--bg-subtle); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 12px; font-family: var(--font-mono);">
                      <div style="color: var(--text-muted); font-size: 10px; font-weight: 700;">EXAMPLE ${idx + 1}</div>
                      ${ex.input ? `<div><span style="color: var(--text-muted);">Input:</span> ${Utils.escapeHtml(ex.input)}</div>` : ''}
                      <div><span style="color: var(--text-muted);">Output:</span> <strong style="color: var(--success);">${Utils.escapeHtml(ex.output)}</strong></div>
                      ${ex.explanation ? `<div style="font-family: var(--font-sans); color: var(--text-muted); margin-top: 4px; font-size: 11px;">${Utils.escapeHtml(ex.explanation)}</div>` : ''}
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ''}

            <div style="background: rgba(234, 179, 8, 0.08); border-left: 3px solid #eab308; padding: 12px 14px; border-radius: var(--radius-sm); font-size: 13px; color: var(--text-main);">
              <strong>💡 Hint:</strong> ${Utils.escapeHtml(q.hint || (q.hints && q.hints[0]) || "Make sure your solution matches the exact output format requirements.")}
            </div>

            <!-- HIDDEN SOLUTION BEHIND [ SHOW ANSWER ] -->
            <details id="worksheet-solution-drawer" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-surface); padding: 10px 14px;">
              <summary style="cursor: pointer; font-size: 13px; font-weight: 700; color: var(--primary); outline: none; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                <span>👁️ [ Show Answer / Verified Solution ]</span>
                <span style="font-size: 11px; font-weight: 600; color: var(--text-muted);">Click to reveal solution</span>
              </summary>
              <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px; border-top: 1px dashed var(--border-color); padding-top: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Standard Verified Solution:</span>
                  <button class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px;" onclick="WorksheetView.loadSolutionToEditor()">
                    <span>Load into Editor ⚡</span>
                  </button>
                </div>
                <div style="background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-color); overflow: hidden;">
                  <pre style="margin: 0; padding: 12px; font-family: var(--font-mono); font-size: 12px; line-height: 1.4; color: var(--text-main); white-space: pre-wrap; overflow-x: auto;"><code>${Utils.escapeHtml(q.expected_solution || q.answer || "// Solution not available")}</code></pre>
                </div>
                ${q.explanation ? `
                  <div style="font-size: 12px; line-height: 1.5; color: var(--text-muted); background: var(--bg-subtle); padding: 8px 12px; border-radius: var(--radius-sm);">
                    <strong>Explanation:</strong> ${Utils.escapeHtml(q.explanation)}
                  </div>
                ` : ''}
              </div>
            </details>

            <!-- PREV / NEXT QUESTION NAV -->
            <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <button class="btn btn-secondary" onclick="WorksheetView.prevSplitQuestion()" ${this.currentIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''} style="padding: 6px 14px; font-size: 12px;">
                ← Previous
              </button>
              <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">${this.currentIndex + 1} / ${total}</span>
              <button class="btn btn-secondary" onclick="WorksheetView.nextSplitQuestion()" ${this.currentIndex >= total - 1 ? 'disabled style="opacity: 0.5;"' : ''} style="padding: 6px 14px; font-size: 12px;">
                Next →
              </button>
            </div>
          </div>

          <!-- RIGHT PANE: CODE EDITOR & TEST RUNNER -->
          <div class="card" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
            <!-- EDITOR HEADER -->
            <div class="code-header" style="border-radius: 0; border-bottom: 1px solid var(--border-color); padding: 10px 16px;">
              <span style="font-weight: 700; color: var(--text-main);">LIVE COMPILER IDE (${langId.toUpperCase()})</span>
              <div style="display: flex; gap: 8px;">
                <button class="copy-btn" onclick="WorksheetView.resetCodeEditor()">Reset</button>
                <button class="btn btn-secondary" style="padding: 5px 12px; font-size: 12px;" onclick="WorksheetView.runSplitCode()">▶ Run Code</button>
                <button class="btn btn-primary" id="btn-split-submit" style="padding: 5px 14px; font-size: 12px;" onclick="WorksheetView.submitSplitSolution()">⚡ Submit Solution</button>
              </div>
            </div>

            <!-- CODE TEXTAREA -->
            <div style="flex: 1; min-height: 220px; position: relative;">
              <textarea id="split-code-editor" class="textarea textarea-code" style="width: 100%; height: 100%; border: none; border-radius: 0; resize: none; font-family: var(--font-mono); font-size: 14px; line-height: 1.5; padding: 14px;" oninput="WorksheetView.saveAnswer(this.value)">${Utils.escapeHtml(currentCode)}</textarea>
            </div>

            <!-- CUSTOM STDIN & TEST RESULTS ACCORDION -->
            <div style="background: var(--bg-subtle); border-top: 1px solid var(--border-color); display: flex; flex-direction: column; max-height: 240px; overflow-y: auto;">
              <!-- CUSTOM STDIN ACCORDION -->
              <details style="padding: 8px 14px; border-bottom: 1px solid var(--border-color); font-size: 12px;">
                <summary style="cursor: pointer; font-weight: 600; color: var(--text-muted);">Custom Standard Input (stdin)</summary>
                <textarea id="split-stdin-input" class="textarea textarea-code" placeholder="Enter standard input values for your program test run..." style="min-height: 50px; margin-top: 6px; font-size: 12px;"></textarea>
              </details>

              <!-- CONSOLE LOGS / TEST RESULTS -->
              <div style="padding: 12px 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Execution & Test Case Validation:</span>
                  <span id="split-status-badge" class="badge badge-subtle" style="font-size: 10px;">Ready</span>
                </div>
                <div id="split-output-console" style="font-family: var(--font-mono); font-size: 13px; color: var(--text-main); white-space: pre-wrap; word-break: break-all; min-height: 40px;">
                  Click "Run Code" to test with custom stdin, or "Submit Solution" to run automated deterministic test cases.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  prevSplitQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderSplitScreenWorkspace(document.getElementById("app-root"));
    }
  },

  nextSplitQuestion() {
    const total = this.currentData.questions.length;
    if (this.currentIndex < total - 1) {
      this.currentIndex++;
      this.renderSplitScreenWorkspace(document.getElementById("app-root"));
    }
  },

  loadSolutionToEditor() {
    const q = this.currentData.questions[this.currentIndex];
    const sol = q.expected_solution || q.answer;
    if (!sol) {
      Utils.showToast("No solution available", "warning");
      return;
    }
    const editor = document.getElementById("split-code-editor");
    if (editor) {
      editor.value = sol;
      this.saveAnswer(sol);
      Utils.showToast("Solution loaded into editor", "info");
    }
  },

  resetCodeEditor() {
    const q = this.currentData.questions[this.currentIndex];
    const starter = q.starter_code || `# Solution for: ${q.title || q.prompt}\n\n`;
    const editor = document.getElementById("split-code-editor");
    if (editor) {
      editor.value = starter;
      this.saveAnswer(starter);
    }
    Utils.showToast("Starter code reset", "info");
  },

  saveAnswer(val) {
    const q = this.currentData.questions[this.currentIndex];
    this.userAnswers[q.id] = val;
  },

  async runSplitCode() {
    const editor = document.getElementById("split-code-editor");
    const stdinEl = document.getElementById("split-stdin-input");
    const consoleEl = document.getElementById("split-output-console");
    const badgeEl = document.getElementById("split-status-badge");

    const code = editor ? editor.value : "";
    const stdin = stdinEl ? stdinEl.value : "";
    const lang = this.currentData.language_id || "python";

    if (!code.trim()) {
      Utils.showToast("Code cannot be empty", "danger");
      return;
    }

    if (badgeEl) {
      badgeEl.className = "badge badge-warning";
      badgeEl.textContent = "Compiling & Running...";
    }
    if (consoleEl) {
      consoleEl.innerHTML = '<span style="color: var(--text-muted);">Executing on native backend...</span>';
    }

    try {
      const result = await API.executeCode(lang, code, stdin);
      if (result.success) {
        if (badgeEl) {
          badgeEl.className = "badge badge-success";
          badgeEl.textContent = `Success (${result.execution_time_ms}ms)`;
        }
        if (consoleEl) {
          consoleEl.innerHTML = `<span style="color: var(--success);">${Utils.escapeHtml(result.stdout || "Program finished with no output.")}</span>`;
        }
        Utils.playSound("correct");
      } else {
        if (badgeEl) {
          badgeEl.className = "badge badge-danger";
          badgeEl.textContent = "Execution Error";
        }
        if (consoleEl) {
          consoleEl.innerHTML = `<span style="color: var(--danger); font-weight: bold;">Error (Exit Code ${result.returncode}):</span>\n<span style="color: var(--danger);">${Utils.escapeHtml(result.stderr || result.error || "Unknown runtime error")}</span>`;
        }
        Utils.playSound("incorrect");
      }
    } catch (e) {
      if (badgeEl) {
        badgeEl.className = "badge badge-danger";
        badgeEl.textContent = "Failed";
      }
      if (consoleEl) {
        consoleEl.innerHTML = `<span style="color: var(--danger);">${Utils.escapeHtml(e.message)}</span>`;
      }
    }
  },

  async submitSplitSolution() {
    const editor = document.getElementById("split-code-editor");
    const consoleEl = document.getElementById("split-output-console");
    const badgeEl = document.getElementById("split-status-badge");
    const q = this.currentData.questions[this.currentIndex];

    const code = editor ? editor.value : "";
    const lang = this.currentData.language_id || "python";

    if (!code.trim()) {
      Utils.showToast("Please write code before submitting", "danger");
      return;
    }

    if (badgeEl) {
      badgeEl.className = "badge badge-warning";
      badgeEl.textContent = "Evaluating Test Cases...";
    }

    try {
      const evalRes = await API.submitWorksheetCode(q.id, lang, code, State.userId, this.currentData.topic_id);
      
      if (evalRes.passed) {
        this.solvedSet.add(q.id);
        if (badgeEl) {
          badgeEl.className = "badge badge-success";
          badgeEl.textContent = `All Tests Passed (${evalRes.passed_count}/${evalRes.total_count})`;
        }
        if (consoleEl) {
          consoleEl.innerHTML = `
            <div style="color: var(--success); font-weight: 700; margin-bottom: 8px;">✓ Submission Accepted! All ${evalRes.total_count} test cases passed.</div>
            <div style="font-size: 12px; color: var(--text-main);">Output: ${Utils.escapeHtml(evalRes.actual_output || "")}</div>
          `;
        }
        Utils.playSound("correct");
        Utils.showToast(`Test Cases Passed! +${q.points || 10} pts`, "success");
      } else {
        if (badgeEl) {
          badgeEl.className = "badge badge-danger";
          badgeEl.textContent = `Failed (${evalRes.passed_count}/${evalRes.total_count} Passed)`;
        }
        if (consoleEl) {
          consoleEl.innerHTML = `
            <div style="color: var(--danger); font-weight: 700; margin-bottom: 8px;">✗ Test Cases Failed (${evalRes.passed_count}/${evalRes.total_count} Passed)</div>
            <div style="font-size: 12px; color: var(--text-main);">${Utils.escapeHtml(evalRes.message || "")}</div>
            ${evalRes.actual_output ? `<div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Received Output:\n<span style="color: var(--danger);">${Utils.escapeHtml(evalRes.actual_output)}</span></div>` : ''}
          `;
        }
        Utils.playSound("incorrect");
        Utils.showToast("Test cases failed. Check output.", "danger");
      }
    } catch (e) {
      if (badgeEl) {
        badgeEl.className = "badge badge-danger";
        badgeEl.textContent = "Submission Error";
      }
      if (consoleEl) {
        consoleEl.innerHTML = `<span style="color: var(--danger);">${Utils.escapeHtml(e.message)}</span>`;
      }
    }
  }
};
