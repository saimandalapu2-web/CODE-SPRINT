// Interactive Multi-Language Compiler & SQL Playground for CODE SPRINT
const CompilerView = {
  currentLang: "python",
  starterTemplates: {
    python: `# CODE SPRINT Interactive Python 3 Environment
def solve():
    print("Welcome to CODE SPRINT Python Compiler!")
    numbers = [1, 2, 3, 4, 5]
    squares = [x**2 for x in numbers]
    print(f"Original: {numbers}")
    print(f"Squares:  {squares}")

solve()
`,
    java: `// CODE SPRINT Java Environment
public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to CODE SPRINT Java Compiler!");
        int a = 15;
        int b = 25;
        int sum = a + b;
        System.out.println("Sum of " + a + " + " + b + " = " + sum);
    }
}
`,
    c: `/* CODE SPRINT C Environment */
#include <stdio.h>

int main() {
    printf("Welcome to CODE SPRINT C Compiler!\\n");
    int arr[] = {10, 20, 30, 40, 50};
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    printf("Sum of array elements: %d\\n", sum);
    return 0;
}
`,
    cpp: `// CODE SPRINT C++ Environment
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "Welcome to CODE SPRINT C++ Compiler!" << std::endl;
    std::vector<int> nums = {5, 10, 15, 20};
    int total = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Total vector sum: " << total << std::endl;
    return 0;
}
`,
    javascript: `// CODE SPRINT JavaScript (Node.js) Environment
function main() {
    console.log("Welcome to CODE SPRINT JavaScript Engine!");
    const items = ["Algorithm", "Data Structure", "Full Stack Engine"];
    items.forEach((item, idx) => {
        console.log(\`\${idx + 1}. \${item}\`);
    });
}

main();
`,
    sql: `-- SQLite Playground (Pre-populated 'students' table)
-- Available columns: id, name, department, gpa, semester, city

SELECT department, COUNT(*) as student_count, AVG(gpa) as average_gpa
FROM students
GROUP BY department
ORDER BY average_gpa DESC;
`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 24px; text-align: center; background: #f8fafc; color: #0f172a; }
    h1 { color: #2563eb; }
    .card { background: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 450px; margin: 0 auto; }
    button { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>CODE SPRINT Live Preview</h1>
    <p>HTML & CSS instant live rendering playground.</p>
    <button onclick="alert('Hello from CODE SPRINT!')">Click Me</button>
  </div>
</body>
</html>
`
  },

  async render(container, initialLang = "python") {
    this.currentLang = initialLang || "python";

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- HEADER -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 26px;">Interactive Multi-Language Compiler</h1>
            <p style="margin-top: 4px; color: var(--text-muted);">Execute real code across 7 languages powered by our native runtime execution backend.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="CompilerView.resetCode()">
              <span>🔄 Reset</span>
            </button>
            <button class="btn btn-primary" id="btn-run-compiler" onclick="CompilerView.runCode()">
              <span>⚡ Run Code (Ctrl+Enter)</span>
            </button>
          </div>
        </div>

        <!-- LANGUAGE SELECTOR BAR -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; overflow-x: auto; flex-wrap: wrap;">
          <button class="btn ${this.currentLang === 'python' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('python')">🐍 Python 3</button>
          <button class="btn ${this.currentLang === 'java' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('java')">☕ Java</button>
          <button class="btn ${this.currentLang === 'c' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('c')">⚙️ C</button>
          <button class="btn ${this.currentLang === 'cpp' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('cpp')">⚡ C++</button>
          <button class="btn ${this.currentLang === 'javascript' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('javascript')">🟨 JavaScript</button>
          <button class="btn ${this.currentLang === 'sql' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('sql')">🗄️ SQL Playground</button>
          <button class="btn ${this.currentLang === 'html' ? 'btn-primary' : 'btn-secondary'}" onclick="CompilerView.switchLanguage('html')">🌐 HTML / CSS</button>
        </div>

        <!-- SQL HELPER PREVIEWS IF SQL ACTIVE -->
        ${this.currentLang === 'sql' ? `
          <div class="card" style="background: var(--bg-subtle); padding: 14px 20px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <strong>Pre-loaded Schema:</strong> <code>students(id, name, department, gpa, semester, city)</code>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="CompilerView.loadSampleQuery('SELECT * FROM students LIMIT 5;')">Sample 1 (Limit 5)</button>
                <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="CompilerView.loadSampleQuery('SELECT name, gpa FROM students WHERE gpa >= 3.8 ORDER BY gpa DESC;')">Sample 2 (GPA >= 3.8)</button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- EDITOR & OUTPUT GRID -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
          <!-- CODE EDITOR PANE -->
          <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div class="code-header" style="border-radius: 0;">
              <span>SOURCE CODE (${this.currentLang.toUpperCase()})</span>
              <div style="display: flex; gap: 6px;">
                <button class="copy-btn" onclick="Utils.copyText(document.getElementById('compiler-textarea').value)">Copy</button>
              </div>
            </div>
            <textarea id="compiler-textarea" class="textarea textarea-code" style="flex: 1; min-height: 380px; border: none; border-radius: 0; resize: none; font-family: var(--font-mono); font-size: 14px; line-height: 1.5; padding: 16px;" placeholder="Write your code here...">${Utils.escapeHtml(this.starterTemplates[this.currentLang] || '')}</textarea>

            <!-- STDIN DRAWER -->
            <div style="border-top: 1px solid var(--border-color); background: var(--bg-subtle); padding: 10px 14px;">
              <details>
                <summary style="font-size: 12px; font-weight: 600; color: var(--text-muted); cursor: pointer;">Custom Standard Input (stdin)</summary>
                <textarea id="compiler-stdin" class="textarea textarea-code" style="min-height: 50px; font-size: 12px; margin-top: 6px;" placeholder="Enter input values passed to stdin..."></textarea>
              </details>
            </div>
          </div>

          <!-- OUTPUT PANE -->
          <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div class="code-header" style="border-radius: 0; display: flex; justify-content: space-between;">
              <span id="compiler-output-header">EXECUTION OUTPUT</span>
              <span id="compiler-metrics" style="font-size: 11px; color: var(--text-muted);">Ready</span>
            </div>

            ${this.currentLang === 'html' ? `
              <iframe id="compiler-html-preview" style="flex: 1; min-height: 380px; width: 100%; border: none; background: #ffffff;" sandbox="allow-scripts"></iframe>
            ` : `
              <div id="compiler-console" class="code-block" style="flex: 1; min-height: 380px; border-radius: 0; margin: 0; white-space: pre-wrap; font-family: var(--font-mono); font-size: 13px; color: var(--text-main); overflow-y: auto;">
                Click "Run Code" or press Ctrl+Enter to execute program on native backend.
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    // Bind keyboard shortcut Ctrl+Enter
    const textarea = document.getElementById("compiler-textarea");
    if (textarea) {
      textarea.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          this.runCode();
        }
      });
    }

    if (this.currentLang === 'html') {
      this.updateHtmlPreview();
    }
  },

  switchLanguage(lang) {
    this.currentLang = lang;
    this.render(document.getElementById("app-root"), lang);
  },

  resetCode() {
    const textarea = document.getElementById("compiler-textarea");
    if (textarea && this.starterTemplates[this.currentLang]) {
      textarea.value = this.starterTemplates[this.currentLang];
      if (this.currentLang === 'html') this.updateHtmlPreview();
      Utils.showToast("Code reset to default template", "info");
    }
  },

  loadSampleQuery(query) {
    const textarea = document.getElementById("compiler-textarea");
    if (textarea) {
      textarea.value = query;
      this.runCode();
    }
  },

  loadAndRunCode(lang, encodedCode) {
    const code = decodeURIComponent(encodedCode);
    location.hash = `#/compiler?lang=${lang}`;
    setTimeout(() => {
      const textarea = document.getElementById("compiler-textarea");
      if (textarea) {
        textarea.value = code;
        this.runCode();
      }
    }, 100);
  },

  updateHtmlPreview() {
    const textarea = document.getElementById("compiler-textarea");
    const preview = document.getElementById("compiler-html-preview");
    if (preview && textarea) {
      preview.srcdoc = textarea.value;
    }
  },

  async runCode() {
    const textarea = document.getElementById("compiler-textarea");
    const stdinEl = document.getElementById("compiler-stdin");
    const consoleEl = document.getElementById("compiler-console");
    const metricsEl = document.getElementById("compiler-metrics");
    const runBtn = document.getElementById("btn-run-compiler");

    if (!textarea) return;

    if (this.currentLang === 'html') {
      this.updateHtmlPreview();
      Utils.showToast("Preview updated", "success");
      return;
    }

    const code = textarea.value;
    const stdin = stdinEl ? stdinEl.value : "";

    if (!code.trim()) {
      Utils.showToast("Please enter code to execute", "danger");
      return;
    }

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.innerHTML = '<span>⚡ Compiling...</span>';
    }
    if (consoleEl) {
      consoleEl.innerHTML = '<span style="color: var(--text-muted);">Executing on native runtime backend...</span>';
    }
    if (metricsEl) metricsEl.textContent = "Running...";

    try {
      const startTime = Date.now();
      const res = await API.executeCode(this.currentLang, code, stdin);
      const elapsed = Date.now() - startTime;

      if (res.success) {
        const outText = (res.output !== undefined ? res.output : res.stdout) || "(Program executed successfully with no stdout output)";
        if (consoleEl) {
          consoleEl.innerHTML = `<span style="color: var(--text-main); white-space: pre-wrap; display: block;">${Utils.escapeHtml(outText)}</span>`;
        }
        if (metricsEl) {
          const timeMs = res.execution_time_ms !== undefined ? res.execution_time_ms : (res.execution_time || elapsed);
          metricsEl.innerHTML = `<span style="color: var(--success); font-weight: 600;">✓ Exit Code 0 • ${timeMs}ms</span>`;
        }
        Utils.playSound("correct");
      } else {
        const errText = res.error || res.stderr || res.output || "Execution failed.";
        if (consoleEl) {
          consoleEl.innerHTML = `
            <div style="color: var(--danger); font-weight: 700; margin-bottom: 6px;">Execution Error:</div>
            <div style="color: var(--danger); white-space: pre-wrap; font-family: var(--font-mono);">${Utils.escapeHtml(errText)}</div>
            ${res.output && res.output !== errText ? `<div style="margin-top: 10px; color: var(--text-muted); white-space: pre-wrap; border-top: 1px dashed var(--border-color); padding-top: 6px;">Output before error:\n${Utils.escapeHtml(res.output)}</div>` : ''}
          `;
        }
        if (metricsEl) {
          metricsEl.innerHTML = `<span style="color: var(--danger); font-weight: 600;">✗ Failed</span>`;
        }
        Utils.playSound("incorrect");
      }
    } catch (e) {
      if (consoleEl) {
        consoleEl.innerHTML = `<span style="color: var(--danger);">Network / Server Error: ${Utils.escapeHtml(e.message)}</span>`;
      }
      if (metricsEl) metricsEl.textContent = "Error";
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.innerHTML = '<span>⚡ Run Code (Ctrl+Enter)</span>';
      }
    }
  }
};
