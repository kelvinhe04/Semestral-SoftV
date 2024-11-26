
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
  const apiUrl = "https://localhost:7156/api/Productos/all";

  try {
    const response = await fetch(apiUrl);

    // Verificar si la respuesta es válida
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    // Convertir la respuesta en JSON
    const productos = await response.json();

    // Si no hay productos
    if (!productos || productos.length === 0) {
      mostrarPantallaVacia("No hay productos disponibles");
    } else {
      ocultarPantalla(); // Ocultamos la pantalla si hay productos
      mostrarProductos(productos); // Mostramos los productos
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarPantallaVacia(
      "Error al obtener los datos. Intenta de nuevo más tarde."
    );
  }
}

// Mostrar el mensaje cuando no hay productos o hay un error
function mostrarPantallaVacia(mensaje) {
  const pantalla = document.querySelector(".pantalla");
  pantalla.classList.add("vacia");
  pantalla.textContent = mensaje;
}

// Ocultar la pantalla cuando hay productos
function ocultarPantalla() {
  const pantalla = document.querySelector(".pantalla");
  pantalla.classList.add("oculta");

  // Opcional: Eliminar del DOM después de la animación
  setTimeout(() => {
    pantalla.remove();
  }, 300); // El mismo tiempo que la animación de transición
}

////////////////////////////////////////////////////////

//PASAR LOS PRODUCTOS DE ORDERNAR.HTML A CARRITO.HTML//

////////////////////////////////////////////////////////

// Función para añadir un producto al carrito
function añadirProductoAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificar si el producto ya existe en el carrito
  const indexProductoExistente = carrito.findIndex(
    (item) => item.productoId === producto.productoId
  );

  if (indexProductoExistente !== -1) {
    // Si el producto ya existe, solo aumentamos la cantidad
    carrito[indexProductoExistente].cantidad += 1;
  } else {
    // Si el producto no existe, lo añadimos con cantidad 1
    producto.cantidad = 1;
    carrito.push(producto);
  }

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar el contador y el subtotal
  actualizarContadorCarrito();
}

////////////////////////////////////////////////////////

//MOSTRAR LOS PRODUCTOS DESPUES DE CONSUMIR LA API//

////////////////////////////////////////////////////////

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
        <div 
          class="btn add-to-cart-btn" 
          data-id="${producto.productoId}" 
          data-nombre="${producto.nombre}" 
          data-descripcion="${producto.descripcion}" 
          data-precio="${producto.precio}" 
          data-stock="${producto.stock}" 
          data-rutaImagen="${producto.rutaImagen}">
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
      const producto = {
        productoId: boton.getAttribute("data-id"),
        nombre: boton.getAttribute("data-nombre"),
        descripcion: boton.getAttribute("data-descripcion"),
        precio: parseFloat(boton.getAttribute("data-precio")),
        stock: parseInt(boton.getAttribute("data-stock")),
        rutaImagen: boton.getAttribute("data-rutaImagen"),
      };

      // Verificar si el stock es 0
      if (producto.stock <= 0) {
        alert(`El producto "${producto.nombre}" no está disponible.`);
        return; // No añadir el producto al carrito
      }

      añadirProductoAlCarrito(producto);
    });
  });
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
