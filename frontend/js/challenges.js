// Algorithmic Coding Challenges Component with Filters & Split-Screen Workspace
const ChallengesView = {
  currentFilters: {
    language: "all",
    difficulty: "all",
    search: ""
  },

  async renderList(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 40px 0;">
        <div style="color: var(--text-muted);">Loading coding challenges...</div>
      </div>
    `;

    try {
      const [challenges, progress] = await Promise.all([
        API.getChallenges(this.currentFilters),
        State.refreshProgress()
      ]);

      const solvedSet = new Set(progress ? progress.solved_challenges : []);

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- HEADER -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
            <div>
              <h1 style="font-size: 28px;">Coding Challenges & Algorithms</h1>
              <p style="margin-top: 4px; color: var(--text-muted);">Solve 120+ algorithmic challenges verified by native deterministic test runners.</p>
            </div>

            <div style="display: flex; gap: 12px; align-items: center;">
              <span class="badge badge-primary" style="font-size: 13px; padding: 6px 12px;">
                Solved: ${solvedSet.size} / ${challenges.length}
              </span>
            </div>
          </div>

          <!-- FILTERS TOOLBAR -->
          <div class="card" style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <!-- LANGUAGE PILLS -->
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Language:</span>
                ${["all", "python", "java", "c", "cpp", "javascript", "sql"].map(lang => `
                  <button class="btn ${this.currentFilters.language === lang ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 12px; font-size: 12px; text-transform: capitalize;" onclick="ChallengesView.setFilter('language', '${lang}')">
                    ${lang === 'all' ? 'All Languages' : (lang === 'cpp' ? 'C++' : lang)}
                  </button>
                `).join("")}
              </div>

              <!-- SEARCH INPUT -->
              <div style="position: relative; min-width: 260px;">
                <input type="text" class="input" placeholder="Search challenges..." value="${Utils.escapeHtml(this.currentFilters.search)}" oninput="ChallengesView.handleSearch(this.value)" style="padding-left: 36px; font-size: 13px;">
                <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px;">🔍</span>
              </div>
            </div>

            <!-- DIFFICULTY PILLS -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Difficulty:</span>
              ${["all", "Easy", "Medium", "Hard"].map(diff => `
                <button class="btn ${this.currentFilters.difficulty === diff ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 12px; font-size: 12px;" onclick="ChallengesView.setFilter('difficulty', '${diff}')">
                  ${diff === 'all' ? 'All Levels' : diff}
                </button>
              `).join("")}
            </div>
          </div>

          <!-- CHALLENGES GRID -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
            ${challenges.length === 0 ? `
              <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
                <h3>No challenges found</h3>
                <p style="margin-top: 6px;">Try adjusting your search query or filter settings.</p>
              </div>
            ` : challenges.map(ch => {
              const diffBadge = ch.difficulty === 'Easy' ? 'badge-success' : (ch.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger');
              const isSolved = solvedSet.has(ch.id);

              return `
                <div class="card card-interactive" onclick="location.hash='#/challenges/${ch.id}'" style="display: flex; flex-direction: column; justify-content: space-between; gap: 16px; ${isSolved ? 'border-color: var(--success);' : ''}">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                      <div style="display: flex; gap: 6px;">
                        <span class="badge ${diffBadge}">${ch.difficulty}</span>
                        <span class="badge badge-primary">${ch.language}</span>
                      </div>
                      ${isSolved ? '<span class="badge badge-success">✓ Solved</span>' : `<span class="badge badge-subtle">${ch.points || 20} Pts</span>`}
                    </div>
                    <h3 style="font-size: 18px; margin-top: 4px;">${Utils.escapeHtml(ch.title)}</h3>
                    <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px; line-height: 1.5;">${Utils.escapeHtml(ch.description)}</p>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px; font-size: 13px;">
                    <span style="color: var(--text-muted); font-weight: 600;">${ch.category}</span>
                    <button class="btn ${isSolved ? 'btn-secondary' : 'btn-outline'}" style="padding: 4px 12px; font-size: 12px;">
                      ${isSolved ? 'Solve Again' : 'Solve Challenge →'}
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h2 style="color: var(--danger);">Failed to load challenges</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="ChallengesView.renderList(document.getElementById('app-root'))">Retry</button>
        </div>
      `;
    }
  },

  setFilter(key, val) {
    this.currentFilters[key] = val;
    this.renderList(document.getElementById("app-root"));
  },

  handleSearch(val) {
    this.currentFilters.search = val;
    this.renderList(document.getElementById("app-root"));
  },

  // ----------------------------------------------------
  // SPLIT-SCREEN CHALLENGE WORKSPACE
  // ----------------------------------------------------
  async renderDetail(container, challengeId) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 40px 0;">
        <div style="color: var(--text-muted);">Loading challenge...</div>
      </div>
    `;

    try {
      const ch = await API.getChallenge(challengeId);
      const diffBadge = ch.difficulty === 'Easy' ? 'badge-success' : (ch.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger');

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px; height: calc(100vh - 120px);">
          <!-- HEADER TOOLBAR -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; background: var(--bg-surface); padding: 12px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <a href="#/challenges" class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px; text-decoration: none;">
                ← All Challenges
              </a>
              <h1 style="font-size: 20px; margin: 0;">${Utils.escapeHtml(ch.title)}</h1>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="badge ${diffBadge}">${ch.difficulty}</span>
              <span class="badge badge-primary">${ch.language}</span>
              <span class="badge badge-warning">${ch.points || 20} Pts</span>
            </div>
          </div>

          <!-- SPLIT PROBLEM & TEST RUNNER -->
          <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 16px; flex: 1; min-height: 0;">
            <!-- LEFT: PROBLEM STATEMENT & TEST CASES -->
            <div class="card" style="display: flex; flex-direction: column; gap: 16px; overflow-y: auto; padding: 20px;">
              <div>
                <span class="badge badge-subtle" style="font-size: 11px;">PROBLEM STATEMENT</span>
                <p style="font-size: 14px; line-height: 1.6; margin-top: 8px; color: var(--text-main);">${Utils.escapeHtml(ch.description)}</p>
              </div>

              ${ch.examples && ch.examples.length > 0 ? `
                <div>
                  <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Example Cases:</span>
                  <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
                    ${ch.examples.map((ex, idx) => `
                      <div style="background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 14px; font-family: var(--font-mono); font-size: 12px;">
                        <div style="color: var(--text-muted); font-size: 11px; font-weight: 700;">EXAMPLE ${idx + 1}</div>
                        ${ex.input ? `<div><span style="color: var(--text-muted);">Input: </span>${Utils.escapeHtml(ex.input)}</div>` : ''}
                        <div><span style="color: var(--text-muted);">Output: </span><strong style="color: var(--success);">${Utils.escapeHtml(ex.output)}</strong></div>
                        ${ex.explanation ? `<div style="color: var(--text-muted); font-family: var(--font-sans); margin-top: 4px; font-size: 12px;">${Utils.escapeHtml(ex.explanation)}</div>` : ''}
                      </div>
                    `).join("")}
                  </div>
                </div>
              ` : ''}

              ${ch.constraints ? `
                <div style="background: var(--bg-subtle); padding: 12px 16px; border-radius: var(--radius-sm); border-left: 3px solid var(--primary); font-size: 13px;">
                  <strong>Constraints:</strong> ${Utils.escapeHtml(ch.constraints)}
                </div>
              ` : ''}

              ${ch.hints && ch.hints.length > 0 ? `
                <details style="background: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px;">
                  <summary style="cursor: pointer; font-weight: 600; color: var(--text-muted);">💡 View Hints</summary>
                  <ul style="padding-left: 18px; margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
                    ${ch.hints.map(h => `<li>${Utils.escapeHtml(h)}</li>`).join("")}
                  </ul>
                </details>
              ` : ''}
            </div>

            <!-- RIGHT: LIVE IDE & TEST EVALUATOR -->
            <div class="card" style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
              <!-- EDITOR TOOLBAR -->
              <div class="code-header" style="border-radius: 0; border-bottom: 1px solid var(--border-color); padding: 10px 16px;">
                <span style="font-weight: 700; color: var(--text-main); font-size: 13px;">SOLUTION EDITOR (${ch.language})</span>
                <div style="display: flex; gap: 8px;">
                  <button class="copy-btn" onclick="ChallengesView.resetStarterCode('${encodeURIComponent(ch.starter_code)}')">Reset</button>
                  <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="ChallengesView.runCode('${ch.language.toLowerCase()}')">▶ Run Code</button>
                  <button class="btn btn-primary" id="btn-submit-challenge" style="padding: 4px 12px; font-size: 12px;" onclick="ChallengesView.submit('${ch.id}', '${ch.language.toLowerCase()}')">⚡ Submit Solution</button>
                </div>
              </div>

              <!-- CODE TEXTAREA -->
              <div style="flex: 1; min-height: 240px; position: relative;">
                <textarea id="challenge-code-editor" class="textarea textarea-code" style="width: 100%; height: 100%; border: none; border-radius: 0; resize: none; font-family: var(--font-mono); font-size: 14px; line-height: 1.5; padding: 14px;">${Utils.escapeHtml(ch.starter_code)}</textarea>
              </div>

              <!-- CONSOLE & TEST RESULTS -->
              <div style="background: var(--bg-subtle); border-top: 1px solid var(--border-color); display: flex; flex-direction: column; max-height: 260px; overflow-y: auto;">
                <details style="padding: 8px 14px; border-bottom: 1px solid var(--border-color); font-size: 12px;">
                  <summary style="cursor: pointer; font-weight: 600; color: var(--text-muted);">Custom Standard Input (stdin)</summary>
                  <textarea id="challenge-stdin-input" class="textarea textarea-code" placeholder="Enter standard input values..." style="min-height: 45px; margin-top: 4px; font-size: 12px;"></textarea>
                </details>

                <div style="padding: 12px 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Deterministic Test Results:</span>
                    <span id="challenge-status-badge" class="badge badge-subtle" style="font-size: 10px;">Ready</span>
                  </div>
                  <div id="challenge-output-console" style="font-family: var(--font-mono); font-size: 13px; color: var(--text-main); white-space: pre-wrap; word-break: break-all; min-height: 50px;">
                    Write code and click "Submit Solution" to run against all hidden and visible test cases.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h2 style="color: var(--danger);">Failed to load challenge</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="location.hash='#/challenges'">Back to Challenges</button>
        </div>
      `;
    }
  },

  resetStarterCode(encodedStarter) {
    const starter = decodeURIComponent(encodedStarter);
    const editor = document.getElementById("challenge-code-editor");
    if (editor) {
      editor.value = starter;
    }
    Utils.showToast("Starter code reset", "info");
  },

  async runCode(language) {
    const editor = document.getElementById("challenge-code-editor");
    const stdinEl = document.getElementById("challenge-stdin-input");
    const consoleEl = document.getElementById("challenge-output-console");
    const badgeEl = document.getElementById("challenge-status-badge");

    const code = editor ? editor.value : "";
    const stdin = stdinEl ? stdinEl.value : "";

    if (!code.trim()) {
      Utils.showToast("Code cannot be empty", "danger");
      return;
    }

    if (badgeEl) {
      badgeEl.className = "badge badge-warning";
      badgeEl.textContent = "Compiling & Running...";
    }

    try {
      const res = await API.executeCode(language, code, stdin);
      if (res.success) {
        if (badgeEl) {
          badgeEl.className = "badge badge-success";
          badgeEl.textContent = `Completed (${res.execution_time_ms}ms)`;
        }
        if (consoleEl) {
          consoleEl.innerHTML = `<span style="color: var(--success);">${Utils.escapeHtml(res.stdout || "Program finished with no output.")}</span>`;
        }
      } else {
        if (badgeEl) {
          badgeEl.className = "badge badge-danger";
          badgeEl.textContent = "Execution Error";
        }
        if (consoleEl) {
          consoleEl.innerHTML = `<span style="color: var(--danger); font-weight: bold;">Error (Exit Code ${res.returncode}):</span>\n<span style="color: var(--danger);">${Utils.escapeHtml(res.stderr || res.error || "Runtime Error")}</span>`;
        }
      }
    } catch (e) {
      if (consoleEl) consoleEl.innerHTML = `<span style="color: var(--danger);">${Utils.escapeHtml(e.message)}</span>`;
    }
  },

  async submit(challengeId, language) {
    const editor = document.getElementById("challenge-code-editor");
    const consoleEl = document.getElementById("challenge-output-console");
    const badgeEl = document.getElementById("challenge-status-badge");

    const code = editor ? editor.value : "";
    if (!code.trim()) {
      Utils.showToast("Please write code before submitting", "danger");
      return;
    }

    if (badgeEl) {
      badgeEl.className = "badge badge-warning";
      badgeEl.textContent = "Running All Test Cases...";
    }

    try {
      const res = await API.submitChallenge(challengeId, State.userId, code);
      if (res.passed) {
        if (badgeEl) {
          badgeEl.className = "badge badge-success";
          badgeEl.textContent = `Accepted (${res.passed_count}/${res.total_count} Passed)`;
        }
        if (consoleEl) {
          consoleEl.innerHTML = `
            <div style="color: var(--success); font-weight: 700; font-size: 15px; margin-bottom: 6px;">✓ Accepted! All ${res.total_count} test cases passed.</div>
            <div style="font-size: 12px; color: var(--text-muted);">Points Earned: <strong>+${res.points || 20} Pts</strong></div>
            ${res.output ? `<div style="margin-top: 6px; font-size: 12px; color: var(--text-main);">Output: ${Utils.escapeHtml(res.output)}</div>` : ''}
          `;
        }
        Utils.playSound("levelup");
        Utils.showToast("Challenge Solved! 🏆", "success");
        await State.refreshProgress();
      } else {
        if (badgeEl) {
          badgeEl.className = "badge badge-danger";
          badgeEl.textContent = `Wrong Answer (${res.passed_count}/${res.total_count} Passed)`;
        }
        if (consoleEl) {
          consoleEl.innerHTML = `
            <div style="color: var(--danger); font-weight: 700; font-size: 15px; margin-bottom: 6px;">✗ Solution Failed (${res.passed_count}/${res.total_count} Test Cases Passed)</div>
            <div style="font-size: 13px; color: var(--text-main);">${Utils.escapeHtml(res.message || "Outputs did not match test case requirements.")}</div>
            ${res.actual_output ? `<div style="margin-top: 6px; font-size: 12px; color: var(--text-muted);">Received:\n<span style="color: var(--danger);">${Utils.escapeHtml(res.actual_output)}</span></div>` : ''}
          `;
        }
        Utils.playSound("incorrect");
        Utils.showToast("Some test cases failed.", "danger");
      }
    } catch (e) {
      if (badgeEl) {
        badgeEl.className = "badge badge-danger";
        badgeEl.textContent = "Error";
      }
      if (consoleEl) {
        consoleEl.innerHTML = `<span style="color: var(--danger);">${Utils.escapeHtml(e.message)}</span>`;
      }
    }
  }
};
