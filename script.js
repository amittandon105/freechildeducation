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

/* On-site rating: dedicated page panel + one-time popup elsewhere */
const REVIEW_PROMPT_KEY = 'bf_google_review_prompt_shown';

function bindStarRating(options) {
  const starsWrap = options.starsWrap;
  const submitBtn = options.submitBtn;
  const message = options.message;
  const actions = options.actions;
  let selectedRating = 0;

  starsWrap.innerHTML = '';
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

  submitBtn.addEventListener('click', () => {
    if (!selectedRating) return;
    message.textContent = 'Thank you for your rating.';
    starsWrap.remove();
    if (actions) actions.remove();
    else submitBtn.remove();
    if (typeof options.onComplete === 'function') options.onComplete();
  });
}

(function initInlineRating() {
  const panel = document.querySelector('[data-inline-rating]');
  if (!panel) return;
  const starsWrap = panel.querySelector('[data-inline-stars]');
  const submitBtn = panel.querySelector('[data-inline-submit]');
  const message = panel.querySelector('.rating-panel-text');
  if (!starsWrap || !submitBtn || !message) return;
  bindStarRating({ starsWrap, submitBtn, message, actions: panel.querySelector('.rating-panel-actions') });
  try { localStorage.setItem(REVIEW_PROMPT_KEY, '1'); } catch (e) { /* ignore */ }
})();

(function showRatingPrompt() {
  if (document.querySelector('[data-inline-rating]')) return;
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

  const removeToast = () => {
    toast.classList.add('is-hiding');
    window.setTimeout(() => toast.remove(), 220);
  };

  bindStarRating({
    starsWrap,
    submitBtn,
    message,
    actions,
    onComplete: () => window.setTimeout(removeToast, 1600)
  });

  toast.querySelector('.review-prompt-close').addEventListener('click', removeToast);
  toast.querySelector('.review-prompt-skip').addEventListener('click', removeToast);
  document.body.appendChild(toast);
  window.requestAnimationFrame(() => toast.classList.add('is-visible'));
})();

/* Live Google Business Profile rating (Places API) — never hardcode values */
const GOOGLE_PLACE_ID = 'ChIJTw-cW0iR7TkRhWbYlYGm--w';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query_place_id=' + encodeURIComponent(GOOGLE_PLACE_ID);
const GOOGLE_WRITE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(GOOGLE_PLACE_ID);

function renderGoogleStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let stars = '';
  for (let i = 1; i <= 5; i += 1) {
    if (i <= full) stars += '★';
    else if (i === full + 1 && half) stars += '☆';
    else stars += '☆';
  }
  return stars;
}

(function loadGooglePlaceRating() {
  const root = document.querySelector('[data-google-place]');
  if (!root) return;

  const nameEl = root.querySelector('[data-place-name]');
  const ratingWrap = root.querySelector('[data-place-rating]');
  const scoreEl = root.querySelector('[data-place-score]');
  const starsEl = root.querySelector('[data-place-stars]');
  const countEl = root.querySelector('[data-place-count]');
  const statusEl = root.querySelector('[data-place-status]');
  const mapFrame = root.querySelector('[data-google-map]');
  const mapsLink = root.querySelector('[data-maps-link]');
  const writeLink = root.querySelector('[data-write-review]');

  if (mapsLink) mapsLink.href = GOOGLE_MAPS_URL;
  if (writeLink) writeLink.href = GOOGLE_WRITE_REVIEW_URL;
  if (mapFrame) {
    mapFrame.src = 'https://www.google.com/maps?q=place_id:' + encodeURIComponent(GOOGLE_PLACE_ID) + '&z=15&output=embed';
  }

  const metaKey = document.querySelector('meta[name="google-maps-api-key"]');
  const apiKey = ((window.GOOGLE_MAPS_API_KEY || metaKey && metaKey.getAttribute('content')) || '').trim();

  if (!apiKey) {
    if (statusEl) {
      statusEl.innerHTML = 'Live star counts load with a Google Maps Platform key. Until then, <a href="' + GOOGLE_MAPS_URL + '" target="_blank" rel="noopener noreferrer">view the genuine rating on Google Maps</a>.';
    }
    return;
  }

  fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(GOOGLE_PLACE_ID) + '?languageCode=en', {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,formattedAddress'
    }
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Place lookup failed');
      return res.json();
    })
    .then(function (place) {
      const displayName = place.displayName && place.displayName.text;
      const rating = typeof place.rating === 'number' ? place.rating : null;
      const count = typeof place.userRatingCount === 'number' ? place.userRatingCount : null;
      const mapsUri = place.googleMapsUri || GOOGLE_MAPS_URL;

      if (displayName && nameEl) nameEl.textContent = displayName;
      if (mapsLink) mapsLink.href = mapsUri;
      if (mapFrame && apiKey) {
        mapFrame.src = 'https://www.google.com/maps/embed/v1/place?key=' + encodeURIComponent(apiKey) + '&q=place_id:' + encodeURIComponent(GOOGLE_PLACE_ID);
      }

      if (rating !== null && scoreEl && starsEl && countEl && ratingWrap) {
        scoreEl.textContent = rating.toFixed(1);
        starsEl.textContent = renderGoogleStars(rating);
        countEl.textContent = count !== null ? '(' + count.toLocaleString() + ' Google review' + (count === 1 ? '' : 's') + ')' : '';
        ratingWrap.hidden = false;
        if (statusEl) statusEl.textContent = 'Rating sourced live from Google Business Profile.';
      } else if (statusEl) {
        statusEl.innerHTML = 'Rating is not available from Google yet. <a href="' + mapsUri + '" target="_blank" rel="noopener noreferrer">Open the listing on Google Maps</a>.';
      }
    })
    .catch(function () {
      if (statusEl) {
        statusEl.innerHTML = 'Could not load live Google rating here. <a href="' + GOOGLE_MAPS_URL + '" target="_blank" rel="noopener noreferrer">See the genuine rating on Google Maps</a>.';
      }
    });
})();
