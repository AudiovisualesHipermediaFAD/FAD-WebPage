document.addEventListener('DOMContentLoaded', () => {
  // --- FILTRADO POR ÁREA Y TIPO DE MEDIO ---
  const areaCheckboxes   = Array.from(document.querySelectorAll('#area-filters input[name="area"]'));
  const applyBtn         = document.getElementById('apply-filters');
  const mediaTypeRadios  = Array.from(document.querySelectorAll('.radial-menu input[name="media-type"]'));
  const areaBlocks       = Array.from(document.querySelectorAll('.area-block'));

  function applyFilters() {
    const activeAreas = areaCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
    const type        = mediaTypeRadios.find(r => r.checked).value; // both|photo|video

    areaBlocks.forEach(block => {
      const area = block.dataset.area;
      if (!activeAreas.includes(area)) {
        block.style.display = 'none';
        return;
      }
      block.style.display = '';
      const items = Array.from(block.querySelectorAll('.media-item'));
      items.forEach(item => {
        const t = item.dataset.type;
        item.style.display = (type === 'both' || type === t) ? '' : 'none';
      });
    });
  }

  applyBtn.addEventListener('click', applyFilters);
  mediaTypeRadios.forEach(r => r.addEventListener('change', applyFilters));
  applyFilters();


  // --- LIGHTBOX, ZOOM Y DRAG ---
  const modal       = document.getElementById('lightbox-modal');
  const overlay     = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');
  let zoomed        = false;
  let isDragging    = false;
  let startX, startY, origX = 0, origY = 0;

  // Abre lightbox en doble clic
  document.querySelectorAll('.media-item[data-type="photo"] img')
    .forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('dblclick', () => {
        lightboxImg.src              = img.src;
        lightboxImg.style.transform  = 'scale(1) translate(0px, 0px)';
        lightboxImg.dataset.tx       = 0;
        lightboxImg.dataset.ty       = 0;
        zoomed = false;
        modal.classList.remove('lightbox-hidden');
        document.body.style.overflow = 'hidden';
      });
    });

  // Alterna zoom-in/zoom-out
  lightboxImg.addEventListener('dblclick', () => {
    if (!zoomed) {
      lightboxImg.style.transform = 'scale(2) translate(0px, 0px)';
      lightboxImg.dataset.tx      = 0;
      lightboxImg.dataset.ty      = 0;
      lightboxImg.style.cursor    = 'grab';
    } else {
      lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
      lightboxImg.dataset.tx      = 0;
      lightboxImg.dataset.ty      = 0;
      lightboxImg.style.cursor    = 'zoom-in';
    }
    zoomed = !zoomed;
  });

  // Inicia drag
  lightboxImg.addEventListener('mousedown', e => {
    if (!zoomed) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    origX = parseFloat(lightboxImg.dataset.tx) || 0;
    origY = parseFloat(lightboxImg.dataset.ty) || 0;
    lightboxImg.style.cursor = 'grabbing';
    e.preventDefault();
  });

  // Durante drag
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const tx = origX + dx;
    const ty = origY + dy;
    lightboxImg.dataset.tx = tx;
    lightboxImg.dataset.ty = ty;
    lightboxImg.style.transform = `scale(2) translate(${tx}px, ${ty}px)`;
  });

  // Finaliza drag
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    lightboxImg.style.cursor = zoomed ? 'grab' : 'zoom-in';
  });

  // Cierra lightbox
  function closeLightbox() {
    modal.classList.add('lightbox-hidden');
    document.body.style.overflow = '';
    lightboxImg.src             = '';
    lightboxImg.style.transform = '';
    lightboxImg.dataset.tx      = 0;
    lightboxImg.dataset.ty      = 0;
    zoomed = false;
    isDragging = false;
  }

  overlay.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);
});
