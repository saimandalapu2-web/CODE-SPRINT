// User Progress & Analytics Dashboard View
const ProgressView = {
  async render(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 40px 0;">
        <div style="color: var(--text-muted);">Loading progress telemetry...</div>
      </div>
    `;

    try {
      const progress = await State.refreshProgress();

      const overallPct = progress.overall_percentage || 0;
      const completedCount = progress.completed_topics_count || 0;
      const totalTopics = progress.total_topics_count || 100;
      const streak = progress.current_streak_days || 1;
      const worksheetsCount = progress.worksheets_completed_count || 0;
      const quizzesCount = progress.quizzes_completed_count || 0;
      const challengesCount = progress.challenges_solved_count || 0;
      const avgQuiz = progress.average_quiz_score || 0;
      const langProg = progress.language_progress || {};
      const recentActivity = progress.recent_activity || [];

      const isLoggedIn = State.isLoggedIn();
      const currentUser = State.user;

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 28px;">
          <!-- USER ACCOUNT & PROGRESS HEADER -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <h1>Learning Analytics & Performance</h1>
              <p style="margin-top: 4px;">Track your topics completed, quiz metrics, worksheets solved, and coding streaks.</p>
            </div>
            
            ${isLoggedIn && currentUser ? `
              <div class="card" style="padding: 10px 16px; background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                <div class="user-avatar-circle" style="width: 36px; height: 36px; font-size: 16px;">
                  ${(currentUser.name || currentUser.username || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 14px;">${Utils.escapeHtml(currentUser.name || currentUser.username)}</div>
                  <div style="font-size: 12px; color: var(--success); font-weight: 600;">● Authenticated Account</div>
                </div>
              </div>
            ` : `
              <div class="card" style="padding: 12px 18px; background: var(--primary-light); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 20px;">🛡️</span>
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: var(--text-main);">Guest Mode Active</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Create an account to save & sync your progress permanently.</div>
                </div>
                <button class="btn btn-primary" style="padding: 6px 14px; font-size: 12px;" onclick="Auth.openModal('register')">
                  Save Progress
                </button>
              </div>
            `}
          </div>

          <!-- KEY PERFORMANCE TILES -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div class="card" style="border-top: 4px solid var(--primary);">
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Overall Completion</span>
              <div style="font-size: 28px; font-weight: 800; color: var(--primary); margin: 6px 0;">${overallPct}%</div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${overallPct}%;"></div>
              </div>
            </div>

            <div class="card" style="border-top: 4px solid #f97316;">
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Daily Streak</span>
              <div style="font-size: 28px; font-weight: 800; color: #f97316; margin: 6px 0;">🔥 ${streak} Days</div>
              <span style="font-size: 12px; color: var(--text-muted);">Consecutive active learning</span>
            </div>

            <div class="card" style="border-top: 4px solid var(--success);">
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Worksheets Solved</span>
              <div style="font-size: 28px; font-weight: 800; color: var(--success); margin: 6px 0;">${worksheetsCount}</div>
              <span style="font-size: 12px; color: var(--text-muted);">Verified practice tests</span>
            </div>

            <div class="card" style="border-top: 4px solid #8b5cf6;">
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Challenges Solved</span>
              <div style="font-size: 28px; font-weight: 800; color: #8b5cf6; margin: 6px 0;">${challengesCount}</div>
              <span style="font-size: 12px; color: var(--text-muted);">Algorithms passed</span>
            </div>
          </div>

          <!-- LANGUAGE PROGRESSION BREAKDOWN -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Language Breakdown</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
              ${Object.keys(langProg).map(lid => {
                const lp = langProg[lid];
                return `
                  <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <h3 style="font-size: 16px;">${lp.name}</h3>
                      <span class="badge badge-primary">${lp.percentage}%</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" style="width: ${lp.percentage}%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
                      <span>${lp.completed_topics} / ${lp.total_topics} Topics Done</span>
                      <a href="#/syllabus/${lid}" style="color: var(--primary); text-decoration: none; font-weight: 600;">Open Track →</a>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- RECENT ACTIVITY TIMELINE -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Recent Activity Feed</h2>
            <div class="card" style="padding: 12px 18px;">
              ${recentActivity.length > 0 ? `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${recentActivity.map(act => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 18px;">
                          ${act.type === 'topic' ? '📖' : (act.type === 'worksheet' ? '📝' : (act.type === 'quiz' ? '⚡' : '🎯'))}
                        </span>
                        <div>
                          <div style="font-weight: 600; font-size: 14px;">${Utils.escapeHtml(act.title)}</div>
                          <div style="font-size: 12px; color: var(--text-muted);">${Utils.escapeHtml(act.score_desc)}</div>
                        </div>
                      </div>
                      <span style="font-size: 12px; color: var(--text-subtle);">${act.timestamp || 'Today'}</span>
                    </div>
                  `).join("")}
                </div>
              ` : `
                <div style="text-align: center; padding: 24px; color: var(--text-muted);">
                  No activities recorded yet. Complete a lesson or worksheet to see your logs!
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h2 style="color: var(--danger);">Failed to load progress</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="ProgressView.render(document.getElementById('app-root'))">Retry</button>
        </div>
      `;
    }
  }
};
