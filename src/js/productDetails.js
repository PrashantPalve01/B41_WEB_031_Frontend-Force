const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const category = urlParams.get('category');

const currentUser = sessionStorage.getItem('currentUser');
const addToBagButton = document.getElementById('addToBag');
if (!currentUser) {
  const banner = document.createElement('div');
  banner.className = 'flex justify-between items-center px-6 py-2 bg-gray-100';
  banner.innerHTML = `
    <p class="text-sm text-black">
      Don’t miss out on your favourite products. Create an account or sign in to save your bag.
    </p>
    <button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800" onclick="redirectToLogin()">Login</button>
  `;
  document.body.prepend(banner);

  addToBagButton.disabled = true;
  addToBagButton.classList.add('cursor-not-allowed', 'opacity-50');
  addToBagButton.title = "You are not logged in. Please login to add products to your bag.";
} else {
  addToBagButton.disabled = false;
  addToBagButton.classList.remove('cursor-not-allowed', 'opacity-50');
  addToBagButton.title = "";
}

function redirectToLogin() {
  window.location.href = 'sign-register.html';
}

async function fetchProductDetails() {
  try {
    const fetchUrl = `https://product-data-371b9-default-rtdb.firebaseio.com/${category}.json`;
    console.log("Fetching data from:", fetchUrl);
    const response = await fetch(fetchUrl);
    const data = await response.json();
    if (!data) {
      console.error("No data found for this category");
      return;
    }

    const product = Object.values(data).find(item => item.id == productId);

    if (product) {
      renderProductDetails(product);
    } else {
      console.error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

function renderProductDetails(product) {
  document.querySelector("#productImage").src = product.image;
  document.querySelector("#productImage").alt = product.name;
  document.querySelector("#productName").textContent = product.name;
  document.querySelector("#productCategory").textContent = product.category;
  document.querySelector("#productPrice").textContent = `Price: ₹${product.price.toFixed(2)}`;
  document.querySelector("#productDescription").textContent = product.description;
  document.querySelector("#productDetails").textContent = product.details;
  document.querySelector("#productId").textContent = `Product ID: ${product.id}`;

  const colorContainer = document.querySelector("#colorSection");
  const sizeContainer = document.querySelector("#sizeSection");
  const errorMessage = document.getElementById("errorMessage");

  if (product.colors && product.colors.length > 0) {
    const colorOptions = document.querySelector("#colorOptions");
    product.colors.forEach(color => {
      const colorButton = document.createElement("button");
      colorButton.style.backgroundColor = color;
      colorButton.className = "w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400";
      colorButton.onclick = () => handleColorSelection(color, colorButton);
      colorOptions.appendChild(colorButton);
    });
  } else {
    colorContainer.classList.add("hidden");
  }

  if (product.sizes && product.sizes.length > 0) {
    const sizeOptions = document.querySelector("#sizeOptions");
    product.sizes.forEach(size => {
      const sizeButton = document.createElement("button");
      sizeButton.textContent = size;
      sizeButton.className =
        "px-4 py-2 border bg-gray-100 rounded-md focus:ring-2 focus:ring-black focus:ring-offset-2";
      sizeButton.onclick = () => handleSizeSelection(size, sizeButton);
      sizeOptions.appendChild(sizeButton);
    });
  } else {
    sizeContainer.classList.add("hidden");
  }

  addToBagButton.onclick = () => {
    const selectedColor = document.querySelector("#colorOptions button.selected");
    const selectedSize = document.querySelector("#sizeOptions button.selected");

    if ((product.colors && !selectedColor) || (product.sizes && !selectedSize)) {
      errorMessage.textContent =
        !selectedColor && product.colors
          ? "Please select a color!"
          : "Please select a size!";
      errorMessage.classList.remove("hidden");
    } else {
      errorMessage.classList.add("hidden");

      const productData = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        color: selectedColor ? selectedColor.style.backgroundColor : "None",
        size: selectedSize ? selectedSize.textContent : "None",
        quantity: 1,
      };

      const userId = currentUser;

      let productBag = JSON.parse(localStorage.getItem("productBag")) || {};

      if (!productBag[userId]) {
        productBag[userId] = [];
      }

      const productInBag = productBag[userId].find(
        item => item.id === product.id && item.color === productData.color && item.size === productData.size
      );
      if (productInBag) {
        if (
          !confirm(
            "Product already in the bag. Do you want to increase the quantity? Go to the bag."
          )
        ) {
          return;
        }
        window.location.href = "bag.html";
      } else {
        productBag[userId].push(productData);
        alert("Item successfully added to your bag! Continue shopping 🛒 proceed to checkout.")
        window.location.href = "bag.html";
      }

      localStorage.setItem("productBag", JSON.stringify(productBag));
    }
  };
}

function handleColorSelection(color, button) {
  const colorButtons = document.querySelectorAll("#colorOptions button");

  colorButtons.forEach(b => b.classList.remove("ring-2", "ring-black", "selected"));

  button.classList.add("ring-2", "ring-black", "selected");

  document.querySelector("#colorName").textContent = `Selected Color: ${color}`;
}

function handleSizeSelection(size, button) {
  const sizeButtons = document.querySelectorAll("#sizeOptions button");

  sizeButtons.forEach(b => b.classList.remove("bg-gray-100", "bg-black", "text-white", "selected"));

  button.classList.add("bg-black", "text-white", "selected");

  document.querySelector("#errorMessage").classList.add("hidden");

  document.querySelector("#sizeName").textContent = `Selected Size: ${size}`;
}

fetchProductDetails();