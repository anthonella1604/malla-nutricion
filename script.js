// Utilidad para seleccionar elementos
const $ = (query, ctx = document) => Array.from(ctx.querySelectorAll(query));

const courses = $(".course");
const totalCountSpan = document.getElementById("total-count");
const completedCountSpan = document.getElementById("completed-count");
const yearTabs = $(".year-tab");

const infoTitle = document.getElementById("info-title");
const infoSem = document.getElementById("info-sem");
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

    courseMap[id] = {
        id,
        name,
        sem,
        prereqs,
        opens,
        completed: false,
        element: btn
    };
});

// Actualizar contador
function updateCounter() {
    const total = Object.keys(courseMap).length;
    const completed = Object.values(courseMap).filter(c => c.completed).length;

    totalCountSpan.textContent = total;
    completedCountSpan.textContent = completed;
}

// Mostrar información del curso
function showCourseInfo(id) {
    const c = courseMap[id];

    infoTitle.textContent = c.name;
    infoSem.textContent = "Semestre: " + c.sem;
    infoStatus.textContent = c.completed ? "Estado: Completado 💖" : "Estado: No completado";

    infoPrereqs.textContent = c.prereqs.length > 0 ? c.prereqs.join(", ") : "Ninguno";
    infoOpens.textContent = c.opens.length > 0 ? c.opens.join(", ") : "Ninguno";
}

// Marcar curso como completado
courses.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const c = courseMap[id];

        c.completed = !c.completed;
        btn.classList.toggle("done");

        showCourseInfo(id);
        updateCounter();
    });
});

// Tabs de años
yearTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const year = tab.dataset.year;
        document.querySelectorAll(".semester").forEach(sec => {
            sec.style.display = sec.dataset.year === year ? "block" : "none";
        });

        yearTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
    });
});

// Botón de reset
resetBtn.addEventListener("click", () => {
    Object.values(courseMap).forEach(c => {
        c.completed = false;
        c.element.classList.remove("done");
    });

    updateCounter();
});
