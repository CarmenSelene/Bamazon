let mysql = require("mysql");
let inq = require("inquirer");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon",
  multipleStatements: true
});

let customerInterface = function() {
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

function onLoad() {
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
          customerInterface();
        } else {
          console.log("* User ID/Password combination not recognized. *");
          onLoad();
        }
      });
  });
}

function managerInterface() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inq
      .prompt([
        {
          name: "managerOptions",
          type: "list",
          message: "Select A Report",
          choices: function() {
            var pullReports = [
              "Current Products",
              "Low Inventory Alerts",
              "Add Inventory",
              "Add Product"
            ];
            return pullReports;
          }
        }
      ])
      .then(function(answer) {
        if (answer.managerOptions === "Current Products") {
          connection.query("SELECT product_name FROM products", function(
            err,
            results
          ) {
            if (err) throw err;
            console.log(results);
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
                  console.log(results[i]);
                }
              }
              console.log(" ");
              managerInterface();
            }
          );
        } else if (answer.managerOptions === "Add Inventory") {
          if (err) throw err;
          console.log(" ");
          inq
            .prompt([
              {
                name: "product_name",
                type: "rawlist",
                pageSize: 15,
                choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                  }
                  return choiceArray;
                },
                message: "Which Product From Inventory To Edit?",
                validate: function(value) {
                  if (value === true) {
                    return true;
                  } else {
                    return false;
                  }
                }
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
          inq
            .prompt([
              {
                name: "product_name",
                type: "input",
                message: "Submit Product Name"
              },
              {
                name: "price",
                type: "input",
                message: "Submit $/kg"
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
                  product_name: product_name,
                  price: price,
                  stock_quantity: stock_quantity
                },
                function(err) {
                  if (err) throw err;
                  console.log("* Product Successfully Created *");
                }
              );
            });
          managerInterface();
        } else {
          console.clear();
          console.log("Error: Input not recognized, please try again.");
          console.log(" ");
          managerInterface();
        }
      });
  });
}

onLoad();

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
        if (selectedProduct.stock_quantity <= 0) {
          console.log("Sorry Item On BackOrder");
          start();
          return;
        }
        if (selectedProduct.stock_quantity <= 100) {
          console.log("* Stock Low - Extra Delivery Time Required *");
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
        console.log("Order placed successfully!");
        console.log(
          "You bought [" +
            answer.howMany +
            "] of [" +
            selectedProduct.product_name +
            "]"
        );
        console.log(
          "Total Before Taxes = $" +
            costTotal +
            ". Successfully Charged To Account."
        );
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
        message: "     ***      Place Another Order?       ***   "
      }
    ])
    .then(function(answer) {
      if (answer.restart === true) {
        customerInterface();
      } else {
        console.log("     ***   Thank You For Your Business   ***   ");
        console.log("     ***         See You Soon!           ***   ");
        connection.end();
      }
    });
}
