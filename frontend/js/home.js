// Home Dashboard View Component for CODE SPRINT
const HomeView = {
  async render(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 40px 0;">
        <div style="color: var(--text-muted);">Loading CODE SPRINT dashboard...</div>
      </div>
    `;

    try {
      const [languages, progress] = await Promise.all([
        API.getLanguages(),
        State.refreshProgress()
      ]);

      const totalTopics = progress ? progress.total_topics_count : 350;
      const completedTopics = progress ? progress.completed_topics_count : 0;
      const overallPct = progress ? progress.overall_percentage : 0;
      const streak = progress ? progress.current_streak_days : 1;
      const worksheetsCount = progress ? progress.worksheets_completed_count : 0;
      const quizzesCount = progress ? progress.quizzes_completed_count : 0;
      const challengesCount = progress ? progress.challenges_solved_count : 0;

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 32px;">
          <!-- HERO BANNER -->
          <div class="card" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; border: none; border-radius: var(--radius-lg); padding: 36px 32px; box-shadow: 0 12px 28px -6px rgba(30, 58, 138, 0.4);">
            <div style="display: flex; flex-direction: column; gap: 12px; max-width: 840px;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="badge" style="background: rgba(255, 255, 255, 0.2); color: #ffffff; width: fit-content; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">⚡ CODE SPRINT PRO • DETERMINISTIC CURRICULUM</span>
                <span class="badge" style="background: rgba(16, 185, 129, 0.25); color: #a7f3d0; font-size: 11px; font-weight: 700;">350+ STRUCTURED TOPICS</span>
              </div>
              <h1 style="font-size: 34px; line-height: 1.2; color: #ffffff; font-weight: 800; letter-spacing: -0.5px;">Learn. Practice. Code. Master.</h1>
              <p style="font-size: 16px; color: rgba(255, 255, 255, 0.92); line-height: 1.6; margin: 2px 0 12px;">
                Accelerate your software engineering mastery with 50+ systematically structured topics across 7 core programming languages. Solve interactive worksheets with our split-screen compiler and tackle 120+ verified coding challenges.
              </p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn" id="home-start-btn" onclick="location.hash='#/syllabus/python'" style="background: #ffffff; color: #1e3a8a; font-weight: 700; padding: 10px 20px; font-size: 14px;">
                  <span>Start Python Track (50 Topics) →</span>
                </button>
                <button class="btn" onclick="location.hash='#/languages'" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.3); font-weight: 600; padding: 10px 18px;">
                  <span>Explore 7 Curriculums</span>
                </button>
                <button class="btn" onclick="location.hash='#/challenges'" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.3); font-weight: 600; padding: 10px 18px;">
                  <span>🎯 120+ Coding Challenges</span>
                </button>
                <button class="btn" onclick="location.hash='#/compiler'" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.3); font-weight: 600; padding: 10px 18px;">
                  <span>💻 Interactive IDE</span>
                </button>
              </div>
            </div>
          </div>

          <!-- PLATFORM METRICS -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div class="card" style="display: flex; flex-direction: column; gap: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Overall Completion</span>
              <div style="font-size: 28px; font-weight: 800; color: var(--primary);">${overallPct}%</div>
              <div class="progress-bar-container" style="margin-top: 4px;">
                <div class="progress-bar-fill" style="width: ${overallPct}%;"></div>
              </div>
            </div>

            <div class="card" style="display: flex; flex-direction: column; gap: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Completed Topics</span>
              <div style="font-size: 28px; font-weight: 800; color: var(--text-main);">${completedTopics} <span style="font-size: 15px; font-weight: 500; color: var(--text-muted);">/ ${totalTopics}</span></div>
              <span style="font-size: 12px; color: var(--text-muted);">50 topics per language</span>
            </div>

            <div class="card" style="display: flex; flex-direction: column; gap: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Worksheets Solved</span>
              <div style="font-size: 28px; font-weight: 800; color: var(--success);">${worksheetsCount}</div>
              <span style="font-size: 12px; color: var(--text-muted);">Self-checking exercises</span>
            </div>

            <div class="card" style="display: flex; flex-direction: column; gap: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Challenges Solved</span>
              <div style="font-size: 28px; font-weight: 800; color: #8b5cf6;">${challengesCount}</div>
              <span style="font-size: 12px; color: var(--text-muted);">Algorithmic tests passed</span>
            </div>

            <div class="card" style="display: flex; flex-direction: column; gap: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Active Streak</span>
              <div style="font-size: 28px; font-weight: 800; color: #f97316;">🔥 ${streak} Day${streak > 1 ? 's' : ''}</div>
              <span style="font-size: 12px; color: var(--text-muted);">Daily practice streak</span>
            </div>
          </div>

          <!-- 7 PROGRAMMING TRACKS -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h2>Programming Tracks (50 Topics Each)</h2>
                <p style="font-size: 14px; color: var(--text-muted); margin: 0;">Beginner → Intermediate → Advanced structured roadmaps</p>
              </div>
              <a href="#/languages" class="btn btn-outline" style="padding: 6px 14px; font-size: 13px;">View All Tracks →</a>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;">
              ${languages.map(lang => {
                const langProg = progress && progress.language_progress ? progress.language_progress[lang.id] : null;
                const pct = langProg ? langProg.percentage : 0;
                const comp = langProg ? langProg.completed_topics : 0;
                return `
                  <div class="card card-interactive" onclick="location.hash='#/syllabus/${lang.id}'" style="display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: ${lang.color}15; color: ${lang.color}; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800;">
                            ${lang.name.charAt(0)}
                          </div>
                          <div>
                            <h3 style="font-size: 18px;">${lang.name}</h3>
                            <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">50 Topics • 3 Levels</span>
                          </div>
                        </div>
                        <span class="badge badge-subtle" style="font-size: 11px;">Beginner → Adv</span>
                      </div>
                      <p style="font-size: 13px; line-height: 1.5; color: var(--text-muted);">${lang.description}</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: var(--text-muted);">
                        <span>Progress (${comp}/50)</span>
                        <span style="color: var(--primary); font-weight: 700;">${pct}%</span>
                      </div>
                      <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${lang.color};"></div>
                      </div>
                      <button class="btn btn-outline" style="width: 100%; margin-top: 4px; font-size: 13px; justify-content: center;">
                        <span>Open 50 Topics Roadmap →</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- QUICK ACCESS TO PRACTICE & COMPILER -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
            <div class="card" style="display: flex; flex-direction: column; gap: 12px; border-left: 4px solid var(--primary);">
              <h3>💻 Multi-Language Compiler & Split-Screen Workspace</h3>
              <p style="font-size: 14px; line-height: 1.5; color: var(--text-muted);">
                Test programs in real-time with our native execution backend supporting Python, C, C++, Java, JavaScript, SQL, and HTML/CSS.
              </p>
              <button class="btn btn-primary" onclick="location.hash='#/compiler'" style="width: fit-content;">
                <span>Launch Interactive IDE →</span>
              </button>
            </div>

            <div class="card" style="display: flex; flex-direction: column; gap: 12px; border-left: 4px solid var(--success);">
              <h3>🎯 120+ Coding Challenges</h3>
              <p style="font-size: 14px; line-height: 1.5; color: var(--text-muted);">
                Sharpen your problem-solving skills with algorithmic challenges across Easy, Medium, and Hard tiers, complete with automated test runners.
              </p>
              <button class="btn btn-secondary" onclick="location.hash='#/challenges'" style="width: fit-content;">
                <span>Browse Challenges →</span>
              </button>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h2 style="color: var(--danger);">Failed to load dashboard</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="HomeView.render(document.getElementById('app-root'))">Retry</button>
        </div>
      `;
    }
  }
};
