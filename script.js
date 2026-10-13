/**
 * Скрипт одностраничного сайта AI-креатора
 *
 * 1) Мобильное меню
 * 2) Плавная прокрутка к разделам (с учётом липкой шапки)
 * 3) Проверка формы и переход в Telegram с текстом заявки
 *
 */

const TELEGRAM_USER = "DaryaKham";

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const form = document.getElementById("lead-form");
const success = document.getElementById("form-success");

/* --- Открытие / закрытие меню на узком экране --- */
function setMenuOpen(isOpen) {
  nav.classList.toggle("is-open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
}

burger.addEventListener("click", function () {
  setMenuOpen(!nav.classList.contains("is-open"));
});

/* Клик по пункту меню: закрыть бургер, прокрутить к секции */
nav.addEventListener("click", function (event) {
  const link = event.target.closest("a[href^='#']");
  if (!link) return;
  setMenuOpen(false);
});

/* Клик вне меню закрывает его */
document.addEventListener("click", function (event) {
  if (!nav.classList.contains("is-open")) return;
  if (nav.contains(event.target) || burger.contains(event.target)) return;
  setMenuOpen(false);
});

/* --- Плавный скролл с отступом под шапку --- */
function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector(".header");
  const offset = header ? header.offsetHeight + 8 : 80;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: top, behavior: "smooth" });
}

document.addEventListener("click", function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href === "#") return;

  const id = href.slice(1);
  if (!document.getElementById(id)) return;

  event.preventDefault();
  scrollToId(id);
});

/* --- Проверка полей формы --- */
function showError(fieldId, messageId, invalid) {
  const wrap = document.getElementById(fieldId).closest(".form__field");
  const error = document.getElementById(messageId);
  wrap.classList.toggle("is-invalid", invalid);
  error.hidden = !invalid;
}

function isFilled(value, minLength) {
  return value.trim().length >= minLength;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const contact = document.getElementById("contact").value;
  const task = document.getElementById("task").value;

  const nameOk = isFilled(name, 2);
  const contactOk = isFilled(contact, 3);
  const taskOk = isFilled(task, 8);

  showError("name", "error-name", !nameOk);
  showError("contact", "error-contact", !contactOk);
  showError("task", "error-task", !taskOk);

  if (!nameOk || !contactOk || !taskOk) {
    success.hidden = true;
    const firstInvalid = form.querySelector(".is-invalid input, .is-invalid textarea");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  /* Собираем текст для Telegram — заявка «работает», пользователь видит готовое сообщение */
  const message = [
    "Заявка с сайта AI-креатора",
    "Имя: " + name.trim(),
    "Связь: " + contact.trim(),
    "Задача: " + task.trim()
  ].join("\n");

  const url = "https://t.me/" + TELEGRAM_USER + "?text=" + encodeURIComponent(message);
  success.hidden = false;
  window.open(url, "_blank", "noopener,noreferrer");
});

/* Скрывать ошибку, когда пользователь начал печатать */
["name", "contact", "task"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", function () {
    const map = {
      name: "error-name",
      contact: "error-contact",
      task: "error-task"
    };
    showError(id, map[id], false);
  });
});
