// ══════════════════════════════════════════════════════════════
//  ANITRACK v2.0 — Feature Update 🎌
// ══════════════════════════════════════════════════════════════

// 1. ESTADO DE LA APLICACIÓN
let listaAnimes = [];
let filtroActual = "Todos";

// 2. FUNCIONES DE APOYO (UI)
function mostrarError(mensaje) {
    let el = document.getElementById("mensajeForm");
    el.textContent = mensaje;
    el.className = "mensaje error";
}

function mostrarExito(mensaje) {
    let el = document.getElementById("mensajeForm");
    el.textContent = mensaje;
    el.className = "mensaje exito";
}

// 3. REQ #1: ELIMINAR ANIME ESPECÍFICO
function eliminarAnime(id) {
    // Filtramos el array para quitar solo el que coincida con el ID
    listaAnimes = listaAnimes.filter(anime => anime.id !== id);
    renderizarLista();
}

// Generador de Tarjetas v2.0
function crearTarjeta(anime) {
    // Generar nombre de imagen basado en género
    let imagenNombre = anime.genero.toLowerCase().replace("ó", "o").replace("í", "i").replace(/ /g, "-") + ".webp";
    
    return `
        <div class="anime-card">
            <img src="static/images/${imagenNombre}" alt="${anime.genero}" class="card-img" />
            <div class="card-overlay"></div>
            <span class="card-badge">${anime.genero}</span>
            
            <button class="btn-delete-small" onclick="eliminarAnime(${anime.id})">✕</button>

            <div class="card-body">
                <div class="card-info">
                    <p class="card-titulo">${anime.titulo}</p>
                    <p class="card-meta">${anime.episodios} eps vistos</p>
                </div>
                <div class="card-score">
                    ${anime.puntuacion} <span>/ 10</span>
                </div>
            </div>
        </div>
    `;
}

// 4. LÓGICA DEL FORMULARIO
document.getElementById("formAnime").addEventListener("submit", function (evento) {
    evento.preventDefault();

    let titulo = document.getElementById("titulo").value.trim();
    let genero = document.getElementById("genero").value;
    let episodios = Number(document.getElementById("episodios").value);
    let puntuacion = Number(document.getElementById("puntuacion").value);

    // Validación
    if (titulo === "") { mostrarError("El título es obligatorio."); return; }
    if (genero === "") { mostrarError("Selecciona un género."); return; }
    if (episodios <= 0) { mostrarError("Número de episodios inválido."); return; }
    if (puntuacion < 1 || puntuacion > 10) { mostrarError("Puntuación de 1 a 10."); return; }

    // Creamos el objeto con un ID único basado en el tiempo actual
    let nuevoAnime = {
        id: Date.now(), 
        titulo,
        genero,
        episodios,
        puntuacion
    };

    listaAnimes.push(nuevoAnime);
    mostrarExito("✅ " + titulo + " agregado.");
    renderizarLista();
    evento.target.reset();
});

// 5. REQ #2: FILTRAR POR GÉNERO
document.getElementById("filtroGenero").addEventListener("change", (e) => {
    filtroActual = e.target.value;
    renderizarLista();
});

// 6. RENDERIZADO Y ESTADÍSTICAS (REQ #3)
function renderizarLista() {
    let contenedor = document.getElementById("listaAnimes");
    
    // Aplicar filtro antes de dibujar
    let listaFiltrada = filtroActual === "Todos" 
        ? listaAnimes 
        : listaAnimes.filter(a => a.genero === filtroActual);

    // Control de estado vacío
    document.getElementById("estadoVacio").style.display = listaFiltrada.length === 0 ? "block" : "none";
    
    // Limpiar y rellenar contenedor
    contenedor.innerHTML = "";
    listaFiltrada.forEach(anime => {
        contenedor.innerHTML += crearTarjeta(anime);
    });

    actualizarEstadisticas();
}

function actualizarEstadisticas() {
    // Total de títulos
    document.getElementById("statTotal").textContent = listaAnimes.length + " títulos";

    // REQ #3: Sumar total de episodios usando reduce()
    let totalEpisodios = listaAnimes.reduce((acumulador, anime) => acumulador + anime.episodios, 0);
    document.getElementById("statEpisodios").textContent = totalEpisodios + " eps totales";

    // Bonus: Promedio de puntuación
    let elPromedio = document.getElementById("statPromedio");
    if (listaAnimes.length > 0) {
        let sumaPuntos = listaAnimes.reduce((acc, anime) => acc + anime.puntuacion, 0);
        let promedio = (sumaPuntos / listaAnimes.length).toFixed(1);
        elPromedio.textContent = "⭐ " + promedio + " promedio";
        elPromedio.style.display = "inline-block";
    } else {
        elPromedio.style.display = "none";
    }
}
// ════════════════════════════════════════════════════════════
//  🔥 EXTRA BONUS: PROMEDIO DE PUNTUACIÓN
// ════════════════════════════════════════════════════════════
//
//  Al final de renderizarLista() calcula el promedio de
//  puntuación usando forEach con un acumulador.
//
//  Pasos:
//  1. Declara un acumulador en 0 antes del forEach
//  2. Dentro del forEach: acumulador += anime.puntuacion
//  3. Divide entre listaAnimes.length al terminar
//  4. Muestra el resultado en id "statPromedio"
//     y quítale el display:none para que aparezca
//
//  Resultado esperado: "⭐ 8 promedio"
//
//  ⚠️ El programa funciona perfectamente sin este bonus.