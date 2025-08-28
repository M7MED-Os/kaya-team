//! Nav In Mobile

const hamburger = document.querySelector(".hamburger");
const navigation = document.querySelector(".navigation");
const main = document.querySelector(".main");

hamburger.addEventListener("click", function (event) {
  event.stopPropagation();
  hamburger.classList.toggle("active");
  navigation.classList.toggle("active");
  main.classList.toggle("active");
});

document.addEventListener("click", function () {
  if (hamburger.classList.contains("active")) {
    hamburger.classList.remove("active");
    navigation.classList.remove("active");
    main.classList.remove("active");
  }
});

//! Reveals

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    } else {
      entry.target.classList.remove("active");
    }
  });
});

reveals.forEach((el) => observer.observe(el));

//! Go To Top

const goTopBtn = document.getElementById("go-to-top");
const SHOW_AFTER = 700;

const onScroll = () => {
  if (window.scrollY >= SHOW_AFTER) {
    goTopBtn.classList.add("show");
  } else {
    goTopBtn.classList.remove("show");
  }
};

window.addEventListener("scroll", onScroll, { passive: true });

goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Subject Content

document.addEventListener("DOMContentLoaded", () => {
  const slugify = (str) =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  const esc = (s) =>
    String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  document.querySelectorAll(".subject").forEach((subject) => {
    const btn = subject.querySelector(".view-btn");
    const panel = subject.querySelector(".lectures");
    const headingEl = subject.querySelector(".heading");
    if (!btn || !panel || !headingEl) return;

    const dataJson = subject.dataset.json
      ? subject.dataset.json.trim()
      : `data/subjects/${slugify(headingEl.textContent)}.json`;

    fetch(dataJson)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        const lectures = Array.isArray(data.lectures) ? data.lectures : [];
        if (lectures.length === 0) {
          panel.innerHTML = `<p class="empty">No lectures yet.</p>`;
          return;
        }

        panel.innerHTML = lectures
          .map((lec) => {
            const video = lec.video
              ? `<a href="${esc(
                  lec.video
                )}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-link icon"></i> Link</a>`
              : `<span class="disabled"><i class="fa-regular fa-clock icon"></i> Link</span>`;
            const quiz = lec.quiz
              ? `<a href="${esc(lec.quiz)}" target="_blank">
                  <i class="fa-solid fa-question-circle icon"></i> Questions
                </a>`
              : `<span class="disabled"><i class="fa-regular fa-clock icon"></i> Questions</span>`;
            const file = lec.file
              ? `<a href="${esc(
                  lec.file
                )}" target="_blank"><i class="fa-solid fa-file-pdf icon"></i> File</a>`
              : `<span class="disabled"><i class="fa-regular fa-clock icon"></i> File</span>`;
            const summary = lec.summary
              ? `<a href="${esc(
                  lec.summary
                )}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-book-open icon"></i> Summary</a>`
              : `<span class="disabled"><i class="fa-regular fa-clock icon"></i> Summary</span>`;

            return `
            <div class="lecture">
              <h4 class="heading">${esc(lec.title)}</h4>
              <div class="details">
                ${video}
                ${quiz}
                ${file}
                ${summary}
              </div>
            </div>
          `;
          })
          .join("");

        if (panel.classList.contains("show")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      })
      .catch((err) => {
        console.warn("Could not load subject data:", dataJson, err);
        if (!panel.innerHTML.trim()) {
          panel.innerHTML = `<p class="empty">No lectures available (data file missing or error).</p>`;
        }
      });

    btn.setAttribute("aria-expanded", "false");

    const openPanel = () => {
      panel.classList.add("show");
      panel.style.maxHeight = panel.scrollHeight + "px";
      btn.textContent = "Hide Content";
      btn.setAttribute("aria-expanded", "true");
    };

    const closePanel = () => {
      panel.classList.remove("show");
      panel.style.maxHeight = null;
      btn.textContent = "View Content";
      btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", () => {
      if (panel.classList.contains("show")) closePanel();
      else openPanel();
    });

    const ro = new ResizeObserver(() => {
      if (panel.classList.contains("show")) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
    ro.observe(panel);
  });
});

// Version

const version = document.querySelector(".v");
version.innerHTML = `v1.0.0`;
