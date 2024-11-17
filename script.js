// script.js
function searchFunction() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const searchResults = document.getElementById("searchResults");

  // Simulamos una lista de datos a buscar (puedes reemplazarla por datos reales o hacer peticiones a una API)
  const data = [
    "Manzana",
    "Plátano",
    "Naranja",
    "Fresa",
    "Mango",
    "Uva",
    "Sandía",
  ];

  // Filtramos los resultados que coinciden con el texto ingresado
  const filteredResults = data.filter((item) =>
    item.toLowerCase().includes(searchInput)
  );

  // Mostrar los resultados
  if (filteredResults.length > 0) {
    searchResults.innerHTML = `<p>Resultados encontrados:</p><ul>${filteredResults
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  } else {
    searchResults.innerHTML = `<p>No se encontraron resultados.</p>`;
  }
}
