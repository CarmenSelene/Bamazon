var mysql = require("mysql");
var inq = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

let item_id;
let product_name;
let price;
let stock_quantity;

let resetInterface = function() {
  connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, result, fields) {
      if (err) console.log("Oops... Something went wrong");
      console.log("*******************************************************");
      console.log("WELCOME TO SARYN'S YUMMIES --- WHOLESALE ORDER PLATFORM");
      console.log("PRODUCT ID --- PRODUCT NAME --- $PRICE/KG --- STOCK AVA");
      console.log("*******************************************************");
      for (i = 0; i < result.length; i++) {
        let nameWidth = 20;
        let priceWidth = 5;
        let stockWidth = 4;
        let display_ID = result[i].item_id;
        if (display_ID <= 9) {
          display_ID = "0" + display_ID;
        }
        let display_name = result[i].product_name;
        let display_price = result[i].price;
        let display_stock = result[i].stock_quantity;
        let addSpaceName = function() {
          if (display_name.length >= nameWidth) {
            return;
          } else {
            display_name = display_name + " ";
            addSpaceName();
          }
        };
        let addSpacePrice = function() {
          if (display_price.length >= priceWidth) {
            return;
          } else {
            display_price = display_price + " ";
            addSpacePrice();
          }
        };
        let addSpaceStock = function() {
          if (display_stock.length >= stockWidth) {
            return;
          } else {
            display_stock = display_stock + " ";
            addSpaceStock();
          }
        };
        addSpaceName();
        addSpacePrice();
        addSpaceStock();
        let mainDisplay =
          " * ID# " +
          display_ID +
          " | " +
          display_name +
          "| $" +
          display_price +
          " | " +
          display_stock +
          " *";
        console.log(mainDisplay);
      }
      start();
    }
  );
  return;
};

resetInterface();

function start() {
  inq
    .prompt([
      {
        name: "whatID",
        type: "input",
        message: "Please input the item ID to place your purchase",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "howMany",
        type: "input",
        message: "Please enter the volume of items to be purchased",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {

// Currently Here - whichOne below outputs the correct value, but when the string is passed to mysql it returns an inproper query

      let whichOne = toString(answer.whatID);
      function checkDB() {
        let getStock = ["SELECT * FROM products WHERE item_id = " + whichOne];
        console.log(getStock);
        connection.query(getStock, function(err, result) {
          if (err) throw err;
          console.log(result);
          // changeDB(x, result);
        });
      }
      checkDB();
      console.log(" *** ");
    });
}

// Still Needed - Next Section (Possibly) after above 


// let changeDB = function(x, y) {
//   let editStock = ["UPDATE products SET ? WHERE ?"];
//   connection.query(
//     editStock,
//     [
//       {
//         stock_quantity: y
//       },
//       {
//         item_id: x
//       }
//     ],
//     function(error) {
//       if (error) throw err;
//       console.log("Bid placed successfully!");
//       newOrder();
//     }
//   );
// };

function newOrder() {
  inq
    .prompt([
      {
        name: "restart",
        type: "confirm",
        message: "   ***      Place Another Order?       ***   "
      }
    ])
    .then(function(answer) {
      if (answer.restart === true) {
        resetInterface();
      } else {
        console.log("   ***   Thank You For Your Business   ***   ");
        console.log("   ***         See You Soon!           ***   ");
        connection.end();
      }
    });
}
