const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealTargets = document.querySelectorAll(
  ".section-heading, .focus-grid article, .skills-grid article, .project-card, .trouble-grid article, .timeline__item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => {
  target.classList.add("reveal");
  observer.observe(target);
});

document.querySelectorAll(".slide-viewer").forEach((viewer) => {
  const track = viewer.querySelector(".slide-track");
  const count = Number(viewer.dataset.slideCount || 0);
  const base = viewer.dataset.slideBase || "";

  if (!track || !count || !base) return;

  const fragment = document.createDocumentFragment();

  for (let index = 1; index <= count; index += 1) {
    const slide = document.createElement("article");
    slide.className = "slide-card";

    const img = document.createElement("img");
    const number = String(index).padStart(2, "0");
    img.src = `${base}${number}.png`;
    img.alt = `TUKTAK 발표자료 ${index}페이지`;
    img.loading = index <= 3 ? "eager" : "lazy";
    img.draggable = false;

    const label = document.createElement("span");
    label.textContent = `${index} / ${count}`;

    slide.append(img, label);
    fragment.append(slide);
  }

  track.append(fragment);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const stopDrag = () => {
    isDown = false;
    viewer.classList.remove("is-dragging");
  };

  viewer.addEventListener("pointerdown", (event) => {
    isDown = true;
    viewer.classList.add("is-dragging");
    viewer.setPointerCapture(event.pointerId);
    startX = event.clientX;
    scrollLeft = viewer.scrollLeft;
  });

  viewer.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    event.preventDefault();
    viewer.scrollLeft = scrollLeft - (event.clientX - startX);
  });

  viewer.addEventListener("pointerup", stopDrag);
  viewer.addEventListener("pointercancel", stopDrag);
  viewer.addEventListener("pointerleave", stopDrag);
});
