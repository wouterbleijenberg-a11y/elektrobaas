// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── BEFORE / AFTER SLIDER ──
function initSlider(slider) {
  const before = slider.querySelector('.ba-before');
  const handle = slider.querySelector('.ba-handle');
  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(3, Math.min(97, pct));
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
  }

  slider.addEventListener('mousedown', (e) => { dragging = true; setPos(e.clientX); });
  window.addEventListener('mouseup',   ()  => { dragging = false; });
  window.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });

  slider.addEventListener('touchstart', (e) => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   ()  => { dragging = false; });
  window.addEventListener('touchmove',  (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
}

document.querySelectorAll('.ba-slider').forEach(initSlider);

// ── BEDANKT POPUP ──
const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        toonBedanktPopup();
      }
    } catch (err) {
      toonBedanktPopup();
    }
  });
}

function toonBedanktPopup() {
  const popup = document.createElement('div');
  popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(5px);';
  popup.innerHTML = `
    <div class="bedankt-popup">
      <img src="images/logo.png" alt="ElektroBaas" style="height:70px;margin-bottom:16px;border-radius:8px;">
      <div style="font-size:2.8rem;margin-bottom:12px;">✅</div>
      <h2>Bedankt voor je bericht!</h2>
      <p>Ik neem zo snel mogelijk contact met je op.<br>Meestal reageer ik binnen 1 werkdag.</p>
      <button onclick="this.closest('.bedankt-popup').parentElement.remove()">Sluiten</button>
    </div>
  `;
  document.body.appendChild(popup);
}
