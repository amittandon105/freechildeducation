const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }));
}
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
const form = document.querySelector('#contact-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Website enquiry: ${data.get('interest')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${data.get('interest')}\n\nMessage:\n${data.get('message') || ''}`);
  window.location.href = `mailto:hello@example.org?subject=${subject}&body=${body}`;
});

/* Temporary Google Reviews prompt — change GOOGLE_REVIEW_URL as needed */
const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJTw-cW0iR7TkRhWbYlYGm--w';
const REVIEW_PROMPT_KEY = 'bf_google_review_prompt_shown';

(function showGoogleReviewPrompt() {
  try {
    if (localStorage.getItem(REVIEW_PROMPT_KEY)) return;
  } catch (e) {
    return;
  }

  window.setTimeout(() => {
    try {
      localStorage.setItem(REVIEW_PROMPT_KEY, '1');
    } catch (e) {
      /* still show once this session if storage is blocked */
    }

    const toast = document.createElement('div');
    toast.className = 'review-prompt';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<p class="review-prompt-text">Support Our Mission ❤️ Rate us on Google.</p>' +
      '<a class="review-prompt-link" href="' + GOOGLE_REVIEW_URL + '" target="_blank" rel="noopener noreferrer">Rate on Google</a>' +
      '<button type="button" class="review-prompt-close" aria-label="Close">×</button>';

    const removeToast = () => {
      toast.classList.add('is-hiding');
      window.setTimeout(() => toast.remove(), 220);
    };

    toast.querySelector('.review-prompt-close').addEventListener('click', removeToast);
    document.body.appendChild(toast);
    window.requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(removeToast, 5000);
  }, 2000);
})();
