// Comprehensive Curriculum & Practical Learning Roadmap View for CODE SPRINT
const SyllabusView = {
  currentLevelFilter: "all",
  searchQuery: "",
  viewMode: "roadmap", // "roadmap" or "list"

  async renderLanguages(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 60px 0;">
        <div style="color: var(--text-muted); font-size: 15px;">Loading programming tracks...</div>
      </div>
    `;

    try {
      const [languages, progress] = await Promise.all([
        API.getLanguages(),
        State.refreshProgress()
      ]);

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 28px;">
          <div>
            <h1 style="font-size: 28px; margin-bottom: 8px;">Practical Learning Curriculums</h1>
            <p style="color: var(--text-muted); font-size: 15px; margin: 0; line-height: 1.5;">
              Structured, career-focused roadmaps covering fundamentals, problem solving, data structures, real-world tools, and hands-on worksheets.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
            ${languages.map(lang => {
              const langProg = progress && progress.language_progress ? progress.language_progress[lang.id] : null;
              const pct = langProg ? langProg.percentage : 0;
              const completedCount = langProg ? langProg.completed_topics : 0;
              return `
                <div class="card card-interactive" onclick="location.hash='#/syllabus/${lang.id}'" style="display: flex; flex-direction: column; justify-content: space-between; gap: 20px; border-top: 4px solid ${lang.color};">
                  <div>
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                      <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: ${lang.color}18; color: ${lang.color}; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800;">
                        ${lang.name.charAt(0)}
                      </div>
                      <div>
                        <h2 style="font-size: 20px; margin: 0;">${lang.name}</h2>
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-muted);">Practical Roadmap • 10+ Exercises/Topic</span>
                      </div>
                    </div>
                    <p style="font-size: 14px; line-height: 1.5; color: var(--text-muted); margin: 0;">${lang.description}</p>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
                      <span>Roadmap Progress</span>
                      <span style="color: var(--primary); font-weight: 700;">${completedCount} Topics (${pct}%)</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${lang.color};"></div>
                    </div>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 6px; justify-content: center;">
                      <span>Explore ${lang.name} Roadmap</span>
                      <span>→</span>
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
          <h2 style="color: var(--danger);">Error loading tracks</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="SyllabusView.renderLanguages(document.getElementById('app-root'))">Retry</button>
        </div>
      `;
    }
  },

  async renderSyllabus(container, languageId) {
    this.currentLevelFilter = "all";
    this.searchQuery = "";

    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 60px 0;">
        <div style="color: var(--text-muted); font-size: 15px;">Loading ${Utils.escapeHtml(languageId)} roadmap...</div>
      </div>
    `;

    try {
      const [curriculum, progress] = await Promise.all([
        API.getCurriculum(languageId),
        State.refreshProgress()
      ]);

      this.currentCurriculum = curriculum;
      this.currentProgress = progress;
      this.renderSyllabusContent(container, languageId);
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; max-width: 600px; margin: 40px auto;">
          <h2 style="color: var(--danger);">Error loading roadmap</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="location.hash='#/languages'">Back to Curriculums</button>
        </div>
      `;
    }
  },

  renderSyllabusContent(container, languageId) {
    const curriculum = this.currentCurriculum;
    const progress = this.currentProgress;

    const completedSet = new Set(progress ? progress.completed_topics : []);
    const langProg = progress && progress.language_progress ? progress.language_progress[languageId] : null;
    const pct = langProg ? langProg.percentage : 0;
    const completedCount = langProg ? langProg.completed_topics : 0;

    const allTopics = curriculum.topics || [];
    const langInfo = curriculum.language || { name: languageId.toUpperCase(), color: "#3b82f6" };

    // Group topics by category
    const categoriesMap = {};
    for (const t of allTopics) {
      const catKey = t.category_name || "01 Fundamentals";
      if (!categoriesMap[catKey]) {
        categoriesMap[catKey] = {
          name: catKey,
          badge: t.badge || "CORE",
          level: t.level || "Beginner",
          topics: []
        };
      }
      categoriesMap[catKey].topics.push(t);
    }

    const beginnerCount = allTopics.filter(t => t.level === "Beginner").length;
    const interCount = allTopics.filter(t => t.level === "Intermediate").length;
    const advCount = allTopics.filter(t => t.level === "Advanced").length;

    // Filter topics
    let activeCategories = Object.values(categoriesMap);
    if (this.currentLevelFilter !== "all") {
      activeCategories = activeCategories.map(cat => ({
        ...cat,
        topics: cat.topics.filter(t => t.level.toLowerCase() === this.currentLevelFilter.toLowerCase())
      })).filter(cat => cat.topics.length > 0);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      activeCategories = activeCategories.map(cat => ({
        ...cat,
        topics: cat.topics.filter(t => 
          t.title.toLowerCase().includes(q) || 
          t.category_name.toLowerCase().includes(q) || 
          t.description.toLowerCase().includes(q)
        )
      })).filter(cat => cat.topics.length > 0);
    }

    const totalFilteredTopics = activeCategories.reduce((acc, c) => acc + c.topics.length, 0);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 28px; padding-bottom: 60px;">
        <!-- BREADCRUMB & HEADER -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted);">
            <a href="#/languages" style="color: var(--primary); text-decoration: none;">Curriculums</a>
            <span>/</span>
            <span>${langInfo.name} Roadmap</span>
          </div>

          <div class="card" style="padding: 26px 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; border-left: 6px solid ${langInfo.color};">
            <div style="display: flex; align-items: center; gap: 18px;">
              <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: ${langInfo.color}20; color: ${langInfo.color}; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800;">
                ${langInfo.name.charAt(0)}
              </div>
              <div>
                <h1 style="font-size: 28px; margin: 0; font-weight: 800;">${langInfo.name} Practical Roadmap</h1>
                <p style="font-size: 14px; color: var(--text-muted); margin: 6px 0 0;">
                  ${allTopics.length} Comprehensive Topics across ${Object.keys(categoriesMap).length} Categories • Beginner (${beginnerCount}) • Intermediate (${interCount}) • Advanced (${advCount})
                </p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 18px;">
              <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-size: 13px; font-weight: 600; color: var(--text-muted);">Completed</span>
                <span style="font-size: 22px; font-weight: 800; color: var(--primary);">${completedCount} / ${allTopics.length} (${pct}%)</span>
              </div>
              <button class="btn btn-outline" onclick="location.hash='#/compiler?lang=${languageId}'">
                <span>💻 Open ${langInfo.name} Compiler</span>
              </button>
            </div>
          </div>
        </div>

        <!-- SEARCH AND LEVEL TABS -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <!-- FILTER TABS -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn ${this.currentLevelFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="SyllabusView.setLevelFilter('${languageId}', 'all')">
              All Topics (${allTopics.length})
            </button>
            <button class="btn ${this.currentLevelFilter === 'beginner' ? 'btn-primary' : 'btn-secondary'}" onclick="SyllabusView.setLevelFilter('${languageId}', 'beginner')">
              Beginner (${beginnerCount})
            </button>
            <button class="btn ${this.currentLevelFilter === 'intermediate' ? 'btn-primary' : 'btn-secondary'}" onclick="SyllabusView.setLevelFilter('${languageId}', 'intermediate')">
              Intermediate (${interCount})
            </button>
            <button class="btn ${this.currentLevelFilter === 'advanced' ? 'btn-primary' : 'btn-secondary'}" onclick="SyllabusView.setLevelFilter('${languageId}', 'advanced')">
              Advanced (${advCount})
            </button>
          </div>

          <!-- TOPIC SEARCH BAR -->
          <div style="position: relative; min-width: 280px;">
            <input type="text" class="input" placeholder="Search topics in ${langInfo.name}..." value="${Utils.escapeHtml(this.searchQuery)}" oninput="SyllabusView.handleSearch('${languageId}', this.value)" style="padding-left: 36px;">
            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px;">🔍</span>
          </div>
        </div>

        <!-- CATEGORIZED ROADMAP SECTIONS -->
        <div style="display: flex; flex-direction: column; gap: 28px;">
          ${activeCategories.length === 0 ? `
            <div class="card" style="text-align: center; padding: 40px; color: var(--text-muted);">
              No topics matched your search filter "${Utils.escapeHtml(this.searchQuery)}".
            </div>
          ` : activeCategories.map((cat, catIdx) => {
            const catDoneCount = cat.topics.filter(t => completedSet.has(t.id)).length;
            const catPct = Math.round((catDoneCount / cat.topics.length) * 100);
            const badgeClass = cat.badge === 'CORE' ? 'badge-primary' : (cat.badge === 'RECOMMENDED' ? 'badge-success' : (cat.badge === 'IMPORTANT' ? 'badge-warning' : 'badge-danger'));

            return `
              <div class="roadmap-category-card" style="display: flex; flex-direction: column; gap: 14px;">
                <!-- CATEGORY HEADER -->
                <div class="card" style="background: var(--bg-surface); padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; border-left: 4px solid var(--primary);">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <h2 style="font-size: 18px; margin: 0; font-weight: 800; color: var(--text-main);">${Utils.escapeHtml(cat.name)}</h2>
                    <span class="badge ${badgeClass}" style="font-size: 11px;">${cat.badge}</span>
                    <span class="badge badge-subtle" style="font-size: 11px;">${cat.topics.length} Topics</span>
                  </div>

                  <div style="display: flex; align-items: center; gap: 14px;">
                    <span style="font-size: 13px; font-weight: 700; color: var(--text-muted);">${catDoneCount}/${cat.topics.length} Done (${catPct}%)</span>
                    <div style="width: 100px;" class="progress-bar-container">
                      <div class="progress-bar-fill" style="width: ${catPct}%;"></div>
                    </div>
                  </div>
                </div>

                <!-- TOPICS IN THIS CATEGORY -->
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  ${cat.topics.map(topic => {
                    const isDone = completedSet.has(topic.id);
                    const levelBadge = topic.level === 'Beginner' ? 'badge-success' : (topic.level === 'Intermediate' ? 'badge-warning' : 'badge-danger');
                    
                    return `
                      <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 16px 22px; transition: all 0.2s; border: 1px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 280px;">
                          <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-subtle); font-family: var(--font-mono); font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border-color);">
                            ${topic.order || 1}
                          </div>

                          <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                              <h3 style="font-size: 15px; margin: 0; color: var(--text-main); font-weight: 700;">${Utils.escapeHtml(topic.title)}</h3>
                              <span class="badge ${levelBadge}" style="font-size: 11px;">${topic.level}</span>
                              ${isDone ? '<span class="badge badge-success" style="font-size: 11px;">✓ Completed</span>' : ''}
                            </div>
                            <p style="font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.4;">${Utils.escapeHtml(topic.description)}</p>
                          </div>
                        </div>

                        <div style="display: flex; gap: 8px; align-items: center;">
                          <button class="btn btn-secondary" onclick="location.hash='#/worksheet/${topic.id}'" style="padding: 7px 14px; font-size: 13px;">
                            <span>📝 Worksheet</span>
                          </button>
                          <button class="btn btn-primary" onclick="location.hash='#/lesson/${topic.id}'" style="padding: 7px 16px; font-size: 13px;">
                            <span>View Lesson →</span>
                          </button>
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  setLevelFilter(languageId, level) {
    this.currentLevelFilter = level;
    this.renderSyllabusContent(document.getElementById("app-root"), languageId);
  },

  handleSearch(languageId, query) {
    this.searchQuery = query;
    this.renderSyllabusContent(document.getElementById("app-root"), languageId);
  }
};
