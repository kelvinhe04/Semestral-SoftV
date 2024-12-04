////////////////////////////////////////////////////////

//NAVBAR//

////////////////////////////////////////////////////////

function cargarNavbar() {
  fetch("navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar navbar " + response.status); //Mensaje de error si la carga falla
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data; //Inserta el navbar en el contenedor
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
      document.getElementById("footer-container").innerHTML = data; //Inserta el Footer en el contenedor
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

window.onload = inicializar; //ejecuta la funcion cuando la pagina haya cargado completamente

// Función para actualizar el contador de productos
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorCarritoSpan = document.getElementById("contador-carrito");

  if (carrito.length > 0) {
    contadorCarritoSpan.textContent = carrito.length; // Muestra el número de productos

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

// Función para actualizar el subtotal
function actualizarSubtotal() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const subtotalSpan = document.getElementById("subtotal-carrito"); // Este es el span donde mostrarás el subtotal

  if (!subtotalSpan) {
    console.error("Elemento con id 'subtotal-carrito' no encontrado.");
    return;
  }

  let subtotal = 0;
  let totalProductos = 0; // Variable para contar la cantidad total de productos

  carrito.forEach((producto) => {
    const precio = parseFloat(producto.precio || 0); // Asegurarnos de que el precio es válido
    const cantidad = parseInt(producto.cantidad || 1, 10); // Asegurarnos de que la cantidad es válida
    subtotal += precio * cantidad; // Multiplicar el precio por la cantidad
    totalProductos += cantidad; // Sumar la cantidad al total de productos
  });

  // Actualizar el contenido del subtotal
  subtotalSpan.innerHTML = `Subtotal (${totalProductos} producto${
    totalProductos !== 1 ? "s" : ""
  })<br>$${subtotal.toFixed(2)}`;
}

function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener el carrito desde localStorage
  const contenedorCarrito = document.getElementById("carrito-container");
  console.log("Carrito con los productos antes de enviar:", carrito);


  if (carrito.length === 0) {
    contenedorCarrito.classList.add("vacio"); // Añadir clase para cuando el carrito está vacío
    contenedorCarrito.innerHTML = `
      <h1 class="indicador-vacio titulo">El carrito está vacío.</h1>
      <p class="indicador-vacio parrafo">¡No dejes tu carrito vacío! <a href="Ordenar.html" class="enlace-ordenar">Ordena ahora</a> y llena tu hogar de sabor y frescura.</p>
    `;
    return;
  }

  contenedorCarrito.innerHTML = ""; // Limpiar el contenedor

  // Agrupar los productos por productoId para evitar mostrar duplicados
  const productosAgrupados = carrito.reduce((acc, producto) => {
    if (acc[producto.productoId]) {
      acc[producto.productoId].cantidad += producto.cantidad;
    } else {
      acc[producto.productoId] = { ...producto };
    }
    return acc;
  }, {});

  // Mostrar cada producto una sola vez con su cantidad
  Object.values(productosAgrupados).forEach((producto) => {
    const esUnico = producto.cantidad === 1; // Verificar si la cantidad es 1

    //Crea el HTML para mostrar el producto
    const productoHTML = ` 
      <div class="producto" data-id="${producto.productoId}">
        <div class="img">
          <img src="${producto.rutaImagen}" alt="${producto.nombre}" />
        </div>
        <div class="seccionador">  
          <div class="izquierda-seccionador">  
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
          </div>
          <div class="derecha-seccionador"> 
            <div class="incrementar"> 
              
                ${
                  esUnico
                    ? `<a href="#" class="btn-trash"><i class="fa-solid fa-trash-can"></i></a>`
                    : ""
                }
                ${
                  esUnico
                    ? ""
                    : `<a href="#" class="minus"><i class="fa-solid fa-minus"></i></a>`
                }
              
              <div id="cantidad-container">
                <h3>${producto.cantidad}</h3> <!-- Mostrar la cantidad -->
              </div>
              
                
                <a href="#" class="plus"><i class="fa-solid fa-plus"></i></a>
              
            </div>
          </div>
        </div>
      </div>
    `;
    contenedorCarrito.insertAdjacentHTML("beforeend", productoHTML); // Agregar el producto al carrito

    // Agregar interactividad a los botones
    agregarEventos(producto.productoId, producto.cantidad);
  });
}

// Función para agregar eventos a los botones de cantidad
function agregarEventos(productoId, cantidad) {
  // Evento para el botón de eliminación (Basura)
  const btnTrash = document.querySelector(
    `[data-id="${productoId}"] .btn-trash`
  );
  if (btnTrash) {
    btnTrash.addEventListener("click", (e) => {
      e.preventDefault();
      eliminarProductoDelCarrito(productoId);
      actualizarContadorCarrito();
      actualizarSubtotal();
    });
  }

  // Evento para disminuir la cantidad
  if (cantidad > 1) {
    const btnMinus = document.querySelector(`[data-id="${productoId}"] .minus`);
    if (btnMinus) {
      btnMinus.addEventListener("click", (e) => {
        e.preventDefault();
        actualizarCantidadProducto(productoId, -1);
        actualizarContadorCarrito();
        actualizarSubtotal();
      });
    }
  }

  // Evento para aumentar la cantidad
  const btnPlus = document.querySelector(`[data-id="${productoId}"] .plus`);
  if (btnPlus) {
    btnPlus.addEventListener("click", (e) => {
      e.preventDefault();
      actualizarCantidadProducto(productoId, 1);
      actualizarContadorCarrito();
      actualizarSubtotal();
    });
  }
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidadProducto(productoId, cantidad) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Buscar el producto en el carrito
  const producto = carrito.find(
    (producto) => producto.productoId === productoId
  );
  if (producto) {
    // Actualizar la cantidad
    producto.cantidad += cantidad;

    if (producto.cantidad <= 0) {
      carrito = carrito.filter((prod) => prod.productoId !== productoId);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Recargar el carrito para reflejar los cambios
    cargarCarrito();
  }
}
// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(productoId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Filtrar el producto para eliminarlo del carrito
  carrito = carrito.filter((producto) => producto.productoId !== productoId);

  // Guardar el carrito actualizado
  localStorage.setItem("carrito", JSON.stringify(carrito));

  cargarCarrito();
}


document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  actualizarSubtotal();
});


// Evento para el botón "Borrar todo"
const botonBorrarTodo = document.getElementById("borrar-todo");
if (botonBorrarTodo) {
  botonBorrarTodo.addEventListener("click", borrarTodoCarrito);
}


// Función para vaciar todo el carrito
function borrarTodoCarrito() {
  // Obtener el carrito actual de localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
console.log("Carrito desde localStorage:", carrito);

  // Verificar si hay productos en el carrito
  if (carrito.length === 0) {
    console.log("El carrito ya está vacío.");
    return; // No hay necesidad de sincronizar con la API si ya está vacío
  }

  // Registrar ventas primero
  registrarVentas(carrito)
    .then(() => {
      // Después de registrar las ventas, actualizar el stock de los productos
      return actualizarProductoEnAPI(carrito);
    })
    .then(() => {
      // Eliminar todo el carrito de localStorage después de completar ambas operaciones
      localStorage.removeItem("carrito");

      actualizarContadorCarrito();
      actualizarSubtotal();
      // Recargar el contenido del carrito (debería mostrarse vacío)
      cargarCarrito();
    })
    .catch((error) => {
      console.error("Error al procesar el carrito:", error);
    });
}

// Función para sincronizar los productos con la API
function actualizarProductoEnAPI(carrito) {
  return fetch("https://localhost:7156/api/Productos/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      carrito.map((producto) => ({
        ProductoId: producto.productoId,
        Cantidad: producto.cantidad,
      }))
    ),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la sincronización con la API para actualizar productos");
      }
      return response.json(); // Procesar la respuesta de la API
    })
    .then((data) => {
      console.log("Sincronización con la API exitosa para actualización de productos:", data);
    });
}

function registrarVentas(carrito) {
  // Verifica el contenido del carrito antes de enviar
  console.log("Datos del carrito a enviar:", carrito);

  return fetch("https://localhost:7156/api/Ventas/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      carrito.map((producto) => ({
        ProductoId: producto.productoId,
        Cantidad: producto.cantidad,
        Precio: producto.precio,
        VendedorId: producto.vendedorId,
      }))
    ),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al registrar las ventas");
      }
      return response.json(); // Procesar la respuesta de la API
    })
    .then((data) => {
      console.log("Ventas registradas exitosamente:", data);
    });
}

