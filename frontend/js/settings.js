// Settings & Preferences View Component
const SettingsView = {
  render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 28px; max-width: 800px; margin: 0 auto;">
        <!-- HEADER -->
        <div>
          <h1>Settings & Preferences</h1>
          <p style="margin-top: 4px;">Customize appearance, themes, font scales, and local storage data.</p>
        </div>

        <!-- APPEARANCE & THEMES -->
        <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
          <h2>Theme & Appearance</h2>

          <!-- THEME SELECTOR -->
          <div>
            <label style="font-size: 13px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px;">Color Accent Theme:</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
              <button class="btn ${State.theme === 'ocean' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.changeTheme('ocean')">🌊 Ocean Blue</button>
              <button class="btn ${State.theme === 'purple' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.changeTheme('purple')">🔮 Purple Violet</button>
              <button class="btn ${State.theme === 'emerald' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.changeTheme('emerald')">🌲 Emerald Teal</button>
              <button class="btn ${State.theme === 'sunset' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.changeTheme('sunset')">🌅 Sunset Orange</button>
              <button class="btn ${State.theme === 'midnight' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.changeTheme('midnight')">🌌 Midnight Cyan</button>
            </div>
          </div>

          <!-- LIGHT / DARK MODE -->
          <div>
            <label style="font-size: 13px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px;">Color Mode:</label>
            <div style="display: flex; gap: 10px;">
              <button class="btn ${State.mode === 'light' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setMode('light')">☀️ Light Mode</button>
              <button class="btn ${State.mode === 'dark' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setMode('dark')">🌙 Dark Mode</button>
            </div>
          </div>
        </div>

        <!-- ACCESSIBILITY & SIZING -->
        <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
          <h2>Typography & Editor</h2>

          <!-- UI FONT SIZE -->
          <div>
            <label style="font-size: 13px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px;">UI Text Scale:</label>
            <div style="display: flex; gap: 10px;">
              <button class="btn ${State.fontSize === 'small' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setFontSize('small')">Small (14px)</button>
              <button class="btn ${State.fontSize === 'medium' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setFontSize('medium')">Default (16px)</button>
              <button class="btn ${State.fontSize === 'large' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setFontSize('large')">Large (18px)</button>
            </div>
          </div>

          <!-- CODE EDITOR FONT SIZE -->
          <div>
            <label style="font-size: 13px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px;">Code Editor Font Size:</label>
            <div style="display: flex; gap: 10px;">
              <button class="btn ${State.editorFontSize === '12' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setEditorFontSize('12')">12px</button>
              <button class="btn ${State.editorFontSize === '14' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setEditorFontSize('14')">14px</button>
              <button class="btn ${State.editorFontSize === '16' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setEditorFontSize('16')">16px</button>
              <button class="btn ${State.editorFontSize === '18' ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.setEditorFontSize('18')">18px</button>
            </div>
          </div>
        </div>

        <!-- SOUND & ANIMATIONS -->
        <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
          <h2>Audio & Animations</h2>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Feedback Sound Effects</div>
              <div style="font-size: 12px; color: var(--text-muted);">Audio chimes for correct/incorrect answers and completions</div>
            </div>
            <button class="btn ${State.sound ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.toggleSound()">
              <span>${State.sound ? '🔊 Enabled' : '🔇 Muted'}</span>
            </button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Smooth UI Animations</div>
              <div style="font-size: 12px; color: var(--text-muted);">Enable or reduce UI motion transitions</div>
            </div>
            <button class="btn ${State.animations ? 'btn-primary' : 'btn-secondary'}" onclick="SettingsView.toggleAnimations()">
              <span>${State.animations ? '✨ Enabled' : '🚫 Reduced Motion'}</span>
            </button>
          </div>
        </div>

        <!-- ACCOUNT & PROFILE SECTION -->
        <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
          <h2>User Account & Sync</h2>
          ${State.isLoggedIn() && State.user ? `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div class="user-avatar-circle" style="width: 44px; height: 44px; font-size: 18px;">
                  ${(State.user.name || State.user.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style="font-size: 16px; font-weight: 700;">${Utils.escapeHtml(State.user.name || State.user.username)}</div>
                  <div style="font-size: 13px; color: var(--text-muted);">@${Utils.escapeHtml(State.user.username || '')} • ${Utils.escapeHtml(State.user.email || '')}</div>
                  <div style="font-size: 11px; color: var(--text-subtle); margin-top: 2px;">User ID: ${State.user.id}</div>
                </div>
              </div>
              <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);" onclick="Auth.logout()">
                <span>🚪 Sign Out</span>
              </button>
            </div>
          ` : `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <div>
                <div style="font-weight: 600; font-size: 14px;">Guest Session Active</div>
                <div style="font-size: 12px; color: var(--text-muted);">Your progress is currently saved in local cache. Sign in or register to persist across devices.</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-outline" onclick="Auth.openModal('login')">Sign In</button>
                <button class="btn btn-primary" onclick="Auth.openModal('register')">Register Free</button>
              </div>
            </div>
          `}
        </div>

        <!-- DATA MANAGEMENT -->
        <div class="card" style="border-left: 4px solid var(--danger); display: flex; flex-direction: column; gap: 12px;">
          <h2 style="color: var(--danger);">Reset Local Storage & Progress</h2>
          <p style="font-size: 13px;">Clear all local cache, user preferences, and start fresh.</p>
          <button class="btn btn-secondary" style="border-color: var(--danger); color: var(--danger); width: fit-content;" onclick="SettingsView.confirmReset()">
            <span>⚠️ Reset All Local Data</span>
          </button>
        </div>
      </div>
    `;
  },

  changeTheme(theme) {
    State.setTheme(theme);
    this.render(document.getElementById("app-root"));
  },

  setMode(mode) {
    State.mode = mode;
    localStorage.setItem("codelearn_mode", mode);
    State.applySettings();
    Utils.playSound("click");
    this.render(document.getElementById("app-root"));
  },

  setFontSize(size) {
    State.setFontSize(size);
    this.render(document.getElementById("app-root"));
  },

  setEditorFontSize(size) {
    State.setEditorFontSize(size);
    this.render(document.getElementById("app-root"));
  },

  toggleSound() {
    State.toggleSound(!State.sound);
    Utils.playSound("click");
    this.render(document.getElementById("app-root"));
  },

  toggleAnimations() {
    State.toggleAnimations(!State.animations);
    Utils.playSound("click");
    this.render(document.getElementById("app-root"));
  },

  confirmReset() {
    if (confirm("Are you sure you want to reset all local data and preferences?")) {
      State.resetAllData();
    }
  }
};
