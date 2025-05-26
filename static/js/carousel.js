// static/js/carousel.js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(initCarousel);
});

function initCarousel(carro) {
  const track   = carro.querySelector('.carousel-track');
  const slides  = Array.from(track.children);
  const prevBtn = carro.querySelector('.prev');
  const nextBtn = carro.querySelector('.next');
  const total   = slides.length;
  let index     = 0;

  prevBtn.addEventListener('click', () => slideTo((index - 1 + total) % total));
  nextBtn.addEventListener('click', () => slideTo((index + 1) % total));

  function slideTo(i) {
    index = i;
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  // Lightbox
  let overlay, imgEl, btnPrev, btnNext;
  let scrollY, zoomed = false, offsetX = 0, offsetY = 0;

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => openLightbox(i));
  });

  function createLightbox() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="close-btn">&times;</button>
      <button class="lb-prev">&lsaquo;</button>
      <img class="lb-img" src="" alt="">
      <button class="lb-next">&rsaquo;</button>
    `;
    document.body.appendChild(overlay);

    imgEl   = overlay.querySelector('.lb-img');
    btnPrev = overlay.querySelector('.lb-prev');
    btnNext = overlay.querySelector('.lb-next');
    const btnClose = overlay.querySelector('.close-btn');

    btnClose.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeLightbox();
    });
    btnPrev.addEventListener('click', e => { e.stopPropagation(); openLightbox((index - 1 + total) % total); });
    btnNext.addEventListener('click', e => { e.stopPropagation(); openLightbox((index + 1) % total); });

    // Drag & Zoom handlers
    setupDragAndZoom();
  }

  function openLightbox(i) {
    index = i;
    if (!overlay) createLightbox();

    imgEl.src = slides[i].querySelector('img').src;
    resetZoom();

    // Lock scroll
    scrollY = window.scrollY;
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollY}px`;

    overlay.style.display = 'flex';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    resetZoom();
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function resetZoom() {
    zoomed = false;
    offsetX = offsetY = 0;
    imgEl.style.transform = '';
    imgEl.classList.remove('zoomed');
    overlay.classList.remove('zoomable');
  }

  function setupDragAndZoom() {
    let isDragging = false, startX, startY, lastTap = 0;

    // Mouse drag
    imgEl.addEventListener('mousedown', e => {
      if (!zoomed) return;
      e.preventDefault();
      isDragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
      imgEl.style.transform = `scale(2) translate(${offsetX}px,${offsetY}px)`;
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // Touch drag
    imgEl.addEventListener('touchstart', e => {
      if (!zoomed || e.touches.length !== 1) return;
      const t = e.touches[0];
      isDragging = true;
      startX = t.clientX - offsetX;
      startY = t.clientY - offsetY;
    });
    imgEl.addEventListener('touchmove', e => {
      if (!isDragging || e.touches.length !== 1) return;
      const t = e.touches[0];
      offsetX = t.clientX - startX;
      offsetY = t.clientY - startY;
      imgEl.style.transform = `scale(2) translate(${offsetX}px,${offsetY}px)`;
    });
    imgEl.addEventListener('touchend', () => isDragging = false);

    // Double-click zoom (desktop)
    imgEl.addEventListener('dblclick', e => {
      e.preventDefault();
      toggleZoom(e.clientX, e.clientY);
    });

    // Double-tap zoom (mobile)
    imgEl.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
        const t = e.changedTouches[0];
        toggleZoom(t.clientX, t.clientY);
      }
      lastTap = now;
    });
  }

  function toggleZoom(cx, cy) {
    zoomed = !zoomed;
    const rect = imgEl.getBoundingClientRect();
    const xRel = cx - rect.left, yRel = cy - rect.top;
    const cx0 = rect.width / 2, cy0 = rect.height / 2;

    if (zoomed) {
      imgEl.classList.add('zoomed');
      overlay.classList.add('zoomable');
      offsetX = -(xRel - cx0);
      offsetY = -(yRel - cy0);
      imgEl.style.transform = `scale(2) translate(${offsetX}px,${offsetY}px)`;
    } else {
      resetZoom();
    }
  }
}
