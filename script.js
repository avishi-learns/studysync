let subjects = [];

document.addEventListener("DOMContentLoaded", () => {
  showView("dashboard");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      showView(link.dataset.section);
    });
  });
});

function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav-link").forEach(l => {
    l.classList.toggle("active", l.dataset.section === id);
  });
}

function addSubject() {
  const input = document.getElementById("subjectInput");
  const name = input.value.trim();
  if (!name) return;

  subjects.push({ id: Date.now(), name, done: 0, total: 10 });
  input.value = "";
  renderSubjects();
  updateProgress();
}

function renderSubjects() {
  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";

  subjects.forEach(s => {
    container.innerHTML += `
      <div class="card">
        <h3>${s.name}</h3>
        <p>${s.done}/${s.total}</p>
        <button onclick="inc(${s.id})">+ Progress</button>
      </div>
    `;
  });

  renderProgressPage();
}

function inc(id) {
  const s = subjects.find(x => x.id === id);
  if (s && s.done < s.total) {
    s.done++;
    renderSubjects();
    updateProgress();
  }
}

function updateProgress() {
  const bar = document.getElementById("overallProgress");
  const text = document.getElementById("overallText");

  if (subjects.length === 0) {
    bar.style.width = "0%";
    text.textContent = "0%";
    return;
  }

  let d = 0, t = 0;
  subjects.forEach(s => { d += s.done; t += s.total; });

  const p = Math.round((d / t) * 100);
  bar.style.width = p + "%";
  text.textContent = p + "%";
}

function renderProgressPage() {
  const container = document.getElementById("subjectProgress");
  container.innerHTML = "";

  subjects.forEach(s => {
    const p = Math.round((s.done / s.total) * 100);
    container.innerHTML += `
      <div class="card">
        <h4>${s.name}</h4>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${p}%"></div>
        </div>
        ${p}%
      </div>
    `;
  });
}

const themeBtn = document.getElementById("themeToggle");
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent =
    document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
};