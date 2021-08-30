/* Init cart*/
var cart = [];

/*Display the cart to user */
showCart = function () {
  var body = "";
  if (cart.length == 0) {
    $('.checkout').hide();
    $('.discount').html("");
    body = "<h2>Your cart is empty</h2>";
    $('.emptyCart').html(body);
    $('.basket').html('');
  }
  else {
    $('.emptyCart').html('');
    body = "<thead>"
      + "<tr>"
      + "<th scope='col'>Product</th>"
      + "<th scope='col'>Price</th>"
      + "<th scope='col'>Qty</th>"
      + "<th scope='col'>Delete</th>"
      + "<th scope='col'>Total</th>"
      + "</tr>"
      + "</thead>"
      + "<tbody>"
    for (var i in cart) {
      body += "<tr>"
        + "<td>" + cart[i].name + "</td>"
        + "<td class='price'>" + cart[i].price + "</td>"
        + "<td><div><button class='minus-product' data-name=" + cart[i].name + ">-</button>"
        + "<input type='number' data-name='" + cart[i].name + "' value='" + cart[i].qty + "'>"
        + "<button class='plus-product' data-name=" + cart[i].name + ">+</button></div></td>"
        + "<td><button class='delete-product' data-name=" + cart[i].name + "><i class='fas fa-trash'></i></button></td>"
        + "<td>" + " €" + totalProduct(cart[i].price, cart[i].qty) + "</td>"
        + "</tr>";
    }
    body += "</tbody>"
    $('.checkout').show();
    $('.basket').html(body);
    $('.total').html(total());
  }
}

/* Total price of every product*/
const totalProduct = function (price, qty) {
  return price * qty;
}

/* Total price of all products */
const total = function () {
  var totalPrice = 0;
  for (var product in cart) {
    totalPrice += cart[product].price * cart[product].qty;
  }
  if (totalPrice > 100) {
    var discount = "<p>10% Discount</p>";
    $('.discount').html(discount);
    return Number(totalPrice - totalPrice * 0.1);
  } else {
    $('.discount').html("");
    return Number(totalPrice);
  }

}


if (sessionStorage.getItem("cart") != null) {
  loadCart();
  showCart();
}
/* Save cart to localStorage to survive refresh*/
function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}
/* Load cart from localStorage*/
function loadCart() {
  cart = JSON.parse(sessionStorage.getItem('cart'));
}

/* Object product constructor*/
function Product(name, price, qty) {
  this.name = name;
  this.price = price;
  this.qty = qty;
}

/* Function to add products to the cart*/
addProduct = function (name, price, qty) {
  for (var product in cart) {
    if (cart[product].name === name) {
      cart[product].qty++;
      saveCart();
      showCart();
      return;
    }
  }
  var product = new Product(name, price, qty);
  cart.push(product);
  saveCart();
  showCart();
}

/* Function to remove product from the cart*/
removeProduct = function (name) {
  for (var product in cart) {
    if (cart[product].name === name) {
      cart.splice(product, 1);
      break;
    }
  }
  saveCart();
  showCart();
}

/* Function to -1 the qty of product*/
minusProduct = function (name) {
  for (var product in cart) {
    if (cart[product].name === name) {
      cart[product].qty--;
      if (cart[product].qty === 0) {
        cart.splice(product, 1);
      }
      break;
    }
  }
  saveCart();
  showCart();
}

/* Function to show Xml file to the console*/
showXML = function () {

  var parser = new DOMParser();
  var xml = "<?xml version=\"1.0\" standalone=\"yes\" ?>";
  xml = xml + "<Products>";
  for (var product in cart) {
    xml = xml + "<Product name=\"" + cart[product].name + "\" Quantity=\"" + cart[product].qty + "\" Price=\"" + cart[product].price * cart[product].qty + "\" />";
  }
  xml = xml + "</Products>";
  var xmlDoc = parser.parseFromString(xml, "application/xml");
  return xmlDoc;
}

/*Event listeners*/

$('.add-product').click(function (event) {
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  addProduct(name, price, 1);
});

$('.basket').on("click", ".plus-product", function (event) {
  var name = $(this).data('name');
  addProduct(name);
})

$('.basket').on("click", ".minus-product", function (event) {
  var name = $(this).data('name');
  minusProduct(name);
  
})

$('.basket').on("click", ".delete-product", function (event) {
  var name = $(this).data('name');
  removeProduct(name);
})

$('.buy-products').click(function (event) {    
    var xml = showXML();
    console.log(xml);
});