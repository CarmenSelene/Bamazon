let mysql = require("mysql");
let inq = require("inquirer");
let managerInterface = require("./managerInterface.js");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

let costBasket = [];

let showInventory = function() {
  console.log("");
  console.log("");
  connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, result, fields) {
      if (err) console.log(" Oops... Something went wrong ");
      console.log(
        "***********************************************************"
      );
      console.log(
        "* WELCOME TO SARYN'S YUMMIES --- WHOLESALE ORDER PLATFORM *"
      );
      console.log(
        "*  PRODUCT ID -- PRODUCT NAME -- $PRICE/KG -- STOCK AVAL  *"
      );
      console.log(
        "***********************************************************"
      );
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
        let catchLowStock = function() {
          if (display_stock <= 0) {
            display_stock = "B/O";
          } else if (display_stock < 100) {
            display_stock = "LOW";
          }
        };
        catchLowStock();
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
      makePurchase();
    }
  );
  return;
};

let onLoad = function() {
  console.log(" ");
  console.log("***********************************************************");
  console.log("* WELCOME TO SARYN'S YUMMIES --- WHOLESALE ORDER PLATFORM *");
  console.log("***********************************************************");
  console.log(" ");
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inq
      .prompt([
        {
          name: "loginID",
          type: "input",
          message: "UserID: "
        },
        {
          name: "password",
          type: "password",
          message: "Password: ",
          mask: true
        }
      ])
      .then(function(answer) {
        if (answer.loginID === "saryn" && answer.password === "manager") {
          console.log(" ");
          console.log("Welcome Saryn!");
          console.log("Loading Managers Interface...");
          console.log(" ");
          managerInterface();
        } else if (answer.loginID === "guest") {
          console.log("");
          showInventory();
        } else {
          console.log("* User ID/Password combination not recognized. *");
          onLoad();
        }
      });
  });
};

let makePurchase = function() {
  console.log("");
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
        if (selectedProduct.stock_quantity <= 0) {
          console.log("");
          console.log("***********************");
          console.log("Sorry Item On BackOrder");
          console.log("***********************");
          console.log("");
          makePurchase();
          return;
        }
        if (selectedProduct.stock_quantity <= 100) {
          console.log("");
          console.log("***********************");
          console.log("* Stock Low - Extra Delivery Time Required *");
          console.log("***********************");
          console.log("");
        }
        convertedQuan = [
          selectedProduct.stock_quantity - parseInt(answer.howMany)
        ];
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
        };
        updateDB();
        let costTotal = [answer.howMany * selectedProduct.price];
        let basketTotal =0;
        let basketCounter = function() {
          costBasket.push(costTotal);
          for (i = 0; i < costBasket.length; i++) {
            basketTotal = (parseFloat(basketTotal) + parseFloat(costBasket[i]));
          }
        };
        basketCounter();
        console.log("");
        console.log("***********************");
        console.log("Order placed successfully!");
        console.log(
          "* You bought [x" +
            answer.howMany +
            "] units of [" +
            selectedProduct.product_name +
            "] *"
        );
        console.log("* Item Total Before Taxes = $" + costTotal + " *");
        console.log(
          "* Basket Total Before Taxes = $" + basketTotal + " *"
        );
        console.log("***********************");
        console.log("");
        newOrder();
      });
  });
};

let newOrder = function() {
  console.log("");
  inq
    .prompt([
      {
        name: "remakePurchase",
        type: "confirm",
        message: "     ***      Place Another Order?       ***   "
      }
    ])
    .then(function(answer) {
      if (answer.remakePurchase === true) {
        console.clear();
        showInventory();
        console.log("");
        console.log("");
      } else {
        console.log("     ***   Thank You For Your Business   ***   ");
        console.log("     ***         See You Soon!           ***   ");
        connection.end();
      }
    });
};

onLoad();
