// script.js — interactivity, modal, validation, smooth behaviors
document.addEventListener('DOMContentLoaded', () => {
  // YEAR
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (navList) {
      navList.style.display = expanded ? 'none' : 'flex';
    }
  });

  // Close mobile nav on link click (for small screens)
  document.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 1000 && navList) {
        navList.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Quick contact button
  document.getElementById('btn-contact-quick')?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({behavior: 'smooth', block: 'start'});
    // focus first input
    setTimeout(()=> document.getElementById('name')?.focus(), 400);
  });

  // Portfolio: Detail buttons => open modal
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalLive = document.getElementById('modal-live');
  const modalRepo = document.getElementById('modal-repo');
  const detailButtons = document.querySelectorAll('.btn-detail');

  function openModalWithData(card) {
    const title = card.dataset.title || 'Project';
    const img = card.dataset.image || '';
    const tech = card.dataset.tech || '';
    const desc = card.dataset.desc || '';

    modalTitle.textContent = title;
    modalImage.src = img;
    modalImage.alt = title;
    modalDesc.textContent = desc;
    modalTech.textContent = tech;

    // Example action links: these are placeholders — you can attach real links
    modalLive.onclick = (e) => { e.preventDefault(); showToast(`Membuka demo: ${title}`); };
    modalRepo.onclick = (e) => { e.preventDefault(); showToast(`Membuka repo: ${title}`); };

    // show dialog if supported, else fallback
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      // fallback: add class
      modal.setAttribute('open', '');
    }
    // lock body scroll
    document.documentElement.style.overflow = 'hidden';
  }

  // attach click/key handlers to project cards and detail buttons
  document.querySelectorAll('.project-card').forEach(card => {
    const btn = card.querySelector('.btn-detail');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModalWithData(card);
      });
    }
    // also open when pressing Enter on the whole card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openModalWithData(card);
      }
    });
  });

  // modal close
  modal?.addEventListener('click', (evt) => {
    // close when clicking outside modal content
    const rect = modal.getBoundingClientRect();
    if (evt.clientY < rect.top || evt.clientY > rect.bottom || evt.clientX < rect.left || evt.clientX > rect.right) {
      closeModal();
    }
  });
  modal?.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(); }); // ESC default
  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => closeModal()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    document.documentElement.style.overflow = '';
  }

  // Contact form validation & submission (demo only)
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = '';
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    const errors = [];
    if (name.length < 2) errors.push('Nama minimal 2 karakter.');
    if (!validateEmail(email)) errors.push('Email tidak valid.');
    if (message.length < 10) errors.push('Pesan minimal 10 karakter.');

    if (errors.length) {
      feedback.style.color = '#ffb4b4';
      feedback.textContent = errors.join(' ');
      showToast('Periksa form — ada isian yang kurang.', true);
      return;
    }

    // Simulate sending (in production, send to endpoint)
    feedback.style.color = 'var(--accent)';
    feedback.textContent = 'Mengirim...';
    setTimeout(() => {
      feedback.textContent = 'Terkirim! Terima kasih — saya akan membalas segera.';
      form.reset();
      showToast('Pesan berhasil dikirim ✔');
    }, 1000);
  });

  function validateEmail(email) {
    // simple regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Toast helper
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.background = isError ? 'linear-gradient(90deg,#ff6b6b,#ff9a9a)' : '';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4200);
  }

  // Add hover / click feedback for all buttons (extra micro-interactions)
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousedown', () => b.style.transform = 'translateY(1px) scale(0.997)');
    b.addEventListener('mouseup', () => b.style.transform = '');
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });

  // Accessibility: ensure anchor smooth scroll offset for fixed header (already CSS scroll-margin-top used)

  // Focus styles for keyboard users
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  });
});