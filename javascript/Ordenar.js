function cargarNavbar() {
  fetch("../html/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error de red " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
    })
    .catch((err) => console.error("error;", err));
}
window.onload = cargarNavbar;


let productosOriginales = []; // Array para almacenar todos los productos

// Función para cargar todos los productos desde la API
async function cargarProductos() {
  const apiUrl = "https://localhost:7156/api/Productos/all";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const productos = await response.json();
    productosOriginales = productos; // Guardamos todos los productos en una variable global

    // Cargar todos los productos al principio (sin filtro)
    mostrarProductos(productos);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para mostrar productos en la página
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = ""; // Limpiar productos anteriores

  productos.forEach((producto) => {
    const productoHTML = `
      <div class="producto">
        <div class="img"><img src="${producto.rutaImagen}" alt="${producto.nombre}" /></div>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p>Precio: $${producto.precio}</p>
        <p>Stock: ${producto.stock}</p>
        <p>Categoria: ${producto.categoriaNombre}</p>
        <p>Vendedor: ${producto.vendedorNombre}</p>
        <div class="btn"><a href="#" class="boton-enlace">Añadir</a> </div>
      </div>
    `;
    contenedor.innerHTML += productoHTML;
  });
}

// Función para obtener las categorías seleccionadas
function obtenerCategoriasSeleccionadas() {
  const categoriasSeleccionadas = [];
  document.querySelectorAll(".categoria:checked").forEach((checkbox) => {
    categoriasSeleccionadas.push(checkbox.value);
  });
  return categoriasSeleccionadas;
}

// Función para filtrar los productos según las categorías seleccionadas
function filtrarProductosPorCategorias() {
  const categoriasSeleccionadas = obtenerCategoriasSeleccionadas();

  if (categoriasSeleccionadas.length > 0) {
    const productosFiltrados = productosOriginales.filter((producto) =>
      categoriasSeleccionadas.includes(producto.categoriaID.toString())
    );
    mostrarProductos(productosFiltrados);
  } else {
    // Si no hay categorías seleccionadas, mostramos todos los productos
    mostrarProductos(productosOriginales);
  }
}

// Evento para aplicar filtros
document
  .querySelector(".apply-filters")
  .addEventListener("click", filtrarProductosPorCategorias);

// Cargar todos los productos al principio cuando se carga la página
document.addEventListener("DOMContentLoaded", cargarProductos);
