if(document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', ready)
}
else
{
    ready()
}


function ready(){
   
    var cancelButtons = document.getElementsByClassName('cancel_order');
    var receivedButtons = document.getElementsByClassName('order_received');
    
    //var buttons = document.getElementsByTagName('button');
    for (let i = 0; i < receivedButtons.length; i++) {
        let button = receivedButtons[i];
        button.addEventListener('click', receivedClicked);
    }

    for (let i = 0; i < cancelButtons.length; i++) {
        let button = cancelButtons[i];
        button.addEventListener('click', cancelClicked);
    }
}

function cancelClicked(event){
    var button = event.target;

    let orderItems = button.parentElement.parentElement.parentElement;

    let valid = true;
    let id = orderItems.getElementsByClassName('order_id')[0];
    let orderId = id.value

    const boolDel = confirm('Are you sure you want to cancel your order?');

    console.log(orderId);

    body ={
        id: orderId
    }

    if(boolDel)
    {
        if (valid) {
            jQuery.post('/cancel-track-order', body, function(result) {
                // console.log(result);
                    location.reload(true);
            });
            console.log("Order cancelled!");
        } else {
    
        }
    }

    
}

function receivedClicked(event){
    var button = event.target;

    let orderItems = button.parentElement.parentElement.parentElement;

    let valid = true;
    let id = orderItems.getElementsByClassName('order_id')[0];
    let orderId = id.value

    const boolRec = confirm('Have you received your order?');

    console.log(orderId);

    body ={
        id: orderId
    }

    if(boolRec)
    {
        if (valid) {
            jQuery.post('/received-track-order', body, function(result) {
                // console.log(result);
                    location.reload(true);
            });
            console.log("Order received!");
        } else {
    
        }
    }
}