// LUMA ESTATES — Part 3: Full JavaScript functionality
const properties = [
  { id: 1, title: "Clifton Ocean Residence", location: "Clifton, Cape Town", type: "House", price: 12500000, status: "For Sale", beds: 5, baths: 4, area: 420, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
  { id: 2, title: "V&A Waterfront Apartment", location: "Waterfront, Cape Town", type: "Apartment", price: 6950000, status: "For Sale", beds: 3, baths: 2, area: 180, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" },
  { id: 3, title: "Constantia Garden Villa", location: "Constantia, Cape Town", type: "Villa", price: 9800000, status: "For Sale", beds: 4, baths: 3, area: 350, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85" },
  { id: 4, title: "Camps Bay Modern Retreat", location: "Camps Bay, Cape Town", type: "House", price: 15900000, status: "For Sale", beds: 6, baths: 5, area: 510, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" },
  { id: 5, title: "Sea Point City Apartment", location: "Sea Point, Cape Town", type: "Apartment", price: 4200000, status: "For Sale", beds: 2, baths: 2, area: 110, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85" },
  { id: 6, title: "Bishopscourt Family Estate", location: "Bishopscourt, Cape Town", type: "Villa", price: 18500000, status: "For Sale", beds: 6, baths: 5, area: 620, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85" }
];

const grid = document.querySelector(".property-grid");
const searchForm = document.querySelector(".search-panel");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const contactForm = document.querySelector(".contact-form");
let favourites = JSON.parse(localStorage.getItem("lumaFavourites") || "[]");

const money = value => new Intl.NumberFormat("en-ZA", {
  style: "currency", currency: "ZAR", maximumFractionDigits: 0
}).format(value);

function renderProperties(list = properties) {
  if (!grid) return;
  grid.innerHTML = list.map(p => `
    <article class="property-card" data-id="${p.id}">
      <div class="image-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <button class="favourite ${favourites.includes(p.id) ? "active" : ""}" data-favourite="${p.id}" aria-label="Favourite ${p.title}">
          ${favourites.includes(p.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="card-body">
        <span>${p.status}</span>
        <h3>${p.title}</h3>
        <p>${p.location}</p>
        <div class="property-meta">${p.beds} beds &nbsp; • &nbsp; ${p.baths} baths &nbsp; • &nbsp; ${p.area} m²</div>
        <strong>${money(p.price)}</strong>
        <button class="details-button" data-details="${p.id}">View details</button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-favourite]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.favourite);
      favourites = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id];
      localStorage.setItem("lumaFavourites", JSON.stringify(favourites));
      renderProperties(list);
    });
  });

  grid.querySelectorAll("[data-details]").forEach(btn => {
    btn.addEventListener("click", () => openModal(properties.find(p => p.id === Number(btn.dataset.details))));
  });
}

function filterProperties(event) {
  event.preventDefault();
  const inputs = searchForm.querySelectorAll("input, select");
  const location = inputs[0].value.trim().toLowerCase();
  const type = inputs[1].value;
  const price = inputs[2].value;

  let results = properties.filter(p => {
    const matchesLocation = !location || p.location.toLowerCase().includes(location);
    const matchesType = type === "Any type" || p.type === type;
    const matchesPrice =
      price === "Any price" ||
      (price === "Under R2m" && p.price < 2000000) ||
      (price === "R2m – R5m" && p.price >= 2000000 && p.price <= 5000000) ||
      (price === "R5m+" && p.price > 5000000);
    return matchesLocation && matchesType && matchesPrice;
  });

  renderProperties(results);
  document.querySelector("#properties").scrollIntoView({ behavior: "smooth" });
}

function openModal(property) {
  const old = document.querySelector(".property-modal");
  if (old) old.remove();
  const modal = document.createElement("div");
  modal.className = "property-modal";
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="${property.title}">
      <button class="modal-close" aria-label="Close">×</button>
      <img src="${property.image}" alt="${property.title}">
      <div class="modal-content">
        <span>${property.status}</span>
        <h2>${property.title}</h2>
        <p>${property.location}</p>
        <div class="modal-price">${money(property.price)}</div>
        <p>${property.beds} bedrooms • ${property.baths} bathrooms • ${property.area} m²</p>
        <button class="button enquire-now">Enquire about this property</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.body.classList.add("modal-open");

  const close = () => {
    modal.remove();
    document.body.classList.remove("modal-open");
  };
  modal.querySelector(".modal-close").onclick = close;
  modal.querySelector(".modal-backdrop").onclick = close;
  modal.querySelector(".enquire-now").onclick = () => {
    close();
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  };
}

if (searchForm) searchForm.addEventListener("submit", filterProperties);

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuToggle.textContent = nav.classList.contains("open") ? "×" : "☰";
  });
}
document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const button = contactForm.querySelector("button");
    button.textContent = "Enquiry sent ✓";
    button.disabled = true;
    contactForm.reset();
    setTimeout(() => {
      button.textContent = "Send enquiry";
      button.disabled = false;
    }, 3000);
  });
}

renderProperties();

function initPropertiesPage() {
  const pageGrid = document.querySelector("#all-properties");
  const filterForm = document.querySelector("#property-filter-form");
  const locationInput = document.querySelector("#property-location");
  const typeSelect = document.querySelector("#property-type");
  const priceSelect = document.querySelector("#property-price");
  const resetButton = document.querySelector("#reset-filters");
  const resultCount = document.querySelector("#result-count");

  if (!pageGrid || !filterForm) return;

  function renderPageProperties(list) {
    if (!list.length) {
      pageGrid.innerHTML = `
        <div class="no-results">
          <h3>No properties found</h3>
          <p>Try changing your search or resetting the filters.</p>
        </div>`;
    } else {
      pageGrid.innerHTML = list.map(p => `
        <article class="property-card" data-id="${p.id}">
          <div class="image-wrap">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <button class="favourite ${favourites.includes(p.id) ? "active" : ""}"
              data-page-favourite="${p.id}" aria-label="Favourite ${p.title}">
              ${favourites.includes(p.id) ? "♥" : "♡"}
            </button>
          </div>
          <div class="card-body">
            <span>${p.status}</span>
            <h3>${p.title}</h3>
            <p>${p.location}</p>
            <div class="property-meta">${p.beds} beds &nbsp; • &nbsp; ${p.baths} baths &nbsp; • &nbsp; ${p.area} m²</div>
            <strong>${money(p.price)}</strong>
            <button class="details-button" data-page-details="${p.id}">View details</button>
          </div>
        </article>
      `).join("");
    }

    resultCount.textContent = `${list.length} ${list.length === 1 ? "property" : "properties"} found`;

    pageGrid.querySelectorAll("[data-page-favourite]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.pageFavourite);
        favourites = favourites.includes(id)
          ? favourites.filter(x => x !== id)
          : [...favourites, id];
        localStorage.setItem("lumaFavourites", JSON.stringify(favourites));
        applyFilters();
      });
    });

    pageGrid.querySelectorAll("[data-page-details]").forEach(btn => {
      btn.addEventListener("click", () => {
        const property = properties.find(p => p.id === Number(btn.dataset.pageDetails));
        if (property) openModal(property);
      });
    });
  }

  function applyFilters() {
    const location = locationInput.value.trim().toLowerCase();
    const type = typeSelect.value;
    const maxPrice = priceSelect.value;

    const filtered = properties.filter(p => {
      const locationMatch =
        !location ||
        p.location.toLowerCase().includes(location) ||
        p.title.toLowerCase().includes(location);

      const typeMatch = type === "Any type" || p.type === type;
      const priceMatch = maxPrice === "Any price" || p.price <= Number(maxPrice);

      return locationMatch && typeMatch && priceMatch;
    });

    renderPageProperties(filtered);
  }

  filterForm.addEventListener("submit", event => {
    event.preventDefault();
    applyFilters();
  });

  resetButton.addEventListener("click", () => {
    locationInput.value = "";
    typeSelect.value = "Any type";
    priceSelect.value = "Any price";
    applyFilters();
  });

  renderPageProperties(properties);
}

// ------------------------------------------------------------
// ALL PROPERTIES PAGE
// ------------------------------------------------------------
const additionalProperties = [
  { id: 7, title: "Sandton Skyline Penthouse", location: "Sandton, Johannesburg", city: "Johannesburg", type: "Apartment", price: 11800000, status: "For Sale", beds: 4, baths: 4, area: 310, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" },
  { id: 8, title: "Umhlanga Coastal Villa", location: "Umhlanga, Durban", city: "Durban", type: "Villa", price: 8900000, status: "For Sale", beds: 5, baths: 4, area: 390, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
  { id: 9, title: "Stellenbosch Winelands Estate", location: "Stellenbosch, Western Cape", city: "Stellenbosch", type: "Estate", price: 14500000, status: "For Sale", beds: 6, baths: 5, area: 580, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85" },
  { id: 10, title: "Waterkloof Family Residence", location: "Waterkloof, Pretoria", city: "Pretoria", type: "House", price: 7350000, status: "For Sale", beds: 5, baths: 4, area: 410, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" },
  { id: 11, title: "Knysna Lagoon Retreat", location: "Knysna, Western Cape", city: "Knysna", type: "Villa", price: 6500000, status: "For Sale", beds: 4, baths: 3, area: 290, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85" },
  { id: 12, title: "Claremont Contemporary Home", location: "Claremont, Cape Town", city: "Cape Town", type: "House", price: 5850000, status: "For Sale", beds: 4, baths: 3, area: 280, image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85" },
  { id: 13, title: "Camps Bay Ocean Penthouse", location: "Camps Bay, Cape Town", city: "Cape Town", type: "Apartment", price: 13200000, status: "For Sale", beds: 3, baths: 3, area: 225, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85" },
  { id: 14, title: "Bryanston Modern Estate", location: "Bryanston, Johannesburg", city: "Johannesburg", type: "Estate", price: 10900000, status: "For Sale", beds: 5, baths: 5, area: 520, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" },
  { id: 15, title: "La Lucia Hillside Home", location: "La Lucia, Durban", city: "Durban", type: "House", price: 6200000, status: "For Sale", beds: 4, baths: 3, area: 330, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85" }
];

const allProperties = [...properties, ...additionalProperties];

const allGrid = document.querySelector("#allPropertiesGrid");
const propertySearch = document.querySelector("#propertySearch");
const locationFilter = document.querySelector("#locationFilter");
const typeFilter = document.querySelector("#typeFilter");
const sortFilter = document.querySelector("#sortFilter");
const resultsCount = document.querySelector("#resultsCount");

function renderAllProperties(list) {
  if (!allGrid) return;

  resultsCount.textContent = `${list.length} ${list.length === 1 ? "property" : "properties"} found`;

  allGrid.innerHTML = list.map(p => `
    <article class="property-card" data-id="${p.id}">
      <div class="image-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <button class="favourite ${favourites.includes(p.id) ? "active" : ""}"
          data-favourite-all="${p.id}" aria-label="Favourite ${p.title}">
          ${favourites.includes(p.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="card-body">
        <span>${p.status}</span>
        <h3>${p.title}</h3>
        <p>${p.location}</p>
        <div class="property-meta">${p.beds} beds &nbsp; • &nbsp; ${p.baths} baths &nbsp; • &nbsp; ${p.area} m²</div>
        <strong>${money(p.price)}</strong>
        <button class="details-button" data-details-all="${p.id}">View details</button>
      </div>
    </article>
  `).join("");

  allGrid.querySelectorAll("[data-favourite-all]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.favouriteAll);
      favourites = favourites.includes(id)
        ? favourites.filter(x => x !== id)
        : [...favourites, id];

      localStorage.setItem("lumaFavourites", JSON.stringify(favourites));
      renderAllProperties(list);
    });
  });

  allGrid.querySelectorAll("[data-details-all]").forEach(btn => {
    btn.addEventListener("click", () => {
      const property = allProperties.find(p => p.id === Number(btn.dataset.detailsAll));
      openModal(property);
    });
  });
}

function filterAllProperties() {
  if (!allGrid) return;

  const query = (propertySearch.value || "").trim().toLowerCase();
  const location = locationFilter.value;
  const type = typeFilter.value;
  const sort = sortFilter.value;

  let filtered = allProperties.filter(p => {
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query);

    const matchesLocation = location === "All" || p.city === location;
    const matchesType = type === "All" || p.type === type;

    return matchesSearch && matchesLocation && matchesType;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  renderAllProperties(filtered);
}

if (allGrid) {
  // The page starts with all 15 properties visible. Filters replace the cards
  // with the matching results; clearing filters restores the full collection.
  propertySearch.addEventListener("input", filterAllProperties);
  locationFilter.addEventListener("change", filterAllProperties);
  typeFilter.addEventListener("change", filterAllProperties);
  sortFilter.addEventListener("change", filterAllProperties);
  renderAllProperties(allProperties);
}
