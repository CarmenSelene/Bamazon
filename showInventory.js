let mysql = require("mysql");
let inq = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon",
    // multipleStatements: true
  });

let showInventory = function() {
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
      start();
    }
  );
  return;
};

module.exports = showInventory();
