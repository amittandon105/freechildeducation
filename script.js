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

/* One-time on-site rating prompt */
const REVIEW_PROMPT_KEY = 'bf_google_review_prompt_shown';

(function showRatingPrompt() {
  try {
    if (localStorage.getItem(REVIEW_PROMPT_KEY)) return;
  } catch (e) {
    return;
  }

  try {
    localStorage.setItem(REVIEW_PROMPT_KEY, '1');
  } catch (e) {
    /* still show once this session if storage is blocked */
  }

  let selectedRating = 0;

  const toast = document.createElement('div');
  toast.className = 'review-prompt';
  toast.setAttribute('role', 'dialog');
  toast.setAttribute('aria-label', 'Rate your experience');
  toast.innerHTML =
    '<button type="button" class="review-prompt-close" aria-label="Close">×</button>' +
    '<p class="review-prompt-text">Please rate your experience with our foundation.</p>' +
    '<div class="review-prompt-stars" role="group" aria-label="Star rating"></div>' +
    '<div class="review-prompt-actions">' +
      '<button type="button" class="review-prompt-submit" disabled>Submit Rating</button>' +
      '<button type="button" class="review-prompt-skip">Skip</button>' +
    '</div>';

  const starsWrap = toast.querySelector('.review-prompt-stars');
  const submitBtn = toast.querySelector('.review-prompt-submit');
  const message = toast.querySelector('.review-prompt-text');
  const actions = toast.querySelector('.review-prompt-actions');

  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'review-prompt-star';
    star.setAttribute('aria-label', i + ' star' + (i === 1 ? '' : 's'));
    star.dataset.value = String(i);
    star.textContent = '★';
    star.addEventListener('click', () => {
      selectedRating = i;
      starsWrap.querySelectorAll('.review-prompt-star').forEach((el) => {
        const value = Number(el.dataset.value);
        el.classList.toggle('is-selected', value <= selectedRating);
      });
      submitBtn.disabled = false;
    });
    starsWrap.appendChild(star);
  }

  const removeToast = () => {
    toast.classList.add('is-hiding');
    window.setTimeout(() => toast.remove(), 220);
  };

  toast.querySelector('.review-prompt-close').addEventListener('click', removeToast);
  toast.querySelector('.review-prompt-skip').addEventListener('click', removeToast);
  submitBtn.addEventListener('click', () => {
    if (!selectedRating) return;
    message.textContent = 'Thank you for your rating.';
    starsWrap.remove();
    actions.remove();
    window.setTimeout(removeToast, 1600);
  });

  document.body.appendChild(toast);
  window.requestAnimationFrame(() => toast.classList.add('is-visible'));
})();
