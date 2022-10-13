if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {

    updateCartTotal();

  const removeCartItemButton = document.getElementsByClassName("btn-danger");
  for (let i = 0; i < removeCartItemButton.length; i++) {
    let button = removeCartItemButton[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName('cart-quantity-input');
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  
  var addToCart = document.getElementsByClassName('shop-item-button');
  for (let i = 0; i < addToCart.length; i++) {
    let add = addToCart[i];
    add.addEventListener("click", addToCartClicked);
  }

  document.getElementsByClassName('purchase-btn')[0].addEventListener('click' , purchaseClicked);

}

function purchaseClicked(){
    alert('Thankyou for your Purchase');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(e) {
  var buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(e){
    var input = e.target ;
    if(isNaN(input.value) || input.value<=0){
        input.value = 1 ;
    }
    updateCartTotal();
}

function addToCartClicked(e){
    var button = e.target ;
    var shopItem = button.parentElement.parentElement  ;
    console.log(shopItem)
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var image = shopItem.getElementsByClassName('shop-item-img')[0].src;
    
    addItemTOCart(title ,price ,image);
    updateCartTotal();
}

function addItemTOCart(title ,price ,image){
    var cartRow = document.createElement('div');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for(let i = 0 ; i<cartItemNames.length ; i++){
        if(cartItemNames[i].innerText == title){
            alert('item is already added to the cart')
            return
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
      <input type="number" class="cart-quantity-input" value="1" />
      <button class="btn-danger">REMOVE</button>
    </span>
  </div>`

  cartRow.innerHTML = cartContent
  cartItems.append(cartRow) ;
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click' , removeCartItem)
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged)
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
