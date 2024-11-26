////////////////////////////////////////////////////////

//NAVBAR//

////////////////////////////////////////////////////////

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
  cargarFooter();
}

window.onload = inicializar;
