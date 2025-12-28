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
        done: task.querySelect