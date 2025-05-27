// ----- Áreas y descripciones -----
const areas = {
  edicion: {
    name: "Edición Gráfica",
    description:
      "Te interesa estructurar contenidos editoriales como libros, revistas o publicaciones digitales. Puedes destacar en diseño editorial y la tipografía."
  },
  ilustracion: {
    name: "Gráfica e Ilustración",
    description:
      "Te sientes cómodo/a con la expresión visual, la creación de personajes, narrativas ilustradas y lenguaje gráfico propio."
  },
  iconicidad: {
    name: "Iconicidad y Entornos",
    description:
      "Te interesa el diseño en el espacio, sistemas de señalización, mapas y elementos visuales que guían y orientan en entornos físicos o digitales."
  },
  hipermedia: {
    name: "Medios Audiovisuales e Hipermedia",
    description:
      "Tu perfil se inclina por la producción audiovisual, animaciones, multimedia e interacción digital."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms.orientationTest;
  const fieldsets = Array.from(form.querySelectorAll("fieldset"));
  let currentStep = 0;

  // Crear área de navegación
  const navDiv = document.createElement("div");
  navDiv.classList.add("navigation-buttons");
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.id = "prev-btn";
  prevBtn.textContent = "Anterior";
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.id = "next-btn";
  // Insertar botones
  navDiv.append(prevBtn, nextBtn);
  form.appendChild(navDiv);

  // Muestra solo el fieldset indexado
  function showStep(idx, direction = "none") {
    fieldsets.forEach((fs, i) => {
      fs.classList.remove("slide-in-right", "slide-in-left", "active");
      if (i === idx) {
        fs.style.display = "block";
        fs.classList.add("active");
        if (direction === "next") fs.classList.add("slide-in-right");
        if (direction === "prev") fs.classList.add("slide-in-left");
      } else {
        fs.style.display = "none";
      }
    });
    prevBtn.disabled = idx === 0;
    nextBtn.textContent =
      idx === fieldsets.length - 1 ? "Ver resultado" : "Siguiente";
  }

  // Avanzar o mostrar resultado
  function goNext() {
    if (currentStep === fieldsets.length - 1) {
      calculateResult();
    } else {
      currentStep++;
      showStep(currentStep, "next");
    }
  }

  // Retroceder
  function goPrev() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep, "prev");
    }
  }

  // Cada vez que el usuario selecciona un radio, avanza
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      setTimeout(goNext, 200);
    });
  });

  // Eventos de botones
  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  // Mostrar primer paso
  showStep(0);
});

// ----- Cálculo del resultado -----
function calculateResult() {
  const form = document.forms.orientationTest;
  const counts = {
    edicion: 0,
    ilustracion: 0,
    iconicidad: 0,
    hipermedia: 0
  };

  // Ahora iteramos de 1 a 20 (tus 20 preguntas)
  for (let i = 1; i <= 20; i++) {
    const val = form[`q${i}`] && form[`q${i}`].value;
    if (val) counts[val]++;
  }

  const topArea = Object.keys(counts).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b
  );

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <h2>Tu área ideal es: ${areas[topArea].name}</h2>
    <p>${areas[topArea].description}</p>
  `;
  resultDiv.style.display = "block";
}
