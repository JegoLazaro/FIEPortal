const alert = require('alert'); 


module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id, qty){
        let storedItem = this.items[id];
        let itemQty = parseInt(qty);
        
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        
        //console.log(item.quantity[0]);

        console.log(storedItem.qty);
        console.log(parseInt(qty));

        if(item.totalEnd >= storedItem.qty + parseInt(qty))
        {
            storedItem.qty += itemQty;
            storedItem.price = storedItem.item.itemPrice * storedItem.qty;
            this.totalQty += itemQty;
            this.totalPrice += itemQty * storedItem.item.itemPrice;
        }
        else
        {
            console.log("not enough qty");
        }
        
        
    };

    this.reduceItem = function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.itemPrice;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.itemPrice;

        if(this.items[id].qty <= 0)
        {
            delete this.items[id];
        }
    }

    this.addItem = function(id){
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.itemPrice;
        this.totalQty++;
        this.totalPrice += this.items[id].item.itemPrice;
    }

    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -=  this.items[id].price;
        delete this.items[id]; 
    }

    this.generateArray = function(){
        let arr = [];
        for (let id in this.items){
            arr.push(this.items[id]);
        }

        return arr;
    };
}