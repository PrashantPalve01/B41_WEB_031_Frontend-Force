const currentUser = sessionStorage.getItem('currentUser');
const loginMsg = document.querySelector('.loginMsg');

if (currentUser) {
  const productBag = JSON.parse(localStorage.getItem('productBag')) || {};
  const userBag = productBag[currentUser];

  if (userBag && userBag.length > 0) {
    displayBagItems(userBag);
  } else {
    document.querySelector('.container').innerHTML = `
        <h1 class="text-5xl font-serif font-bold">Your bag is empty.</h1> 
        <p class="my-4 text-gray-700">Add to your bag by clicking on your size on an item or in the product detail page.</p>
        <a href="index.html" class="px-4 mt-10 py-2 bg-black text-white w-full border hover:bg-white hover:text-black hover:border-black" >Continue Shopping</a>
    `;
  }
} else {
  
    const banner = document.createElement('div');
    banner.className = 'flex justify-between items-center px-6 py-2 bg-gray-100';
    banner.innerHTML = `
        <p class="text-sm text-black">
        Don’t miss out on your favourite products. Create an account or sign in to save your bag.
        </p>
        <button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800" onclick="redirectToLogin()">Login</button>
    `;
    loginMsg.append(banner);

    document.querySelector('.container').innerHTML = `
        <h1 class="text-5xl font-serif font-bold">Your bag is empty.</h1> 
        <p class="my-4 text-gray-700">Create an account or sign in to see your favorite wishlist items. <a onclick="redirectToLogin()" class="text-blue-500 hover:cursor-pointer hover:underline">Login/Register</a></p>
    `;

}

function redirectToLogin() {
    window.location.href = 'sign-register.html';
}

function displayBagItems(userBag) {
  const bagTableBody = document.getElementById('bagItems');
  const totalItemsElement = document.getElementById('totalItems');
  const subtotalElement = document.getElementById('subtotal');
  const totalPriceElement = document.getElementById('totalPrice');

  bagTableBody.innerHTML = '';

  let totalPrice = 0;
  let totalItems = 0;

  userBag.forEach(item => {
    const { id, name, color, size, quantity, price, image } = item;

    const row = document.createElement('tr');
    
    row.classList.add('border-b');
    row.innerHTML = `
      <td class="flex items-center gap-4 py-4">
        <img src="${image}" alt="Product Image" class="w-70 h-20 object-cover">
        <div>
          <p class="font-medium text-black">${name}</p>
          <p class="text-sm text-gray-500">Color: ${color}</p>
        </div>
      </td>
      <td class="py-4 px-2">
        <p>${size}</p>
      </td>
      <td class="py-4 px-2">
        <select class="block w-full px-2 py-1 border rounded-md" onchange="updateQuantity(event, '${id}', '${size}', '${color}')">
          ${[...Array(30).keys()].map(i => `<option ${i+1 === quantity ? 'selected' : ''}>${i+1}</option>`).join('')}
        </select>
      </td>
      <td class="py-4 px-2 font-medium text-black">&#8377;${(price * quantity).toFixed(2)}</td>
      <td class="py-4 text-center">
        <button class="remove-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500 hover:text-black">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    `;

    row.querySelector('.remove-btn').addEventListener('click', () => {
      removeFromBag(name, id, size, color);
    });

    bagTableBody.appendChild(row);

    totalPrice += parseFloat(price) * parseInt(quantity, 10);
    totalItems += quantity;
  });

  totalItemsElement.textContent = totalItems;
  subtotalElement.textContent = `₹${totalPrice.toFixed(2)}`;
  totalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;
}


function removeFromBag(productname, productId, productSize, productColor) {

  if(!confirm(`Are you sure you want to remove name - ${productname}, color - ${productColor}, Size - ${productSize} from your bag?`))
    return
  const productBag = JSON.parse(localStorage.getItem('productBag')) || {};
  const userBag = productBag[currentUser];

  if (userBag) {
    const updatedBag = userBag.filter(
      item =>
        !(item.id === productId && item.size === productSize && item.color === productColor)
    );

    if (updatedBag.length === 0) {
      delete productBag[currentUser];
    } else {
      productBag[currentUser] = updatedBag;
    }

    localStorage.setItem('productBag', JSON.stringify(productBag));

    if (updatedBag.length > 0) {
      displayBagItems(updatedBag);
    } else {
      document.querySelector('.container').innerHTML = `
        <h1 class="text-5xl font-serif font-bold">Your bag is empty.</h1> 
        <p class="my-4 text-gray-700">Add to your bag by clicking on your size on an item or in the product detail page.</p>
        <a href="index.html" class="px-4 mt-10 py-2 bg-black text-white w-full border hover:bg-white hover:text-black hover:border-black">Continue Shopping</a>
      `;
    }
  }
}

function updateQuantity(event, productId, productSize, productColor) {
  const newQuantity = parseInt(event.target.value); 
  const productBag = JSON.parse(localStorage.getItem('productBag')) || {};
  const userBag = productBag[currentUser];

  if (userBag) {
    const productIndex = userBag.findIndex(
      item =>
        item.id == productId && item.size == productSize && item.color == productColor
    );

    if (productIndex !== -1) {
      userBag[productIndex].quantity = newQuantity;
      productBag[currentUser] = userBag;
      localStorage.setItem('productBag', JSON.stringify(productBag));
      displayBagItems(userBag);
    }
  }
}



document.getElementById("orderBtn").addEventListener("click", function() {

  const successMessage = document.getElementById("successMessage");
  successMessage.classList.remove("hidden");

  setTimeout(function() {
    successMessage.classList.add("hidden");
    window.location.href = "../index.html"; 
  }, 3000); 
});
