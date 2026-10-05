/*
  Theme Switcher, Mobile Navigation, Project Filter, Lightbox, Contact Form & Smooth UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initProjectFilter();
  initBackToTop();
  initContactForm();
  initScrollSpy();
});

/* 
   1. THEME SWITCHER (Light / Dark Mode)
    */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Listen for system theme changes if user hasn't set custom preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* 
   2. MOBILE DRAWER NAVIGATION
    */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* 
   3. PROJECT FILTERING
    */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* 
   4. LIGHTBOX / MEDIA MODAL
    */
const lightboxModal = document.getElementById('lightboxModal');
const modalMediaWrapper = document.getElementById('modalMediaWrapper');
const modalTitle = document.getElementById('modalTitle');
const modalRole = document.getElementById('modalRole');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalExternalLink = document.getElementById('modalExternalLink');

function openLightbox(type, src, title, role, desc, externalLink, externalLabel) {
  if (!lightboxModal) return;

  modalMediaWrapper.innerHTML = '';

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    modalMediaWrapper.appendChild(img);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    modalMediaWrapper.appendChild(video);
  } else if (type === 'embed') {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'fullscreen');
    iframe.style.width = '100%';
    iframe.style.height = '480px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    modalMediaWrapper.appendChild(iframe);
  }

  modalTitle.textContent = title || 'Project Preview';
  modalRole.textContent = role || 'Graphic Design';
  modalDesc.textContent = desc || '';

  if (modalExternalLink) {
    if (externalLink) {
      modalExternalLink.href = externalLink;
      modalExternalLink.textContent = externalLabel || 'View Live Project ↗';
      modalExternalLink.style.display = 'inline-flex';
    } else {
      modalExternalLink.style.display = 'none';
    }
  }

  lightboxModal.classList.add('open');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxModal) return;

  lightboxModal.classList.remove('open');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Stop video or iframe playback if any
  const video = modalMediaWrapper.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  modalMediaWrapper.innerHTML = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLightbox);

if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
    closeLightbox();
  }
});

// Expose globally for inline onclick triggers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* 
   5. CONTACT FORM & GOOGLE DRIVE / EMAIL DISPATCH
    */
// Optional Google Drive Google Apps Script Web App URL (if deployed)
// Instructions to set up Google Drive spreadsheet logger are in GOOGLE_DRIVE_SETUP.md
const GOOGLE_DRIVE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzXH-9iP-u1dxsMm0vlhZyK29p6JSzvYikwdE__wT5nvFIYMupu0JfYw4xCrh9Om1SBMg/exec';

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  const whatsappDirectBtn = document.getElementById('whatsappDirectBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('nameInput').value.trim();
      const email = document.getElementById('emailInput').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const message = document.getElementById('messageInput').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Update button state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
      showStatus('Sending your message...', 'info');

      const payload = {
        name: name,
        email: email,
        service: service,
        message: message,
        _subject: `New Portfolio Inquiry from ${name} (${service})`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
        timestamp: new Date().toISOString()
      };

      try {
        // Submit directly to backend server receiver at yaesthetic1@gmail.com
        const response = await fetch('https://formsubmit.co/ajax/yaesthetic1@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Background logging if configured
        if (GOOGLE_DRIVE_SHEET_WEBAPP_URL) {
          fetch(GOOGLE_DRIVE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }

        if (response.ok) {
          showStatus(`✓ Thank you, ${name}! Your inquiry has been sent successfully. I'll get back to you shortly.`, 'success');
          contactForm.reset();
        } else {
          throw new Error('Backend service unavailable');
        }
      } catch (err) {
        console.warn('Direct submit fallback to email client:', err);
        // Fallback to mailto
        const subject = encodeURIComponent(`Project Inquiry: ${service} — ${name}`);
        const body = encodeURIComponent(
          `Hi Yadusan,\n\nI'm reaching out regarding a project.\n\nName: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${message}\n\nLooking forward to hearing from you!`
        );
        showStatus('Opening email client to dispatch to yaesthetic1@gmail.com...', 'success');
        setTimeout(() => {
          window.location.href = `mailto:yaesthetic1@gmail.com?subject=${subject}&body=${body}`;
        }, 600);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const name = document.getElementById('nameInput').value.trim() || 'A Client';
      const service = document.getElementById('serviceSelect').value || 'Graphic Design';
      const message = document.getElementById('messageInput').value.trim() || 'I would like to discuss a project with you.';

      const text = encodeURIComponent(
        `Hi Yadusan! My name is ${name}. I am interested in ${service}. Here are some details: "${message}". Let's discuss!`
      );
      window.open(`https://wa.me/94741703653?text=${text}`, '_blank');
    });
  }

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 6000);
  }
}

/* 
   6. SCROLL SPY (ACTIVE NAVIGATION LINK)
    */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* 
   7. BACK TO TOP BUTTON
    */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
/* Maximize feature - add before </body>:  <script src="maximize.js"></script> */
(function () {
  // Which images/videos get the maximize button. Change to match your page,
  // e.g. ".post img, .post video"  or  ".gallery img, .gallery video"
  var SELECTOR = "img, video";
  // Images narrower than this (logos, icons) are skipped
  var MIN_IMG_WIDTH = 120;

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
  var medias = [];

  document.querySelectorAll(SELECTOR).forEach(function (media) {
    if (media.closest(".mx-wrap, .mx-overlay")) return;
    if (media.tagName === "IMG" && media.getBoundingClientRect().width < MIN_IMG_WIDTH) return;

    var wrap = document.createElement("div");
    wrap.className = "mx-wrap";
    media.parentNode.insertBefore(wrap, media);
    wrap.appendChild(media);

    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "mx-btn";
    btn.title = "Maximize"; btn.setAttribute("aria-label", "Maximize");
    btn.innerHTML = ICON;
    btn.addEventListener("click", function (e) { e.stopPropagation(); open(media); });
    wrap.appendChild(btn);

    if (media.tagName === "IMG") media.addEventListener("click", function () { open(media); });
    medias.push(media);
  });

  var overlay, stage, caption, current, wasPlaying = false, origVideo = null;

  function list() {
    return medias.filter(function (m) { return m.offsetParent !== null; }); // only visible ones
  }

  function open(media) {
    if (!overlay) build();
    show(media);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.querySelector(".mx-close").focus();
  }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "mx-overlay"; overlay.hidden = true;
    overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<button class="mx-ctrl mx-close" aria-label="Close">&times;</button>' +
      '<button class="mx-ctrl mx-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="mx-ctrl mx-next" aria-label="Next">&#8250;</button>' +
      '<div class="mx-stage"></div><div class="mx-caption"></div>';
    document.body.appendChild(overlay);
    stage = overlay.querySelector(".mx-stage");
    caption = overlay.querySelector(".mx-caption");

    overlay.querySelector(".mx-close").onclick = close;
    overlay.querySelector(".mx-prev").onclick = function () { step(-1); };
    overlay.querySelector(".mx-next").onclick = function () { step(1); };
    overlay.addEventListener("click", function (e) { if (e.target === overlay || e.target === stage) close(); });
    document.addEventListener("keydown", function (e) {
      if (overlay.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  function syncBack() {
    var big = stage && stage.querySelector("video");
    if (big && origVideo) {
      origVideo.currentTime = big.currentTime;
      big.pause();
      if (wasPlaying) origVideo.play().catch(function () {});
    }
    origVideo = null; wasPlaying = false;
  }

  function show(media) {
    syncBack();
    current = media;
    stage.innerHTML = "";
    var big;
    if (media.tagName === "VIDEO") {
      big = document.createElement("video");
      big.src = media.currentSrc || media.src;
      big.poster = media.poster;
      big.controls = true; big.autoplay = true; big.playsInline = true;
      big.addEventListener("loadedmetadata", function () { try { big.currentTime = media.currentTime; } catch (e) {} }, { once: true });
      origVideo = media; wasPlaying = !media.paused;
      media.pause();
    } else {
      big = document.createElement("img");
      big.src = media.currentSrc || media.src; big.alt = media.alt || "";
    }
    stage.appendChild(big);
    caption.textContent = media.alt || media.getAttribute("title") || media.dataset.caption || "";
    var many = list().length > 1;
    overlay.querySelector(".mx-prev").hidden = overlay.querySelector(".mx-next").hidden = !many;
  }

  function step(dir) {
    var l = list(), i = l.indexOf(current);
    show(l[(i + dir + l.length) % l.length]);
  }

  function close() {
    syncBack();
    stage.innerHTML = "";
    overlay.hidden = true;
    document.body.style.overflow = "";
  }
})();