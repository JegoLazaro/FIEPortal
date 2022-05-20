if(document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', ready)
}
else
{
    ready()
}

function ready(){
   
    var addToCartButtons = document.getElementsByClassName('add-btn')

    console.log(addToCartButtons)
    
    //var buttons = document.getElementsByTagName('button');
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    var removeToCartButtons = document.getElementsByClassName('remove-cart-btn')
    for (let i = 0; i < removeToCartButtons.length; i++) {
        let button = removeToCartButtons[i];
        button.addEventListener('click', removeToCartClicked);
    }
}

function removeToCartClicked(event){
    var button = event.target;

    let cartItem = button.parentElement.parentElement;

    let valid = true;
    let id = cartItem.getElementsByClassName('cart_id')[0];
    let cartId = id.value

    body ={
        id: cartId
    }

    if (valid) {
        jQuery.post('/remove-item-cart', body, function(result) {
            // console.log(result);
                location.reload(true);
        });
        console.log("Removed from cart!");
    } else {

    }
}

function addToCartClicked(event){
    var button = event.target;

    var addToCartButtons = document.getElementsByClassName('cart-item-qty')[0];

    let shopItem = button.parentElement;

    let qty = shopItem.getElementsByClassName('cart-item-qty')[0];
    let itemQty = qty.value

    let type = shopItem.getElementsByClassName('order_itemType')[0];
    let itemType = type.value

    let id = shopItem.getElementsByClassName('order_id')[0];
    let itemId = id.value

    let valid = toggleValidityBorder('#order_qty',
            !isFieldEmpty(itemQty)&&
            !isInvalidQty(itemQty));

    console.log(itemQty);
    body={
        qty: itemQty ,
        itemType: itemType, 
        id: itemId
    }
    console.log(body);

    if (valid) {
        jQuery.post('/order-product', body, function(result) {
            console.log(result);
                location.reload(true);
        });
        console.log("Added to cart!");
    } else {

    }
}

function isInvalidQty(qty){
    return (qty <= 0)
}

function isFieldEmpty(str) {
    return (!str || str.length === 0);
};

function toggleValidityBorder(fieldname, valid) {
    if (valid) {
        return true;
    } else {
        alert("Quantity should be more than 0.");
        return false;
    }
}
