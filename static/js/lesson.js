// Topic Comprehensive Lesson View Component for CODE SPRINT
const LessonView = {
  currentTopic: null,
  currentWorksheet: null,

  async render(container, topicId) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 60px 0;">
        <div style="color: var(--text-muted); font-size: 15px; display: flex; align-items: center; gap: 10px;">
          <span>⏳</span>
          <span>Loading comprehensive lesson content...</span>
        </div>
      </div>
    `;

    try {
      const [topic, progress, worksheet] = await Promise.all([
        API.getTopic(topicId),
        State.refreshProgress(),
        API.getWorksheet(topicId).catch(() => ({ questions: [] }))
      ]);

      this.currentTopic = topic;
      this.currentWorksheet = worksheet;

      const isCompleted = progress && progress.completed_topics && progress.completed_topics.includes(topicId);
      const badgeType = topic.badge === 'CORE' ? 'badge-primary' : (topic.badge === 'RECOMMENDED' ? 'badge-success' : (topic.badge === 'IMPORTANT' ? 'badge-warning' : 'badge-danger'));
      const levelBadge = topic.level === 'Beginner' ? 'badge-success' : (topic.level === 'Intermediate' ? 'badge-warning' : 'badge-danger');
      const questionsList = (worksheet && worksheet.questions && worksheet.questions.length > 0) ? worksheet.questions : [];
      const questionCount = questionsList.length || 10;

      // Smart fallback for Why Matters and Real-World Use if not explicitly present
      const whyMattersText = topic.why_matters || 
        `Mastering ${topic.title} is a fundamental milestone in ${topic.language_name}. It establishes the foundational principles required for building scalable, bug-free applications, writing idiomatic code, and excelling in technical interviews.`;
      
      const realWorldUseText = topic.real_world_use || 
        `Widely applied in production ${topic.language_name} systems, enterprise web applications, high-performance distributed architectures, and modern software engineering pipelines.`;

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 32px; max-width: 980px; margin: 0 auto; padding-bottom: 60px;">
          <!-- BREADCRUMB NAVIGATION -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted);">
              <a href="#/languages" style="color: var(--primary); text-decoration: none;">Curriculums</a>
              <span>/</span>
              <a href="#/syllabus/${topic.language_id}" style="color: var(--primary); text-decoration: none;">${topic.language_name} Roadmap</a>
              <span>/</span>
              <span>${Utils.escapeHtml(topic.category_name)}</span>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              ${topic.badge ? `<span class="badge ${badgeType}">${topic.badge}</span>` : ''}
              <span class="badge ${levelBadge}">${topic.level}</span>
              <span class="badge ${isCompleted ? 'badge-success' : 'badge-subtle'}" id="lesson-status-badge">
                ${isCompleted ? '✓ Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          <!-- LESSON TITLE & HERO -->
          <div class="card" style="display: flex; flex-direction: column; gap: 14px; border-left: 6px solid var(--primary); padding: 26px 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--primary); background: var(--bg-subtle); padding: 4px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">Topic #${topic.order || 1}</span>
                <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">${topic.language_name} Practical Track</span>
              </div>
              <a href="#/worksheet/${topic.id}" class="btn btn-outline" style="font-size: 13px; padding: 6px 14px; text-decoration: none;">
                <span>📝 Open ${questionCount}+ Question Worksheet →</span>
              </a>
            </div>
            <h1 style="font-size: 28px; margin: 0; color: var(--text-main); font-weight: 800;">${Utils.escapeHtml(topic.title)}</h1>
            <p style="font-size: 15px; color: var(--text-muted); margin: 0; line-height: 1.6;">${Utils.escapeHtml(topic.description)}</p>
          </div>

          <!-- WHY THIS TOPIC MATTERS -->
          <div class="card" style="background: rgba(59, 130, 246, 0.04); border-left: 5px solid var(--primary); padding: 22px 26px;">
            <h3 style="font-size: 17px; margin: 0 0 8px; color: var(--primary); display: flex; align-items: center; gap: 10px; font-weight: 800;">
              <span>💡</span>
              <span>Why This Topic Matters</span>
            </h3>
            <p style="font-size: 15px; color: var(--text-main); margin: 0; line-height: 1.6;">${Utils.escapeHtml(whyMattersText)}</p>
          </div>

          <!-- WHAT YOU WILL LEARN (LEARNING OBJECTIVES) -->
          <div class="card" style="border-left: 5px solid var(--success); padding: 22px 26px;">
            <h3 style="font-size: 17px; margin: 0 0 14px; display: flex; align-items: center; gap: 10px; font-weight: 800;">
              <span style="color: var(--success);">🎯</span>
              <span>What You Will Learn</span>
            </h3>
            <ul style="list-style-type: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
              ${(topic.learning_objectives && topic.learning_objectives.length > 0 ? topic.learning_objectives : [
                `Understand core mechanics and syntax of ${topic.title} in ${topic.language_name}.`,
                `Write clean, idiomatic code without syntax errors or runtime bugs.`,
                `Analyze edge cases, performance considerations, and defensive patterns.`,
                `Solve hands-on practice problems in the accompanying ${questionCount}+ question worksheet.`
              ]).map(obj => `
                <li style="display: flex; align-items: flex-start; gap: 10px; line-height: 1.5;">
                  <span style="color: var(--success); font-weight: 800; font-size: 15px;">✓</span>
                  <span style="color: var(--text-main); font-weight: 500;">${Utils.escapeHtml(obj)}</span>
                </li>
              `).join("")}
            </ul>
          </div>

          <!-- THEORY & DETAILED CONCEPT -->
          <section style="display: flex; flex-direction: column; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0;">Detailed Concept & Explanation</h2>
            <div class="card" style="line-height: 1.7; font-size: 15px; color: var(--text-main); padding: 26px;">
              <div style="white-space: pre-line;">${Utils.escapeHtml(topic.theory || topic.description)}</div>
            </div>
          </section>

          <!-- SYNTAX SPECIFICATION -->
          <section style="display: flex; flex-direction: column; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0;">Syntax Specification</h2>
            <div class="card" style="padding: 0; overflow: hidden;">
              <div class="code-header">
                <span>SYNTAX SPECIFICATION (${topic.language_name.toUpperCase()})</span>
                <button class="copy-btn" onclick="LessonView.copySyntax()">Copy Syntax</button>
              </div>
              <pre class="code-block" style="border-radius: 0; margin: 0; padding: 18px 20px;"><code>${Utils.formatCode(topic.syntax || `// Syntax for ${topic.title}`, topic.language_id)}</code></pre>
            </div>
          </section>

          <!-- BEGINNER-FRIENDLY CODE EXAMPLES -->
          <section style="display: flex; flex-direction: column; gap: 16px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0;">Beginner-Friendly Code Examples</h2>
            ${(topic.examples || []).map((ex, idx) => `
              <div class="card" style="padding: 0; overflow: hidden;">
                <div class="code-header">
                  <span style="font-weight: 600; color: var(--text-main); font-family: var(--font-sans);">Example ${idx + 1}: ${Utils.escapeHtml(ex.title)}</span>
                  <button class="copy-btn" onclick="LessonView.copyExample(${idx})">Copy Code</button>
                </div>
                <pre class="code-block" style="border-radius: 0; margin: 0; padding: 18px 20px;"><code>${Utils.formatCode(ex.code, topic.language_id)}</code></pre>
                
                ${ex.expected_output ? `
                  <div style="padding: 14px 20px; background: var(--bg-subtle); border-top: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 13px;">
                    <span style="color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px;">Expected Output:</span>
                    <pre style="margin: 0; color: var(--success); font-family: var(--font-mono);">${Utils.escapeHtml(ex.expected_output)}</pre>
                  </div>
                ` : ''}

                ${ex.explanation ? `
                  <div style="padding: 14px 20px; background: var(--bg-surface); border-top: 1px solid var(--border-color); font-size: 14px; line-height: 1.5; color: var(--text-muted);">
                    <strong style="color: var(--text-main);">Walkthrough: </strong> ${Utils.escapeHtml(ex.explanation)}
                  </div>
                ` : ''}

                <div style="padding: 12px 20px; background: var(--bg-surface); border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end;">
                  <button class="btn btn-outline" style="padding: 6px 14px; font-size: 13px;" onclick="LessonView.runExample(${idx})">
                    <span>⚡ Try in Compiler IDE</span>
                  </button>
                </div>
              </div>
            `).join("")}
          </section>

          <!-- COMMON MISTAKES & DEFENSIVE CODING -->
          <section style="display: flex; flex-direction: column; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0;">Common Mistakes & Pitfalls</h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${(topic.common_mistakes && topic.common_mistakes.length > 0 ? topic.common_mistakes : [
                { mistake: `Overlooking boundary conditions or edge cases in ${topic.title}.`, solution: `Add defensive input validations and check boundary limits.` },
                { mistake: `Using non-idiomatic patterns that increase time or space complexity.`, solution: `Leverage built-in standard library utilities and clear control flow.` }
              ]).map(m => `
                <div class="card" style="border-left: 4px solid var(--danger); padding: 16px 20px;">
                  <div style="display: flex; align-items: center; gap: 8px; color: var(--danger); font-weight: 700; font-size: 14px; margin-bottom: 6px;">
                    <span>⚠️ Pitfall:</span>
                    <span>${Utils.escapeHtml(m.mistake)}</span>
                  </div>
                  <div style="display: flex; align-items: flex-start; gap: 8px; color: var(--success); font-weight: 600; font-size: 13px;">
                    <span>💡 Solution:</span>
                    <span style="color: var(--text-main); font-weight: normal; line-height: 1.5;">${Utils.escapeHtml(m.solution)}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </section>

          <!-- KEY POINTS & BEST PRACTICES -->
          <section style="display: flex; flex-direction: column; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0;">Key Points & Best Practices</h2>
            <div class="card" style="background: var(--bg-subtle); padding: 20px 24px;">
              <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: var(--text-main); margin: 0;">
                ${(topic.important_notes && topic.important_notes.length > 0 ? topic.important_notes : [
                  `Maintain clean code structure and follow established conventions for ${topic.language_name}.`,
                  `Ensure code readability with meaningful identifiers and self-explanatory logic.`,
                  `Reinforce concepts by working through the ${questionCount}+ practice exercises below.`
                ]).map(note => `
                  <li>${Utils.escapeHtml(note)}</li>
                `).join("")}
              </ul>
            </div>
          </section>

          <!-- REAL-WORLD USE CASE SECTION -->
          <section style="display: flex; flex-direction: column; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span>🏢</span>
              <span>Real-World Use</span>
            </h2>
            <div class="card" style="padding: 20px 26px; font-size: 14px; line-height: 1.6; color: var(--text-main); border-left: 5px solid #8b5cf6; background: rgba(139, 92, 246, 0.04);">
              <div style="font-weight: 700; color: #7c3aed; margin-bottom: 6px; font-size: 13px; text-transform: uppercase;">Production & Industry Applications</div>
              <div>${Utils.escapeHtml(realWorldUseText)}</div>
            </div>
          </section>

          <!-- EMBEDDED PRACTICE WORKSHEET WITH 10+ QUESTIONS & DIRECT LINK -->
          <section style="display: flex; flex-direction: column; gap: 16px;">
            <div class="card" style="background: var(--bg-surface); border: 2px solid var(--primary); padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 22px;">📝</span>
                  <h2 style="font-size: 20px; font-weight: 800; margin: 0; color: var(--text-main);">Practical Practice Worksheet (${questionCount} Exercises)</h2>
                </div>
                <p style="font-size: 14px; color: var(--text-muted); margin: 4px 0 0;">
                  Master this topic with 10+ graduated coding exercises featuring live compiler execution and deterministic test cases.
                </p>
              </div>

              <a href="#/worksheet/${topic.id}" class="btn btn-primary" style="padding: 10px 22px; font-size: 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <span>Open Full Worksheet (${questionCount} Exercises)</span>
                <span>→</span>
              </a>
            </div>

            <!-- EXERCISE LIST WITH 'TRY MYSELF' BUTTONS -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${questionsList.map((q, idx) => {
                const diffBadge = q.difficulty === 'Beginner' ? 'badge-success' : (q.difficulty === 'Easy' ? 'badge-success' : (q.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'));
                return `
                  <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding: 14px 20px; border-left: 3px solid var(--border-color);">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 260px;">
                      <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: var(--bg-subtle); font-family: var(--font-mono); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border-color);">
                        ${q.number || idx + 1}
                      </div>
                      <div>
                        <div style="font-size: 14px; font-weight: 700; color: var(--text-main);">${Utils.escapeHtml(q.title || `Exercise ${idx + 1}`)}</div>
                        <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${Utils.escapeHtml(q.prompt || q.description || "")}</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span class="badge ${diffBadge}" style="font-size: 11px;">${q.difficulty}</span>
                      <span class="badge badge-warning" style="font-size: 11px;">${q.points || 10} Pts</span>
                      <a href="#/worksheet/${topic.id}/${q.id}" class="btn btn-outline" style="padding: 5px 14px; font-size: 12px; text-decoration: none;">
                        <span>⚡ Try Myself</span>
                      </a>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </section>

          <!-- BOTTOM ACTION CONTROLS & COMPLETION -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 20px 24px;">
            <button class="btn btn-secondary" ${topic.prev_topic_id ? `onclick="location.hash='#/lesson/${topic.prev_topic_id}'"` : 'disabled style="opacity: 0.5; cursor: not-allowed;"'}>
              <span>← Previous Lesson</span>
            </button>

            <div style="display: flex; gap: 10px; align-items: center;">
              <a href="#/worksheet/${topic.id}" class="btn btn-outline" style="text-decoration: none;">
                <span>📝 Worksheet</span>
              </a>
              <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'}" id="mark-complete-btn" onclick="LessonView.toggleComplete('${topic.id}')">
                <span>${isCompleted ? '✓ Completed (Click to Unmark)' : '✓ Mark as Completed'}</span>
              </button>
            </div>

            <button class="btn btn-primary" ${topic.next_topic_id ? `onclick="location.hash='#/lesson/${topic.next_topic_id}'"` : 'disabled style="opacity: 0.5; cursor: not-allowed;"'}>
              <span>Next Lesson →</span>
            </button>
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 50px 20px; max-width: 600px; margin: 40px auto;">
          <h2 style="color: var(--danger); font-size: 22px;">Failed to Load Lesson</h2>
          <p style="margin: 14px 0 24px; color: var(--text-muted);">${Utils.escapeHtml(e.message)}</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <button class="btn btn-primary" onclick="location.hash='#/languages'">Back to Curriculums</button>
            <button class="btn btn-outline" onclick="LessonView.render(document.getElementById('app-root'), '${topicId}')">Retry</button>
          </div>
        </div>
      `;
    }
  },

  copySyntax() {
    if (this.currentTopic && this.currentTopic.syntax) {
      Utils.copyText(this.currentTopic.syntax);
    }
  },

  copyExample(idx) {
    if (this.currentTopic && this.currentTopic.examples && this.currentTopic.examples[idx]) {
      Utils.copyText(this.currentTopic.examples[idx].code);
    }
  },

  runExample(idx) {
    if (this.currentTopic && this.currentTopic.examples && this.currentTopic.examples[idx]) {
      const code = this.currentTopic.examples[idx].code;
      CompilerView.loadAndRunCode(this.currentTopic.language_id, encodeURIComponent(code));
    }
  },

  async toggleComplete(topicId) {
    try {
      const progress = await State.refreshProgress();
      const isCurrentlyCompleted = progress && progress.completed_topics && progress.completed_topics.includes(topicId);
      const newStatus = !isCurrentlyCompleted;

      await API.markTopicComplete(State.userId, topicId, newStatus);
      await State.refreshProgress();

      Utils.playSound("correct");
      Utils.showToast(newStatus ? "Topic marked as Completed! ✓" : "Topic unmarked", "success");

      const btn = document.getElementById("mark-complete-btn");
      const badge = document.getElementById("lesson-status-badge");
      if (btn) {
        btn.className = `btn ${newStatus ? 'btn-secondary' : 'btn-success'}`;
        btn.innerHTML = `<span>${newStatus ? '✓ Completed (Click to Unmark)' : '✓ Mark as Completed'}</span>`;
      }
      if (badge) {
        badge.className = `badge ${newStatus ? 'badge-success' : 'badge-subtle'}`;
        badge.textContent = newStatus ? '✓ Completed' : 'In Progress';
      }
    } catch (e) {
      Utils.showToast("Failed to update progress", "danger");
    }
  }
};
