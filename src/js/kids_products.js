// JavaScript Code
const refineButton = document.getElementById("refineButton");
const refineModal = document.getElementById("refineModal");
const closeRefine = document.getElementById("closeRefine");
const applyFilter = document.getElementById("applyFilter");

let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];

refineButton.addEventListener("click", () => {
  refineModal.classList.remove("-translate-x-full");
});

closeRefine.addEventListener("click", () => {
  refineModal.classList.add("-translate-x-full");
});

applyFilter.addEventListener("click", () => {
  refineModal.classList.add("-translate-x-full");

  const priceFilter = document.querySelector('select[name="price"]').value;
  const categoryFilter = document.querySelector('select[name="category"]').value;

  filteredProducts = allProducts.filter(product => {
    let matchCategory = true;
    let matchPrice = true;

    if (categoryFilter && categoryFilter !== "all" && product.category !== categoryFilter) {
      matchCategory = false;
    }

    return matchCategory && matchPrice;
  });

  if (priceFilter === 'High to Low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (priceFilter === 'Low to High') {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  currentPage = 1; 
  renderProducts(paginateProducts(filteredProducts));
  renderPagination(filteredProducts);
});

async function fetchProducts() {
  try {
    const response = await fetch('https://product-data-371b9-default-rtdb.firebaseio.com/kids.json');
    const data = await response.json();

    if (data) {
      allProducts = Object.values(data);
      const itemCount = document.getElementById('itemCount');
      itemCount.textContent = `[${allProducts.length} items]`;
      filteredProducts = allProducts;
      renderProducts(paginateProducts(filteredProducts));
      renderPagination(filteredProducts);
    } else {
      console.error('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function paginateProducts(products) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return products.slice(startIndex, endIndex);
}

function renderPagination(products) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const createButton = (text, isDisabled, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `px-3 py-1 mx-1 border rounded-sm ${isDisabled ? 'cursor-not-allowed bg-gray-400 text-white' : 'hover:bg-black hover:text-white'}`;
    if (!isDisabled) {
      button.onclick = onClick;
    }
    return button;
  };

  const prevButton = createButton('Previous', currentPage === 1, () => {
    currentPage--;
    renderProducts(paginateProducts(products));
    renderPagination(products);
  });
  paginationContainer.appendChild(prevButton);

  let startPage = Math.max(currentPage - 1, 1);
  let endPage = Math.min(currentPage + 1, totalPages);

  if (currentPage === 1) {
    endPage = Math.min(3, totalPages);
  } else if (currentPage === totalPages) {
    startPage = Math.max(totalPages - 2, 1);
  }

  if (startPage > 1) {
    paginationContainer.appendChild(createButton('1', false, () => {
      currentPage = 1;
      renderProducts(paginateProducts(products));
      renderPagination(products);
    }));

    if (startPage > 2) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      dots.className = 'mx-1';
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createButton(i, i === currentPage, () => {
      currentPage = i;
      renderProducts(paginateProducts(products));
      renderPagination(products);
    });
    if (i === currentPage) {
      pageButton.classList.add('bg-black', 'text-white');
    }
    paginationContainer.appendChild(pageButton);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      dots.className = 'mx-1';
      paginationContainer.appendChild(dots);
    }

    paginationContainer.appendChild(createButton(totalPages, false, () => {
      currentPage = totalPages;
      renderProducts(paginateProducts(products));
      renderPagination(products);
    }));
  }

  const nextButton = createButton('Next', currentPage === totalPages, () => {
    currentPage++;
    renderProducts(paginateProducts(products));
    renderPagination(products);
  });
  paginationContainer.appendChild(nextButton);
}


function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');

  productGrid.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'bg-white rounded-sm border shadow-md overflow-hidden relative cursor-pointer hover:border-black p-1';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="w-full h-100 md:h-70 xl:h-80">
      <div class="border-t px-4 mt-2 py-3">
        <h3 class="text-lg font-bold">${product.name}</h3>
        <p class="text-gray-900 text-md">&#8377; ${product.price.toFixed(2)}</p>
        <p class="text-gray-600 text-sm">${product.description}</p>
      </div>
    `;
    
    productCard.onclick = () => {
      window.location.href = `product_details.html?id=${product.id}&category=kids`;
    };

    productGrid.appendChild(productCard);
  });
}

fetchProducts();
