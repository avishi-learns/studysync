/* ---------- NAVIGATION ---------- */
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.dataset.section;
    sections.forEach(sec => {
      sec.style.display = sec.id === target ? "block" : "none";
    });
  });
});

/* Default view */
sections.forEach(sec => sec.style.display = "none");
document.getElementById("dashboard").style.display = "block";

/* ---------- MEMORY ---------- */
function saveData() {
  const subjects = [];

  document.querySelectorAll(".subject").forEach(subject => {
    const name = subject.querySelector("h4").childNodes[0].nodeValue.trim();
    const tasks = [];

    subject.querySelectorAll(".task").forEach(task => {
      tasks.push({
        text: task.querySelector("span").innerText,
        done: task.querySelector(".task-check").checked
      });
    });

    subjects.push({ name, tasks });
  });

  localStorage.setItem("studysync-data", JSON.stringify(subjects));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("studysync-data"));
  if (!data) return;

  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";

  data.forEach(subject => {
    const card = document.createElement("section");
    card.className = "card subject";

    card.innerHTML = `
      <h4>${subject.name}</h4>
      <div class="tasks"></div>
      <button onclick="addTask(this)">+ Add Topic</button>
    `;

    const tasksDiv = card.querySelector(".tasks");

    subject.tasks.forEach(t => {
      const task = document.createElement("div");
      task.className = "task";
      task.innerHTML = `
        <input type="checkbox" class="task-check" ${t.done ? "checked" : ""}>
        <span contenteditable="true">${t.text}</span>
        <button onclick="deleteTask(this)">🗑</button>
      `;
      tasksDiv.appendChild(task);
    });

    container.appendChild(card);
  });

  updateProgress();
}

/* ---------- SUBJECT & TASK ---------- */
function addSubject() {
  const input = document.getElementById("subjectInput");
  if (!input.value.trim()) return;

  const card = document.createElement("section");
  card.className = "card subject";
  card.innerHTML = `
    <h4>${input.value}</h4>
    <div class="tasks"></div>
    <button onclick="addTask(this)">+ Add Topic</button>
  `;

  document.getElementById("subjectsContainer").appendChild(card);
  input.value = "";
  saveData();
}

function addTask(btn) {
  const tasksDiv = btn.previousElementSibling;
  const task = document.createElement("div");

  task.className = "task";
  task.innerHTML = `
    <input type="checkbox" class="task-check">
    <span contenteditable="true">New Topic</span>
    <button onclick="deleteTask(this)">🗑</button>
  `;

  tasksDiv.appendChild(task);
  saveData();
}

function deleteTask(btn) {
  btn.parentElement.remove();
  saveData();
}

/* ---------- PROGRESS ---------- */
function updateProgress() {
  const all = document.querySelectorAll(".task-check");
  const done = document.querySelectorAll(".task-check:checked");

  const percent = all.length === 0 ? 0 : Math.round((done.length / all.length) * 100);
  document.getElementById("progressText").innerText = percent + "%";
  document.getElementById("progressFill").style.width = percent + "%";
}

/* ---------- AI PLANNER ---------- */
function generatePlan() {
  const hours = parseInt(document.getElementById("studyTime").value);
  if (!hours) return;

  const out = document.getElementById("planOutput");
  out.innerHTML = "";

  document.querySelectorAll(".subject").forEach(subject => {
    const name = subject.querySelector("h4").innerText;
    const pending = subject.querySelectorAll(".task-check:not(:checked)").length;

    if (pending && hours > 0) {
      out.innerHTML += `<li>📘 ${name}: ${Math.min(pending, hours)} topic(s)</li>`;
    }
  });
}

document.addEventListener("change", e => {
  if (e.target.classList.contains("task-check")) {
    updateProgress();
    saveData();
  }
});

loadData();
