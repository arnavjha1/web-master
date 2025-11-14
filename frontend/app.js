const API = "http://localhost:3000/api/resources";

// Load Highlights (Home page)
if (document.getElementById("highlight-container")) {
  fetch(API)
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("highlight-container");
      data.slice(0, 3).forEach(res => {
      container.innerHTML += `
        <div class="card">
          ${res.image ? `<img src="${res.image}" alt="${res.name}">` : ""}
          <div class="card-content">
            <h3>${res.name}</h3>
            <p>${res.description}</p>
          </div>
        </div>`;
      });
    });
}

// Directory Page
if (document.getElementById("directory-container")) {
  const searchBox = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");

  function loadDirectory() {
    fetch(API).then(r => r.json()).then(data => {
      const search = searchBox.value.toLowerCase();
      const category = categoryFilter.value;
      const filtered = data.filter(res =>
        (res.name.toLowerCase().includes(search) ||
         res.description.toLowerCase().includes(search)) &&
        (category === "" || res.category === category)
      );
      const container = document.getElementById("directory-container");
      container.innerHTML = filtered.map(res => `
        <div class="card">
          ${res.image ? `<img src="${res.image}" alt="${res.name}">` : ""}
          <div class="card-content">
            <h3>${res.name}</h3>
            <p>${res.description}</p>
          </div>
        </div>
      `).join("");
    });
  }

  searchBox.addEventListener("input", loadDirectory);
  categoryFilter.addEventListener("change", loadDirectory);
  loadDirectory();
}

// Submit Page
if (document.getElementById("resourceForm")) {
  document.getElementById("resourceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    alert("Resource submitted!");
    e.target.reset();
  });
}
