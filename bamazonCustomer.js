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

connection.connect(function(err) {
  if (err) throw err;
  start();
});

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
      console.log("*****");
      console.log("Avaliable Stock: ");
      console.log("*****");
      con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM products", function(err, result, fields) {
          if (err) throw err;
          console.log(result);
        });
        console.log(answer);
      });
        con.query(
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
            console.log("Order Placed! Thank You For Your Business");
            start();
          }
        );
    });
}
