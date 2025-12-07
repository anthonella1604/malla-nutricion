// Utilidad: convertir NodeList a array
const $ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

const courses = $(".course");
const totalCountSpan = document.getElementById("total-count");
const completedCountSpan = document.getElementById("completed-count");
const yearTabs = $(".year-tab");

const infoTitle = document.getElementById("info-title");
const infoSem = document.getElementById("info-semester");
const infoStatus = document.getElementById("info-status");
const infoPrereqs = document.getElementById("info-prereqs");
const infoOpens = document.getElementById("info-opens");
const resetBtn = document.getElementById("reset-btn");

// Construimos mapa de cursos
const courseMap = {};
courses.forEach(btn => {
  const id = btn.dataset.id;
  const name = btn.textContent.trim();
  const sem = btn.dataset.semester;
  const prereqs = (btn.dataset.prereqs || "")
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const opens = (btn.dataset.opens || "")
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  courseMap[id] = { id, name, sem, prereqs, opens, done: false, btn };
});

// Actualizar pantalla
function updateUI() {
  let total = courses.length;
  let completed = 0;

  for (let id in courseMap) {
    const c = courseMap[id];
    const button = c.btn;

    button.classList.remove("done", "locked", "unlocked");

    if (c.done) {
      button.classList.add("done");
      completed++;
    } else if (c.prereqs.length === 0 || c.prereqs.every(p => courseMap[p]?.done)) {
      button.classList.add("unlocked");
    } else {
      button.classList.add("locked");
    }
  }

  totalCountSpan.textContent = total;
  completedCountSpan.textContent = completed;
}

// Click en curso
courses.forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const course = courseMap[id];

    // Mostrar info
    infoTitle.textContent = course.name;
    infoSem.textContent = course.sem;
    infoStatus.textContent = course.done ? "Completado" : "Pendiente";
    infoPrereqs.textContent =
      course.prereqs.length > 0
        ? course.prereqs.map(p => courseMap[p]?.name).join(", ")
        : "Sin requisitos";
    infoOpens.textContent =
      course.opens.length > 0
        ? course.opens.map(o => courseMap[o]?.name).join(", ")
        : "No habilita cursos";

    // Alternar estado
    course.done = !course.done;
    updateUI();
  });
});

// Cambiar semestre
yearTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    yearTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const year = tab.dataset.year;

    $(".year-block").forEach(block => {
      block.style.display = block.dataset.year === year ? "grid" : "none";
    });
  });
});

// Botón reset
resetBtn.addEventListener("click", () => {
  for (let id in courseMap) {
    courseMap[id].done = false;
  }
  updateUI();
});

// Inicializar
updateUI();
