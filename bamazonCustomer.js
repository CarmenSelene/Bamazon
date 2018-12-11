var mysql = require("mysql");
var inq = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon",
  multipleStatements: true
});

// let item_id;
// let product_name;
// let price;
// let stock_quantity;

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
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
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
        let selectedProduct;
        let convertedQuan;
        for (let i = 0; i < results.length; i++) {
          if (results[i].item_id == answer.whatID) {
            selectedProduct = results[i];
          }
        }
        convertedQuan = [
          selectedProduct.stock_quantity - parseInt(answer.howMany)
        ];
        console.log("This is convertedQuan: " + convertedQuan);
        console.log("This is selectedProduct: " + selectedProduct);
        let updateDB = function() {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: convertedQuan
              },
              {
                item_id: selectedProduct.item_id
              }
            ],
            function(err) {
              if (err) throw err;
            }
          );
        }
        updateDB();
        console.log("Bid placed successfully!");
        newOrder();
      });
  });
}

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
