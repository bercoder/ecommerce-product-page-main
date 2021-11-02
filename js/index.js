const spinner = document.querySelector(".spinner-input");
const decrease = document.querySelector(".decrease");
const increase = document.querySelector(".increase");
const addCart = document.querySelector(".add-cart");
const cartItems = document.querySelector(".cart-items");
const ToggleCartButton = document.querySelector(".cart-button");
const cartContainer = document.querySelector(".cart");
const checkout = document.querySelector('.checkout > button');
const carousel = document.querySelectorAll('.images > img')
const left = document.querySelector(".left-button");
const right = document.querySelector(".right-button");
const mini = document.querySelector(".thumbnails");
const images = document.querySelector(".images");
const thumbnails = document.querySelectorAll(".thumbnails > a")
const background = document.querySelector(".background");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".closeModal");

let actualSlide = 0;

const product = {
  name: "Autumn Limited Edition",
  image: "image-product-1-thumbnail.jpg",
  price: "125.00"
}

const empty = `<article class="empty">
    <p>Your cart is empty.</p>
  </article>`

const cart = [];

let qty = 1;

function add() {
  ++qty;
  spinner.value = qty;
}

function substract() {
  qty = Math.max(qty - 1, 1);
  spinner.value = qty;
}

function handleKey(e) {
  if (isNaN(+e.key) && e.key !== 'Backspace') {
    e.preventDefault()
    return false;
  }
}

function handleChange({ target: { value }}) {
  qty = isNaN(value) ? 1 : +value
}

function Article({ name, image, price, quantity }) {
  return `<article>
     <img src="./images/${image}" />
     <p>${name}...<br/>
     $${price} x${quantity} <strong>$${(quantity * price).toFixed(2)}</strong></p>
     <button data-article="${name}" class="delete"></button>
   </article>
   `
 }

function addToCart() {
  const exists = cart.findIndex(item => item.name === product.name)
  if (exists > -1) {
    cart[exists].quantity += qty;
  } else {
    const item = {
      ...product,
      quantity: qty
    }
    cart.push(item)
  }
  renderCart();
  toggleCart(true)
}

function deleteCartItem({ target }) {
  const article = target.getAttribute('article');
  const index = cart.indexOf(art => art.name !== article);
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  let count = 0;
  const articles = cart.map(article => {
    count += article.quantity;
    return Article(article);
  }).join('');
  if (articles.length < 1) {
     cartItems.innerHTML = empty
     checkout.style.display = 'none';
     ToggleCartButton.childNodes[0].style.display = 'none'
    } else {
      cartItems.innerHTML = articles;
      const deletes = cartItems.querySelectorAll('.delete');
      deletes.forEach(el => el.addEventListener('click', deleteCartItem, false));
      ToggleCartButton.childNodes[0].innerHTML = count;
      checkout.style.display = 'block';
      ToggleCartButton.childNodes[0].style.display = 'inline'
      
  }
}

function toggleCart(show = false) {
 
  if (show) {
    cartContainer.classList.add('visible');
    ToggleCartButton.classList.add('visible');
    return;
  }

  cartContainer.classList.toggle('visible');
  ToggleCartButton.classList.toggle('visible');
}

function slideLeft() {
  if (actualSlide > 0) {
    --actualSlide;
  } else {
    actualSlide = carousel.length - 1
  }
  // carousel[actualSlide].scrollIntoView({ block: "center", behavior: "smooth" })  
  changeThumbnail()
}

function slideRight() {
  if (actualSlide < carousel.length - 1) {
    ++actualSlide;
  } else {
    actualSlide = 0
  }

  // carousel[actualSlide].scrollIntoView({ block: "center", behavior: "smooth" })
  changeThumbnail()
}

function thumbnailClick(e) {
  e.preventDefault()
  actualSlide = e.target.getAttribute("data-id") - 1
  changeThumbnail()
}

function changeThumbnail() {
  thumbnails.forEach(el => el.classList.remove('active'))
  thumbnails[actualSlide].classList.add('active')
  carousel[actualSlide].scrollIntoView({ block: "center", behavior: "smooth" })  
}

function imageClick() {
  background.classList.add('show')
  modal.classList.add('show')
}

function closeTheModal() {
  background.classList.remove('show')
  modal.classList.remove('show')
}

function keyModal(e) {
  if (e.key === 'Escape') {
    background.classList.remove('show')
    modal.classList.remove('show')
    cartContainer.classList.remove('visible')
    document.getElementById('close').checked = false
  }
}

increase.addEventListener("click", add, false);
decrease.addEventListener("click", substract, false);
spinner.addEventListener("keydown", handleKey, false)
spinner.addEventListener("input", handleChange, false)
addCart.addEventListener("click", addToCart, false);
left.addEventListener("click", slideLeft, false);
right.addEventListener("click", slideRight, false);
mini.addEventListener("click", thumbnailClick, false);
images.addEventListener("click", imageClick, false);
closeModal.addEventListener("click", closeTheModal, false);
background.addEventListener("click", closeTheModal, false);
document.addEventListener("keydown", keyModal, false);
ToggleCartButton.addEventListener("click", () => toggleCart(), false);

renderCart()