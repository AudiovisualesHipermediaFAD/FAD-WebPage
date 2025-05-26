document.addEventListener('DOMContentLoaded', () => {
  const modal       = document.createElement('div');
  modal.id          = 'lightbox-modal';
  modal.innerHTML   = `
    <div id="lightbox-content">
      <span id="lightbox-close">&times;</span>
      <button id="arrow-prev" class="lightbox-arrow">&#x276E;</button>
      <img id="lightbox-img" src="" alt="">
      <button id="arrow-next" class="lightbox-arrow">&#x276F;</button>
    </div>`;
  document.body.appendChild(modal);

  const imgEl    = modal.querySelector('#lightbox-img');
  const closeBtn = modal.querySelector('#lightbox-close');
  const prevBtn  = modal.querySelector('#arrow-prev');
  const nextBtn  = modal.querySelector('#arrow-next');
  let items       = [];
  let currentIdx  = 0;
  let zoomed      = false;

  // Identificar grupo por bloque .media-grid
  document.querySelectorAll('.media-grid').forEach(grid => {
    const imgs = Array.from(grid.querySelectorAll('img'));
    imgs.forEach((img, idx) => {
      items.push({ el: img, group: grid, index: idx });
      img.addEventListener('dblclick', e => onDoubleClick(e, grid, idx));
    });
  });

  function onDoubleClick(e, group, idx) {
    items = items.filter(i => i.group === group);
    currentIdx = idx;
    openLightbox(items[currentIdx].el.src, items[currentIdx].el.alt);
  }

  function openLightbox(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt;
    modal.classList.add('show');
    zoomed = false;
    imgEl.style.transform = 'translate(0,0) scale(1)';
  }

  function closeLightbox() {
    modal.classList.remove('show');
  }

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  function showPrev() {
    currentIdx = (currentIdx - 1 + items.length) % items.length;
    imgEl.src = items[currentIdx].el.src;
  }
  function showNext() {
    currentIdx = (currentIdx + 1) % items.length;
    imgEl.src = items[currentIdx].el.src;
  }

  // Zoom y paneo
  imgEl.addEventListener('dblclick', e => {
    if (!zoomed) {
      const rect = imgEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const scale = 2;
      const offsetX = ((x / rect.width) * 100);
      const offsetY = ((y / rect.height) * 100);
      imgEl.style.transformOrigin = `${offsetX}% ${offsetY}%`;
      imgEl.style.transform = `scale(${scale})`;
      zoomed = true;
      imgEl.style.cursor = 'grab';
    } else {
      imgEl.style.transform = 'scale(1)';
      zoomed = false;
      imgEl.style.cursor = 'default';
    }
  });

  // Paneo con mouse
  let isDragging = false;
  let startX, startY;
  let currentTranslate = { x: 0, y: 0 };

  imgEl.addEventListener('mousedown', e => {
    if (!zoomed) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    imgEl.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const tx = currentTranslate.x + dx;
    const ty = currentTranslate.y + dy;
    imgEl.style.transform = `translate(${tx}px, ${ty}px) scale(2)`;
  });
  document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    currentTranslate.x += e.clientX - startX;
    currentTranslate.y += e.clientY - startY;
    imgEl.style.cursor = 'grab';
  });
});