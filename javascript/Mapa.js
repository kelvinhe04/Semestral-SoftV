////////////////////////////////////////////////////////

//NAVBAR//

////////////////////////////////////////////////////////

function cargarNavbar() {
  fetch("../navbar.html")
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
  fetch("../Footer.html")
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
