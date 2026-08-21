// Technical Interview Questions Preparation Component
const InterviewView = {
  currentCategory: "all",
  currentDifficulty: "all",
  currentCompany: "all",
  searchQuery: "",

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; padding: 40px 0;">
        <div style="color: var(--text-muted);">Loading interview questions...</div>
      </div>
    `;

    try {
      const questions = await API.getInterviewQuestions({
        category: this.currentCategory,
        difficulty: this.currentDifficulty,
        company: this.currentCompany,
        search: this.searchQuery
      });

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- HEADER -->
          <div>
            <h1>Technical Interview Preparation</h1>
            <p style="margin-top: 4px;">100+ curated technical questions across Python, DSA, OOP, DBMS, OS, and Networks with real company tags.</p>
          </div>

          <!-- FILTERS BAR -->
          <div class="card" style="padding: 18px 20px; display: flex; flex-direction: column; gap: 14px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              <!-- CATEGORY FILTER -->
              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Category / Domain:</label>
                <select class="select" id="filter-int-cat" onchange="InterviewView.onFilterChange()">
                  <option value="all" ${this.currentCategory === 'all' ? 'selected' : ''}>All Categories</option>
                  <option value="Python" ${this.currentCategory === 'Python' ? 'selected' : ''}>Python</option>
                  <option value="Data Structures" ${this.currentCategory === 'Data Structures' ? 'selected' : ''}>Data Structures</option>
                  <option value="Algorithms" ${this.currentCategory === 'Algorithms' ? 'selected' : ''}>Algorithms</option>
                  <option value="OOP" ${this.currentCategory === 'OOP' ? 'selected' : ''}>OOP Concepts</option>
                  <option value="DBMS" ${this.currentCategory === 'DBMS' ? 'selected' : ''}>DBMS & SQL</option>
                  <option value="Operating Systems" ${this.currentCategory === 'Operating Systems' ? 'selected' : ''}>Operating Systems</option>
                  <option value="Computer Networks" ${this.currentCategory === 'Computer Networks' ? 'selected' : ''}>Computer Networks</option>
                  <option value="JavaScript" ${this.currentCategory === 'JavaScript' ? 'selected' : ''}>JavaScript</option>
                </select>
              </div>

              <!-- DIFFICULTY FILTER -->
              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Difficulty:</label>
                <select class="select" id="filter-int-diff" onchange="InterviewView.onFilterChange()">
                  <option value="all" ${this.currentDifficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
                  <option value="Easy" ${this.currentDifficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                  <option value="Medium" ${this.currentDifficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="Hard" ${this.currentDifficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                </select>
              </div>

              <!-- SEARCH FILTER -->
              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Keyword Search:</label>
                <input type="text" class="input" id="filter-int-search" placeholder="Search keywords (e.g. GIL, ACID, BFS)..." value="${Utils.escapeHtml(this.searchQuery)}" oninput="InterviewView.onSearchInput(this.value)">
              </div>
            </div>
          </div>

          <!-- QUESTIONS LIST -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; color: var(--text-muted);">
              <span>Showing ${questions.length} Question${questions.length !== 1 ? 's' : ''}</span>
            </div>

            ${questions.map((q, idx) => `
              <div class="card" style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-primary">${q.category}</span>
                    <span class="badge ${q.difficulty === 'Easy' ? 'badge-success' : (q.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger')}">${q.difficulty}</span>
                    ${(q.company_tags || []).map(tag => `<span class="badge badge-subtle">🏢 ${Utils.escapeHtml(tag)}</span>`).join("")}
                  </div>
                  <button class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;" onclick="InterviewView.toggleAnswer('${q.id}')">
                    <span id="btn-text-${q.id}">Reveal Answer ▼</span>
                  </button>
                </div>

                <h3 style="font-size: 17px; line-height: 1.4; color: var(--text-main);">${Utils.escapeHtml(q.question)}</h3>

                <!-- EXPANDABLE ANSWER REGION -->
                <div id="ans-region-${q.id}" style="display: none; flex-direction: column; gap: 12px; background: var(--bg-subtle); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
                  <div>
                    <strong style="color: var(--primary);">Direct Answer:</strong>
                    <p style="margin-top: 4px; font-size: 14px; color: var(--text-main);">${Utils.escapeHtml(q.answer)}</p>
                  </div>

                  <div>
                    <strong style="color: var(--text-main);">In-Depth Explanation:</strong>
                    <p style="margin-top: 4px; font-size: 14px; color: var(--text-muted);">${Utils.escapeHtml(q.explanation)}</p>
                  </div>

                  ${q.key_points && q.key_points.length > 0 ? `
                    <div>
                      <strong style="font-size: 13px; color: var(--text-main);">Key Takeaways:</strong>
                      <ul style="padding-left: 20px; font-size: 13px; margin-top: 4px; color: var(--text-main);">
                        ${q.key_points.map(pt => `<li>${Utils.escapeHtml(pt)}</li>`).join("")}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join("")}

            ${questions.length === 0 ? `
              <div class="card" style="text-align: center; padding: 40px;">
                <h3>No matching interview questions found</h3>
                <p style="margin-top: 6px;">Try adjusting your category, difficulty, or search term filters.</p>
                <button class="btn btn-secondary" style="margin-top: 14px;" onclick="InterviewView.resetFilters()">Reset Filters</button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h2 style="color: var(--danger);">Failed to load interview questions</h2>
          <p style="margin: 12px 0 20px;">${Utils.escapeHtml(e.message)}</p>
          <button class="btn btn-primary" onclick="InterviewView.render(document.getElementById('app-root'))">Retry</button>
        </div>
      `;
    }
  },

  onFilterChange() {
    const cat = document.getElementById("filter-int-cat").value;
    const diff = document.getElementById("filter-int-diff").value;
    this.currentCategory = cat;
    this.currentDifficulty = diff;
    this.render(document.getElementById("app-root"));
  },

  onSearchInput: Utils.debounce(function(val) {
    InterviewView.searchQuery = val;
    InterviewView.render(document.getElementById("app-root"));
  }, 300),

  resetFilters() {
    this.currentCategory = "all";
    this.currentDifficulty = "all";
    this.searchQuery = "";
    this.render(document.getElementById("app-root"));
  },

  toggleAnswer(qid) {
    const el = document.getElementById(`ans-region-${qid}`);
    const btnText = document.getElementById(`btn-text-${qid}`);
    if (el) {
      const isHidden = el.style.display === "none";
      el.style.display = isHidden ? "flex" : "none";
      if (btnText) {
        btnText.textContent = isHidden ? "Hide Answer ▲" : "Reveal Answer ▼";
      }
      Utils.playSound("click");
    }
  }
};
