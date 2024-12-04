////////////////////////////////////////////////////////

//NAVBAR//

////////////////////////////////////////////////////////

function cargarNavbar() {
  fetch("navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar navbar " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
      actualizarContadorCarrito(); // Llamar después de cargar el navbar
    })
    .catch((err) => console.error("Error:", err));
}

////////////////////////////////////////////////////////

//FOOTER//

////////////////////////////////////////////////////////

function cargarFooter() {
  fetch("Footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar footer " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("footer-container").innerHTML = data;
      actualizarContadorCarrito(); // Llamar después de cargar el navbar
    })
    .catch((err) => console.error("Error:", err));
}

////////////////////////////////////////////////////////

//CARGAR FOOTER Y NAVBAR//

////////////////////////////////////////////////////////

function inicializar() {
  cargarNavbar();
  cargarFooter();
}

window.onload = inicializar;

////////////////////////////////////////////////////////

//CONSUMO DE API, PARA MOSTRAR TODOS LOS PRODUCTOS//

////////////////////////////////////////////////////////

let productosOriginales = []; // Array para almacenar todos los productos

// Función para cargar todos los productos desde la API
async function cargarProductos() {
  const apiUrl = "https://localhost:7156/api/Productos/all"; //Conexion con la APi

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    //Convierte la respuesta en formato JSON
    const productos = await response.json();
    productosOriginales = productos; // Guardar productos originales para búsqueda
    if (!productos || productos.length === 0) {
      mostrarPantallaVacia("No hay productos disponibles");
    } else {
      ocultarPantalla(); // Ocultar la pantalla si hay productos
      mostrarProductos(productos); // Mostrar los productos
    }

    return productos; // Devuelve los productos cargados
  } catch (error) {
    console.error("Error:", error);
    mostrarPantallaVacia(
      "Error al obtener los datos. Intenta de nuevo más tarde."
    );
    return []; // Devuelve un arreglo vacío si hay un error
  }
}

// Función para mostrar los productos en el contenedor
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = ""; // Limpiar productos anteriores

  // Si no hay productos disponibles, mostrar el mensaje solo si los productos originales existen
  if (productos.length === 0 && productosOriginales.length > 0) {
    contenedor.innerHTML = `<p class="alerta">No se encontraron productos con ese término!</p>`;
    return;
  }

  // Si se encontraron productos, mostrar cada uno de ellos
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
      <div 
        class="btn add-to-cart-btn" 
        data-id="${producto.productoId}" 
        data-nombre="${producto.nombre}" 
        data-descripcion="${producto.descripcion}" 
        data-precio="${producto.precio}" 
        data-stock="${producto.stock}" 
        data-rutaImagen="${producto.rutaImagen}"
        data-vendedorId="${producto.vendedorId}"> <!-- Añadir el vendedorId aquí -->
        <a href="#" class="boton-enlace">Añadir</a> 
      </div>
    </div>
  `;
  contenedor.innerHTML += productoHTML;
});

// Añadir eventos a los botones "Añadir al carrito"
const botonesAñadir = document.querySelectorAll(".add-to-cart-btn");
botonesAñadir.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtener todos los datos del producto, incluido vendedorId
    const producto = {
      productoId: boton.getAttribute("data-id"),
      nombre: boton.getAttribute("data-nombre"),
      descripcion: boton.getAttribute("data-descripcion"),
      precio: parseFloat(boton.getAttribute("data-precio")),
      stock: parseInt(boton.getAttribute("data-stock")),
      rutaImagen: boton.getAttribute("data-rutaImagen"),
      vendedorId: boton.getAttribute("data-vendedorId"), // Añadir vendedorId
    };

    if (producto.stock <= 0) {
      alert(`El producto "${producto.nombre}" no está disponible.`);
      return; // No añadir el producto al carrito si no hay stock
    }

    añadirProductoAlCarrito(producto); // Añadir el producto con vendedorId al carrito
  });
});

}

// Función combinada para filtrar productos y mostrar sugerencias
function buscarProductos(event) {
  const termino = event.target.value.toLowerCase();
  const suggestionsList = document.querySelector(".suggestions-list");
  const contenedor = document.getElementById("productos-container"); // Contenedor donde mostrar los productos o el mensaje de error

  // Limpiar lista de sugerencias
  suggestionsList.innerHTML = "";

  // Verificar si hay productos cargados desde la API
  if (productosOriginales.length === 0) {
    return; // Si no hay productos disponibles, no hacer nada
  }

  // Filtrar productos por el término de búsqueda
  const productosFiltrados = productosOriginales.filter(
    (producto) => producto.nombre.toLowerCase().includes(termino) // Usar includes para mejorar la búsqueda
  );

  // Mostrar productos filtrados en el contenedor
  mostrarProductos(productosFiltrados);

  // Si estamos en Ordenar.html, no mostrar las sugerencias
  if (window.location.pathname.includes("Ordenar.html")) {
    suggestionsList.style.display = "none";
    return; // Salir de la función si estamos en Ordenar.html
  }

  // Mostrar sugerencias debajo del input solo si no estamos en Ordenar.html
  if (termino) {
    suggestionsList.style.display = "block";

    if (productosFiltrados.length > 0) {
      productosFiltrados.forEach((producto) => {
        const li = document.createElement("li");
        li.textContent = producto.nombre;
        li.addEventListener("click", () => seleccionarProducto(producto));
        suggestionsList.appendChild(li);
      });
    } else {
      // Aquí solo mostramos "Producto no encontrado" si no hay coincidencias
      const li = document.createElement("li");
      li.textContent = "Producto no encontrado";
      li.classList.add("no-results");
      suggestionsList.appendChild(li);
    }
  } else {
    suggestionsList.style.display = "none"; // Ocultar las sugerencias si no hay texto
  }

  
}

// Funciones para manejar el carrito
function añadirProductoAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const indexProductoExistente = carrito.findIndex(
    (item) => item.productoId === producto.productoId
  );

  if (indexProductoExistente !== -1) {
    carrito[indexProductoExistente].cantidad += 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}


// Función para seleccionar un producto desde las sugerencias
function seleccionarProducto(producto) {
  const input = document.querySelector(".search-input");
  input.value = producto.nombre;

  // Actualizar productos visibles
  mostrarProductos([producto]);
  cerrarSugerencias();
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


// Mostrar mensaje cuando no hay productos o hay error
function mostrarPantallaVacia(mensaje) {
  const pantalla = document.querySelector(".pantalla");
  pantalla.classList.add("vacia");
  pantalla.textContent = mensaje;
}

// Ocultar la pantalla cuando hay productos
function ocultarPantalla() {
  const pantalla = document.querySelector(".pantalla");
  pantalla.classList.add("oculta");
}


// Función para actualizar el contador de productos
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorCarritoSpan = document.getElementById("contador-carrito");

  if (carrito.length > 0) {
    const totalProductos = carrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    );
    contadorCarritoSpan.textContent = totalProductos; // Muestra el total de productos
    contadorCarritoSpan.style.display = "inline-flex"; // Mostrar el contador
  } else {
    contadorCarritoSpan.style.display = "none"; // Ocultar si no hay productos
  }
}

////////////////////////////////////////////////////////

//DROPDOWN DE CATEGORIAS//

////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtn = document.querySelector(".dropdown-btn"); // Botón del dropdown
  const dropdownContent = document.querySelector(".dropdown-content"); // Contenido del dropdown

  // Evento para alternar la visibilidad del dropdown
  dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("show"); // Agrega o quita la clase 'show'
  });

  // Evento para cerrar el dropdown al hacer clic fuera de él
  document.addEventListener("click", (event) => {
    // Si el clic no ocurre dentro del botón o el contenido del dropdown, se cierra
    if (
      !dropdownBtn.contains(event.target) &&
      !dropdownContent.contains(event.target)
    ) {
      dropdownContent.classList.remove("show"); // Oculta el contenido
    }
  });

  // Función para obtener las categorías seleccionadas
  function obtenerCategoriasSeleccionadas() {
    const categoriasSeleccionadas = [];
    document.querySelectorAll(".categoria:checked").forEach((checkbox) => {
      categoriasSeleccionadas.push(checkbox.value); // Obtiene los valores de las categorías seleccionadas
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
      mostrarProductos(productosFiltrados); // Muestra solo los productos filtrados
    } else {
      mostrarProductos(productosOriginales); // Si no hay filtros, muestra todos los productos
    }
  }

  // Evento del botón "Aplicar Filtros"
  document
    .querySelector(".apply-filters")
    .addEventListener("click", filtrarProductosPorCategorias);

  // Cargar productos al cargar la página
  cargarProductos();
});

////////////////////////////////////////////////////////

//BOTON BASURA EN EL DROPDOWN DE CATEGORIAS//

////////////////////////////////////////////////////////

// Seleccionamos el botón y los checkboxes
const eliminarChecksBtn = document.getElementById("btn-trash");
const checkboxes = document.querySelectorAll(".categoria");

// Añadimos un evento de click al botón
eliminarChecksBtn.addEventListener("click", () => {
  // Iteramos sobre todos los checkboxes y los desmarcamos
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
});



document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const searchInput = document.querySelector(".search-input");
    const parametroBusqueda = localStorage.getItem("search"); // Obtener el valor de búsqueda desde localStorage
    console.log(parametroBusqueda);

    if (searchInput && parametroBusqueda) {
      searchInput.value = parametroBusqueda; // Colocar el valor en el input de búsqueda
      buscarProductos({ target: { value: parametroBusqueda } }); // Ejecutar la búsqueda automáticamente

      // Borrar el valor de búsqueda de localStorage después de realizar la búsqueda
      localStorage.removeItem("search");
    }
  }, 500); // Esperar medio segundo para asegurarse de que el DOM esté completamente cargado
});
