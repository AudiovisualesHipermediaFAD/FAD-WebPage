document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orientationTest');
    const fieldsets = Array.from(form.querySelectorAll('fieldset'));
    const resultDiv = document.getElementById('result');
    const progressBar = document.getElementById('progressBar');
    const total = fieldsets.length;

    // Muestra solo la primera
    let current = 0;
    fieldsets.forEach((fs, i) => fs.classList.toggle('active', i === 0));
    updateProgress();

    function updateProgress() {
        const pct = (current / total) * 100;
        progressBar.style.width = pct + '%';
    }

    // Al principio del archivo, justo debajo de DOMContentLoaded:
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

    function showResult() {
        // Completa la barra al 100%
        progressBar.style.width = '100%';

        // Calcula los scores
        const scores = { edicion: 0, ilustracion: 0, iconicidad: 0, hipermedia: 0 };
        for (let i = 1; i <= total; i++) {
            const val = form[`q${i}`].value;
            if (scores.hasOwnProperty(val)) scores[val]++;
        }
        const winner = Object.keys(scores).reduce((a, b) =>
            scores[a] >= scores[b] ? a : b
        );

        // Obtén datos del área ganadora
        const { name, description } = areas[winner] || {};

        // Inserta HTML con título y párrafo
        resultDiv.innerHTML = `
    <h3>${name || "Perfil desconocido"}</h3>
    <p>${description || "No se pudo determinar tu perfil con claridad."}</p>
  `;
        resultDiv.className = winner;        // aplica la clase de color
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }


    form.addEventListener('change', e => {
        if (!e.target.matches('input[type="radio"]')) return;

        // retardamos 0.1s el avance de slide
        setTimeout(() => {
            current++;
            if (current < total) {
                fieldsets.forEach((fs, i) => fs.classList.toggle('active', i === current));
                updateProgress();
            } else {
                showResult();
            }
        }, 300);
    });
});
