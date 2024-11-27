// Función para cargar los productos
async function cargarProductos() {
  const apiUrl = "https://localhost:7156/api/Productos/all"; //Conexion con la API
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    //Convierte la respuesta en formato JSON
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

let todosLosProductos = [];

// Cargar productos al inicio
(async () => {
  todosLosProductos = await cargarProductos();
})();

// Función de búsqueda de productos
function buscarProductos(event) {
  const termino = event.target.value.toLowerCase();
  const suggestionsList = document.querySelector(".suggestions-list");

  // Limpiar lista de sugerencias
  suggestionsList.innerHTML = "";
  suggestionsList.style.display = "none";

  if (termino) {
    // Filtrar productos por las iniciales del nombre
    const sugerencias = todosLosProductos.filter((producto) =>
      producto.nombre.toLowerCase().startsWith(termino)
    );

    suggestionsList.style.display = "block";

    if (sugerencias.length > 0) {
      // Mostrar sugerencias
      sugerencias.forEach((producto) => {
        const li = document.createElement("li");
        li.textContent = producto.nombre;

        // Añadir evento de clic a cada sugerencia
        li.addEventListener("click", () => {
          seleccionarProducto(producto);
          irAOrdenar(producto); // Redirigir al hacer clic en la sugerencia
        });

        suggestionsList.appendChild(li);
      });
    } else {
      // Sin resultados
      const li = document.createElement("li");
      li.textContent = "Producto no encontrado";
      li.classList.add("no-results");
      suggestionsList.appendChild(li);
    }
  }
}

// Función para seleccionar un producto desde las sugerencias
function seleccionarProducto(producto) {
  const input = document.querySelector(".search-input");
  input.value = producto.nombre;
  cerrarSugerencias(); // Cierra las sugerencias al seleccionar un producto
}

// Función para cerrar las sugerencias
function cerrarSugerencias() {
  const suggestionsList = document.querySelector(".suggestions-list");
  suggestionsList.style.display = "none";
}

// Detectar clics fuera del contenedor de búsqueda
document.addEventListener("click", (event) => {
  const searchContainer = document.querySelector(".search-container");
  if (!searchContainer.contains(event.target)) {
    cerrarSugerencias();
  }
});

// Función para redirigir a Ordenar.html con el valor de búsqueda
function irAOrdenar(producto) {
  const searchInput = producto
    ? producto.nombre
    : document.querySelector(".search-input").value;
  localStorage.setItem("search", searchInput); // Guardar el valor de búsqueda en localStorage
  window.location.href = "Ordenar.html"; // Redirigir a la página de ordenar
}

// Evento para la lupa: redirigir cuando se hace clic en la lupa
document.querySelector(".fa-magnifying-glass").addEventListener("click", () => {
  irAOrdenar(); // Redirigir al hacer clic en la lupa
});

// Evento para presionar Enter en el campo de búsqueda
document.querySelector(".search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    irAOrdenar(); // Redirigir si presiona Enter
    event.preventDefault(); // Evitar que la página se recargue al presionar Enter
  }
});
