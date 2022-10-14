if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  
  getProductsFromBackend();
  fetchCartProducts();
  updateCartTotal();
  countItemsInCart();

  const removeCartItemButton = document.getElementsByClassName("btn-danger");
  for (let i = 0; i < removeCartItemButton.length; i++) {
    let button = removeCartItemButton[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCart = document.getElementsByClassName("shop-item-button");
  for (let i = 0; i < addToCart.length; i++) {
    let add = addToCart[i];
    add.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("purchase-btn")[0]
    .addEventListener("click", purchaseClicked);

    var openCart = document.getElementsByClassName('open-cart') ;
    for(let i =0; i<openCart.length ; i++){
        let open = openCart[i];
        open.addEventListener('click' , showCart);
    }

    var closeCart = document.getElementsByClassName('cancel')[0];
    closeCart.addEventListener('click', ()=>{
    const cart = document.getElementById('cart');
    cart.classList.remove('active');
    })
}

function showCart(e){
    const cart = document.getElementById('cart');
    cart.classList.add('active');
}

function purchaseClicked() {
  alert("Thankyou for your Purchase");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  countItemsInCart();
}

function removeCartItem(e) {
  var buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
  countItemsInCart();
}

function quantityChanged(e) {
  var input = e.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(e , id) {
  var button = e.target;
  var shopItem = button.parentElement.parentElement;

  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var image = shopItem.getElementsByClassName("shop-item-img")[0].src;
 
  addItemTOCart(title, price, image , id);
  updateCartTotal();
  countItemsInCart();
  showNotification(title);
}

function addItemTOCart(title, price, image , id) {
  var cartRow = document.createElement("div");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("item is already added to the cart");
      return;
    }
  }
  var cartContent = `<div class="cart-row">
    <span class="cart-item cart-column">
      <img
        class="cart-img shop-item-img"
        src="${image}"
        alt=""
      />
      <span class="cart-item-title">${title}</span>
    </span>
    <span class="cart-price cart-column shop-item-price">${price}</span>
    <span class="cart-quantity cart-column">
      <input type="number" class="cart-quantity-input" value="1" min="1" max="1" />
      <button class="btn-danger">REMOVE</button>
    </span>
  </div>`;

  cartRow.innerHTML = cartContent;
  cartItems.append(cartRow);
  
  postProductToCart(id);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);

    
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  let total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var cartQuantity = cartRow.getElementsByClassName("cart-quantity")[0];
    var quantityElement = cartQuantity.getElementsByClassName(
      "cart-quantity-input"
    )[0];

    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = total.toFixed(2);
  document.getElementsByClassName("total-price")[0].innerText = total;
}

function countItemsInCart(){
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var cartItemsLength = cartRows.length;
    document.getElementsByClassName('cart-number')[0].innerText = cartItemsLength;
}

function showNotification(title){
    const notifications = document.getElementById('container');
    const newDiv = document.createElement('div');
    newDiv.classList.add('notification');
    newDiv.innerHTML = `<h4>Your Product : <span>${title}</span> added to cart<h4>`
    notifications.append(newDiv);

    setTimeout(()=>{
        newDiv.remove();
    },2500)
}

async function getProductsFromBackend(){
    try {
        let products = await axios.get('http://localhost:3000/products');
        
        products.data.products.map(p=>{
            addProductsToScreen(p)
        })
    } catch (error) {
        console.log(error);
    }
}

function addProductsToScreen(data){
   
    let list = document.getElementById("music-content");
    let childHTML = `<div id=${data.id}>
    <h3 class="shop-item-title">${data.title}</h3>
    <div class="image-container">
      <img
        class="prod-images shop-item-img"
        src=${data.imageUrl}
        alt=""
      />
    </div>
    <div class="prod-details">
      <span class="shop-item-price ">$${data.price}</span>
      <button class="shop-item-button" type="button" onclick="addToCartClicked(event, ${data.id})">
        ADD TO CART
      </button>
    </div>
  </div>`

    list.innerHTML = list.innerHTML + childHTML ;

}

async function postProductToCart(prodId){
    try {
        const data = await axios.post('http://localhost:3000/cart',{prodId:prodId});
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function fetchCartProducts(){
    try {
        const products = await axios.get('http://localhost:3000/cart') 
        console.log(products.data)
        products.data.map(p=>{
            showProductsInCart(p);
        })
    } catch (error) {
        console.log(error);
    }
}

function showProductsInCart(product){
    var cartItems = document.getElementsByClassName("cart-items")[0];
    let childHTML = `<div class="cart-row">
    <span class="cart-item cart-column">
      <img
        class="cart-img shop-item-img"
        src="${product.imageUrl}"
        alt=""
      />
      <span class="cart-item-title">${product.title}</span>
    </span>
    <span class="cart-price cart-column shop-item-price">${product.price}</span>
    <span class="cart-quantity cart-column">
      <input type="number" class="cart-quantity-input" value="1" min="1" max="1" />
      <button class="btn-danger">REMOVE</button>
    </span>
  </div>`

  cartItems.innerHTML = cartItems.innerHTML + childHTML
  countItemsInCart();
  updateCartTotal()
}