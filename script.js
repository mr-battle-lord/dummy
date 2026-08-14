const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

const modeBtn = document.getElementById("modeBtn");
modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  modeBtn.textContent = document.body.classList.contains("light") ? "●" : "◐";
});

const rows = document.querySelectorAll(".stack-row");
rows.forEach(row => {
  row.addEventListener("mouseenter", () => row.querySelector("i").textContent = "↗");
  row.addEventListener("mouseleave", () => row.querySelector("i").textContent = "↗");
});
