// ============================================================
// MEDIA UNIT PORTFOLIO CONFIG
// Set your official inquiry email here before publishing.
// Example: const INQUIRY_EMAIL = "mediaunit@example.com";
// ============================================================
const INQUIRY_EMAIL = "";

const header = document.getElementById("siteHeader");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("siteNav");
const year = document.getElementById("year");
const cursorGlow = document.querySelector(".cursor-glow");
const form = document.getElementById("inquiryForm");
const formStatus = document.getElementById("formStatus");

if (year) year.textContent = new Date().getFullYear();

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 26);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuBtn?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0.02 });
sections.forEach((section) => sectionObserver.observe(section));

if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    const offset = (header?.offsetHeight || 70) + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const type = String(data.get("type") || "").trim();
  const subject = String(data.get("subject") || "").trim();
  const message = String(data.get("message") || "").trim();

  const emailSubject = `Media Unit Inquiry — ${subject}`;
  const emailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone || "Not provided"}`,
    `Inquiry Type: ${type}`,
    `Event / Project: ${subject}`,
    "",
    "Message:",
    message
  ].join("\n");

  const recipient = INQUIRY_EMAIL.trim();
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  window.location.href = mailto;

  formStatus.textContent = recipient
    ? "Your email app should now open with the inquiry prepared."
    : "Your email app should open. Add the official Media Unit email in script.js to set the recipient automatically.";
});
