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
            <p>${res.description}</p><br>
            <a class="a" href="${res.website}" target="_blank">Visit Website</a>
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
            <p>${res.description}</p><br>
            <a class="a" href="${res.website}" target="_blank">Visit Website</a>
          </div>
        </div>
      `).join("");
    });
  }

  searchBox.addEventListener("input", loadDirectory);
  categoryFilter.addEventListener("change", loadDirectory);
  loadDirectory();
}

// Preview on Submit Page
if (document.getElementById("submit-container")) {
  const container = document.getElementById("submit-container");
  const name = document.getElementById("name");
  const desc = document.getElementById("description");
  const linker = document.getElementById("website");
  const image = document.getElementById("image");
  function loadDirectory() {
    const ifLink = linker.value.startsWith("http://") || linker.value.startsWith("https://");
    if(ifLink){  
      container.innerHTML = `
        <div class="card">
          <img src="`+image.value+`" alt="Put a valid image URL to see preview">
          <div class="card-content">
            <h3>`+name.value+`</h3>
            <p>`+desc.innerHTML+`</p><br>
            <a class="a" href="`+linker.value+`" target="_blank">Visit Website</a>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card">
          <img src="`+image.value+`" alt="Put a valid image URL to see preview">
          <div class="card-content">
            <h3>`+name.value+`</h3>
            <p>`+desc.value+`</p><br>
            <a class="a">Visit Website</a>
          </div>
        </div>
      `;
    }
  }
  name.addEventListener("input", loadDirectory);
  desc.addEventListener("input", loadDirectory);
  linker.addEventListener("input", loadDirectory);
  image.addEventListener("input", loadDirectory);
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
