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


async function cargarProductos() {
  const apiUrl = "https://localhost:7156/api/Productos/all";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const productos = await response.json();

    const contenedor = document.getElementById("productos-container");

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
        </div>
      `;
      contenedor.innerHTML += productoHTML;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarProductos);
