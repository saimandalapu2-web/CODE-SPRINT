// Authentication Manager, UI Modals, and State Binding for CodeLearn
const Auth = {
  activeTab: "login", // 'login' | 'register'
  modalEl: null,

  init() {
    this.createModalDOM();
    this.renderHeaderAuth();
  },

  createModalDOM() {
    let modal = document.getElementById("auth-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal-backdrop";
      modal.id = "auth-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      document.body.appendChild(modal);
    }
    this.modalEl = modal;

    this.modalEl.addEventListener("click", (e) => {
      if (e.target === this.modalEl) {
        this.closeModal();
      }
    });
  },

  openModal(tab = "login") {
    this.activeTab = tab;
    this.renderModalContent();
    if (this.modalEl) {
      this.modalEl.classList.add("active");
    }
  },

  closeModal() {
    if (this.modalEl) {
      this.modalEl.classList.remove("active");
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.renderModalContent();
  },

  renderModalContent(errorMessage = "") {
    if (!this.modalEl) return;

    const isLogin = this.activeTab === "login";

    this.modalEl.innerHTML = `
      <div class="auth-modal-dialog">
        <div class="auth-modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">⚡</span>
            <strong style="font-size: 16px;">${isLogin ? 'Sign In to CODE SPRINT' : 'Create an Account'}</strong>
          </div>
          <button class="btn-icon" onclick="Auth.closeModal()" aria-label="Close dialog">✕</button>
        </div>

        <div class="auth-modal-body">
          <div class="auth-tabs">
            <button class="auth-tab-btn ${isLogin ? 'active' : ''}" onclick="Auth.switchTab('login')">
              Sign In
            </button>
            <button class="auth-tab-btn ${!isLogin ? 'active' : ''}" onclick="Auth.switchTab('register')">
              Create Account
            </button>
          </div>

          ${errorMessage ? `
            <div class="form-error-banner" id="auth-error-msg">
              <span>⚠️</span>
              <span>${Utils.escapeHtml(errorMessage)}</span>
            </div>
          ` : ''}

          ${isLogin ? this.getLoginFormHtml() : this.getRegisterFormHtml()}
        </div>
      </div>
    `;

    // Focus initial input
    const firstInput = this.modalEl.querySelector("input");
    if (firstInput) firstInput.focus();
  },

  getLoginFormHtml() {
    return `
      <form id="auth-login-form" onsubmit="Auth.handleLogin(event)">
        <div class="form-group">
          <label class="form-label" for="login-identifier">Username or Email</label>
          <input type="text" class="form-input" id="login-identifier" placeholder="e.g. alex or alex@example.com" required autocomplete="username">
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="form-label" for="login-password">Password</label>
          </div>
          <div class="input-with-icon">
            <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required autocomplete="current-password">
            <button type="button" class="password-toggle-btn" onclick="Auth.togglePasswordVisibility('login-password')">👁️</button>
          </div>
        </div>

        <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 10px;">
          <button type="submit" class="btn btn-primary" id="login-submit-btn" style="width: 100%; justify-content: center; padding: 10px 16px;">
            <span>Sign In</span>
            <span>→</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 16px; font-size: 13px; color: var(--text-muted);">
          Don't have an account? 
          <a href="javascript:void(0)" onclick="Auth.switchTab('register')" style="color: var(--primary); font-weight: 600; text-decoration: none;">Create one free</a>
        </div>
      </form>
    `;
  },

  getRegisterFormHtml() {
    return `
      <form id="auth-register-form" onsubmit="Auth.handleRegister(event)">
        <div class="form-group">
          <label class="form-label" for="reg-name">Your Full Name</label>
          <input type="text" class="form-input" id="reg-name" placeholder="e.g. Alex Rivera" required autocomplete="name">
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-username">Choose a Username</label>
          <input type="text" class="form-input" id="reg-username" placeholder="e.g. coder_alex" required autocomplete="username" minlength="3">
          <span class="form-hint">Letters, numbers, underscores only (min 3 chars).</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email Address</label>
          <input type="email" class="form-input" id="reg-email" placeholder="e.g. alex@example.com" required autocomplete="email">
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Create Password</label>
          <div class="input-with-icon">
            <input type="password" class="form-input" id="reg-password" placeholder="At least 6 characters" required minlength="6" autocomplete="new-password">
            <button type="button" class="password-toggle-btn" onclick="Auth.togglePasswordVisibility('reg-password')">👁️</button>
          </div>
        </div>

        <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 10px;">
          <button type="submit" class="btn btn-primary" id="register-submit-btn" style="width: 100%; justify-content: center; padding: 10px 16px;">
            <span>Create Free Account</span>
            <span>✓</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 16px; font-size: 13px; color: var(--text-muted);">
          Already have an account? 
          <a href="javascript:void(0)" onclick="Auth.switchTab('login')" style="color: var(--primary); font-weight: 600; text-decoration: none;">Sign In</a>
        </div>
      </form>
    `;
  },

  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById("login-identifier").value.trim();
    const password = document.getElementById("login-password").value;
    const btn = document.getElementById("login-submit-btn");

    if (!identifier || !password) {
      this.renderModalContent("Please enter both username/email and password.");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Signing In...";
    }

    try {
      const res = await API.login(identifier, password);
      if (!res.success) {
        this.renderModalContent(res.error || "Invalid username or password.");
        return;
      }

      await State.setAuthSession(res.token, res.user);
      this.closeModal();
      Utils.playSound("pass");
      Utils.showToast(`Welcome back, ${res.user.name || res.user.username}!`);
      this.renderHeaderAuth();
      
      // If currently on progress page or syllabus, re-render to show user-specific data
      Router.handleRoute();
    } catch (err) {
      this.renderModalContent(err.message || "Failed to sign in. Please try again.");
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const btn = document.getElementById("register-submit-btn");

    if (username.length < 3) {
      this.renderModalContent("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      this.renderModalContent("Password must be at least 6 characters.");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Creating Account...";
    }

    try {
      const res = await API.register(username, email, password, name);
      if (!res.success) {
        this.renderModalContent(res.error || "Failed to create account.");
        return;
      }

      await State.setAuthSession(res.token, res.user);
      this.closeModal();
      Utils.playSound("pass");
      Utils.showToast(`Account created! Welcome, ${res.user.name || res.user.username}!`);
      this.renderHeaderAuth();

      Router.handleRoute();
    } catch (err) {
      this.renderModalContent(err.message || "Failed to register. Please try again.");
    }
  },

  async logout() {
    await State.logout();
    this.renderHeaderAuth();
    Utils.showToast("You have been logged out.");
    Router.handleRoute();
  },

  renderHeaderAuth() {
    const container = document.getElementById("auth-header-container");
    if (!container) return;

    const isLoggedIn = State.isLoggedIn();
    const user = State.user;

    if (isLoggedIn && user) {
      const initial = (user.name || user.username || "U").charAt(0).toUpperCase();
      container.innerHTML = `
        <div style="position: relative;">
          <button class="user-profile-btn" id="user-menu-trigger" onclick="Auth.toggleUserDropdown()" aria-label="User menu">
            <div class="user-avatar-circle">${initial}</div>
            <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${Utils.escapeHtml(user.name || user.username)}
            </span>
            <span style="font-size: 10px; color: var(--text-muted);">▼</span>
          </button>

          <div class="user-dropdown" id="user-menu-dropdown">
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${Utils.escapeHtml(user.name || user.username)}</div>
              <div class="user-dropdown-email">@${Utils.escapeHtml(user.username || 'learner')} • ${Utils.escapeHtml(user.email || '')}</div>
            </div>
            
            <a href="#/progress" class="user-dropdown-item" onclick="Auth.closeUserDropdown()">
              <span>📊</span>
              <span>My Progress & Streaks</span>
            </a>
            <a href="#/settings" class="user-dropdown-item" onclick="Auth.closeUserDropdown()">
              <span>⚙️</span>
              <span>Account & Settings</span>
            </a>
            
            <div style="border-top: 1px solid var(--border-color); margin: 4px 0;"></div>
            
            <button class="user-dropdown-item danger" onclick="Auth.logout(); Auth.closeUserDropdown();">
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="auth-header-group">
          <button class="btn btn-outline" style="padding: 6px 12px; font-size: 13px;" onclick="Auth.openModal('login')">
            <span>Sign In</span>
          </button>
          <button class="btn btn-primary" style="padding: 6px 14px; font-size: 13px;" onclick="Auth.openModal('register')">
            <span>Register</span>
          </button>
        </div>
      `;
    }
  },

  toggleUserDropdown() {
    const dropdown = document.getElementById("user-menu-dropdown");
    if (dropdown) {
      dropdown.classList.toggle("active");
    }
  },

  closeUserDropdown() {
    const dropdown = document.getElementById("user-menu-dropdown");
    if (dropdown) {
      dropdown.classList.remove("active");
    }
  }
};

// Global click outside to close user dropdown
document.addEventListener("click", (e) => {
  const trigger = document.getElementById("user-menu-trigger");
  const dropdown = document.getElementById("user-menu-dropdown");
  if (dropdown && dropdown.classList.contains("active")) {
    if (!dropdown.contains(e.target) && !trigger?.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  }
});
