const header = document.querySelector(".site-header");
const stages = document.querySelectorAll(".stage");

function onScroll() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

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
