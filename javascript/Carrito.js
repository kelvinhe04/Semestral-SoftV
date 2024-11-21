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
    })
    .catch((err) => console.error("error;", err));
}
window.onload = cargarNavbar;



function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorCarritoSpan = document.getElementById("contador-carrito");

  if (carrito.length > 0) {
    contadorCarritoSpan.textContent = carrito.length; // Muestra el número de productos
    contadorCarritoSpan.style.display = "inline-flex"; // Mostrar el contador
  } else {
    contadorCarritoSpan.style.display = "none"; // Ocultar si no hay productos
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito(); // Sincroniza el contador al cargar
  cargarCarrito(); // Carga los productos en el carrito al iniciar
});

function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Obtener el carrito desde localStorage
  const contenedorCarrito = document.getElementById("carrito-container");

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  contenedorCarrito.innerHTML = ""; // Limpiar el contenedor

  carrito.forEach((producto) => {
    const productoHTML = `
      <div class="producto">
        <div class="img"><img src="${producto.rutaImagen}" alt="${producto.nombre}" /></div>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p>Precio: $${producto.precio}</p>
        <p>Stock: ${producto.stock}</p>
  
      </div>
    `;
    contenedorCarrito.innerHTML += productoHTML;
  });
}

// Cargar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", cargarCarrito);

