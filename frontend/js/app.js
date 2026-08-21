// CodeLearn Application Bootstrapper & Global Event Handlers
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize State & Preferences
  await State.init();

  // 2. Initialize Authentication UI & Listeners
  Auth.init();

  // 3. Initialize Router
  Router.init();

  // 3. Setup Quick Theme Toggle Button in Sidebar
  const themeToggle = document.getElementById("quick-theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => State.toggleMode());
  }

  // 4. Setup Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });

    // Close on navigation
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
      });
    });
  }

  // 5. Global Search Modal Setup
  const searchTrigger = document.getElementById("global-search-trigger");
  const searchModal = document.getElementById("search-modal");
  const searchClose = document.getElementById("search-modal-close");
  const searchInput = document.getElementById("search-modal-input");
  const searchResults = document.getElementById("search-results-container");

  function openSearch() {
    if (searchModal && searchInput) {
      searchModal.classList.add("active");
      searchInput.value = "";
      searchInput.focus();
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove("active");
    }
  }

  if (searchTrigger) searchTrigger.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchModal) {
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Global Keyboard Shortcuts (/ or Ctrl+K or Cmd+K)
  window.addEventListener("keydown", (e) => {
    if ((e.key === "/" || (e.key === "k" && (e.ctrlKey || e.metaKey))) && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape" && searchModal && searchModal.classList.contains("active")) {
      closeSearch();
    }
  });

  // Search Live Query Handler
  if (searchInput && searchResults) {
    searchInput.addEventListener("input", Utils.debounce(async (e) => {
      const q = e.target.value;
      if (!q || q.trim().length === 0) {
        searchResults.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted);">
            Type to search instantly across all languages, topics, worksheets, and challenges.
          </div>
        `;
        return;
      }

      try {
        const results = await API.search(q);
        if (results.length === 0) {
          searchResults.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-muted);">
              No matching topics or challenges found for "${Utils.escapeHtml(q)}".
            </div>
          `;
          return;
        }

        searchResults.innerHTML = results.map(item => {
          let icon = "📚";
          if (item.type === "challenge") icon = "🎯";
          if (item.type === "interview") icon = "💼";
          if (item.type === "language") icon = "⚡";

          return `
            <a href="${item.link}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('active')">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">${icon}</span>
                <div>
                  <div style="font-weight: 700; font-size: 14px;">${Utils.escapeHtml(item.title)}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${Utils.escapeHtml(item.subtitle)}</div>
                </div>
              </div>
              <span class="badge badge-subtle" style="font-size: 11px;">${Utils.escapeHtml(item.category)}</span>
            </a>
          `;
        }).join("");
      } catch (err) {
        searchResults.innerHTML = `
          <div style="padding: 20px; text-align: center; color: var(--danger);">
            Search error: ${Utils.escapeHtml(err.message)}
          </div>
        `;
      }
    }, 200));
  }
});
