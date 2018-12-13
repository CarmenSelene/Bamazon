let mysql = require("mysql");
let inq = require("inquirer");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

let managerInterface = function() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inq
      .prompt([
        {
          name: "managerOptions",
          type: "list",
          message: "Select A Report",
          choices: function() {
            let pullReports = [
              "Current Products",
              "Low Inventory Alerts",
              "Add Inventory",
              "Add Product"
            ];
            return pullReports;
          }
        }
      ])
      .then(async function(answer) {
        if (answer.managerOptions === "Current Products") {
          connection.query("SELECT product_name FROM products", function(
            err,
            results
          ) {
            if (err) throw err;
            for (i = 0; i < results.length; i++) {
              if (results[i].product_name) {
                console.log(results[i].product_name);
              }
            }
            console.log(results.product_name);
            console.log(" ");
            managerInterface();
          });
        } else if (answer.managerOptions === "Low Inventory Alerts") {
          connection.query(
            "SELECT product_name, stock_quantity FROM products",
            function(err, results) {
              if (err) throw err;
              for (i = 0; i < results.length; i++) {
                if (results[i].stock_quantity < 100) {
                  console.log(
                    results[i].product_name + " [x" +
                    results[i].stock_quantity + "] "
                  );
                }
              }
              console.log(" ");
              managerInterface();
            }
          );
        } else if (answer.managerOptions === "Add Inventory") {
          if (err) throw err;
          console.log(" ");
          await inq
            .prompt([
              {
                name: "product_name",
                type: "rawlist",
                pageSize: 15,
                choices: function() {
                  let choiceArray = [];
                  for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                  }

                  return choiceArray;
                },
                message: "Which Product From Inventory To Edit?"
              },
              {
                name: "stock_quantity",
                type: "input",
                message: "Submit New Inventory Level",
                validate: function(value) {
                  if (isNaN(value) === false) {
                    return true;
                  }
                  console.log("error - must be a number");
                  return false;
                }
              }
            ])
            .then(function(answer) {
              let selectedProduct;
              for (let i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.product_name) {
                  selectedProduct = results[i];
                }
              }
              let addInventory = function() {
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: answer.stock_quantity
                    },
                    {
                      product_name: selectedProduct.product_name
                    }
                  ],
                  function(err) {
                    if (err) throw err;
                  }
                );
                console.log("* Inventory Successfully Changed *");
              };
              addInventory();
            });
          managerInterface();
        } else if (answer.managerOptions === "Add Product") {
          if (err) throw err;
          console.log(" ");
          await inq
            .prompt([
              {
                name: "product_name",
                type: "input",
                message: "Submit Product Name"
              },
              {
                name: "department_name",
                type: "list",
                message: "Select Department Tag",
                pageSize: 15,
                choices: function() {
                  let choiceArray = [];
                  for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].department_name);
                  }
                  let format = choiceArray.filter(function(item, index) {
                    return choiceArray.indexOf(item) >= index;
                  });
                  let formattedChoices = Array.from(new Set(format));
                  return formattedChoices;
                }
              },
              {
                name: "price",
                type: "input",
                message: "Submit $/kg",
                validate: function(value) {
                  if (isNaN(value) === false && value.length < 5) {
                    return true;
                  }
                  return false;
                }
              },
              {
                name: "stock_quantity",
                type: "input",
                message: "Submit Inventory Level"
              }
            ])
            .then(function(answer) {
              connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answer.product_name,
                  department_name: answer.department_name,
                  price: answer.price,
                  stock_quantity: answer.stock_quantity
                },
                function(err) {
                  if (err) throw err;
                  console.log("* Product Successfully Created *");
                }
              );
            });
          managerInterface();
        } else {
          console.log("Error: Input not recognized, please try again.");
          console.log(" ");
          managerInterface();
        }
      });
  });
};

module.exports = managerInterface;
