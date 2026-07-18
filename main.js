const header = document.querySelector(".site-header");
const stages = document.querySelectorAll(".stage");
const dropdowns = document.querySelectorAll(".nav-dropdown");

function onScroll() {
  if (!header) return;
  if (document.body.classList.contains("page-inner")) {
    header.classList.add("is-scrolled");
    return;
  }
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeDropdowns(except) {
  dropdowns.forEach((dropdown) => {
    if (dropdown === except) return;
    dropdown.classList.remove("is-open");
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains("is-open");
    closeDropdowns();
    dropdown.classList.toggle("is-open", willOpen);
    toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
});

document.addEventListener("click", () => closeDropdowns());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDropdowns();
});

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.25 }
  );
  stages.forEach((stage) => io.observe(stage));
} else {
  stages.forEach((stage) => stage.classList.add("is-in"));
}
