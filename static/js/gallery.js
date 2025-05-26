document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('lightbox-modal');
  const overlay  = document.getElementById('lightbox-overlay');
  const imgEl    = document.getElementById('lightbox-img');
  const btnClose = document.getElementById('lightbox-close');

  let isZoomed = false;
  let startX, startY, origX = 0, origY = 0;
  let imgWidth, imgHeight;

  // Abre el lightbox
  function openLightbox(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || '';
    modal.classList.add('show');
    resetZoom();
  }
  // Cierra el lightbox
  function closeLightbox() {
    modal.classList.remove('show');
    imgEl.src = '';
    resetZoom();
  }
  // Resetea zoom y transformaciones
  function resetZoom() {
    isZoomed = false;
    imgEl.style.transform = '';
    imgEl.style.cursor = 'zoom-in';
  }

  // Zoom-in/out en doble click
  imgEl.addEventListener('dblclick', e => {
    e.stopPropagation();  // evitar cierre inmediato
    const rect = imgEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (!isZoomed) {
      // calcula origen del zoom en porcentaje
      const originX = (clickX / rect.width) * 100;
      const originY = (clickY / rect.height) * 100;
      imgEl.style.transformOrigin = `${originX}% ${originY}%`;
      imgEl.style.transform = 'scale(2)';  // ajusta factor si quieres más/menos zoom
      imgEl.style.transition = 'transform 0.3s ease';
      imgEl.style.cursor = 'grab';
      isZoomed = true;

      // guarda dimensiones para el pan
      imgWidth  = rect.width * 2;
      imgHeight = rect.height * 2;
    } else {
      resetZoom();
    }
  });

  // Iniciar pan al hacer mousedown cuando está zoomed
  imgEl.addEventListener('mousedown', e => {
    if (!isZoomed) return;
    e.preventDefault();
    imgEl.style.cursor = 'grabbing';
    startX = e.clientX - origX;
    startY = e.clientY - origY;

    function onMouseMove(eMove) {
      origX = eMove.clientX - startX;
      origY = eMove.clientY - startY;
      // límite de desplazamiento
      const maxX = (imgWidth - imgEl.parentElement.clientWidth) / 2;
      const maxY = (imgHeight - imgEl.parentElement.clientHeight) / 2;
      origX = Math.max(-maxX, Math.min(origX, maxX));
      origY = Math.max(-maxY, Math.min(origY, maxY));
      imgEl.style.transform = `scale(2) translate(${origX/2}px, ${origY/2}px)`;
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      imgEl.style.cursor = 'grab';
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Cerrar al click en cualquier parte del modal (incluido overlay)
  modal.addEventListener('click', closeLightbox);
  // Pero evitar que el click en la imagen cierre
  imgEl.addEventListener('click', e => e.stopPropagation());

  // Cerrar con tecla Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeLightbox();
    }
  });

  // Abrir lightbox desde miniaturas
  document.querySelectorAll('.media-item img').forEach(img => {
    img.addEventListener('dblclick', e => {
      openLightbox(e.currentTarget.src, e.currentTarget.alt);
    });
  });

  // Soporte doble tap en móvil
  document.querySelectorAll('.media-item').forEach(item => {
    let tapped = false;
    item.addEventListener('touchstart', e => {
      if (!tapped) {
        tapped = setTimeout(() => tapped = false, 300);
      } else {
        clearTimeout(tapped);
        tapped = false;
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.media-item img');

  images.forEach(img => {
    let isZoomed = false;
    let startX, startY;
    let originX = 0, originY = 0;

    // Transición suave para zoom
    img.style.transition = 'transform 0.3s ease';
    img.style.cursor = 'zoom-in';
    img.style.transformOrigin = 'center center';

    // Manejar doble click en escritorio
    img.addEventListener('dblclick', e => {
      const rect = img.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;

      if (!isZoomed) {
        img.style.transformOrigin = `${(clickX * 100).toFixed(2)}% ${(clickY * 100).toFixed(2)}%`;
        img.style.transform = 'scale(2)';
        img.style.cursor = 'grab';
        isZoomed = true;
      } else {
        img.style.transformOrigin = 'center center';
        img.style.transform = 'scale(1)';
        img.style.cursor = 'zoom-in';
        isZoomed = false;
        // Reset pan variables
        img.style.setProperty('--pan-x', 0);
        img.style.setProperty('--pan-y', 0);
      }
    });

    // Pan cuando esté zoomed: mouse down + move
    img.addEventListener('mousedown', e => {
      if (!isZoomed) return;
      e.preventDefault();
      img.style.cursor = 'grabbing';
      startX = e.clientX;
      startY = e.clientY;
      originX = parseFloat(getComputedStyle(img).getPropertyValue('--pan-x') || 0);
      originY = parseFloat(getComputedStyle(img).getPropertyValue('--pan-y') || 0);

      const onMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        img.style.transform = `scale(2) translate(${originX + dx}px, ${originY + dy}px)`;
        img.style.setProperty('--pan-x', originX + dx);
        img.style.setProperty('--pan-y', originY + dy);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        img.style.cursor = 'grab';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Soporte básico de doble tap en móviles
    let lastTap = 0;
    img.addEventListener('touchend', e => {
      const currentTime = Date.now();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        img.dispatchEvent(new MouseEvent('dblclick', {
          clientX: e.changedTouches[0].clientX,
          clientY: e.changedTouches[0].clientY
        }));
        e.preventDefault();
      }
      lastTap = currentTime;
    });
  });
});