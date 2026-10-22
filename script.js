const navToggle = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".primary-nav");

navToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const track = document.querySelector(".carousel-track");
const cards = Array.from(track.children);
const dots = document.querySelector(".carousel-dots");
const slideNumber = document.querySelector("#slide-number");
let currentSlide = 0;
let carouselTimer;

function cardsPerView() {
  if (window.innerWidth <= 720) return 1;
  if (window.innerWidth <= 1000) return 2;
  return 3;
}

function pageCount() {
  return Math.ceil(cards.length / cardsPerView());
}

function buildDots() {
  dots.innerHTML = "";
  for (let index = 0; index < pageCount(); index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show disciplines ${index * cardsPerView() + 1} to ${Math.min((index + 1) * cardsPerView(), cards.length)}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.append(dot);
  }
}

function showSlide(index) {
  const pages = pageCount();
  currentSlide = (index + pages) % pages;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  [...dots.children].forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentSlide));
  slideNumber.textContent = String(currentSlide * cardsPerView() + 1).padStart(2, "0");
}

function resetAutoplay() {
  window.clearInterval(carouselTimer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
  }
}

document.querySelectorAll("[data-carousel-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    showSlide(currentSlide + Number(button.dataset.carouselDirection));
    resetAutoplay();
  });
});

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    currentSlide = 0;
    buildDots();
    showSlide(0);
  }, 180);
});

buildDots();
showSlide(0);
resetAutoplay();

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll("[data-lightbox-image]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.lightboxImage;
    lightboxImage.alt = button.dataset.lightboxAlt;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelector("#year").textContent = new Date().getFullYear();
