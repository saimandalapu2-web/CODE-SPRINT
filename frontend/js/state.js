// Client-Side State, Session, & Preference Management for CodeLearn
const State = {
  guestId: localStorage.getItem("codelearn_guest_id") || ("guest_" + Math.random().toString(36).substring(2, 9)),
  token: localStorage.getItem("codelearn_token") || null,
  user: null,
  theme: localStorage.getItem("codelearn_theme") || "ocean",
  mode: localStorage.getItem("codelearn_mode") || "light",
  fontSize: localStorage.getItem("codelearn_font_size") || "medium",
  editorFontSize: localStorage.getItem("codelearn_editor_font_size") || "14",
  animations: localStorage.getItem("codelearn_animations") !== "false",
  sound: localStorage.getItem("codelearn_sound") !== "false",
  cachedProgress: null,

  get userId() {
    return (this.user && this.user.id) ? this.user.id : this.guestId;
  },

  getUserId() {
    return this.userId;
  },

  isLoggedIn() {
    return !!(this.token && this.user);
  },

  async init() {
    localStorage.setItem("codelearn_guest_id", this.guestId);
    
    // Load cached user profile if present
    const cachedUser = localStorage.getItem("codelearn_user");
    if (cachedUser) {
      try {
        this.user = JSON.parse(cachedUser);
      } catch (e) {
        this.user = null;
      }
    }

    this.applySettings();

    // Verify session token with backend if token exists
    if (this.token) {
      try {
        const check = await API.getMe(this.token);
        if (check.valid && check.user) {
          this.user = check.user;
          localStorage.setItem("codelearn_user", JSON.stringify(this.user));
        } else {
          // Token invalid or expired
          this.token = null;
          this.user = null;
          localStorage.removeItem("codelearn_token");
          localStorage.removeItem("codelearn_user");
        }
      } catch (e) {
        console.warn("Could not verify session with server:", e);
      }
    }

    // Refresh progress from database for the active user
    await this.refreshProgress();
  },

  async setAuthSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem("codelearn_token", token);
    localStorage.setItem("codelearn_user", JSON.stringify(user));
    await this.refreshProgress();
  },

  async logout() {
    if (this.token) {
      await API.logout(this.token);
    }
    this.token = null;
    this.user = null;
    localStorage.removeItem("codelearn_token");
    localStorage.removeItem("codelearn_user");
    await this.refreshProgress();
  },

  applySettings() {
    const doc = document.documentElement;
    doc.setAttribute("data-theme", this.theme);
    doc.setAttribute("data-mode", this.mode);
    doc.setAttribute("data-font-size", this.fontSize);
    doc.setAttribute("data-editor-font-size", this.editorFontSize);
    doc.setAttribute("data-animations", this.animations ? "true" : "false");
    doc.setAttribute("data-sound", this.sound ? "true" : "false");

    const themeIcon = document.getElementById("theme-toggle-icon");
    if (themeIcon) {
      themeIcon.textContent = this.mode === "dark" ? "☀️" : "🌙";
    }
  },

  toggleMode() {
    this.mode = this.mode === "light" ? "dark" : "light";
    localStorage.setItem("codelearn_mode", this.mode);
    this.applySettings();
    Utils.playSound("click");
    Utils.showToast(`Switched to ${this.mode} mode`);
  },

  setTheme(themeName) {
    this.theme = themeName;
    localStorage.setItem("codelearn_theme", themeName);
    this.applySettings();
    Utils.playSound("click");
  },

  setFontSize(size) {
    this.fontSize = size;
    localStorage.setItem("codelearn_font_size", size);
    this.applySettings();
  },

  setEditorFontSize(size) {
    this.editorFontSize = size;
    localStorage.setItem("codelearn_editor_font_size", size);
    this.applySettings();
  },

  toggleAnimations(enabled) {
    this.animations = enabled;
    localStorage.setItem("codelearn_animations", enabled ? "true" : "false");
    this.applySettings();
  },

  toggleSound(enabled) {
    this.sound = enabled;
    localStorage.setItem("codelearn_sound", enabled ? "true" : "false");
    this.applySettings();
  },

  async refreshProgress() {
    try {
      const progress = await API.getUserProgress(this.userId);
      this.cachedProgress = progress;
      
      const streakIndicator = document.getElementById("streak-text");
      if (streakIndicator && progress.current_streak_days) {
        streakIndicator.textContent = `${progress.current_streak_days} Day${progress.current_streak_days > 1 ? 's' : ''} Streak`;
      }
      return progress;
    } catch (e) {
      console.warn("Failed to refresh user progress:", e);
      return null;
    }
  },

  resetAllData() {
    localStorage.clear();
    location.reload();
  }
};
