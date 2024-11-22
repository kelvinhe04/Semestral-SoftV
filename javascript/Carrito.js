function cargarNavbar() {
  fetch("../navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error de red " + response.status);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
      actualizarContadorCarrito(); // Llamar después de cargar el navbar
    })
    .catch((err) => console.error("Error:", err));
}

window.onload = cargarNavbar;







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
  subtotalSpan.textContent = `Subtotal (${totalProductos} producto${totalProductos !== 1 ? "s" : ""}): $${subtotal.toFixed(2)}`;

}








function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener el carrito desde localStorage
  const contenedorCarrito = document.getElementById("carrito-container");

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
    const productoHTML = `
      <div class="producto">
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
              <div id="btn-trash">
                <a href="#"><i class="fa-solid fa-trash-can"></i></a>
              </div>
              <div id="cantidad-container">
                <h3>${producto.cantidad}</h3> <!-- Mostrar la cantidad -->
              </div>
              <div class="signo-mas">
                <img src="../Img/Iconos/plus.png" alt="Plus Icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    contenedorCarrito.insertAdjacentHTML("beforeend", productoHTML); // Agregar el producto al carrito
  });
}


document.addEventListener("DOMContentLoaded", () => {
 
  cargarCarrito();
  actualizarSubtotal();
});