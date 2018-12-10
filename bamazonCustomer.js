var mysql = require("mysql");
var inq = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

let product_name;
let price;
let stock_quantity;

connection.query(
  "SELECT product_name, price, stock_quantity FROM products",
  function(err, result, fields) {
    if (err) console.log("Oops... Something went wrong");
    console.log("*****");
    console.log("WELCOME TO SARYN'S YUMMIES - WHOLESALE ORDER PLATFORM");
    console.log("PRODUCT NAME --- PRICE / KG --- STOCK")
    console.log("*****");
    for (i=0; i<result.length; i++) {
        console.log(" | " + result[i].product_name," | " +  result[i].price," | " +  result[i].stock_quantity);
    }
    start();
  }
);

function start() {
  inq
    .prompt([
      {
        name: "whatID",
        type: "input",
        message: "Please input the item ID to place your purchase"
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
      connection.query(
        "SELECT * FROM products",
        {
          item_ID: answer.item_id,
          product_name: answer.product_name,
          department_name: answer.department_name,
          price: answer.price,
          stock_quantity: answer.stock_quantity
        },
        function(err) {
          if (err) throw err;
        }
      );
      console.log(answer);
    });
}
