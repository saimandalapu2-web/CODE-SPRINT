// Client-Side Hash Router for CODE SPRINT
const Router = {
  routes: {
    "": () => HomeView.render(Router.getRoot()),
    "languages": () => SyllabusView.renderLanguages(Router.getRoot()),
    "syllabus": (lang) => SyllabusView.renderSyllabus(Router.getRoot(), lang || "python"),
    "lesson": (topicId) => LessonView.render(Router.getRoot(), topicId),
    "worksheet": (topicId, qId) => {
      const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
      const questionId = qId || urlParams.get("q");
      WorksheetView.render(Router.getRoot(), topicId, questionId);
    },
    "quiz": (topicId) => QuizView.render(Router.getRoot(), topicId),
    "compiler": (param) => {
      const urlParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
      const lang = urlParams.get("lang") || param || "python";
      CompilerView.render(Router.getRoot(), lang);
    },
    "challenges": (chId) => {
      if (chId) {
        ChallengesView.renderDetail(Router.getRoot(), chId);
      } else {
        ChallengesView.renderList(Router.getRoot());
      }
    },
    "interview": () => InterviewView.render(Router.getRoot()),
    "progress": () => ProgressView.render(Router.getRoot()),
    "settings": () => SettingsView.render(Router.getRoot()),
    "login": () => {
      Auth.openModal("login");
      HomeView.render(Router.getRoot());
    },
    "register": () => {
      Auth.openModal("register");
      HomeView.render(Router.getRoot());
    }
  },

  getRoot() {
    return document.getElementById("app-root");
  },

  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const rawHash = window.location.hash.slice(1);
    const cleanHash = rawHash.split("?")[0].replace(/^\/+|\/+$/g, "");
    const parts = cleanHash.split("/");
    const mainRoute = parts[0] || "";
    const param1 = parts[1] || null;
    const param2 = parts[2] || null;

    this.updateActiveNav(mainRoute);
    window.scrollTo(0, 0);

    const handler = this.routes[mainRoute];
    if (handler) {
      handler(param1, param2);
    } else {
      HomeView.render(this.getRoot());
    }
  },

  updateActiveNav(mainRoute) {
    const routeKey = mainRoute || "home";

    document.querySelectorAll(".nav-link").forEach(link => {
      const target = link.getAttribute("data-route");
      if (target === routeKey || (routeKey === "syllabus" && target === "languages") || (routeKey === "lesson" && target === "languages") || (routeKey === "worksheet" && target === "languages")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    document.querySelectorAll(".mobile-nav-item").forEach(item => {
      const target = item.getAttribute("data-route");
      if (target === routeKey || (routeKey === "syllabus" && target === "languages") || (routeKey === "lesson" && target === "languages") || (routeKey === "worksheet" && target === "languages")) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
};
