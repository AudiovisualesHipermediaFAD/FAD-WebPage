document.addEventListener('DOMContentLoaded', () => {
  const navToggle     = document.querySelector('.nav-toggle');
  const navMenu       = document.querySelector('.nav-menu');
  const hamburger     = document.querySelector('.hamburger');
  const dropdownLinks = document.querySelectorAll('.has-dropdown > a');

  // Toggle del menú hamburguesa
  navToggle.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Abrir submenús solo en móvil
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const parent = link.parentElement;
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Si ya está abierto, permitir navegar
        if (parent.classList.contains('open')) return;

        e.preventDefault(); // Evita navegación en primer click
        parent.classList.add('open');
      }
    });
  });

  // Al cambiar tamaño a desktop, cerrar todo
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.querySelectorAll('.has-dropdown.open')
              .forEach(li => li.classList.remove('open'));
    }
  });
});
