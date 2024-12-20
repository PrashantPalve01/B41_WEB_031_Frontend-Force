
const sizeButtons = document.querySelectorAll('.selectSize button');
const colorButtons = document.querySelectorAll('.selectColor button');
const addToBagButton = document.getElementById('addToBag');
const errorMessage = document.getElementById('errorMessage');
let selectedSize = false;
let selectedColor = false;

sizeButtons.forEach(button => {
  button.addEventListener('click', () => {
    sizeButtons.forEach(btn => btn.classList.remove('bg-black', 'text-white'));
    button.classList.add('bg-black', 'text-white');
    selectedSize = true;
    updateButtonState();
  });
});

colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    colorButtons.forEach(btn => btn.classList.remove('ring', 'ring-offset-2'));
    button.classList.add('ring', 'ring-offset-2');
    selectedColor = true;
    updateButtonState();
  });
});

addToBagButton.addEventListener('click', () => {
  if (!selectedSize || !selectedColor) {
    errorMessage.classList.remove('hidden');
  } else {
    errorMessage.classList.add('hidden');
    alert("Item added to the bag!");
  }
});

function updateButtonState() {
  if (selectedSize && selectedColor) {
    errorMessage.classList.add('hidden');
  }
}